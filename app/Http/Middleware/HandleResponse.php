<?php namespace App\Http\Middleware;

use Closure;
use DB;

class HandleResponse
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */

    public function handle($request, Closure $next)
    {
        $response = $next($request);
        if (!$response->getContent() && inputWantsJson()) {
            return \Response::json(['status' => 'success']);
        }
        return $response;
    }

}