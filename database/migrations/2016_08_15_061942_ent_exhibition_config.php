<?php class EntExhibitionConfig extends CreateBase
{
    protected $table = "ent_exhibition_config";

    public function create(&$table)
    {
        $table->string("name");
        $table->tinyInteger("edition");
        $table->dataTime("created_at");
        $table->dataTime("updated_at");
    }
}