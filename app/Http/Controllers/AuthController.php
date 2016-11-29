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
use Illuminate\Support\Facades\Log;
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
//        $name=inputGetOrFail('name');
//        $unionid=inputGetOrFail('unionid');
//        $name=$oauthUser['nickname'];
//        $unionid=$oauthUser['unionid'];
//        $image=$oauthUser['headimgurl'];
        $member = LAccount::setUser($name, $unionid)->toArray();
        $ent = EntConfig::_findOrFail($member['ent_id'])->toArray();
        $member['edition'] = $ent['edition'];
        $his_member = Session::get('member');
        if (!$his_member) {
            Session::flush();
            Session::put('member', $member);
        }
        return $member;
//          return $_COOKIE['member'];
    }

    public function getLogout()
    {
        Session::flush();
        \Cookie::clearResolvedInstances();
        clear_cookie();
        View::addExtension('html', 'blade');
        return;
    }

    public static function login($user)
    {
        $member = Member::getUnionid($user->id);
        if (array_key_exists("member", $_COOKIE)) {
            return $members = json_decode($_COOKIE['member'], true);
        } elseif ($member && $member['phone']) {
            $ent = EntConfig::_findOrFail($member['ent_id'])->toArray();
            $member['edition'] = $ent['edition'];
            $member['org_name'] = $ent['name'];
            setcookie('member', json_encode($member), time() + 60 * 360, '/');
        } else {
            $member = LAccount::setUser($user->name, $user->id, $user->avatar)->toArray();
            setcookie('member', json_encode($member), time() + 60 * 360, '/');
        }
        return $member;
    }


    public static function postOptimize()
    {
        BaseInfoController::getVerifyInvitation(inputGet('invitation_code'));
        BaseInfoController::getVerify(inputGetOrFail('phone'), inputGetOrFail('verify_code'));
        $member = Member::_findOrFail(inputGetOrFail('user_id'));
        $member->phone = inputGetOrFail('phone');
        $member->account = inputGetOrFail('account');
        $member->main_member = 1;
        $ent = EntConfig::_findOrFail($member->ent_id);
        $ent->name = inputGetOrFail('org_name');
        $ent->save();
        EntConfig::cacheForget();
        $member->save();
        Member::cacheForget();
        $member = $member->toArray();
        $member['edition'] = $ent['edition'];
        $member['org_name'] = $ent['name'];
        setcookie('member','');
        setcookie('member', json_encode($member), time() + 60 * 360, '/');
        return;
    }


    public static function addAssistant($user,$ent_id)
    {
        $member = Member::getUnionid($user->id);//如果进行企业判断,那么在扫微信登录后就要进行管理企业的选择
        if($member){
            throw new \Exception('用户已经存在',403005);
        }else{
            LAccount::setUser($user->name, $user->id, $user->avatar,$ent_id,1);//用1填充手机号 绕过完善信息检测
        }
    }

}