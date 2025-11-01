<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountLocked
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->is_locked) {
            return response()->json([
                'message' => 'Votre compte est verrouillé. Contactez l\'administrateur.',
            ], 403);
        }

        return $next($request);
    }
}