<?php
namespace App\Logic;

use App\Models\EntConfig;
use App\Models\ExhibitionInfo;
use App\Models\Member;
use App\Models\GroupInfo;

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/8
 * Time: 下午3:43
 */
class LAccount
{
    
    const LOGO_URL="ce8cfebaec8af2164e9f171006852d8d943229e7.png-160";
    public static function setUser($name = '', $unionid = '',$image='',$ent_id='')
    {
        $member = Member::getUniqueCode($name, $unionid);
        if (!$member && !$ent_id) {
            $member = new Member();
            $ent_id=LAccount::setEntConfig();
            $member->ent_id = $ent_id;
        }elseif ($ent_id){
            $member = new Member();
            $member->ent_id = $ent_id;
        }
        $member->name = $name;
        $member->unionid = $unionid;
        $member->image=$image;
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

    public static function setExhibition($ent_id,$org_id,$id='',$res_collect_lock=0,$title='会展助手',$start_date='',$ent_date='',$web_site='')
    {
        if($id){
            $exhibition=ExhibitionInfo::_findOrFail($id);
        }else{
            $exhibition=new ExhibitionInfo();
            $exhibition->logo=config('app.qiniu.domain')."/".self::LOGO_URL;
            $exhibition->banner=config('app.qiniu.domain')."/".config('data.BANNER')[random_int(0,8)];
        }
        $exhibition->title=$title;
        $exhibition->unique_code=getUniqueCode();
        $exhibition->ent_id=$ent_id;
        $exhibition->org_id=$org_id;
        $exhibition->start_date=$start_date?$start_date:get_date(0,'',"Y-m-d");
        $exhibition->end_date=$ent_date?$ent_date:get_date(0,'',"Y-m-d");
        $exhibition->res_collect_lock=$res_collect_lock;
        $property=["web_site"=>$web_site,"file_count"=>0,"size_use"=>0,"dir_count"=>0];
        $exhibition->property=json_encode($property);
        $exhibition->save();
        ExhibitionInfo::cacheForget();
        return $exhibition;
    }

    //创建新的分组
    public static function setGroup($ex_id,$id="",$name="新分组",$start_time="0000-00-00 00:00:00",$end_time="0000-00-00 00:00:00",$hidden=0)
    {
        if($id){
            $group=GroupInfo::_findOrFail($id);
        }else {
            $group = new GroupInfo();
        }
        $group->ex_id = $ex_id;
        $group->name = $name;
        $group->start_time = $start_time;
        $group->end_time = $end_time;
        $group->hidden = $hidden;
        $group->save();
        GroupInfo::cacheForget();
        return $group;
    }


    //更新会展大小
    public static function postUpdateExhibition($org_id,$dirs,$files,$size)
    {
        $exhibition = ExhibitionInfo::getOfOrgId($org_id);
        $property=json_decode($exhibition->property,true);
        $property['file_count']=$files;
        $property['size_use']=$size;
        $property['dir_count']=$dirs;
        $exhibition->property=json_encode($property);
        $exhibition->save();
        ExhibitionInfo::cacheForget();
    }
}