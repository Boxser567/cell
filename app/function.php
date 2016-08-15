<?php
/**
 * Created by PhpStorm.
 * User: rongshenghu
 * Date: 15-11-6
 * Time: 16:57
 */

/**
 * @return mixed
 *
 * @author hurs
 */
function is_debug()
{
    return config('app.debug');
}

function inputWantsJson()
{
    return Request::wantsJson() || ($_SERVER["HTTP_X_REQUESTED_WITH"] == 'XMLHttpRequest');
}

function inputGet($key, $default = '')
{
    if (\Request::has($key)) {
        return inputFilters(\Request::input($key));
    } else {
        return $default;
    }
}

function inputAll()
{
    return Input::all();
}

function inputGetOrFail($key, $value = null)
{
    if (!is_null($value)) {
        return $value;
    }
    if (Input::has($key)) {

    } elseif (!is_debug()) {
        throw new Exception('请求参数错误', 40003);
    } else {
        throw new Exception('请求参数错误' . $key, 40003);
    }
    return inputGet($key);
}

function inputFilters($string)
{
    $string = str_replace('<', '&lt;', $string);
    $string = str_replace('>', '&gt;', $string);
    return $string;
}

function view_path()
{
    $view = isset($_SERVER['X-VIEW-PATH']) ? $_SERVER['X-VIEW-PATH'] : 'app';
    return public_path() . '/web/' . $view;
}

function get_app_list($include_web = true)
{
    $list = ['ipad', 'iphone', 'android', 'win', 'mac'];
    if ($include_web) {
        $list[] = 'web';
    }
    return $list;
}

/**
 * 获取客户端IP地址
 * @return string
 */
function get_client_ip()
{
    return Request::getClientIp();
}

function check_ip($ip, $ips_allow)
{
    $result = false;
    foreach ($ips_allow as $ip_allow) {
        $ip_section = explode('.', $ip);
        $ip_allow_section = explode('.', $ip_allow);
        $result_ip = true;
        foreach ($ip_section as $key => $section) {
            if ($ip_allow_section[$key] == "*") {
                continue;
            }
            if ($ip_allow_section[$key] != $section) {
                $result_ip = false;
            }
        }
        $result = $result ? : $result_ip;
    }
    return $result;
}

function get_domain(&$url)
{
    if (!$url) {
        return '';
    }
    $url_ex = explode('/', $url);
    if ($url_ex[1]) {
        $url = str_replace(':/', '://', $url);
        return $url_ex[1];
    } else {
        return $url_ex[2];
    }
}

function get_vsrc($url, $start_str = 'vsrc=', $end_str = '&')
{
    $is = strpos($url, 'vsrc=');
    if ($is !== false) {
        $start_pos = strpos($url, $start_str) + strlen($start_str);
        $end_pos = strpos($url, $end_str);
        if ($end_pos == false) {
            $end_pos = strlen($url);
        }
        $c_str_l = $end_pos - $start_pos;
        $contents = substr($url, $start_pos, $c_str_l);
        return $contents;
    } else {
        return '';
    }

}

//orm with 的时候，使用缓存功能
function createWith($relations)
{
//    return $relations;
    $new_relation = [];
    if (is_array($relations)) {
        foreach ($relations as $relation) {
            if (is_callable($relation)) {
                $new_relation[$relation] = function ($query) {
                    $query->tags();
                };
            } else {

            }
        }
    } else {
        $new_relation = [
            $relations => function ($query) {
                $query->tags();
            }
        ];
    }
    return $new_relation;
}

function get_page_size($size = 20)
{
    return inputGet('size', $size);
}

function get_system_user()
{
    return \App\Models\User::_find('24')->toArray();
    /*return [
        'id' => 0,
        'name' => \App\Models\User::SYSTEM_NAME
    ];*/
}

function get_http_host()
{
    return \Request::getHttpHost();
}

function get_scheme_host()
{
    return \Request::getSchemeAndHttpHost();
}

