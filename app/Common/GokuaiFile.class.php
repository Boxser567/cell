<?php

if (!class_exists('GokuaiBase')) {
    require 'GokuaiBase.class.php';
}

class GokuaiFile extends GokuaiBase
{
    protected $api_url = 'http://yk3-api-ent.goukuai.cn';

    public function __construct($org_client_id, $org_client_secret)
    {
        $this->client_id = $org_client_id;
        $this->client_secret = $org_client_secret;
    }

    /**
     * @param string $http_method POST or GET
     * @param string $uri
     * @param array $parameters
     * @return bool
     */
    public function callAPI2($http_method, $uri, array $parameters = [])
    {
        $parameters['org_client_id'] = $this->client_id;
        $parameters['dateline'] = time();
        $parameters['sign'] = $this->getSign($parameters);
        $this->sendRequest($this->api_url . $uri, $http_method, $parameters);
        return $this->isOK();
    }
    
}
