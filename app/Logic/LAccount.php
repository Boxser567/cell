<?php
namespace App\Logic;

use App\Models\EntConfig;
use App\Models\ExhibitionInfo;
use App\Models\Member;

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/8
 * Time: 下午3:43
 */
class LAccount
{
    public static function setUser($name = '', $unionid = '',$image='')
    {
        $member = Member::getUniqueCode($name, $unionid);
        if (!$member) {
            $member = new Member();
            $ent_id=LAccount::setEntConfig();
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

    public static function setExhibition($ent_id,$org_id,$id='',$res_collect_lock=0,$title='会展助手',$start_date='',$ent_date='',$web_site=ExhibitionInfo::INIT_WEB_SITE)
    {
        if($id){
            $exhibition=ExhibitionInfo::_findOrFail($id);
        }else{
            $exhibition=new ExhibitionInfo();
            $exhibition->banner=config('app.qiniu.domain')."/".config('data.BANNER')[random_int(0,4)];
            $exhibition->logo=config('app.qiniu.domain')."/".config('data.LOGO')[random_int(0,4)];
        }
        $exhibition->title=$title;
        $exhibition->unique_code=getUniqueCode();
        $exhibition->ent_id=$ent_id;
        $exhibition->org_id=$org_id;
        $exhibition->start_date=$start_date?$start_date:get_date();
        $exhibition->end_date=$ent_date?$ent_date:get_date();
        $exhibition->res_collect_lock=$res_collect_lock;
        $property=["web_site"=>$web_site,"file_count"=>0,"size_use"=>0,"dir_count"=>0];
        $exhibition->property=json_encode($property);
        $exhibition->save();
        ExhibitionInfo::cacheForget();
        return $exhibition;
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