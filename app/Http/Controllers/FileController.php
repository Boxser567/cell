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
use App\Models\ExhibitionInfo;
use App\Logic\YunkuOrg;

class FileController extends Controller
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
        $this->format($exhibition);
        return $exhibition;
    }

    //格式化会展资料详情
    public function format(&$exhibition, $flag = false)
    {
        //获取文件列表
        $org_file = new YunkuFile($exhibition->org_id);
        $yunku_org = new YunkuOrg();
        $org_info = $yunku_org->getOrgInfo($exhibition->org_id);
        $file_info = array();
        $file_info['dir_count'] = $org_info['info']['dir_count'];
        $file_info['file_count'] = $org_info['info']['file_count'];
        $file_info['size_use'] = $org_info['info']['size_org_use'];
        $file_list = $org_file->getFileList();
        $files = $file_list['list'];
        $dir = array();
        $list = array();
        foreach ($files as $key => &$file) {
            $this->fileFilter($file);
            if ($file['filename'] == ExhibitionController::RES_COLLECTION_FOLDER_NAME) {
                $res_col_info = $org_file->getInfo(ExhibitionController::RES_COLLECTION_FOLDER_NAME, 1);
                $file_info['file_count'] = $file_info['file_count'] - $res_col_info['file_count'];
                $file_info['size_use'] = $file_info['size_use'] - $res_col_info['files_size'];
                $file_info['dir_count'] = $file_info['dir_count'] - 1;
            }
            if ($file['dir'] && $file['filename'] != ExhibitionController::RES_COLLECTION_FOLDER_NAME) {
                $res_col_info = $org_file->getFileList($file['fullpath']);
                $res_col_detail = $org_file->getInfo($file['fullpath'], 1);
                $file += ["filespace" => $res_col_detail['files_size']];
                $file += ["filecount" => $res_col_info['count']];
                $dir[$key] = $file;
            } else {
                if (!$file['dir'] && $file['filename'] != ExhibitionController::RES_COLLECTION_FOLDER_NAME) {
                    $list[$key] = $org_file->getInfo($file['fullpath']);
                }
            }
        }
        if (!$flag) {
            $file_info['list'] = array_values($list);
            $file_info['dirs'] = array_values($dir);
        }
        $exhibition = $exhibition->toArray();
        $exhibition['unique_code'] = "http://" . config("app.view_domain") . "/" . $exhibition['unique_code'];
        if ($exhibition['res_collect_lock']) {
            $exhibition['res_collect_lock'] = ExhibitionController::RES_COLLECTION_FOLDER_NAME;
        }
        $exhibition['files'] = $file_info;
    }
    //过滤无效字段
    public function fileFilter(&$file)
    {
        unset($file['create_dateline'], $file['create_member_name'], $file['filehash'], $file['last_dateline'], $file['last_member_name']);
    }
}