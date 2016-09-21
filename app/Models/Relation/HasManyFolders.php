<?php
namespace App\Models\Relation;

/**
 * Created by PhpStorm.
 * User: rongshenghu
 * Date: 16-1-18
 * Time: 17:10
 */
trait HasManyFolders
{
    public function folder()
    {
        return $this->hasMany('App\Models\FolderInfo', 'group_id', 'id');
    }
}