<?php
namespace App\Scope;

use App\Models\BaseModel;

trait BaseScope
{
    
    /**
     * @param \Illuminate\Database\Query\Builder|static $query
     * @param $column
     * @param $values
     * @param string $boolean
     * @param bool $not
     * @return \Illuminate\Database\Query\Builder
     *
     * @author hurs
     */
    public function scopeColumnIn($query, $column, $values, $boolean = 'and', $not = false)
    {
        if (!$values) {
            return $query->where($this->primaryKey, '=', 0, $boolean);
        }
        return $query->whereIn($column, $values, $boolean, $not);
    }

    /**
     * @param \Illuminate\Database\Query\Builder|static $query
     * @param $column
     * @param $values
     * @param string $boolean
     * @return \Illuminate\Database\Query\Builder|static
     *
     * @author hurs
     */
    public function scopeOrColumnIn($query, $column, $values, $boolean = 'or')
    {
        return $query->columnIn($column, $values, $boolean);
    }

    /**
     * @param \Illuminate\Database\Query\Builder|static $query
     * @param $column
     * @param $values
     * @param string $boolean
     * @return \Illuminate\Database\Query\Builder|static
     *
     * @author hurs
     */
    public function scopeColumnNotIn($query, $column, $values, $boolean = 'and')
    {
        return $query->columnIn($column, $values, $boolean, true);
    }

    /**
     * @param \Illuminate\Database\Query\Builder|static $query
     * @param $column
     * @param $values
     * @param string $boolean
     * @return \Illuminate\Database\Query\Builder|static
     *
     * @author hurs
     */
    public function scopeOrColumnNotIn($query, $column, $values, $boolean = 'or')
    {
        return $query->columnNotIn($column, $values, $boolean);
    }

    /**
     * @param \Illuminate\Database\Query\Builder|static
     * @param array $relations
     * @param array $tags
     * @return \Illuminate\Database\Query\Builder|static
     *
     * @author hurs
     */
    public function scopeCreateWith($query, $relations = [], $tags = [])
    {
        $new_relation = [];
        if (!is_array($relations)) {
            $relations = [$relations];
        }
        if (!is_array($tags)) {
            $tags = [$tags];
        }
        foreach ($relations as $relation) {
            if (method_exists($this, 'scopeWith' . ucfirst($relation))) {
                $relation = 'with' . ucfirst($relation);
                $query->$relation();
            } else {
                $new_relation[$relation] = function ($query) {
                    $query->tags();
                };
            }
        }
        if($new_relation){
            $query->with($new_relation);
        }
        return $query->tags($tags);
    }

    /**
     * @param \Illuminate\Database\Query\Builder|static $query
     * @param array $tags
     * @return \Illuminate\Database\Query\Builder|static
     *
     * @author hurs
     */
    public function scopeTags($query, $tags = [])
    {
        if (is_debug() && inputGet('log')) {
            return $query;
        }
        $tags[] = BaseModel::MEMCACHED_PREFIX.static::class;
        return $query->cacheTags($tags)->remember(static::CACHE_TIME);
    }

}