<?php

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/17
 * Time: 下午1:39
 */
class FileTest extends TestCase
{
    public function testLists()
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
}