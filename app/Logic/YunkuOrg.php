<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 上午11:22
 */

namespace App\Logic;

use GokuaiAuth;
use Exception;
class YunkuOrg
{
    private $ent_sdk;
    
    public function __construct()
    {
        $this->ent_sdk = new \GokuaiBase();
    }

    //创建库 
     public function setOrg($org_name,$org_logo='',$org_capacity='',$storage_point_name='',$org_desc='')
     {
         $data=[
             "org_name"=>$org_name,
             "org_logo"=>$org_logo,
             "org_capacity"=>$org_capacity,
             "storage_point_name"=>$storage_point_name,
             "org_desc"=>$org_desc
         ];
         $res = $this->ent_sdk->callAPI('POST', '/1/org/create',$data);
         $this->checkResult($res,$this->ent_sdk);
         return $res;
     }

    //获取库信息
    public function getOrgInfo($org_id)
    {
        $data=[
            "org_id"=>$org_id,
        ];
        $res = $this->ent_sdk->callAPI('GET', '/1/org/info',$data);
        $this->checkResult($res,$this->ent_sdk);
        return $res;
    }

    //获取库列表
    public function getOrg()
    {
        $res = $this->ent_sdk->callAPI('GET', '/1/org/ls');
        $this->checkResult($res,$this->ent_sdk);
        return $res;
    }
    
    //获取库授权
    public function getOrgAuth($org_id,$title='',$url='')
    {
        $data=[
            "org_id"=>$org_id,
            "title"=>$title,
            "url"=>$url
        ];
        $res = $this->ent_sdk->callAPI('GET', '/1/org/bind',$data);
        $this->checkResult($res,$this->ent_sdk);
        return $res;
    }

    public function checkResult(&$res,$ent_sdk)
    {
        if (!$res) {
            \Log::info("云库错误");
            throw new Exception($ent_sdk->getHttpResponse());
        } else {
            $res=json_decode($ent_sdk->getHttpResponse(),true);
        }
    }
}