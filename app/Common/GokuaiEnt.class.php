<?php

if (!class_exists('GokuaiBase')) {
    require 'GokuaiBase.class.php';
}

class GokuaiEnt extends GokuaiBase
{
    protected $api_url = 'http://a-lib.goukuai.cn';
    const TOKEN_TYPE_ENT = 'ent';
    private $token_type;
    private $token;

    public function __construct($token, $client_id, $client_secret, $token_type = self::TOKEN_TYPE_ENT)
    {
        $this->token = $token;
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->token_type = $token_type;
    }

    /**
     * @param string $http_method POST or GET
     * @param string $uri
     * @param array $parameters
     * @return bool
     */
    public function callAPI($http_method, $uri, array $parameters = [])
    {
        $parameters['token_type'] = $this->token_type;
        $parameters['token'] = $this->token;
        $parameters['dateline'] = time();
        $parameters['sign'] = $this->getSign($parameters);
        $this->sendRequest($this->api_url . $uri, $http_method, $parameters);
        return $this->isOK();
    }
}
