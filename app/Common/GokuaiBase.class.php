<?php

class GokuaiBase
{
    const TOKEN_TYPE_ENTERPRISE = 'ent';
    const TOKEN_TYPE_PERSONAL = '';

    public $timeout = 300;
    public $connecttimeout = 10;
    protected static $user_agent = 'Yunku-SDK-PHP_1.0';
    protected $api_url = 'http://yk3-api-ent.goukuai.cn';
    protected $curl;
    protected $http_code;
    protected $http_error;
    protected $response;

    protected $client_id;
    protected $client_secret;

    public function __construct($client_id='', $client_secret='')
    {
        $this->client_id = config("app.yunku.client_id");
        $this->client_secret = config("app.yunku.client_secret");
    }

    /**
     * @param string $http_method POST or GET
     * @param string $uri
     * @param array $parameters
     * @return bool
     */
    public function callAPI($http_method, $uri, array $parameters = [])
    {
        $parameters['client_id'] = $this->client_id;
        $parameters['dateline'] = time();
        $parameters['sign'] = $this->getSign($parameters);
        $this->sendRequest($this->api_url . $uri, $http_method, $parameters);
        return $this->isOK();
    }

    protected function getSign(array $parameters)
    {
        if (!$parameters) {
            return '';
        }
        ksort($parameters);
        $data = implode("\n", $parameters);
        $signature = base64_encode(hash_hmac('sha1', $data, $this->client_secret, true));
        return $signature;
    }

    /**
     * @return bool
     */
    public function isOK()
    {
        return !$this->http_error && $this->http_code < 400;
    }

    /**
     * @return string
     */
    public function getHttpError()
    {
        return $this->http_error;
    }

    /**
     * @return string
     */
    public function getHttpCode()
    {
        return $this->http_code;
    }

    /**
     * @param bool $return_json
     * @return string|array
     */
    public function getHttpResponse($return_json = false)
    {
        return $return_json ? json_decode($this->response, true) : $this->response;
    }

    protected function sendRequest($url, $method, array $data = [])
    {
        $method = strtoupper($method);
        $this->curl = curl_init();
        curl_setopt($this->curl, CURLOPT_USERAGENT, self::$user_agent);
        curl_setopt($this->curl, CURLOPT_CONNECTTIMEOUT, $this->connecttimeout);
        curl_setopt($this->curl, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($this->curl, CURLOPT_HEADER, false);
        $fields_string = '';
        if ($data) {
            if (is_array($data)) {
                foreach ($data as $k => $v) {
                    $fields_string .= $k . '=' . rawurlencode($v) . '&';
                }
                $fields_string = rtrim($fields_string, '&');
            } else {
                $fields_string = $data;
            }
        }
        $method = strtoupper($method);
        switch ($method) {
            case 'GET':
                if ($fields_string) {
                    if (strpos($url, '?')) {
                        curl_setopt($this->curl, CURLOPT_URL, $url . '&' . $fields_string);
                    } else {
                        curl_setopt($this->curl, CURLOPT_URL, $url . '?' . $fields_string);
                    }
                }
                break;
            case 'POST':
                curl_setopt($this->curl, CURLOPT_URL, $url);
                curl_setopt($this->curl, CURLOPT_POST, true);
                curl_setopt($this->curl, CURLOPT_POSTFIELDS, $fields_string);
                break;
            default:
                curl_setopt($this->curl, CURLOPT_URL, $url);
                curl_setopt($this->curl, CURLOPT_CUSTOMREQUEST, $method);
                curl_setopt($this->curl, CURLOPT_POSTFIELDS, $fields_string);
                break;
        }
        $this->response = curl_exec($this->curl);
        $this->http_code = curl_getinfo($this->curl, CURLINFO_HTTP_CODE);
        $this->http_error = curl_error($this->curl);
        curl_close($this->curl);
    }
}