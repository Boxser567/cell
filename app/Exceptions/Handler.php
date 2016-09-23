<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Redirect;
use Response;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        HttpException::class,
        ModelNotFoundException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        return parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {

        $error = [
            'error_code' => 40106,
            'error_msg' => $e->getMessage() ? : '未知错误'
        ];
        if (strpos($error['error_msg'], 'SQLSTATE') !== false) {
            $error = [
                'error_code' => 500,
                'error_msg' => is_debug() ? $error['error_msg'] : '数据库异常',
                'error_msg_hidden' => $error['error_msg'],
            ];
        }
return Response::json($error);
        if (inputWantsJson()) {
            return Response::json($error, substr($error['error_code'], 0, 3));
        } else {
            switch ($error['error_code']) {
                case 40106:
                    return Redirect::guest('/auth/auth');
                case 4000340:
                    return Redirect::guest('/auth/verify');
            }
            if (is_debug()) {
                return parent::render($request, $e);
            } else {
                return Response::view('errors.standard', $error);
            }
        }
    }
}
