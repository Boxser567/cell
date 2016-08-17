<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
class CreateBase extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    protected $table = '';



    public function up()
    {
        try {
            if ($this->table) {
                if (Schema::connection($this->getConnection())->hasTable($this->table)) {
                    $this->down();
                }
                Schema::connection($this->getConnection())->create(
                    $this->table, function ($table) {
                        $table->collation = 'utf8_general_ci';
                        $this->create($table);

                    }
                );
            }
        } catch (Exception $e) {
            echo $e->getFile() . PHP_EOL;
            echo $e->getLine() . PHP_EOL;
            echo $e->getMessage() . PHP_EOL;
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if ($this->table) {
            Schema::connection($this->getConnection())->dropIfExists($this->table);
        }
    }

    public function create(&$table)
    {

    }
}
