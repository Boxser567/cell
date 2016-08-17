<?php class EntExhibitionInfo extends CreateBase
{
    protected $table = "ent_exhibition_info";

    public function create(&$table)
    {
        $table->string("title");
        $table->string("logo");
        $table->interger("unique_code");
        $table->string("banner");
        $table->date("start_date");
        $table->date("end_date");
        $table->interger("ent_id");
        $table->tinyInteger("resource_col");
        $table->dataTime("created_at");
        $table->dataTime("updated_at");
    }
}