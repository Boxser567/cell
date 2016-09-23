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
        return self::createWith()->where('unionid', $unionid)->first();
    }

    public static function getPhone($phone)
    {
        return self::where('phone', $phone)->first();
    }

    public static function getUnionidEntID($unionid, $ent_id)
    {
        return self::where('unionid', $unionid)->where('ent_id',$ent_id)->first();
    }

    public static function getEntId($ent_id)
    {
        return self::createWith()->where('ent_id',$ent_id)->select('id','image','account','name','main_member')->get();
    }

    public static function deleteIdEntId($id)
    {
        return self::where('id',$id)->delete();
    }
}