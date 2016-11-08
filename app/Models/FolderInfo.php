<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:42
 */

namespace App\Models;


class FolderInfo extends BaseModel
{
    protected $table = 'folder_info';
    public $timestamps = true;

    public static function getByHash($hash)
    {
        return self::createWith()->where("folder_hash", $hash)->first();
    }


    public static function getCountByOrgId($org_id)
    {
        return self::createWith()->where('org_id',$org_id)->count();
    }

    public static function getByGroupId($group_id)
    {
        return self::createWith()->where('group_id',$group_id)->get();
    }

    public static function deleteByHash($hash)
    {
        return self::where("folder_hash", $hash)->delete();
    }

    public static function updateInfo($hash, $file_count, $file_size)
    {
        return self::where("folder_hash", $hash)->update(["file_size" => $file_size, "file_count" => $file_count]);
    }

    public static function updateImgUrl($hash, $img_url)
    {
        return self::where("folder_hash", $hash)->update(["img_url" => $img_url]);
    }

    public static function updateTitle($hash, $title)
    {
        return self::where("folder_hash", $hash)->update(["title" => $title]);
    }

    public static function updateValidateTime($hash,$start_time,$end_time)
    {
        return self::where("folder_hash", $hash)->update(["start_time" => $start_time,'end_time'=>$end_time]);
    }

    public static function getCountByGroup($group_id)
    {
        return self::where('group_id',$group_id)->count();
    }

    public static function addCount($id)
    {
        return self::find($id)->increment('file_count');
    }
}