<?php

namespace App\Http\Controllers\Api\Assistant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            $assistant = $user->assistant;
            
            if (!$assistant) {
                $assistant = $user->assistant()->create([]);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'first_name' => $user->first_name ?? '',
                    'last_name' => $user->last_name ?? '',
                    'email' => $user->email,
                    'phone' => $assistant->phone ?? '',
                    'employee_id' => $assistant->employee_id ?? '',
                    'department' => $assistant->department ?? 'Scolarité',
                    'role' => 'Assistante Administrative',
                    'bio' => $assistant->bio ?? '',
                    'linkedin' => $assistant->linkedin ?? '',
                    'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant get profile error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching profile', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20',
                'bio' => 'nullable|string',
                'linkedin' => 'nullable|url',
            ]);
            
            $user = $request->user();
            $assistant = $user->assistant;
            
            $user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
            ]);
            
            if (!$assistant) {
                $assistant = $user->assistant()->create([]);
            }
            
            $assistant->update([
                'phone' => $request->phone,
                'bio' => $request->bio,
                'linkedin' => $request->linkedin,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant update profile error: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating profile', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function uploadAvatar(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            $user = $request->user();
            
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            $path = $request->file('avatar')->store('avatars', 'public');
            
            $user->update(['avatar' => $path]);
            
            return response()->json([
                'success' => true,
                'message' => 'Avatar uploaded successfully',
                'data' => ['avatar_url' => url('storage/' . $path)]
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant upload avatar error: ' . $e->getMessage());
            return response()->json(['message' => 'Error uploading avatar', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|min:8|confirmed',
            ]);
            
            $user = $request->user();
            
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'Current password is incorrect'], 400);
            }
            
            $user->update([
                'password' => Hash::make($request->new_password),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant change password error: ' . $e->getMessage());
            return response()->json(['message' => 'Error changing password', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function getNotifications(Request $request)
    {
        try {
            $assistant = $request->user()->assistant;
            
            if (!$assistant) {
                $assistant = $request->user()->assistant()->create([]);
            }
            
            $defaultSettings = [
                'email_new_justification' => true,
                'email_high_absence' => true,
                'email_daily_report' => false,
                'push_new_justification' => true,
                'push_urgent_alerts' => true,
            ];
            
            return response()->json([
                'success' => true,
                'data' => $assistant->notification_settings ?? $defaultSettings,
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant get notifications error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching notifications', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function updateNotifications(Request $request)
    {
        try {
            $assistant = $request->user()->assistant;
            
            if (!$assistant) {
                $assistant = $request->user()->assistant()->create([]);
            }
            
            $assistant->update([
                'notification_settings' => $request->all(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Notification settings updated successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Assistant update notifications error: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating notifications', 'error' => $e->getMessage()], 500);
        }
    }
}