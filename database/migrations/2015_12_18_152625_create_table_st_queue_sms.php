<?php

class CreateTableStQueueSms extends CreateBase
{
    protected $table = 'st_queue_sms';

    /**
     * @param \Illuminate\Database\Schema\Blueprint $table
     *
     * @author hurs
     */
    public function create(&$table)
    {
        $table->increments('id');
        $table->string('phone', 20);
        $table->text('text');
        $table->tinyInteger('type');
        $table->string('uniqid', 50);
        $table->text('property');
        $table->string('ip', 20);
        $table->tinyInteger('state');
        $table->integer('dateline');
        $table->integer('scheduletime');
        $table->integer('sendtime');
        $table->string('unique_code', 100);
        $table->integer('user_id');
        $table->index('uniqid');
        $table->index('ip');
        $table->index(['dateline', 'type', 'phone']);
    }

}