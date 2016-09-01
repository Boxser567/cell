<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:34
 */

namespace App\Http\Controllers;


use App\Logic\LAccount;
use App\Models\EntConfig;
use Session;
use Auth;
use URL;
use View;

class AuthController extends Controller
{

    public function getLogin($oauthUser='')
    {
        $name="够快科技";
        $unionid="12345";
        //$name=inputGetOrFail('name');
        //$unionid=inputGetOrFail('unionid');
        //$name=$oauthUser['nickname'];
        //$unionid=$oauthUser['unionid'];
        //$image=$oauthUser['headimgurl'];
        $member=LAccount::setUser($name,$unionid)->toArray();
        $ent=EntConfig::_findOrFail($member['ent_id'])->toArray();
        $member['edition']=$ent['edition'];
        $his_member = Session::get('member');
        if (!$his_member) {
            Session::flush();
            Session::put('member', $member);
            Session::regenerate();
        }
        return $member;
    }

    public function getLogout()
    {
        Session::flush();
        View::addExtension('html','blade');
        return  view('index');
    }
}