<?php

namespace App\Http\Middleware;

use App\Services\DeviceService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackDevice
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $this->deviceService->trackDevice($request->user(), $request);
        }

        return $next($request);
    }
}