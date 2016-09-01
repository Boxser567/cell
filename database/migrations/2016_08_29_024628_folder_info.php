<?php class FolderInfo extends CreateBase
{
    protected $table = "folder_info";

    public function create(&$table)
    {
        $table->increments('id');
        $table->integer("org_id");
        $table->string("folder_hash", 100);
        $table->string("img_url", 150);
        $table->integer("file_count");
        $table->integer("file_size");
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
    }
}