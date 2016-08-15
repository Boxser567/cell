<?php

class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }

    public function request($method, $actionName, $withValue = [])
    {
        $headers = ['accept' => 'application/json'];
        $this->login(24);
        $server = $this->transformHeadersToServerVars($headers);
        $result_request = $this->call(
            $method, $actionName, $withValue, [], [], $server
        );
        return $result_request;
    }

    public function login($user_id)
    {
        $user = \App\Models\User::find($user_id);
        $this->session(['user' => $user]);
    }


    public function checkOut()
    {
        // if ($this->response->getStatusCode() == 200) {
        $result =$this->response->getContent();
        dump($result);
        //}
    }

    public function seeJsonDebug($dump = false)
    {
        if ($dump) {
            $content = $this->response->getContent();
            $array = json_decode($content, true);
            if (is_array($array)) {
                dump($array);
            } else {
                dump($content);
            }
        }
        return parent::seeJson();
    }

}
