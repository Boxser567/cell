<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/17
 * Time: 上午8:48
 */

namespace App\Http\Controllers;

use App\Logic\LAccount;
use App\Logic\YunkuFile;
use Qiniu\Auth;
use App\Models\ExhibitionInfo;
use App\Logic\YunkuOrg;

class FileController extends Controller
{
    //获取文件列表
    public function getList()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $file_list=$files->getFileList(inputGet('fullpath',''));
        if(!$file_list) {
            $this->updateStatistic($file_list['list'], inputGetOrFail('org_id'));
        }
        return $file_list;
    }


    // 更新文件大小
    private function updateStatistic($file_list,$org_id)
    {
        $yunku_org = new YunkuOrg();
        $org_info = $yunku_org->getOrgInfo($org_id);
        $dirs=$files=$size=0;
        $org_file = new YunkuFile($org_id);
            foreach ($file_list as $key => $file) {
                if ($file['filename'] == ExhibitionController::RES_COLLECTION_FOLDER_NAME) {
                    $res_col_info = $org_file->getInfo(ExhibitionController::RES_COLLECTION_FOLDER_NAME, 1);
                    $files =$org_info['info']['file_count'] - $res_col_info['file_count'];
                    $size = $org_info['info']['size_org_use'] - $res_col_info['files_size'];
                    $dirs =$org_info['info']['dir_count'] - 1;
                }
            }
        LAccount::postUpdateExhibition($org_id,$dirs,$files,$size);
    }

    //获取文件夹或文件详情
    public function getInfo()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->getInfo(inputGetOrFail('fullpath'),1);
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

    //修改文件(夹)名称 
    public function postResetName()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->setName(inputGetOrFail('fullpath'),inputGetOrFail('newpath'));
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
        return ["upload_domain"=>config('app.qiniu.domain'),'token'=>$token,'file_name'=>sha1(uniqid())];
    }

    //通过链接上传文件
    public function postUrlUpload()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->setUrlFile(inputGetOrFail('fullpath'),inputGetOrFail('url'));
    }

    public function getShow()
    {
        $exhibition = ExhibitionInfo::getUniqueCode(inputGetOrFail('unique_code'));
        return $exhibition->toArray();
    }

}