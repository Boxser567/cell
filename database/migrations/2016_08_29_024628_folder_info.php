<?php class FolderInfo extends CreateBase
{
    protected $table = "folder_info";
    protected $connection = "yunku_boss";

    public function create(&$table)
    {
        $table->integer("org_id");
        $table->string("folder_hash", 30);
        $table->interger("file_count");
        $table->interger("file_size");
        $table->dataTime("created_at");
        $table->dataTime("updated_at");
    }
}