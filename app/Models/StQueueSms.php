<?php
namespace App\Models;

class StQueueSms extends BaseModel
{
    protected $table = "st_queue_sms";
    const CACHE_TIME = 240;//4h
    const STATE_WAIT = 0;
    const STATE_SENT = 1;
    const STATE_ERROR = 2;
    const TYPE_SEND_TEXT = 1;//自定义内容发送
    const TYPE_VERIFY_ACCOUNT_IP = 2;//手机短信验证非法ip
    const TYPE_RESET_PASSWORD = 3;//重置密码
    const TYPE_VERIFY_PHONE_CHANGE = 4;//手机短信验证手机号码修改
    const  TYPE_REGISTER = 5;//注册

    public static function add($phone, $text, $type, $user_id, $property = [], $ip = '')
    {
        $sms = new self();
        $sms->phone = $phone;
        $sms->text = $text;
        $sms->type = $type;
        $sms->uniqid = get_code(6);
        $sms->property = json_encode($property);
        $sms->ip = $ip ? : get_client_ip();
        $sms->state = self::STATE_WAIT;
        $sms->dateline = time();
        $sms->scheduletime = time();
        $sms->sendtime = 0;
        $sms->user_id = $user_id;
        $sms->save();
        return $sms;
    }
}