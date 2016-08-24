<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:29
 */

namespace App\Http\Controllers;

use App\Models\ExhibitionInfo;
use Session;
use Auth;
use Exception;
use Endroid\QrCode\QrCode;
use App\Logic\YunkuFile;
use App\Logic\YunkuOrg;

class BaseController extends Controller
{
    public $member;

    public function __construct($member = [])
    {
        $member = Session::get('member', $member);
        if (!$member) {
            throw new Exception(40106);
        } else {
            $this->member = $member;
        }
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

    public function show($unique_code)
    {
        $exhibition = ExhibitionInfo::getUniqueCode($unique_code);
        $this->format($exhibition);
        return $exhibition;
        return view("show", $exhibition);
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
                    $list[$key] = $file;
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