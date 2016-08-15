<?php

if (!class_exists('GokuaiBase')) {
    require 'GokuaiBase.class.php';
}

class GokuaiAuth extends GokuaiBase
{
    protected $api_url = 'http://a.goukuai.cn';

    const GRANT_TYPE_PERSONAL_PASSWORD = 'password';
    const GRANT_TYPE_ENTERPRISE_PASSWORD = 'ent_password';

    public function __construct($client_id, $client_secret)
    {
        $this->client_id =$client_id;
        $this->client_secret = $client_secret;
    }

    /**
     * @param string $username account
     * @param string $password password
     * @param string $grant_type 'password' or 'ent_password'
     * @return bool
     */
    public function token($username, $password, $grant_type)
    {
        if (preg_match('/[\\/\\\\]/', $username)) {
            $password_encoded = base64_encode($password);
        } else {
            $password_encoded = md5($password);
        }
        $data = array(
            'username' => $username,
            'password' => $password_encoded,
            'grant_type' => $grant_type
        );
        return $this->callAPI('post', '/oauth2/token2', $data);
    }
}
