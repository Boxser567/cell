<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\AssistantController;
use App\User;
use Overtrue\Socialite\Config;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Request;
use Laravel\Socialite\Facades\Socialite;
use View;


class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:6',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }

    public function oauth(Request $request)
    {
        $wechat=app('wechat');
        return $wechat->oauth->scopes(['snsapi_login'])
            ->redirect();
    }

# 微信的回调地址
    public function callback(Request $request)
    {
        $wechat=app('wechat');
        $user = $wechat->oauth->user();
        $auth=new \App\Http\Controllers\AuthController();
        if(\Request::has('target')){
            $auth->addAssistant($user,inputGetOrFail('ent_id'));
            return "<script>window.close()</script>";
        }
        $auth_user= $auth->login($user);
        if(!$auth_user['phone']) {
            View::addExtension('html', 'blade');
            header("Location:http://cell.meetingfile.com/admin?info=1/#/register?".$auth_user['id']);
        }else{
            View::addExtension('html', 'blade');
            header("Location:http://cell.meetingfile.com/admin/#/exhibition?");
        }
    }

}
