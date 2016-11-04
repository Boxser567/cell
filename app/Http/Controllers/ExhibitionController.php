<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:23
 */

namespace App\Http\Controllers;

use App\Logic\LAccount;
use App\Logic\YunkuFile;
use App\Logic\YunkuOrg;
use App\Models\ExhibitionInfo;
use App\Models\FileInfo;
use App\Models\FolderInfo;
use App\Models\GroupInfo;
use Log;

class ExhibitionController extends BaseController
{
    const PRE_FIX = "Exhibition_";
    const BASE_FILE_NAME = 'base_folder';
    private $ent_id;

    public function __construct()
    {
        parent::__construct();
        $this->ent_id = $this->member['ent_id'];
    }

    //获取展会列表
    public function getList($ent_id = '')
    {
        ExhibitionInfo::cacheForget();
        if (!$ent_id) {
            $ent_id = $this->ent_id;
        }
        $lists = ExhibitionInfo::getOfEntId($ent_id);
        $ex_list=$lists->toArray();
        foreach ($ex_list as $key=>$list){
            if(date("Y-m-d")>$list['end_date']){
                $ex_list[$key]+=["finished"=>1];
            }elseif( date("Y-m-d")< $list['start_date']){
                $ex_list[$key]+=["finished"=>-1];
            }else{
                $ex_list[$key]+=["finished"=>0];
            }
        }
        return $ex_list;
    }

    //创建展会
    public function postCreate()
    {
        $ex_count = ExhibitionInfo::getCountByEntId($this->ent_id);
        $meanwhile_ex_count = ExhibitionInfo::getCountByEntTime(date('Y-m-d'), $this->ent_id);
        //  $this->judgePermission('meanwhile_amount',$meanwhile_ex_count);//权限判断同时进行的会展
        //  $this->judgePermission('exhi_amount',$ex_count);//权限判断会展总数量
        $yunku_org = new YunkuOrg();
        // $org_size=$this->member['edition_info']['ex_size']==-1?"":$this->member['edition_info']['ex_size']*1024*1024;//权限设置单个会展可用空间
        $org = $yunku_org->setOrg(self::PRE_FIX . $this->member['id']);
        // $org = $yunku_org->setOrg(self::PRE_FIX . $this->member['id'],'',$org_size);
        $yunku_file = new YunkuFile($org['org_id']);
        $folder_info = $yunku_file->setFolder(self::BASE_FILE_NAME);
        $exhibition = LAccount::setExhibition($this->ent_id, $org['org_id'], $folder_info['hash']);
        $group = LAccount::setGroup($exhibition->id);
        $new_exhibition = ExhibitionInfo::getOfOrgId($exhibition->org_id);
        $this->format($new_exhibition);
        return $new_exhibition;
    }

    //获取展会详情
    public function getDetail()
    {
        $exhibition = ExhibitionInfo::getUniqueCode(inputGetOrFail('unique_code'));
        $this->format($exhibition);
        /*************计算更新会展文件个数记总大小****************/
//        $files = new YunkuFile($exhibition['org_id']);
//        $file_list = $files->getFileList(inputGet('fullpath', ''));
//        $statistics = $this->updateStatistic($file_list['list'], $exhibition['org_id']);
//        $property = json_decode($exhibition["property"], true);
//        $property['file_count'] = $statistics['files'];
//        $property['size_use'] = $statistics['size'];
//        $property['dir_count'] = $statistics['dirs'] - 1;
//        $exhibition["property"] = json_encode($property);
        /*****************************************************/
        /*if($exhibition['end_date']< date('Y-m-d')){//权限判断会展结束后地址有效时间
            $end_hour=(time()-strtotime($exhibition['end_date']))/(60*60);
            $this->judgePermission('meeting_after_hour',$end_hour);
        }*/
        return $exhibition;
    }

    //创建新分组
    public function postGroup()
    {
        $group_count = GroupInfo::getCountByExId(inputGetOrFail('ex_id'));
        // $this->judgePermission('group_count',$group_count);//权限判断分组个数
        return LAccount::setGroup(inputGetOrFail('ex_id'));
    }

