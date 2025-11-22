<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // S'assurer que les rôles existent
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $professorRole = Role::firstOrCreate(['name' => 'professor', 'guard_name' => 'web']);
        $studentRole = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $assistantRole = Role::firstOrCreate(['name' => 'assistant', 'guard_name' => 'web']);

        $admin = User::create([
            'first_name' => 'IGP',
            'last_name' => 'Maroc',
            'email' => 'bouysfi.othman@gmail.com',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->roles()->attach($adminRole->id);

        $professor = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Professor',
            'email' => 'obouysfi@gmail.com',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $professor->roles()->attach($professorRole->id);

        $student = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Student',
            'email' => 'bouysfideveloper@gmail.com',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $student->roles()->attach($studentRole->id);

        $assistant = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Assistant',
            'email' => 'assistant@igp.edu',
            'password' => Hash::make('Bouy1021@'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $assistant->roles()->attach($assistantRole->id);
    }
}