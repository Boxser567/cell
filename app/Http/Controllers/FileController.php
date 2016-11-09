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
use App\Models\FileInfo;
use App\Models\FolderInfo;
use App\Models\GroupInfo;
use Qiniu\Auth;
use App\Models\ExhibitionInfo;
use App\Logic\YunkuOrg;
use Endroid\QrCode\QrCode;


class FileController extends Controller
{

    const RES_COLLECTION_FOLDER_NAME = "GKKJ_ZLSJJ";//资料收集夹
    const TYPE_FILE_FROM_YUNKU="yunku";
    //获取文件列表
    public function getList()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $file_list = $files->getFileList(inputGet('fullpath', ''));

//        if (\Request::has('hash') && \Request::has('fullpath')) {
//            $folder_info = FolderInfo::getByHash(inputGetOrFail('hash'));
//            $now = date('Y-m-d H:i:s');
//           /* if ($now < $folder_info->start_time || $now > $folder_info->end_time) {
//                throw new \Exception("文件夹未授权开放", 400001);
//            }*/
//        }
//        if (!\Request::has('fullpath')) {
//            foreach ($file_list["list"] as $key => &$file) {
//                if ($file['dir']) {
//                    if ($file['fullpath'] == FileController::RES_COLLECTION_FOLDER_NAME) {
//                        unset($file_list["list"][$key]);
//                    } else {
//                        //  dump($file['hash']);
//                        $file_list["list"][$key] += ["info" => FolderInfo::getByHash($file['hash'])->toArray()];
//                    }
//                }
//            }
//        }
        return $file_list;
    }

    public function getModule()
    {
        FileInfo::cacheForget();
        if(\Request::has("folder_id")){
            $modules=FileInfo::getFolderId(inputGet("folder_id"));
        }else{
            $modules=FileInfo::getExId(inputGetOrFail("ex_id"));
        }
        return $modules;
    }


    //获取分组信息
    public function getGroup($id='')
    {
        GroupInfo::cacheForget();
        FolderInfo::cacheForget();
        GroupInfo::cacheForget(['folder']);//todo shd
        $group_info = GroupInfo::getFolderInfo(inputGet('group_id',$id));
        $folder_info = $group_info->folder->toArray();
        $group_info = $group_info->toArray();
        $group_info['folder'] = $folder_info;
        return $group_info;
    }

    //获取移动端分组信息
    public function getMobileGroup()
    {
        GroupInfo::cacheForget();
        GroupInfo::cacheForget(['folder']);//todo shd
        FolderInfo::cacheForget();
        $group_info = GroupInfo::getFolderInfo(inputGetOrFail('group_id'));
        $now = date('Y-m-d H:i:s');
        if ($group_info->hidden == 1) {
            return [0];
        } else if($group_info->end_time!==''){
            if ($now > $group_info->end_time || $now < $group_info->start_time) {
                $group_info->hidden = 3;
                return $group_info;
            }
        }
        $folder_info = $group_info->folder->toArray();
        foreach ($folder_info as $key => &$folder) {
            if ($folder['hidden'] == 1) {
                unset($folder_info[$key]);
            } else if($folder['end_time']!==''){
                if ($now > $folder['end_time'] || $now < $folder['start_time']) {
                    $folder ['hidden']= 3;
                }
            }
        }
        $group_info = $group_info->toArray();
        $group_info['folder'] = $folder_info;
        return $group_info;
    }

    //获取移动端会展分组信息
    public function getMobileExGroup($id='')
    {
        GroupInfo::cacheForget();//todo shd
        GroupInfo::cacheForget(['folder']);//todo shd
        FolderInfo::cacheForget();
        $group_info=GroupInfo::getExIdWithOutFolder(inputGet('ex_id',$id))->toArray();
        $now = date('Y-m-d H:i:s');
        foreach ($group_info as $key=>&$group){
            if ($group['hidden'] == 1) {
                unset($group_info[$key]);
            } else if($group['end_time']!==''){
                if ($now > $group['end_time']|| $now < $group['start_time']) {
                    $group['hidden']=2;
                }
            }else{
                $folder_infos=FolderInfo::getByGroupId($group['id']);
                $folder_info=!$folder_infos?$folder_infos:$folder_infos->toArray();
                if($folder_info) {
                    foreach ($folder_info as $key2 => &$folder) {
                        if ($folder['hidden'] == 1) {
                            unset($folder_info[$key2]);
                        } else {
                            if ($folder['end_time'] !== '') {
                                if ($now > $folder['end_time'] || $now < $folder['start_time']) {
                                    $folder_info[$key2]['hidden'] =2;
                                }
                            }
                        }
                    }
                }
                $group+=['folder'=>$folder_info];
            }
        }
        return $group_info;
    }

    //获取会展分组信息
    public function getExGroup($id='')
    {
        GroupInfo::cacheForget();//todo shd
        GroupInfo::cacheForget(['folder']);//todo shd
        return $group_info=GroupInfo::getExId(inputGet('ex_id',$id))->toArray();
    }

    //获取文件夹或文件详情
    public function getInfo($org_id=0,$hash=0)
    {
        $files = new YunkuFile(inputGet('org_id',$org_id));
        return $files->getInfo(inputGet('hash',$hash), 1);
    }

    //获取专题详情
    public function getFolderInfo()
    {
        FolderInfo::cacheForget();
        return FolderInfo::_findOrFail(inputGetOrFail('folder_id'))->toArray();
    }

    //修改文件夹有效时间以及版式
    public function postValidateTime()
    {
        //权限判断
        $folder = FolderInfo::getByHash(inputGetOrFail('hash'));
        if (!$folder) {
            throw new \Exception("文件分类不存在", 403009);
        } else {
            if (\Request::has('title')) {
                $files = new YunkuFile($folder->org_id);
                $files->setName($folder->title, inputGetOrFail('title'));
                FolderInfo::updateTitle(inputGetOrFail('hash'), inputGetOrFail('title'));
            }
            if (\Request::has('forever')) {
                $folder->forever = inputGet('forever');
            }
            if (inputGet('start_time')) {
                $folder->start_time = inputGet('start_time');
            }
            if (inputGet('end_time')) {
                $folder->end_time = inputGet('end_time');
            }
            if (\Request::has('hidden')) {
                $folder->hidden = inputGet('hidden');
            }
            if (\Request::has('position')) {
                // $base_controller=new BaseController();
                //  $base_controller->judgePermission("class_style");//权限判断自定义专题显示样式
                $folder->property = json_encode(['position' => inputGet('position')]);
            }
            $folder->save();
            FolderInfo::cacheForget();
            return $folder;
        }
    }

    //创建文件夹
    public function postCreateFolder()
    {
        $folder_count=FolderInfo::getCountByGroup(inputGetOrFail('group_id'));
        // $base_controller=new BaseController();
        // $base_controller->judgePermission("class_count",$folder_count);//权限判断子分类个数
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $files_info = $files->setFolder(inputGetOrFail('fullpath'));
        $group_info=GroupInfo::_find(inputGetOrFail('group_id'));
        $folder_info = new FolderInfo();
        $folder_info->start_time = $group_info->start_time;
        $folder_info->end_time= $group_info->end_time;
        $folder_info->org_id = inputGetOrFail('org_id');
        $folder_info->title = inputGet('title', '请填写专题名称');
        $folder_info->order_by=$folder_count+1;
        $folder_info->folder_hash = $files_info['hash'];
        $folder_info->group_id = inputGetOrFail('group_id');
        $folder_info->property = json_encode(['position' => 'middle']);
        $img_url = config('app.qiniu.domain') . "/" . config('data.FOLDER')[random_int(0, 8)];
        $folder_info->img_url = json_encode(["0" => $img_url]);
        $folder_info->save();
        FolderInfo::cacheForget();
        $files_info += ["img_url" => json_decode($folder_info->img_url, true)];
        return FolderInfo::find($folder_info->id)->toArray();
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
                throw new \Exception("无效的操作", 400001);
        }
        FolderInfo::updateInfo(inputGet('hash', $hash), $file_count, $file_size);
        FolderInfo::cacheForget();
    }

    //上传文件夹图片
    public function postUpdateImg()
    {
        //  $base_controller->judgePermission("self_class_pic");//权限判断上传自定义专题图片
        $folder_info = FolderInfo::getByHash(inputGetOrFail('hash'));
        $img_url = json_decode($folder_info->img_url, true);//todo 图片个数限制
        if (inputGetOrFail('type')) {
            array_push($img_url, inputGetOrFail("img_url"));
        } else {
            foreach($img_url as $key=>&$value){
                if(inputGetOrFail("img_url")==$value){
                    unset($img_url[$key]);
                }
            }
            $img_url=array_values($img_url);
        }
        $folder_info->img_url = json_encode($img_url);
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
        FolderInfo::updateTitle(inputGetOrFail('hash'), inputGetOrFail('newpath'));
        FolderInfo::cacheForget();
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

    //移动端获取展会详情
    public function getShow()
    {
        $exhibition = ExhibitionInfo::getUniqueCode(inputGetOrFail('unique_code'));
        $this->format($exhibition);
        return $exhibition;
    }

    //格式化文件
    public function format(&$exhibition)
    {
        $exhibition = $exhibition->toArray();
        $exhibition['unique_code'] = "http://" . config("app.view_domain") . "/#/mobile/" . $exhibition['unique_code'];
        $exhibition['base_folder'] = ExhibitionController::BASE_FILE_NAME;

        if($exhibition["group"]){
            foreach ($exhibition["group"] as $key=>$value){
                $exhibition["group"][$key]=$this->getGroup($value['id']);
            }
        }
        if ($exhibition['res_collect_lock'] != 0) {
            $exhibition['res_collect'] = FileController::RES_COLLECTION_FOLDER_NAME;
        }
        if(date("Y-m-d")>$exhibition['end_date']){
            $exhibition+=["finished"=>1];
        }elseif( date("Y-m-d")<$exhibition['start_date']){
            $exhibition+=["finished"=>-1];
        }else{
            $exhibition+=["finished"=>0];
        }


    }

    //获取二维码
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

    //秒存文件
    public function getYunkuFile()
    {
        $yunkufile = new YunkuFile(inputGetOrFail("org_id"));
        return $yunkufile->setYunkuFile(inputGetOrFail("filename"), inputGetOrFail("size"), inputGetOrFail("hash"));
    }
    

    //从资料收集夹或者已有文件中获取
    public function postSelfFile()
    {
        $yunkufile = new YunkuFile(inputGetOrFail("org_id"));
        $files = inputGetOrFail("files");
        $type=inputGet("type",0);
        $return_files = array();
        foreach ($files as $key => $file) {
            $module=[];
            if(\Request::has('ex_id') && $type){
                if(\Request::has('folder_id')){
                    $folder=FolderInfo::find(inputGet("folder_id"));
                    $result = $yunkufile->setYunkuFile($folder->title.'/'.$file["filename"], $file["size"], $file["hash"]);
                    $module=ExhibitionController::postModule(inputGet("ex_id"),inputGet("folder_id"),$file["filename"],$result['hash'],$result['filesize']);
                }else{
                    $result = $yunkufile->setYunkuFile(ExhibitionController::BASE_FILE_NAME.'/'.$file["filename"], $file["size"], $file["hash"]);
                    $module=ExhibitionController::postModule(inputGet("ex_id"),'',$file["filename"],$result['hash'],$result['filesize']);
                }
            }else{
                if(\Request::has('folder_id')){
                    $new_folder=FolderInfo::find(inputGet("folder_id"));
                    $older_folder=FileInfo::getByHash($file["hash"]);
                    $result = $yunkufile->copy($older_folder->title.'/'.$file["filename"], $new_folder->title.'/'.$file["filename"]);
                    $module=ExhibitionController::postModule(inputGet("ex_id"),inputGet("folder_id"),$file["filename"],$result['hash'],$result['filesize']);
                }else{
                    $files=FileInfo::getByHash($file["hash"]);
                    $older_folder=FolderInfo::find($files->folder_id);
                    $result = $yunkufile->copy($older_folder->title.'/'.$file["filename"], ExhibitionController::BASE_FILE_NAME.'/'.$file["filename"]);
                    $module=ExhibitionController::postModule(inputGet("ex_id"),'',$file["filename"],$result['hash'],$result['filesize']);
                }
            }
            $return_files[$key]=$module;
        }
        if (\Request::has('hash')) {
            $folder_info = FolderInfo::getByHash(inputGetOrFail('hash'));
            $file_size = $folder_info->file_size + inputGetOrFail('dirsize');
            $file_count = $folder_info->file_count + inputGetOrFail('dircount');
            FolderInfo::updateInfo(inputGetOrFail('hash'), $file_count, $file_size);
            FolderInfo::cacheForget();
        }
        return $return_files;
    }
    

    public function createModule($files)
    {
        $yunkufile = new YunkuFile(inputGetOrFail("org_id"));
        $return_files = array();
        foreach ($files as $key => $file) {
            $result = $yunkufile->setYunkuFile($file["filename"], $file["size"], $file["hash"]);
            $module=[];
            if(\Request::has('ex_id')){
                if(\Request::has('folder_id')){
                    $module=ExhibitionController::postModule(inputGet("ex_id"),inputGet("folder_id"),$result['fullpath'],$result['hash'],$result['filesize']);
                }else{
                    $module=ExhibitionController::postModule(inputGet("ex_id"),'',$result['fullpath'],$result['hash'],$result['filesize']);
                }
            }
            $return_files[$key]=$module;
        }
        if (\Request::has('hash')) {
            $folder_info = FolderInfo::getByHash(inputGetOrFail('hash'));
            $file_size = $folder_info->file_size + inputGetOrFail('dirsize');
            $file_count = $folder_info->file_count + inputGetOrFail('dircount');
            FolderInfo::updateInfo(inputGetOrFail('hash'), $file_count, $file_size);
            FolderInfo::cacheForget();
        }
        return $return_files;
    }

    //获取资料收集夹的外链地址
    public function getResCollector()
    {
        $org = new YunkuFile(inputGetOrFail('org_id'));
        return $org->getLink(self::RES_COLLECTION_FOLDER_NAME);
    }


    //获取所有文件列表
    public function getAllFiles()
    {
        $file_list=FileInfo::getElseFiles(inputGetOrFail('ex_id'),inputGet('folder_id',0));
        return $file_list?$file_list->toArray():[];
    }


}