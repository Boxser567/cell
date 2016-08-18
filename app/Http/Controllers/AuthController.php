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

class AuthController extends Controller
{

    public function postLogin()
    {
        $name=inputGetOrFail('name');
        $unionid=inputGetOrFail('unionid');
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
}