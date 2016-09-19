<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:29
 */

namespace App\Http\Controllers;

use App\Models\ExhibitionInfo;
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
        $members = json_decode($_COOKIE['member'],true);
        if (!$members) {
            throw new Exception(40106);
        } else {
            $this->member = $members;
        }
    }

}