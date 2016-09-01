<?php 
class EntExhibitionConfig extends CreateBase
{
    protected $table = "ent_exhibition_config";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("name",100);
        $table->tinyInteger("edition");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}