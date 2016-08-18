<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/17
 * Time: 上午9:32
 */

namespace App\Http\Controllers;


class AccountController extends BaseController
{
    public function getInfo()
    {
     return $this->member;
    }
}