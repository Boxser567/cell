<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午3:19
 */

namespace App\Models;


class EntConfig extends BaseModel
{
    const EDITION_FREE=1;//免费版
    const EDITION_CHARGE=2;//收费版

    public $table = "ent_exhibition_config";
    public $timestamps = true;

}