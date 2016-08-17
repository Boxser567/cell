<?php
class Member extends CreateBase
{
    protected $table = "member";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("name",30);
        $table->string("image",30);
        $table->integer("unionid");
        $table->integer("ent_id");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}