    //新建更新模块
    public static function postModule($ex_id=0,$folder_id=0,$title="新建模块",$hash='',$size='')
    {
        $ex_id = inputGet("ex_id",$ex_id);
        $folder_id = inputGet("folder_id",$folder_id );
        $order_by = FileInfo::getCount($ex_id,$folder_id) + 1;
        if (!$folder_id) {
            // $this->judgePermission('base_count',$order_by-1);//常用文件上传个数
        }else{
            // $this->judgePermission('file_count',$order_by-1);//每个专题下文件个数
        }
        $property = json_encode(["title" => $title, "back_pic" => "http://res.meetingfile.com/2168a80ad9c3a8b1a07eb78751e37e4d2491041a.jpg", "sub_title" => "", "style" => FileInfo::STYLE_LIST_LEFT,"size"=>$size]);
        return LAccount::setFile("", $ex_id,$hash, $folder_id, $order_by, $property);
    }

    //修改模块设置
    public function postUpdateModule()
    {
        if(\Request::has('ex_id')){
            if(\Request::has('folder_id')){
                $module=self::postModule(inputGet("ex_id"),inputGet("folder_id"));
            }else{
                $module=self::postModule(inputGet("ex_id"));
            }
            $id=$module->id;
        }else{
            $id = inputGetOrFail("file_id");
        }
        $module = FileInfo::_findOrFail($id);
        $property = json_decode($module->property, true);
        $hash = inputGet("hash", "");
        $title = inputGet("title", "");
        $back_pic = inputGet("back_pic", "");
        $sub_title = inputGet("sub_title", "");
        $style = inputGet("style", "");
        $size = inputGet("size", "");
        if ($title) {
            $property["title"] = $title;
        }
        if ($back_pic) {
            $property["back_pic"] = $back_pic;
        }
        if ($sub_title) {
            $property["sub_title"] = $sub_title;
        }
        if ($style) {
            $property["style"] = $style;
        }
        if ($size) {
            $property["size"] = $size;
        }
        $property = json_encode($property);
        return LAccount::setFile($id, "", $hash, "", "", $property);
    }


    //删除模块
    public function postDeleteModule()
    {
        $files = new YunkuFile(inputGetOrFail('org_id'));
        $id = inputGetOrFail("file_id");
        $module=FileInfo::_findOrFail($id);
        $property = json_decode($module->property, true);
        if(\Request::has("hash")){
            $fullpath=inputGetOrFail("folder_title")."/".$property['title'];
            $file_controller=new FileController();
            $file_controller->postUpdateFolder(inputGetOrFail('hash'), "delete", $property['size']);
        }else{
            $fullpath=self::BASE_FILE_NAME."/".$property['title'];
        }
        $files->deleteFile($fullpath);
        $result= FileInfo::deleteId($id);
        FileInfo::cacheForget();
        return $result;
    }


    //删除分组
    public function postDeleteGroup()
    {
        GroupInfo::deleteById(inputGetOrFail('group_id'));
        GroupInfo::cacheForget();
        return;
    }

    //更新分组信息
    public function postGroupUpdate()
    {
        $group_info = GroupInfo::_findOrFail(inputGetOrFail('group_id'));
        if (\Request::has('forever')) {
            $group_info->forever = inputGet('forever');
        }
        if (inputGet('name')) {
            //$this->judgePermission('name_group');//权限判断自定义分组名称
            $group_info->name = inputGet('name');
        }
        if (inputGet('start_time')) {
            $group_info->start_time = inputGet('start_time');
        }
        if (inputGet('end_time')) {
            $group_info->end_time = inputGet('end_time');
        }
        if (\Request::has('hidden')) {
            $group_info->hidden = inputGet('hidden');
        }
        $group_info->save();
        if (inputGet('start_time') || inputGet('end_time') || inputGet('hidden')) {
            $folder_info = FolderInfo::getByGroupId(inputGetOrFail('group_id'))->toArray();
            foreach ($folder_info as $folder) {
                $base_folder = FolderInfo::_findOrFail($folder['id']);
                if (inputGet('start_time') && $base_folder->start_time < inputGet('start_time')) {
                    $base_folder->start_time = inputGet('start_time');
                }
                if (inputGet('end_time') && $base_folder->end_time > inputGet('end_time')) {
                    $base_folder->end_time = inputGet('end_time');
                }
                if (inputGet('hidden')) {
                    $base_folder->hidden = inputGet('hidden');
                }
                $base_folder->save();
                FolderInfo::cacheForget();
            }
        }
        ExhibitionInfo::cacheForget();
        return $group_info->toArray();
    }


