<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:42
 */

namespace App\Models;


class Member extends User
{
    protected $table = 'member';
    public $timestamps = true;

    public static function getUniqueCode($name, $unionid)
    {
        return self::createWith()->where('name', $name)->where('unionid', $unionid)->first();
    }

    public static function getUnionid($unionid)
    {
        return self::createWith()->where('unionid',$unionid)->first();
    }
}