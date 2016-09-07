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
use App\Models\FolderInfo;
use Qiniu\Auth;
use App\Models\ExhibitionInfo;
use App\Logic\YunkuOrg;
use Endroid\QrCode\QrCode;


class FileController extends Controller
{

    const RES_COLLECTION_FOLDER_NAME = "GKKJ_ZLSJJ";//够快科技资料收集夹

    //获取文件列表
    public function getList()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $file_list = $files->getFileList(inputGet('fullpath', ''));
        /*$input=inputGet('fullpath','')?1:0;
         $type=inputGet("type",'')?1:0;
        if(!$input && !$type) {
          $this->updateStatistic($file_list['list'], inputGetOrFail('org_id'));
        }*/

        if(!\Request::has('fullpath')) {
            foreach ($file_list["list"] as $key => $file) {
                if ($file['dir']) {
                    $file_list["list"][$key] += ["info" => FolderInfo::getByHash($file['hash'])->toArray()];
                }
            }
        }
        return $file_list;
    }

    //获取文件夹或文件详情
    public function getInfo()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->getInfo(inputGetOrFail('fullpath'), 1);
    }

    //创建文件夹
    public function postCreateFolder()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $files_info = $files->setFolder(inputGetOrFail('fullpath'));
        $folder_info = new FolderInfo();
        $folder_info->org_id = inputGetOrFail('org_id');
        $folder_info->folder_hash = $files_info['hash'];
        $img_url=config('app.qiniu.domain')."/".config('data.FOLDER')[random_int(0,8)];
        $folder_info->img_url =json_encode(["0"=>$img_url]);
        $folder_info->save();
        FolderInfo::cacheForget();
        $files_info+=["img_url"=>json_decode($folder_info->img_url,true)];
        return $files_info;
    }


    //更新文件夹信息
    public function postUpdateFolder($hash = '', $type = '', $size = 0)
    {
        $folder_info = FolderInfo::getByHash(inputGet('hash', $hash));
        $type = inputGet('type', $type);
        switch ($type) {
            case "add":
                $file_count = $folder_info->file_count + 1;
                $file_size = $folder_info->file_size + inputGet('size', $size);
                break;
            case "delete":
                $file_count = $folder_info->file_count - 1;
                $file_size = $folder_info->file_size - inputGet('size', $size);
                break;
            default:
                throw new \Exception("无效的操作");
        }
        FolderInfo::updateInfo(inputGet('hash', $hash), $file_count, $file_size);
        FolderInfo::cacheForget();
    }

    //上传文件夹图片
    public function postUpdateImg()
    {
        $folder_info = FolderInfo::getByHash(inputGetOrFail('hash'));
        $img_url=json_decode($folder_info->img_url,true);
        array_push($img_url,inputGetOrFail("img_url"));
        $folder_info->img_url=json_encode($img_url);
        $folder_info->save();
        FolderInfo::cacheForget();
    }


    //获取文件夹大小及文件个数
    public function getFolderDetail()
    {
        return FolderInfo::getByHash(inputGetOrFail('hash'))->toArray();
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
        return $files->setName(inputGetOrFail('fullpath'), inputGetOrFail('newpath'));
    }

    //删除文件(夹)
    public function postDel()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $files->deleteFile(inputGetOrFail('fullpath'));
        if (\Request::has('is_dir')) {
            if (inputGetOrFail('is_dir')) {
                FolderInfo::deleteByHash(inputGetOrFail('hash'));
                FolderInfo::cacheForget();
            } else {
                $this->postUpdateFolder(inputGetOrFail('hash'), "delete", inputGetOrFail('size'));
            }
        }
    }

    //获取图片上传参数
    public function getUpPicture()
    {
        $accessKey = config('app.qiniu.access_key');
        $secretKey = config('app.qiniu.secret_key');
        $auth = new Auth($accessKey, $secretKey);
        $bucket = config('app.qiniu.bucket');
        $token = $auth->uploadToken($bucket);
        return ["upload_domain" => config('app.qiniu.domain'), 'token' => $token, 'file_name' => sha1(uniqid())];
    }

    //通过链接上传文件
    public function postUrlUpload()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        return $files->setUrlFile(inputGetOrFail('fullpath'), inputGetOrFail('url'));
    }

    public function getShow()
    {
        $exhibition = ExhibitionInfo::getUniqueCode(inputGetOrFail('unique_code'));
        $this->format($exhibition);
        return $exhibition;
    }

    public function format(&$exhibition)
    {
        $exhibition = $exhibition->toArray();
        $exhibition['unique_code'] = "http://" . config("app.view_domain") . "/#/mobile/" . $exhibition['unique_code'];
    }

    public function getQr()
    {
        $text = inputGetOrFail("text");
        $type = inputGet('type', 'png');
        $size = inputGet('size', 100);
        $qrCode = new QrCode();
        $qrCode
            ->setText($text)
            ->setExtension($type)
            ->setSize($size)
            ->setPadding(10)
            ->setBackgroundColor(array('r' => 255, 'g' => 255, 'b' => 255, 'a' => 0))
            ->setForegroundColor(array('r' => 0, 'g' => 0, 'b' => 0, 'a' => 0))
            ->setErrorCorrection(QrCode::LEVEL_MEDIUM);
        header('Content-Type: ' . $qrCode->getContentType());
        $qrCode->render();
        exit();
    }

    public function getYunkuFile()
    {
        $org_id=inputGetOrFail("org_id");
        $yunkufile=new YunkuFile($org_id);
       return  $yunkufile->setYunkuFile(inputGetOrFail("size"),inputGetOrFail("size"));
    }

    public function getResCollector()
    {
        $org=new YunkuFile(inputGetOrFail('org_id'));
        return $org->getLink(self::RES_COLLECTION_FOLDER_NAME);
    }

}