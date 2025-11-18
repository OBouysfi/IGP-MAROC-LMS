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
            'first_name' => 'IGP',
            'last_name' => 'Maroc',
            'email' => 'bouysfi.othman@gmail.com',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        $professor = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Professor',
            'email' => 'obouysfi@gmail.com',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $professor->assignRole('professor');

        $student = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Student',
            'email' => 'bouysfideveloper@gmail.com',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $student->assignRole('student');

        $assistant = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Assistant',
            'email' => 'assistant@igp.edu',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $assistant->assignRole('assistant');
    }
}