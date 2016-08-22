<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/17
 * Time: 上午8:48
 */

namespace App\Http\Controllers;

use App\Logic\YunkuFile;
use Qiniu\Auth;

class FileController extends BaseController
{
    //获取文件列表
    public function getList()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->getFileList(inputGetOrFail('fullpath'));
    }

    //获取文件夹或文件详情
    public function getInfo()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->getInfo(inputGetOrFail('fullpath'));
    }

    //创建文件夹
    public function postCreateFolder()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->setFolder(inputGetOrFail('fullpath'));
    }

    //获取上传地址
    public function getUpAddress()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $web_address = $files->getWebServer();
        $api_address = $web_address[YunkuFile::UPLOAD_WEB_ADDRESS][0] . "/2/web_upload";
        return ['url' => $api_address, 'org_client_id' => $files->getOrgClientId()];
    }

    //删除文件(夹)
    public function postDel()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->deleteFile(inputGetOrFail('fullpath'));
    }

    //获取图片上传参数
    public function getUpPicture()
    {
        $accessKey = config('app.qiniu.access_key');
        $secretKey = config('app.qiniu.secret_key');
        $auth = new Auth($accessKey, $secretKey);
        $bucket = config('app.qiniu.bucket');
        $token = $auth->uploadToken($bucket);
        return ["upload_domain"=>config('app.qiniu.domain'),'token'=>$token];
    }

    //通过链接上传文件
    public function postUrlUpload()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->setUrlFile(inputGetOrFail('fullpath'),inputGetOrFail('url'));
    }
}