<?php

class CreateTableSmsReport extends CreateBase
{
    protected $table = 'sms_report';

    /**
     * @param \Illuminate\Database\Schema\Blueprint $table
     *
     * @author hurs
     */
    public function create(&$table)
    {
        $table->increments('id');
        $table->string('report_id', 100);
        $table->string('server_id', 100);
        $table->string('mobile', 100);
        $table->string('unique_code', 100);
        $table->string('state', 100);
        $table->string('ip', 100);
        $table->string('args');
        $table->dateTime('create_time');
        $table->index(['mobile']);
        $table->index(['create_time']);
        $table->index(['state']);
    }
}