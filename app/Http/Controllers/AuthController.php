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
use App\Models\Member;
use Session;
use Auth;
use URL;
use View;

class AuthController extends Controller
{

    public function getLogin($oauthUser = '')
    {
        $name = "会展adminer";
        $unionid = "12345";
        //$name=inputGetOrFail('name');
        //$unionid=inputGetOrFail('unionid');
        //$name=$oauthUser['nickname'];
        //$unionid=$oauthUser['unionid'];
        //$image=$oauthUser['headimgurl'];
      /*  $member = LAccount::setUser($name, $unionid)->toArray();
        $ent = EntConfig::_findOrFail($member['ent_id'])->toArray();
        $member['edition'] = $ent['edition'];
        $his_member = Session::get('member');
        if (!$his_member) {
            Session::flush();
            Session::put('member', $member);
            Session::regenerate();
        }*/
        //return $member;
        return $_COOKIE['member'];
    }

    public function getLogout()
    {
        Session::flush();
        \Cookie::clearResolvedInstances();
        View::addExtension('html', 'blade');
        return view('index');
    }

    public static function login($user)
    {
        $member = Member::getUnionid($user->id);
        if ($member) {
            $ent = EntConfig::_findOrFail($member['ent_id'])->toArray();
            $member['edition'] = $ent['edition'];
            setcookie('member',json_encode($member),time()+60*360,'/');
        } else if(\Cookie::get('member')){
        } else{
            $member = LAccount::setUser($user->name, $user->id,$user->avatar)->toArray();
            $ent = EntConfig::_findOrFail($member['ent_id'])->toArray();
            $member['edition'] = $ent['edition'];
            $member['edition'] = $ent['edition'];
            setcookie('member',json_encode($member),time()+60*360,'/');
        }
    }

}