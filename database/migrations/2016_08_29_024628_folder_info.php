<?php class FolderInfo extends CreateBase
{
    protected $table = "folder_info";

    public function create(&$table)
    {
        $table->increments('id');
        $table->integer("org_id");
        $table->integer("group_id");
        $table->string("title", 100);
        $table->string("folder_hash", 100);
        $table->string("img_url", 450);
        $table->string("property", 150);
        $table->integer("file_count");
        $table->integer("file_size");
        $table->integer("order_by");
        $table->dateTime("start_time");
        $table->dateTime("end_time");
        $table->tinyInteger("forever");
        $table->tinyInteger("hidden");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
        $table->index(['folder_hash']);
        $table->index(['org_id','group_id']);
    }
}