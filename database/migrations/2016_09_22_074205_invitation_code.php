<?php class InvitationCode extends CreateBase
{
    protected $table = "invitation_code";

    public function create(&$table)
    {
        $table->increments('id');
        $table->string("key", 30);
        $table->string("code", 100);
        $table->dateTime("ent_time");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}