<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Non authentifié'], 401);
        }

        if (!in_array($request->user()->type, $roles)) {
            return response()->json(['error' => 'Non autorisé pour ce rôle'], 403);
        }

        return $next($request);
    }
} 