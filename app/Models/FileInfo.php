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
    const USUAL_FILE_COUNT=1;
    const USUAL_FOLDER_COUNT=1;


    public static function getCount($ex_id)
    {
        return self::createWith()->where("ex_id", $ex_id)->count();
    }

    public static function getFolderId($folder_id)
    {
        return self::createWith()->where("folder_id", $folder_id)->orderBy("order_by")->paginate(self::USUAL_FILE_COUNT);
    }

    public static function getExId($ex_id)
    {
        return self::createWith()->where("ex_id", $ex_id)->where('folder_id',0)->orderBy("order_by")->paginate(self::USUAL_FOLDER_COUNT);
    }

    public static function deleteId($id)
    {
        return self::where('id',$id)->delete();
    }
}