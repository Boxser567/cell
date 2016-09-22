<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午6:01
 */

namespace App\Http\Controllers;

use App\Logic\Yunku;
use App\Logic\YunkuFile;
use App\Logic\YunkuOrg;
use App\Models\ExhibitionInfo;
use App\Models\InvitationCode;
use Session;
use Input;
use App\Logic\LAccount;
use EasyWeChat\Foundation\Application;

class TestController extends Controller
{

    public function getClear()
    {
        Session::flush();
        //  \DB::table("ent_exhibition_config")->truncate();
        // \DB::table("ent_exhibition_info")->truncate();
        //  \DB::table("member")->truncate();
        echo "清理缓存完毕";
    }

    public function getD()
    {
        $yunku = new Yunku();
        return $yunku->setOrg("上海够快");
    }

    public function getE()
    {
        $yunku = new YunkuOrg();
        return $yunku->getOrg();
    }


    public function getF()
    {
        $yunku = new YunkuFile(665030);
        return $yunku->getFileList();
    }

    public function getG()
    {
        $yunku = new YunkuFile(665030);
        return $yunku->setFolder("/wang");
    }

    public function getH()
    {
        $yunku = new YunkuFile(665030);
        return $yunku->deleteFile("/wang");
    }

    public function postI()
    {
        $yunku = new YunkuFile(665030);
        $yunku->setUpload("/wang", "yuxiang", "ss");
    }

    public function getJ()
    {
        $yunku = new YunkuFile(665030);
        return $yunku->getInfo("/wang", 1);
    }

    public function getK()
    {
        $yunku_org = new YunkuOrg();
        $org = $yunku_org->setOrg(ExhibitionController::PRE_FIX . 2);
        $exhibition = LAccount::setExhibition(2, $org['org_id']);
        $this->format($exhibition);
        return $exhibition;
    }

    public function getL()
    {
        $exhibition = ExhibitionInfo::_findOrFail(1);
        $this->format($exhibition);
        return $exhibition;
    }

    private function format(&$exhibition)
    {
        //获取文件列表
        $files = new YunkuFile($exhibition->org_id);
        $yunku_org = new YunkuOrg();
        $org_info = $yunku_org->getOrgInfo($exhibition->org_id);
        $file_info = array();
        $file_info['dir_count'] = $org_info['info']['dir_count'];
        $file_info['file_count'] = $org_info['info']['file_count'];
        $file_info['size_use'] = $org_info['info']['size_org_use'];
        $file_list = $files->getFileList();
        $files = $file_list['list'];
        foreach ($files as $key => &$file) {
            $this->fileFilter($file);
            if ($file['filename'] == ExhibitionController::RES_COLLECTION_FOLDER_NAME) {
                unset($files[$key]);
            }
        }
        $file_info['list'] = $files;
        $exhibition = $exhibition->toArray();
        $exhibition['files'] = $file_info;
    }

    private function fileFilter(&$file)
    {
        unset($file['create_dateline'], $file['create_member_name'], $file['filehash'], $file['last_dateline'], $file['last_member_name']);
    }

    public function getM()
    {
        $result = array();
        $tables = \DB::select("show tables");
        foreach ($tables as $table) {
            dump($table);
            die;
            $sql = "show columns from " . $table;
            $columns = \DB::select($sql);
            $result[$table] = $columns;
        }
        return $result;
    }

    public function getN()
    {
        return config('data.BANNER')[random_int(0, 5)];
    }


    public function getO()
    {
        return config('app.qiniu.domain') . "/" . config('data.BANNER')[random_int(0, 8)];
    }

    public function getP()
    {
        $org_file = new YunkuFile(665030);
        $file_list = $org_file->getFileList();
        return $file_list;
    }


    public function getQ()
    {
        return get_http_host();
    }
    

    public function getY()
    {
        $files = new YunkuFile(688643);
        return $files->getAllFiles();
    }


    public function getW()
    {
        $org = new YunkuFile(688602);
        //return $org->getLink("工作计划");
        return $file_list = $org->getFileList(inputGet('fullpath', ''));
    }


    public function getX()
    {
        $wechat=app('wechat');
        $js = $wechat->js;
     return    $parameters=$js->config(array('onMenuShareQQ', 'onMenuShareWeibo'), true);
       // return['appId'=>$parameters,'nonceStr'=>,'timestamp'=>,'signature'=>];
    }


    public function getWw()
    {
        echo phpinfo();
    }

    public function getInvitationCode()
    {
        $key=inputGetOrFail('key');
        $end_time=inputGet('end_time','2019-01-01 00:00:00');
        $invitation=new InvitationCode();
        $invitation->key=$key;
        $invitation->end_time=$end_time;
        $invitation->code=$key."_".getUniqueCode();
        $invitation->save();
        return $invitation;
    }
}