<?php
namespace App\Http\Controllers;

use App\Models\SmsReport;
use Log;
use App\Models\StQueueSms;
/**
 * Created by PhpStorm.
 * User: rongshenghu
 * Date: 14-11-6
 * Time: 11:02
 */
Class SmsController extends Controller
{
    const TEXT_FROM = '【够快科技】';
    private static $servers = null;
    private static $current_server = '';

    public function postReport()
    {
        $ips_allow = ['124.127.61.82', '127.0.0.1', '117.79.237.*', '117.79.238.*', '116.228.88.180'];
        $ip = get_client_ip();
        if (!check_ip($ip, $ips_allow)) {
            return ['msg' => '非法ip'];
        };
        $args = inputGet('args');
        $messages = explode(';', $args);
        foreach ($messages as $message) {
            $smsReport = new SmsReport();
            $smsReport->ip = $ip;
            $rows = explode(',', $message);
            $smsReport->report_id = $rows[0];
            $smsReport->server_id = $rows[1];
            $smsReport->mobile = $rows[2];
            $smsReport->unique_code = $rows[3];
            $smsReport->state = $rows[4];
            $smsReport->create_time = $rows[5];
            $smsReport->args = $args;
            $smsReport->save();
        }
        return \Response::json(0);
    }

    /**
     * 发送短信
     * @param  int $id gk_queue_sms自增ID
     * @param  mixed $numbers string|array 传入一个或多个手机号码
     * @param  string $text 短信内容
     * @param  boolean $day_send 是否日间发送（晚上批量发的时候不打扰用户，自动延迟在 8:00 以后发送）
     * @return boolean          [description]
     */
    public static function sms($id, $numbers, $text, $day_send = false)
    {
        if (is_array($numbers)) {
            $numbers = array_filter($numbers);
            array_walk($numbers, create_function('&$val', '$val = trim($val);'));
            $numbers = array_unique($numbers);
            if (!count($numbers)) {
                return false;
            }
            $numbers = implode(';', $numbers);
        }

        $text = trim($text);
        if (!$text) {
            return false;
        }

        $data = array(
            'host' => config('app.callback_domain'),
            'port' => 80,
            'id' => $id,
            'destmobile' => $numbers,
            'msgText' => $text
        );

        $options = array('attempts' => 5);
        if ($day_send == true && date('G') <= 8) {
            $today_seconds = (time() + 8 * 3600) % 86400;
            $delay = 8 * 3600 + mt_rand(1, 3600) - $today_seconds;
            $options['delay'] = $delay * 1000; // to ms
        }
        $postData = json_encode(array('type' => 'sms', 'data' => $data, 'options' => $options));

        return self::post($postData);
    }

    private static function post($postData)
    {
        /**
         * 尝试用 Node 服务器发送
         */
        $http_code = '';
        $error = '';
        $res = [];
        while ($mq_server = self::getServer()) {
            $res = curl_invoke($mq_server, 'POST', $postData, array('Content-Type' => 'application/json'), $http_code, $error);
            $res = json_decode($res, true) ? : [];
            if (200 == $http_code) {
                return true;
            } else {
                self::$current_server = ''; // 删除当前一个服务器
            }
        }
        /**
         * 失败后记录错误日志
         */
        Log::error(sprintf('GKMessageQueue Error %s %s %s', date('Y-m-d H:i:s'), $http_code, $error), $res);
        return false;
    }

    private static function getServer()
    {
        if (self::$servers === null) {
            self::$servers = config('queue.sms');
            foreach (self::$servers as &$server) {
                $server = implode(':', $server);
            }
        }

        if (self::$current_server) {
            return self::$current_server;
        }

        shuffle(self::$servers);
        $server = array_pop(self::$servers);
        if (!$server) {
            return false;
        }

        self::$current_server = 'http://' . $server . '/job';
        return self::$current_server;
    }


    public function send($phone, $text, $type, $property = [], $ip = '',$user=0)
    {
        if (!$phone) {
            return;
        }
        $text = $text.' '.self::TEXT_FROM ;
        $sms = StQueueSms::add($phone, $text, $type, $user, $property, $ip);
        $res = SmsController::sms($sms->id, $phone, $text);
        if ($res) {
            $sms->state = StQueueSms::STATE_SENT;
            $sms->sendtime = time();
        } else {
            $sms->state = StQueueSms::STATE_ERROR;
        }
        $sms->save();
        return $sms;
    }
}