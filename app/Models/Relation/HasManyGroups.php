<?php
namespace App\Models\Relation;

/**
 * Created by PhpStorm.
 * User: rongshenghu
 * Date: 16-1-18
 * Time: 17:10
 */
trait HasManyGroups
{
    public function group()
    {
        return $this->hasMany('App\Models\GroupInfo', 'ex_id', 'id');
    }
}