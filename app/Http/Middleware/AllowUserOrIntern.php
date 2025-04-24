<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AllowUserOrIntern
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() || Auth::guard('intern')->check()) {
            return $next($request);
        }

        return redirect()->route('login'); // You can also use 'intern.login' if needed
    }
}
