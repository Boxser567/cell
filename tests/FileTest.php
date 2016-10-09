<?php

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/17
 * Time: 下午1:39
 */
class FileTest extends TestCase
{
    public function estLists()
    {
        dump("获取文件列表");
        $result = $this->request(
            "GET", "/file/list", [
                'org_id'=>'665030',
                'fullpath'=>" ",
            ]
        );
        $this->checkOut($result);
    }

    public function estList()
    {
        dump("获取文件(夹)详情");
        $result = $this->request(
            "GET", "/file/info", [
                'org_id'=>'665030',
                'fullpath'=>'概况RESTful.md',
            ]
        );
        $this->checkOut($result);
    }

    public function estReport()
    {
        dump("创建新文件夹");
        $result = $this->request(
            "POST", "/file/create-folder", [
                'org_id'=>'665215',
                'fullpath'=>'keji1',
            ]
        );
        $this->checkOut($result);

    }

    public function testImg()
    {
        dump("修改文件夹图片");
        $result = $this->request(
            "POST", "/file/update-img", [
                'hash'=>'6ad0967e09b64067311e9516fbc6010f55c13eb0',
                'img_url'=>'dsfdfsfsdfsdfsd',
                'type'=>0,
            ]
        );
        $this->checkOut($result);

    }


    public function estSendMail()
    {
        dump("删除文件(夹)");
        $result = $this->request(
            "POST", "/file/del", [
                'org_id'=>'665030',
                'fullpath'=>'logo',
            ]
        );
        $this->checkOut($result);
    }

    public function estSendMa()
    {
        dump("修改文件(夹)名");
        $result = $this->request(
            "POST", "/file/reset-name", [
                'org_id'=>'665030',
                'fullpath'=>'概况RESTful.md',
                "newpath"=>"newName.md"

            ]
        );
        $this->checkOut($result);
    }


    public function estSendMas()
    {
        dump("修改文件(夹)名");
        $result = $this->request(
            "GET", "/file/yunku-file", [
                'org_id'=>'688602',
                'hash'=>'972553240201a02c0e433a51dbfbe8c85c3cd8b4',
                "size"=>"362560"

            ]
        );
        $this->checkOut($result);
    }

    public function estGroupUpdate()
    {
        dump("更新分类");
        $result = $this->request(
            "POST", "/file/validate-time", [
                'hash'=>'c78dac2826ec8f604702440eb549df9949171830',
                'start_time'=>'2016-01-01 12:12:00',
                'end_time'=>'2016-01-01 12:12:00',
                'hidden'=>0,
                'position'=>'under',
            ]
        );
        $this->checkOut($result);

    }
}