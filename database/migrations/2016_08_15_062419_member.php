<?php
class Member extends CreateBase
{
    protected $table = "member";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("name",100);
        $table->string("image",200);
        $table->string("unionid",50);
        $table->integer("ent_id");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}