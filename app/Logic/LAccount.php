<?php
namespace App\Logic;

use App\Models\EntConfig;
use App\Models\ExhibitionInfo;
use App\Models\Member;
use App\Models\GroupInfo;
use App\Models\FileInfo;

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/8
 * Time: 下午3:43
 */
class LAccount
{

    const LOGO_URL = "ce8cfebaec8af2164e9f171006852d8d943229e7.png-160";

    public static function setUser($name = '', $unionid = '', $image = '', $ent_id = '', $phone = '')
    {
        $member = Member::getUniqueCode($name, $unionid);
        if (!$member && !$ent_id) {
            $member = new Member();
            $ent_id = LAccount::setEntConfig();
            $member->ent_id = $ent_id;
        } elseif ($ent_id) {
            $member = new Member();
            $member->ent_id = $ent_id;
        }
        $member->name = $name;
        $member->unionid = $unionid;
        $member->phone = $phone;
        $member->image = $image;
        $member->save();
        Member::cacheForget();
        return $member;
    }


    public static function setEntConfig($name = '', $edition = EntConfig::EDITION_FREE)
    {
        $ent = new EntConfig();
        $ent->name = $name;
        $ent->edition = $edition;
        $ent->save();
        EntConfig::cacheForget();
        return $ent->id;
    }

    public static function setExhibition($ent_id, $org_id, $base_hash = '', $id = '', $res_collect_lock = 0, $title = '会展助手', $start_date = '', $ent_date = '', $web_site = '')
    {
        if ($id) {
            $exhibition = ExhibitionInfo::_findOrFail($id);
        } else {
            $exhibition = new ExhibitionInfo();
            $exhibition->logo = config('app.qiniu.domain') . "/" . self::LOGO_URL;
            $exhibition->banner = config('app.qiniu.domain') . "/" . config('data.BANNER')[random_int(0, 8)];
        }
        $exhibition->title = $title;
        $exhibition->unique_code = getUniqueCode();
        $exhibition->ent_id = $ent_id;
        $exhibition->org_id = $org_id;
        $exhibition->start_date = $start_date ? $start_date : get_date(0, '', "Y-m-d");
        $exhibition->end_date = $ent_date ? $ent_date : get_date(0, '', "Y-m-d");
        $exhibition->res_collect_lock = $res_collect_lock;
        $property = ["web_site" => $web_site, "file_count" => 0, "size_use" => 0, "dir_count" => 0, 'base_hash' => $base_hash,"sub_title"=>""];
        $exhibition->property = json_encode($property);
        $exhibition->save();
        ExhibitionInfo::cacheForget();
        return $exhibition;
    }

    //创建新的分组
    public static function setGroup($ex_id, $order=1,$id = "", $name = "新分组", $start_time = NULL, $end_time = NULL, $hidden = 0)
    {
        if ($id) {
            $group = GroupInfo::_findOrFail($id);
        } else {
            $group = new GroupInfo();
        }
        $group->order_by = $order;
        $group->ex_id = $ex_id;
        $group->name = $name;
        $group->start_time = $start_time;
        $group->end_time = $end_time;
        $group->hidden = $hidden;
        $group->save();
        GroupInfo::cacheForget();
        return $group;
    }

    //创建更新新模块
    public static function setFile($id = "", $ex_id = "", $hash = "", $folder_id = "", $order_by = "",$size=0, $property = "")
    {
        if ($id) {
            $module = FileInfo::_findOrFail($id);
        } else {
            $module = new FileInfo();
        }

        if ($ex_id) {
            $module->ex_id = $ex_id;
        }
        if ($hash) {
            $module->hash = $hash;
        }
        if ($size) {
            $module->size = $size;
        }
        if ($folder_id) {
            $module->folder_id = $folder_id;
        }
        if ($order_by) {
            $module->order_by = $order_by;
        }
        if ($property) {
            $module->property = $property;
        }
        $module->save();
        FileInfo::cacheForget();
        return $module;
    }


    //更新会展大小
    public static function postUpdateExhibition($org_id, $dirs, $files, $size)
    {
        $exhibition = ExhibitionInfo::getOfOrgId($org_id);
        $property = json_decode($exhibition->property, true);
        $property['file_count'] = $files;
        $property['size_use'] = $size;
        $property['dir_count'] = $dirs;
        $exhibition->property = json_encode($property);
        $exhibition->save();
        ExhibitionInfo::cacheForget();
    }
}