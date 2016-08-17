<?php class Member extends CreateBase
{
    protected $table = "member";
    protected $connection = "yunku_boss";

    public function create(&$table)
    {
        $table->string("name");
        $table->interger("uniq_code");
        $table->interger("ent_id");
        $table->dataTime("created_at");
        $table->dataTime("updated_at");
    }
}