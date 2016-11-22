<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::get('/admin', 'IndexController@getIndex');
Route::get('/mobile', 'BaseInfoController@getMobileIndex');
Route::get('/', 'BaseInfoController@getIndex');

Route::get('/login', function () {
    return view('show');
});
Route::get('/logout', 'AuthController@getLogout');
# 用户点击登录按钮时请求的地址
Route::get('/auth/oauth', 'Auth\AuthController@oauth');
# 微信接口回调地址
Route::get('/auth/callback', 'Auth\AuthController@callback');
Route::controller("base","BaseController");
Route::controller("account","AccountController");
Route::controller("auth","AuthController");
Route::controller("file","FileController");
Route::controller("exhibition","ExhibitionController");
Route::controller("test","TestController");
Route::controller("baseinfo","BaseInfoController");
Route::controller("assistant","AssistantController");

