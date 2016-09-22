<?php
namespace App\Http\Controllers;
use View;

class IndexController extends BaseController
{

    protected $view_prefix = 'test';

    /**
     * @return \Illuminate\View\View
     *
     * @author hurs
     */
    public function getIndex()
    {
        View::addExtension('html', 'blade');
        $wechat=app('wechat');
        $js = $wechat->js;
        return view('index',['js' => $js]);
    }
}
