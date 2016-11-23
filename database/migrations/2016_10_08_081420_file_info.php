<?php class FileInfo extends CreateBase
{
    protected $table = "file_info";

    public function create(&$table)
    {
        $table->increments('id');
        $table->integer("ex_id");
        $table->string("hash", 100);
        $table->string("property", 300);
        $table->integer("folder_id");
        $table->integer("order_by");
        $table->string("size",20);
        $table->string("title",100);
        $table->dateTime("created_at");
        $table->dateTime("updated_at");
        $table->index(['hash']);
        $table->index(['ex_id','folder_id']);
    }
}