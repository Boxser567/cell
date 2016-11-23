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
    const STYLE_LIST_LEFT= 1;
    const STYLE_LIST_RIGHT= 3;
    const STYLE_DOUBLE_COLUMN_LEFT = 2;
    const STYLE_DOUBLE_COLUMN_RIGHT = 4;
    const STYLE_BACK_PIC = 5;

    const USUAL_FILE_COUNT=1;
    const USUAL_FOLDER_COUNT=1;


    public static function getElseFiles($ex_id,$folder_id){
        return self::createWith()->where('ex_id',$ex_id)->where('folder_id','<>',$folder_id)->groupBy('title')->get();
    }
    public static function getByTitle($title,$folder_id)
    {
        return self::where('title',$title)->where('folder_id',$folder_id)->first();
    }

    public static function getCount($ex_id,$folder_id)
    {
        return self::createWith()->where("ex_id", $ex_id)->where('folder_id',$folder_id)->count();
    }

    public static function getFolderId($folder_id)
    {
        return self::createWith()->where("folder_id", $folder_id)->orderBy("order_by")->paginate(get_page_size());
    }

    public static function getExId($ex_id)
    {
        return self::createWith()->where("ex_id", $ex_id)->where('folder_id',0)->orderBy("order_by")->paginate(get_page_size());
    }

    public static function deleteId($id)
    {
        return self::where('id',$id)->delete();
    }

    public static function getSize($ex_id){
        return self::createWith()->where('ex_id',$ex_id)->sum('size');
    }

    public static function getCountByExId($ex_id)
    {
        return self::createWith()->where("ex_id", $ex_id)->count();
    }
    
    public static function getByHash($hash)
    {
       return self::createWith()->where('hash',$hash)->first();
    }
}