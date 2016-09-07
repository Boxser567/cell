<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/9/6
 * Time: 上午11:35
 */

namespace App\Http\Controllers;


use App\Logic\YunkuFile;
use Log;

class YunkufileController extends BaseController
{
    
    public function yunkuUpload($org_id,$file_size, $file_hash)
    {
        $yunkufile=new YunkuFile($org_id);
        $yunkufile->setYunkuFile($file_size,$file_hash);
    }

}