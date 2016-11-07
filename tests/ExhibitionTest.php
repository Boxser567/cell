<?php

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/17
 * Time: 上午9:42
 */
class ExhibitionTest extends TestCase
{
    public function estList()
    {
        dump("获取用户会展列表");
        $result = $this->request(
            "GET", "/exhibition/list", [
            ]
        );
        $this->checkOut($result);
    }

    public function estReport()
    {
        dump("创建会展");
        $result = $this->request(
            "POST", "/exhibition/create", [
            ]
        );
        $this->checkOut($result);
    }

    public function estGroup()
    {
        dump("创建分组");
        $result = $this->request(
            "POST", "/exhibition/group", [
                'ex_id'=>32
            ]
        );
        $this->checkOut($result);

    }

    public function estGroupUpdate()
    {
        dump("更新分组");
        $result = $this->request(
            "POST", "/exhibition/group-update", [
                'group_id'=>3,
                'name'=>"wangyuxiang",
                'start_time'=>'2016-01-01 12:12:00',
                'end_time'=>'2016-01-01 12:12:00',
                'hidden'=>0,
                'forever'=>0,
            ]
        );
        $this->checkOut($result);

    }


    public function testSize()
    {
        dump("更新大小");
        $result = $this->request(
            "GET", "/exhibition/size", [
                'unique_code'=>'0911368292'
            ]
        );
        $this->checkOut($result);

    }

    public function estSendMail()
    {
        dump("获取会展详情");
        $result = $this->request(
            "GET", "/exhibition/detail", [
                'unique_code'=>'0539527426'
            ]
        );
        $this->checkOut($result);
    }

    public function estInfo()
    {
        dump("修改会展详情");
        $result = $this->request(
            "POST", "/exhibition/info", [
                "exhibition_id"=>80,
                "sub_title"=>"被修改的标题",
               // "logo"=>"狗头",
               // "banner"=>"banner",
               // "start_date"=>"2016-09-09",
               // "end_date"=>"2019-09-29",
               // "website"=>"www.nbai.com",
            ]
        );
        $this->checkOut($result);

    }

    public function estInfos()
    {
        dump("开启/关闭资料收集夹");
        $result = $this->request(
            "POST", "/exhibition/res-collection", [
                "exhibition_id"=>1,
                "action"=>"close",
            ]
        );
        $this->checkOut($result);

    }

    public function estAccount()
    {
        dump("账户信息");
        $result = $this->request(
            "GET", "/account/info", [
            ]
        );
        $this->checkOut($result);

    }


    public function estModule()
    {
        dump("创建模块");
        $result = $this->request(
            "POST", "/exhibition/module", [
                "ex_id"=>1,
            ]
        );
        $this->checkOut($result);
    }

    public function estModules()
    {
        dump("更新模块");
        $result = $this->request(
            "POST", "/exhibition/update-module", [
                "ex_id"=>80,
                //'folder_id'=>30,
                "title"=>"wangyuxiang",
                //"back_pic"=>"dfdfdfdsfadsfadfadsfadsfadsfadsf",
                //"sub_title"=>"zhongguoren",
                "style"=>2
            ]
        );
        $this->checkOut($result);
    }

}