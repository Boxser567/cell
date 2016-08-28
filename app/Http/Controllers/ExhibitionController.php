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
    const RES_COLLECTION_FOLDER_NAME = "GKKJ_ZLSJJ";//够快科技资料收集夹
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
        $org = $yunku_org->setOrg(self::PRE_FIX . $this->ent_id);
        $exhibition = LAccount::setExhibition($this->ent_id, $org['org_id']);
        $this->format($exhibition,true);
        return $exhibition;
    }

    //获取展会详情
    public function getDetail()
    {
        $exhibition = ExhibitionInfo::_findOrFail(inputGetOrFail('exhibition_id'));
        $this->format($exhibition);
     //   $this->postUpdateExhibition($exhibition['id'],$exhibition['files']['dir_count'],$exhibition['files']['file_count'],$exhibition['files']['size_use']);
        return $exhibition;
    }

    //更新会展大小
    public function postUpdateExhibition($id,$dirs,$files,$size)
    {
        $exhibition = ExhibitionInfo::_findOrFail($id);
        $property=json_decode($exhibition->property,true);
        $property['file_count']=$files;
        $property['size_use']=$size;
        $property['dir_count']=$dirs;
        $exhibition->property=json_encode($property);
        $exhibition->save();
        ExhibitionInfo::cacheForget();
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
                $org_file->setFolder(self::RES_COLLECTION_FOLDER_NAME);
                break;
            case "close":
                $exhibition->res_collect_lock = 0;
                break;
            default:
                throw new \Exception("参数错误");
        }
        $exhibition->save();
        ExhibitionInfo::cacheForget();
    }

    //格式化会展资料详情
    public function format(&$exhibition, $flag = false)
    {
        //$flag = true;
        //获取文件列表
        $yunku_org = new YunkuOrg();
        $org_info = $yunku_org->getOrgInfo($exhibition->org_id);
        $file_info = array();
        $file_info['dir_count'] =  $org_info['info']['dir_count'];
        $file_info['file_count'] = $org_info['info']['file_count'];
        $file_info['size_use'] =   $org_info['info']['size_org_use'];

        $org_file = new YunkuFile($exhibition->org_id);
        $file_list = $org_file->getFileList();
        $files = $file_list['list'];
        if(!$flag) {
            foreach ($files as $key => &$file) {
                if ($file['filename'] == ExhibitionController::RES_COLLECTION_FOLDER_NAME) {
                    unset($files[$key]);
                    $res_col_info = $org_file->getInfo(ExhibitionController::RES_COLLECTION_FOLDER_NAME, 1);
                    $file_info['file_count'] = $file_info['file_count'] - $res_col_info['file_count'];
                    $file_info['size_use'] = $file_info['size_use'] - $res_col_info['files_size'];
                    $file_info['dir_count'] = $file_info['dir_count'] - 1;
                }
            }
        }
        $file_info['list'] = $files;
        $exhibition = $exhibition->toArray();
        $exhibition['unique_code'] = "http://" . config("app.view_domain") . "/" . $exhibition['unique_code'];
        if ($exhibition['res_collect_lock']) {
            $exhibition['res_collect_lock'] = ExhibitionController::RES_COLLECTION_FOLDER_NAME;
        }
        $exhibition['files'] = $file_info;
    }


}