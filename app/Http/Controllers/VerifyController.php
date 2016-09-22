<?php
namespace App\Http\Controllers;

use Exception;
use VerifyCode;



class VerifyController extends Controller
{
    const TIME_TWO_MINUTES = 2;
    const TIME_ONE_MINUTE = 1;
    const CACHE_KEY_LOGIN = '/login/';
    const CACHE_KEY_PHONE_MODIFY = '/phone/';
    const CACHE_KEY_EMAIL_MODIFY = '/email/';
    const CACHE_KEY_REGISTER = '/register/';
    
    public static function checkLogin($key, $verify)
    {
        $cache_key = self::CACHE_KEY_LOGIN . $key;
        self::simpleCheck($cache_key, $verify);
    }

    public static function simpleCheck($cache_key, $verify)
    {
        if (!$verify && self::checkIp()) {
            throw new Exception('无效验证码');
        }
      /*  if (strtolower($verify) != strtolower(\Cache::get($cache_key)) && self::checkIp()) {
            throw new GKException(4000329);
        }*/
        if(strtolower($verify) != strtolower(\Cache::get($cache_key)) ){
            throw new Exception('验证码错误');
        }
    }

    public static function getVerify($cache_key)
    {
        return strtolower(\Cache::get($cache_key));
    }

    public static function postVerify($cache_key, $code, $mim = self::TIME_TWO_MINUTES)
    {
        \Cache::put($cache_key, $code, $mim);
    }

    public static function getSimpleCode($cache_key, $mim = self::TIME_TWO_MINUTES)
    {
        $verify = new VerifyCode(150, 30);
        $code = $verify->showAlpha(4);
        \Cache::put($cache_key, $code, $mim);
        return $code;
    }

    public static function getStrongCode($cache_key, $mim = self::TIME_TWO_MINUTES)
    {
        $code = substr(md5(get_code(6)), 0, 8);
        VerifyController::postVerify($cache_key, $code, $mim);
        return $code;
    }

    public static function getSimpleDigitalCode($cache_key, $mim = self::TIME_ONE_MINUTE)
    {
        $code = get_code(6);
        VerifyController::postVerify($cache_key, $code, $mim);
        return $code;
    }

    public static function checkIp()
    {
        return !in_array(get_client_ip(), ['127.0.0.1', '116.228.48.106']);
    }
}