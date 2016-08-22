<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/16
 * Time: 上午8:54
 */

namespace App\Logic;

use Exception;

class YunkuFile extends \GokuaiFile
{
    const UPLOAD_WEB_ADDRESS = "upload3";
    public $org_client_id;

    public function __construct($org_id)
    {
        $yunku_ent = new YunkuOrg();
        $org_info = $yunku_ent->getOrgAuth($org_id);
        $this->org_client_id = $org_info['org_client_id'];
        $org_client_secret = $org_info['org_client_secret'];
        parent::__construct($this->org_client_id, $org_client_secret);
    }


    public function getOrgClientId()
    {
        return $this->org_client_id;
    }


    //文件列表
    public function getFileList($fullpath = '', $start = '', $size = '')
    {
        $data = [
            'fullpath' => $fullpath,
            'start' => $start,
            'size' => $size
        ];
        $res = $this->callAPI2('GET', '/1/file/ls', $data);
        $this->checkResult($res);
        return $res;
    }

    //创建文件夹
    public function setFolder($fullpath)
    {
        $data = [
            'fullpath' => $fullpath,
        ];
        $res = $this->callAPI2('POST', '/1/file/create_folder', $data);
        $this->checkResult($res);
        return $res;
    }

    //文件直接上传
    public function setFile($content, $fullpath, $filefield, $op_id = '', $op_name = '', $overwrite = 1)
    {
        $data = [
            $filefield => $content,
            'fullpath' => $fullpath,
            'filefield' => $filefield,
            'op_id' => $op_id,
            'op_name' => $op_name,
            'overwrite' => $overwrite
        ];
        $res = $this->callAPI2('POST', '/1/file/create_file', $data);
        $this->checkResult($res);
        return $res;
    }


    //web直接上传文件
    //步骤1
    public function getWebServer()
    {
        $res = $this->callAPI2('GET', '/1/file/upload_servers');
        $this->checkResult($res);
        return $res;
    }

    //步骤2
    public function setUpload($path, $name, $filefield, $redirect = '')
    {
        $web_address = $this->getWebServer();
        $api_address = $web_address[self::UPLOAD_WEB_ADDRESS][0] . "/2/web_upload";
        $parameters = [
            'path' => $path,
            'name' => $name,
            'filefield' => "file",
            'file' => $filefield,
            'redirect' => $redirect
        ];
        $parameters['org_client_id'] = $this->client_id;
        $parameters['dateline'] = time();
        $parameters['sign'] = $this->getSign($parameters);
        $this->sendRequest($api_address, 'POST', $parameters);
        $this->checkResult($res);
        return $res;
    }

    //删除文件(夹)
    public function deleteFile($fullpath, $op_id = '', $op_name = '')
    {
        $data = [
            'fullpath' => $fullpath,
            'op_id' => $op_id,
            'op_name' => $op_name,
        ];
        $res = $this->callAPI2('POST', '/1/file/del', $data);
        $this->checkResult($res);
        return $res;
    }

    //通过链接上传文件
    public function setUrlFile($fullpath, $url, $op_id = '', $op_name = '', $overwrite = 1)
    {
        $data = [
            'fullpath' => $fullpath,
            'url' => $url,
            'op_id' => $op_id,
            'op_name' => $op_name,
            'overwrite'=>$overwrite
        ];
        $res = $this->callAPI2('POST', '/1/file/create_file_by_url', $data);
        $this->checkResult($res);
        return $res;

    }

    //文件信息
    public function getInfo($fullpath,$attribute=0, $net = '')
    {
        $data = [
            'fullpath' => $fullpath,
            'net' => $net,
            'attribute'=>$attribute
        ];
        $res = $this->callAPI2('GET', '/1/file/info', $data);
        $this->checkResult($res);
        return $res;
    }

    public function checkResult(&$res)
    {
        if (!$res) {
            throw new Exception($this->getHttpResponse());
        } else {
            $res = json_decode($this->getHttpResponse(), true);
        }
    }


}