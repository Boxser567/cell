<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:29
 */

namespace App\Http\Controllers;

use App\Models\ExhibitionInfo;
use App\Models\InvitationCode;
use App\Models\Member;
use Session;
use Auth;
use Exception;
use App\Logic\YunkuFile;
use App\Logic\YunkuOrg;
use View;

class BaseInfoController extends Controller
{

    public function getIndex()
    {
        View::addExtension('html','blade');
        return view('homepage');
    }

    public function getMobileIndex()
    {
        View::addExtension('html', 'blade');
        $wechat=app('wechat');
        $js = $wechat->js;
        return view('index',['js' => $js]);
    }

    public static function getVerifyInvitation($invitation_code='')
    {
        $invitation=InvitationCode::getCode(inputGet('invitation_code',$invitation_code));
        if(!$invitation || date('Y-m-d H:i:s') > $invitation->end_time ){
            throw new Exception('邀请码错误或已失效',403001);
        }
        return $invitation;
    }

    public function getSms(){
        $phone = inputGetOrFail("phone");
        $this->getCheckUserPhone($phone);
        $cache_key = VerifyController::CACHE_KEY_REGISTER . "/" . $phone;
        $verify_code = VerifyController::getSimpleDigitalCode($cache_key);
        $message = new SmsMessageController();
        $message->register($phone, $verify_code);
    }

    public function getCheckUserPhone($phone = 0)//验证手机号是否重复
    {
        if (!$phone) {
            $phone = inputGet("phone");
        }
        $ent = Member::getPhone($phone);
        if ($ent) {
            throw new Exception('手机号码已经被使用',403002);
        } else {
            return ;
        }
    }

    public static function getVerify($verify_code = " ", $phone = " ")
    {
        $verify_code = inputGet("verify_code", $verify_code);
        $phone = inputGet("phone", $phone);
        $cache_key = VerifyController::CACHE_KEY_REGISTER . "/" . $phone;
        VerifyController::simpleCheck($cache_key, $verify_code);
        return ['result' => '1'];
    }

    public  function getRegister()
    {
        $user_id=inputGet('user_id');
        header("Location:/admin?info=1/#/register?".$user_id);
    }
    
    public function getBannerList()
    {
        // $base_controller=new BaseController();
        //  $base_controller->judgePermission("self_banner");//权限判断会展 Banner 背景
        $list=config('data.BANNER');
        foreach($list as $key=>&$banner){
            $list[$key]=config('app.qiniu.domain')."/".$banner;
        }
        return $list;
    }

    public function getClassList()
    {
        // $base_controller=new BaseController();
        //  $base_controller->judgePermission("class_pic");//权限判断专题图片
        $list=config('data.FOLDER');
        foreach($list as $key=>&$banner){
            $list[$key]=config('app.qiniu.domain')."/".$banner;
        }
        return $list;
    }
    
    
}