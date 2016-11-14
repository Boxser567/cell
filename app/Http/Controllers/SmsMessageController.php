<?php
namespace App\Http\Controllers;
use App\Models\StQueueSms;
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/3/25
 * Time: 上午9:50
 */
class SmsMessageController extends SmsController{

    const TEXT_FROM = '【会文件】';
    const VERIFY_KEY = '/sms/';
   

    public function verifyPhone($phone, $code)
    {
        $this->send($phone, "您的BOSS系统修改手机号验证码为：" . $code . "，请在一分钟内输入。", StQueueSms::TYPE_VERIFY_PHONE_CHANGE);
    }
    
    public function register($phone, $code)
    {
       return $this->send($phone, "您的注册验证码为：" . $code . "，请在5分钟内输入。", StQueueSms::TYPE_REGISTER);
    }

}