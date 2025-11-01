<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'IGP',
            'email' => 'admin@igp-maroc.com',
            'password' => Hash::make('password'),
            'phone' => '+212600000000',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        $professor = User::create([
            'first_name' => 'Mohammed',
            'last_name' => 'Alami',
            'email' => 'prof@igp-maroc.com',
            'password' => Hash::make('password'),
            'phone' => '+212611111111',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $professor->assignRole('professor');

        $student = User::create([
            'first_name' => 'Fatima',
            'last_name' => 'Zahra',
            'email' => 'student@igp-maroc.com',
            'password' => Hash::make('password'),
            'phone' => '+212622222222',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $student->assignRole('student');
    }
}