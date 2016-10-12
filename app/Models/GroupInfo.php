<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:42
 */

namespace App\Models;

use App\Models\Relation\HasManyFolders;

class GroupInfo extends BaseModel
{
    use HasManyFolders;
    protected $table = 'group_info';
    public $timestamps = true;

    public static function getFolderInfo($group_id)
    {
        return self::createWith(['folder'])->find($group_id);
    }

    public static function getCountByExId($ex_id)
    {
        return self::where('ex_id',$ex_id)->count();
    }

    public static function deleteById($id)
    {
        return self::where('id',$id)->delete();
    }
    
    public static function getExId($ex_id)
    {
        return self::createWith(['folder'])->where('ex_id',$ex_id)->get();
    }
}