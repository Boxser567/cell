<?php 
class EntExhibitionInfo extends CreateBase
{
    protected $table = "ent_exhibition_info";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("title",100);
        $table->string("logo",100);
        $table->string("unique_code",100);
        $table->integer("org_id");
        $table->string("banner",100);
        $table->date("start_date");
        $table->date("end_date");
        $table->tinyInteger("closed");
        $table->integer("ent_id");
        $table->tinyInteger("res_collect_lock");
        $table->string("property",200);
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
        $table->index(['unique_code']);
        $table->index(['org_id']);
        $table->index(['ent_id']);
    }
}