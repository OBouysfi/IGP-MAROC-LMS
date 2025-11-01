<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserDevice;
use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;

class DeviceService
{
    public function generateDeviceId(Request $request): string
    {
        return md5($request->userAgent() . $request->ip());
    }

    public function trackDevice(User $user, Request $request): UserDevice
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        $deviceId = $this->generateDeviceId($request);

        return UserDevice::updateOrCreate(
            ['device_id' => $deviceId],
            [
                'user_id' => $user->id,
                'device_name' => $agent->device() ?: 'Unknown',
                'device_type' => $agent->deviceType(),
                'browser' => $agent->browser(),
                'platform' => $agent->platform(),
                'ip_address' => $request->ip(),
                'last_used_at' => now(),
            ]
        );
    }

    public function isNewDevice(User $user, Request $request): bool
    {
        $deviceId = $this->generateDeviceId($request);
        
        return !UserDevice::where('user_id', $user->id)
            ->where('device_id', $deviceId)
            ->exists();
    }

    public function isTrustedDevice(User $user, Request $request): bool
    {
        $deviceId = $this->generateDeviceId($request);
        
        return UserDevice::where('user_id', $user->id)
            ->where('device_id', $deviceId)
            ->where('is_trusted', true)
            ->exists();
    }
}