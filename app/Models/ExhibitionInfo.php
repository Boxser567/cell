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
    const  INIT_LOGO_URL = "http://gkavatar2.oss-cn-hangzhou.aliyuncs.com/04/04ad7a92535005059995fcb15e2d94707776bc5e.jpg";
    const  INIT_BANNER_URL = "http://gkavatar2.oss-cn-hangzhou.aliyuncs.com/04/04ad7a92535005059995fcb15e2d94707776bc5e.jpg";
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

}