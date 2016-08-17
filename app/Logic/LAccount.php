<?php
namespace App\Logic;

use App\Model\Product;
use App\User;

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/8
 * Time: 下午3:43
 */
class LAccount
{
    public static function test()
    {
        $result = array();
        $tables = \DB::select("show tables");
        foreach ($tables as $table) {
            $sql="show columns from ".$table->Tables_in_la_project;
            $columns=\DB::select($sql);
            $result[$table->Tables_in_la_project]=$columns;
        }
      return $result;

    }

}