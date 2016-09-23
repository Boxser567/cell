<?php class GroupInfo extends CreateBase
{
    protected $table = "group_info";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("name", 100);
        $table->dateTime("start_time");
        $table->dateTime("end_time");
        $table->integer("ex_id");
        $table->tinyInteger("hidden");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}