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
      if (array_key_exists("member", $_COOKIE)) {
          setcookie('member', $_COOKIE['member'], time() + 60 * 360, '/');
          $members = json_decode($_COOKIE['member'], true);
        } else {
            $members = [];
        }
       if (!$members) {
            $wechat = app('wechat');
            $response = $wechat->oauth->scopes(['snsapi_login'])->redirect();
            $response->send();
        } elseif (!$members['phone'] && !array_key_exists('info', $_GET)) {
           header("Location:baseinfo/register?user_id=" . $members['id']);
        } else {
            if ($members['phone']) {
               $edition = $this->getSetting($members['edition']);
               $members += ['edition_info' => $edition];
           }
           $this->member = $members;
        }
//       $member = Session::get('member', $member);
//        if (!$member) {
//            throw new Exception(40106);
//        } else {
//            Session::put('member', $member);
//            $this->member = $member;
//        }

    }

    public function getSetting($member_edition = '')
    {
        $member_edition = inputGet("edition", $member_edition);
        if ($member_edition) {
            switch ($member_edition) {
                case 1:
                    $edition = "free";
                    break;
                case 2:
                    $edition = "standard";
                    break;
                case 3:
                    $edition = "advanced";
                    break;
                default:
                    throw new Exception("版本错误", 403000);
            }
            return config("data.EDITION." . $edition);
        } else {
            throw new Exception("版本错误", 403000);
        }
    }


    public function judgePermission($permission, $parameter='')
    {
        $setting_list = $this->member['edition_info'];
        if (!array_key_exists($permission, $setting_list)) {
            throw new Exception("权限判断参数错误", 4021002);
        } else {
            if ($parameter && $setting_list[$permission]>0  && $parameter > $setting_list[$permission] ) {
                throw new Exception("超过版本设置参数,请升级版本", 4021002);
            } else {
                if (!$setting_list[$permission]) {
                    throw new Exception('当前版本没有此权限,请升级版本', 403008);
                }
            }
        }
    }


}