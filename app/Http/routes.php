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

Route::get('/', function () {
    View::addExtension('html','blade');
    return view('index');
});
Route::get('/pic', function () {
    return view('upload');
});
Route::get('/login', function () {
    return view('welcome');
});

//Route::get('/{unicode}','BaseController@show' )->where('unicode', '[\d]{10}');
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

