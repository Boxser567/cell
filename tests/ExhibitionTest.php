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

    public function testReport()
    {
        dump("创建会展");
        $result = $this->request(
            "POST", "/exhibition/create", [
            ]
        );
        $this->checkOut($result);

    }

    public function estSendMail()
    {
        dump("获取会展详情");
        $result = $this->request(
            "GET", "/exhibition/create", [
                'exhibition_id'=>'1'
            ]
        );
        $this->checkOut($result);
    }

    public function estInfo()
    {
        dump("修改会展详情");
        $result = $this->request(
            "POST", "/exhibition/info", [
                "exhibition_id"=>1,
                "title"=>"被修改的标题",
                "logo"=>"狗头",
                "banner"=>"banner",
                "start_date"=>"2016-09-09",
                "end_date"=>"2019-09-09",
                "website"=>"www.nbai.com",
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

}