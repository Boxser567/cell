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

class ExhibitionController extends BaseController
{
    const PRE_FIX = "Exhibition_";
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
        return $lists->toArray();
    }

    //创建展会
    public function postCreate()
    {
        $yunku_org = new YunkuOrg();
        $org = $yunku_org->setOrg(self::PRE_FIX . $this->member['id']);
        $exhibition = LAccount::setExhibition($this->ent_id, $org['org_id']);
        $this->format($exhibition);
        return $exhibition;
    }

    //获取展会详情
    public function getDetail()
    {
        $exhibition = ExhibitionInfo::getUniqueCode(inputGetOrFail('unique_code'));
        $this->format($exhibition);
        /*************计算更新会展文件个数记总大小****************/
        $files = new YunkuFile($exhibition['org_id']);
        $file_list=$files->getFileList(inputGet('fullpath',''));
        $statistics=$this->updateStatistic($file_list['list'], $exhibition['org_id']);
        $property=json_decode($exhibition["property"],true);
        $property['file_count']=$statistics['files'];
        $property['size_use']=$statistics['size'];
        $property['dir_count']=$statistics['dirs'];
        $exhibition["property"]=json_encode($property);
        /*****************************************************/
        return $exhibition;
    }


    private function updateStatistic($file_list,$org_id)
    {
        $yunku_org = new YunkuOrg();
        $org_info = $yunku_org->getOrgInfo($org_id);
        // dump($org_info);
        $dirs=$org_info['info']['dir_count'];
        $files=$org_info['info']['file_count'];
        $size=$org_info['info']['size_org_use'];
        $org_file = new YunkuFile($org_id);
        foreach ($file_list as $key => $file) {
            if ($file['filename'] == FileController::RES_COLLECTION_FOLDER_NAME) {
                $res_col_info = $org_file->getInfo(FileController::RES_COLLECTION_FOLDER_NAME, 1);
                $files =$org_info['info']['file_count'] - $res_col_info['file_count'];
                $size = $org_info['info']['size_org_use'] - $res_col_info['files_size'];
                $dirs =$org_info['info']['dir_count'] - 1;
            }
        }
        LAccount::postUpdateExhibition($org_id,$dirs,$files,$size);
        return ['dirs'=>$dirs,'files'=>$files,'size'=>$size];
    }

    //修改展会详情
    public function postInfo()
    {
        $exhibition = ExhibitionInfo::_findOrFail(inputGetOrFail('exhibition_id'));
        if (inputGet('title')) {
            $exhibition->title = inputGet('title');
        }
        if (inputGet('logo')) {
            $exhibition->logo = inputGet('logo');
        }
        if (inputGet('banner')) {
            $exhibition->banner = inputGet('banner');
        }
        if (inputGet('start_date')) {
            $exhibition->start_date = inputGet('start_date');
        }
        if (inputGet('end_date')) {
            $exhibition->end_date = inputGet('end_date');
        }
        if (inputGet('website')) {
            $exhibition->property = json_encode(["web_site" => inputGet('website')]);
        }
        $exhibition->save();
        ExhibitionInfo::cacheForget();
    }

    //开启/关闭资料收集
    public function postResCollection()
    {
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
                throw new \Exception("参数错误");
        }
        $exhibition->save();
        ExhibitionInfo::cacheForget();
        if($exhibition->res_collect_lock!=0){
            return ["fullpath"=>FileController::RES_COLLECTION_FOLDER_NAME];
        }
    }

    //格式化会展资料详情
    public function format(&$exhibition)
    {
        $exhibition = $exhibition->toArray();
        $exhibition['unique_code'] = "http://" . config("app.view_domain") . "/#/mobile/" . $exhibition['unique_code'];
        if ($exhibition['res_collect_lock']!=0) {
            $exhibition['res_collect'] = FileController::RES_COLLECTION_FOLDER_NAME;
        }
    }


}