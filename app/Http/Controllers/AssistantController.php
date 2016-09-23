<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/9/23
 * Time: 上午8:51
 */

namespace App\Http\Controllers;


use App\Models\Member;

class AssistantController extends BaseController
{

    public  function postAdd()
    {
        $ent_id=inputGetOrFail('ent_id');
        \Config::set('wechat.oauth.callback','http://cell.meetingfile.com/auth/callback?target=add&ent_id='.$ent_id);
        $wechat=app('wechat');
        $wechat->oauth->scopes(['snsapi_login'])
            ->redirect()->send();
    }

    public function getList()
    {
               Member::cacheForget();
        return Member::getEntId(inputGetOrFail('ent_id'))->toArray();
    }
    
    public function postDelete()
    {
        return Member::deleteIdEntId(inputGetOrFail('member_id'));//返回值为1
    }
}