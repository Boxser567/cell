<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/9/23
 * Time: 上午8:51
 */

namespace App\Http\Controllers;


use App\Models\Member;
use Illuminate\Support\Facades\Log;

class AssistantController extends BaseController
{

    public  function getAdd()
    {
        $ent_id=inputGetOrFail('ent_id');
        \Config::set('wechat.oauth.callback',env('WEIXIN_REDIRECT_URI').'?target=add&ent_id='.$ent_id);
        Log::info('添加协同管理员'.env('WEIXIN_REDIRECT_URI').'?target=add&ent_id='.$ent_id);
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