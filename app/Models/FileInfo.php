<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:42
 */

namespace App\Models;


class FileInfo extends BaseModel
{
    protected $table = 'file_info';
    public $timestamps = true;
    const STYLE_LIST = 1;
    const STYLE_DOUBLE_COLUMN = 2;
    const STYLE_BACK_PIC = 3;


    public static function getCount($ex_id)
    {
        return self::createWith()->where("ex_id",$ex_id)->count();
    }
}