    private function updateStatistic($file_list, $org_id)
    {
        $yunku_org = new YunkuOrg();
        $org_info = $yunku_org->getOrgInfo($org_id);
        // dump($org_info);
        $dirs = $org_info['info']['dir_count'];
        $files = $org_info['info']['file_count'];
        $size = $org_info['info']['size_org_use'];
        $org_file = new YunkuFile($org_id);
        foreach ($file_list as $key => $file) {
            if ($file['filename'] == FileController::RES_COLLECTION_FOLDER_NAME) {
                $res_col_info = $org_file->getInfo('',1,FileController::RES_COLLECTION_FOLDER_NAME);
                $files = $org_info['info']['file_count'] - $res_col_info['file_count'];
                $size = $org_info['info']['size_org_use'] - $res_col_info['files_size'];
                $dirs = $org_info['info']['dir_count'] - 1;
            }
        }
        LAccount::postUpdateExhibition($org_id, $dirs, $files, $size);
        return ['dirs' => $dirs, 'files' => $files, 'size' => $size];
    }

    //修改展会详情
    public function postInfo()
    {
        $exhibition = ExhibitionInfo::_findOrFail(inputGetOrFail('exhibition_id'));
        if (inputGet('title')) {
            $exhibition->title = inputGet('title');
        }
        if (inputGet('logo')) {
            // $this->judgePermission('design_logo');//权限判断自定义会展详情及 Logo
            $exhibition->logo = inputGet('logo');
        }
        if (inputGet('banner')) {
            //   $this->judgePermission('upload_banner');//权限判断上传自定义 Banner 背景
            $exhibition->banner = inputGet('banner');
        }
        if (inputGet('start_date')) {
            $before_hour = strtotime(strtotime(inputGet('start_date')) - time()) / (60 * 60);
            //  $this->judgePermission('end_date',$before_hour);//权限判断展会筹备时间
            $exhibition->start_date = inputGet('start_date');
        }
        if (inputGet('end_date')) {
            $last_hour = (strtotime(inputGet('end_date')) - strtotime(inputGet('start_date'))) / (60 * 60);
            // $this->judgePermission('meeting_last_hour',$last_hour);//权限判断会展持续时间
            $exhibition->end_date = inputGet('end_date');
        }
        if (inputGet('website') || inputGet('sub_title')) {
            //  $this->judgePermission('web_link');
            $exhibition->property = json_encode(["web_site" => inputGet('website'), "sub_title" => inputGet('sub_title')]);
        }
        $exhibition->save();
        ExhibitionInfo::cacheForget();
    }

    //开启/关闭资料收集
    public function postResCollection()
    {
        // $this->judgePermission('res_collection');//权限判断资料收集开启或者关闭
        $exhibition = ExhibitionInfo::_findOrFail(inputGetOrFail('exhibition_id'));
        $action = inputGetOrFail('action');
        switch ($action) {
            case "open":
                $exhibition->res_collect_lock = 1;
                $org_file = new YunkuFile($exhibition->org_id);
                $org_file->setFolder(FileController::RES_COLLECTION_FOLDER_NAME);
                break;
            case "close":
                $exhibition->res_collect_lock = -1;
                break;
            default:
                throw new \Exception("参数错误", 400001);
        }
        $exhibition->save();
        ExhibitionInfo::cacheForget();
        if ($exhibition->res_collect_lock != 0) {
            return ["fullpath" => FileController::RES_COLLECTION_FOLDER_NAME];
        }
    }

    //格式化会展资料详情
    public function format(&$exhibition)
    {
        $exhibition = $exhibition->toArray();
        $exhibition['unique_code'] = "http://" . config("app.view_domain") . "/#/mobile/" . $exhibition['unique_code'];
        $exhibition['base_folder'] = self::BASE_FILE_NAME;
        if ($exhibition['res_collect_lock'] != 0) {
            $exhibition['res_collect'] = FileController::RES_COLLECTION_FOLDER_NAME;
        }
    }


}