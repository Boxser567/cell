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
use Session;
use Auth;
use Exception;
use App\Logic\YunkuFile;
use App\Logic\YunkuOrg;

class BaseController extends Controller
{
    public $member;

    public function __construct($member = [])
    {
        /*if (array_key_exists("member", $_COOKIE)) {
            $members = json_decode($_COOKIE['member'], true);
        } else {
            $members = [];
        }
        if (!$members) {
            $wechat = app('wechat');
            $response = $wechat->oauth->scopes(['snsapi_login'])->redirect();
            $response->send();
        } elseif (!$members['phone'] && !array_key_exists('info', $_GET)) {
            header("Location:baseinfo/register?user_id=".$members['id']);
        } else {
            $this->member = $members;
        }*/

        $members = Session::get('member',$member);
                if (!$members) {
                    throw new Exception(40106);
                } else {
                    $this->member = $members;
                }
    }


}