<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:42
 */

namespace App\Models;


class InvitationCode extends BaseModel
{
    protected $table = 'invitation_code';
    public $timestamps = true;

    public static function getCode($code)
    {
        return self::where('code',$code)->first();
    }

}