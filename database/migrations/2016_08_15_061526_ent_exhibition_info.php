<?php 
class EntExhibitionInfo extends CreateBase
{
    protected $table = "ent_exhibition_info";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("title",30);
        $table->string("logo",30);
        $table->integer("unique_code");
        $table->integer("org_id");
        $table->string("banner",30);
        $table->date("start_date");
        $table->date("end_date");
        $table->integer("ent_id");
        $table->tinyInteger("res_collect_lock");
        $table->string("property",30);
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}