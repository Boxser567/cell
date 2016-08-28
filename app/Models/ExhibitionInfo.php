<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午3:32
 */

namespace App\Models;


class ExhibitionInfo extends BaseModel
{
    const  INIT_WEB_SITE = "http://www.gokuai.com/";
    public $table = "ent_exhibition_info";
    public $timestamps = true;

    public static function getOfEntId($ent_id)
    {
        return self::createWith()->where('ent_id', $ent_id)->get();
    }

    public static function getUniqueCode($unique_code)
    {
        return self::createWith()->where('unique_code', $unique_code)->first();
    }

    public static function getOfOrgId($org_id)
    {
        return self::createWith()->where('org_id', $org_id)->first();

    }
    

}