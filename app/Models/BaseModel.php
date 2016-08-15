<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/6/6
 * Time: 下午1:19
 */

namespace App\Models;

use \Eloquent;
use \Exception;
use \Cache;
use App\Scope\BaseScope;
use Watson\Rememberable\Rememberable;

class BaseModel extends Eloquent
{
    const MEMCACHED_PREFIX="Boss_";
    use BaseScope, Rememberable;
    public $timestamps = false;
    const  CACHE_TIME = 10;//10min
    protected $connection = "boss";

    public static function _max($key = '')
    {
        $key = $key ? : with(new static())->getKeyName();
        return static::max($key) ? : 0;
    }

    static function _findOrNew($primary_key)
    {
        $model = static::_find($primary_key);
        if (!$model) {
            $model = new static();
        }
        return $model;
    }

    public static function _findOrFail($primary_key)
    {
        $model = static::_find($primary_key);
        if (!$model) {
            throw new Exception(404);
        }
        return $model;
    }

    public static function _find($primary_key)
    {
        return static::createWith()->find($primary_key);
    }

    public static function getAll($with = [])
    {
        return static::createWith($with)->get();
    }

    public static function dump()
    {
        $model = new static();
        $config = $model->getConnection()->getConfig(null);
        $table = $model->getTableName();
        $db = $config['database'];
        $data_path = storage_path("app/" . $db . ".$table.sql");
        list($host, $port) = explode(":", $config['host']);
        $port = $port ? : 3306;
        $username = $config['username'];
        $password = $config['password'];
        $shell = "mysqldump  -h$host -P$port -u$username -p$password $db $table  --lock-tables=false --set-gtid-purged=OFF > $data_path";
        exec($shell);
        return $db;
    }

    public static function import($database)
    {
        $model = new static();
        $config = $model->getConnection()->getConfig(null);
        $table = $model->getTableName();
        $data_path = storage_path("app/" . $database . ".$table.sql");
        list($host, $port) = explode(":", $config['host']);
        $port = $port ? : 3306;
        $username = $config['username'];
        $password = $config['password'];
        $db = $config['database'];
        $shell = "mysql -h$host  -P$port -u$username -p$password $db  < $data_path";
        exec($shell);
    }

    //*******************缓存相关

    public static function cacheForget($tag = '')
    {
        $tag = $tag ? : self::MEMCACHED_PREFIX.static::class;
        Cache::tags($tag)->flush();
    }

    public static function getTableName()
    {
        return with(new static())->table;
    }

    public static function getPrimaryCacheKey($id)
    {
        return static::class . '\\' . $id;
    }

    public static function createCode($key)
    {
        $key = time() . $key . get_code(10);
        return md5($key);
    }
}