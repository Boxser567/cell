<?php
class Member extends CreateBase
{
    protected $table = "member";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("name",100);
        $table->string("image",100);
        $table->integer("unionid");
        $table->integer("ent_id");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}