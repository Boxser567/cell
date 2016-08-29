<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:42
 */

namespace App\Models;


class FolderInfo extends User
{
    protected $table = 'folder_info';


    public static function getByHash($hash)
    {
        return self::createWith()->where("folder_hash", $hash)->select("file_count","file_size")->first();
    }

    public static function deleteByHash($hash)
    {
        return self::where("folder_hash", $hash)->delete();

    }

    public static function updateInfo($hash,$file_count,$file_size)
    {
        return self::where("folder_hash", $hash)->update(["file_size"=>$file_size,"file_count"=>$file_count]);
    }
}