function object_flatten($object, $key = '')
{
    if (!$object) {
        return [];
    }
    if (is_object($object)) {
        $object = $object->toArray();
    }
    if ($key) {
        foreach ($object as &$array) {
            $array = array_dot($array);
            if (array_key_exists($key, $array)) {
                $array = $array[$key];
            }
        }
    }
    return array_flatten($object);
}

function get_date($key = 0, $t = '', $format = "Ymd")
{
    $t = $t ? strtotime($t) : time();
    if (!$key) {
        return date($format, $t);
    }
    $d = strtotime('' . $key . " day", $t);
    $d = date($format, $d);
    return $d;
}

function get_datetime($time = '')
{
    $time = $time ? : time();
    return date('Y-m-d H:i:s', $time);
}

function inputGetExplode($key, $default = '', $unique = true, $delimiter = ',')
{
    $value = inputGet($key, $default);
    $value = explode($delimiter, $value);
    if ($unique) {
        $value = array_unique($value);
    }
    return $value;
}

function get_code($size = 10, $codes = '0123456789')
{
    $code = '';
    $codes_len = strlen($codes);
    for ($i = 0; $i < $size; $i++) {
        $code .= $codes[mt_rand(0, $codes_len - 1)];
    }
    return $code;
}

function curl_invoke($url, $method, $data, $header = null, &$http_code = 0, &$error = '', $time_out = false)
{
    try {
        $ch = curl_init($url);
        if (stripos($url, "https://") !== false) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $time_out ? : 30);
        curl_setopt($ch, CURLOPT_TIMEOUT, $time_out ? : 60);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $fields_string = '';
        if ($data) {
            if (is_array($data)) {
                foreach ($data as $k => $v) {
                    $fields_string .= $k . '=' . $v . '&';
                }
                $fields_string = rtrim($fields_string, '&');
            } else {
                $fields_string = $data;
            }
        }
        switch ($method) {
            case 'GET':
                if ($fields_string) {
                    if (strpos($url, '?')) {
                        curl_setopt($ch, CURLOPT_URL, $url . '&' . $fields_string);
                    } else {
                        curl_setopt($ch, CURLOPT_URL, $url . '?' . $fields_string);
                    }
                }
                break;
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
                break;
            default:
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
                break;
        }
        if (!is_array($header)) {
            $header = [];
        }
        if ($_SERVER['HTTP_ACCEPT_LANGUAGE'] && !array_key_exists('Accept-Language', $header)) {
            $header['Accept-Language'] = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
        }
        $header['X-Forwarded-For'] = get_client_ip();
        $httpheader = array();
        foreach ($header as $key => $value) {
            array_push($httpheader, $key . ': ' . $value);
        }
        if ($httpheader) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $httpheader);
        }
        if ($_COOKIE['think_language']) {
            curl_setopt($ch, CURLOPT_COOKIE, 'think_language=' . $_COOKIE['think_language']);
        }

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $response;
    } catch (Exception $e) {
        $error = $e->getMessage();
        return null;
    }
}

function get_size($size = 0, $length = 2)
{
    if ($size > (1024 * 1024 * 1024)) {
        $size = $size / 1024 / 1024 / 1024;
        return number_format($size, $length) . ' (GB)';
    } elseif ($size > (1024 * 1024)) {
        $size = $size / 1024 / 1024;
        return number_format($size, $length) . ' (MB)';
    } elseif ($size > 1024) {
        $size = $size / 1024;
        return number_format($size, $length) . ' (KB)';
    }
    return $size . ' (B)';
}

function L($key, $replace = [], $locale = null)
{
    return Lang::get('text.' . $key, $replace, $locale);
}

function is_deploy()
{
    return Config::get('app.deploy');
}
function dencode_license($data, $key)
{
    $decode_data=mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($key), base64_decode($data), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND));
    $text=str_replace("\000", '', $decode_data);
    return $text;
}

function getTradeNo()
{
    $microtime = str_pad(str_replace('.', '', microtime(true)), 14, '0');
    return date('Ymd') . $microtime;
}