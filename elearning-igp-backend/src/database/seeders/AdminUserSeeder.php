<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Professor;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $professorRole = Role::firstOrCreate(['name' => 'professor', 'guard_name' => 'web']);
        $studentRole = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $assistantRole = Role::firstOrCreate(['name' => 'assistant', 'guard_name' => 'web']);

        // Admin
        $admin = User::create([
            'first_name' => 'IGP',
            'last_name' => 'Maroc',
            'email' => 'bouysfi.othman@gmail.com',
            'password' => Hash::make('123456789'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->roles()->attach($adminRole->id);

        // Professor
        $professorUser = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Professor',
            'email' => 'obouysfi@gmail.com',
            'password' => Hash::make('123456789'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $professorUser->roles()->attach($professorRole->id);
        
        Professor::create([
            'user_id' => $professorUser->id,
            'department' => 'Informatique',
            'specialization' => 'Développement Web',
            'hourly_rate' => 150,
        ]);

        // Student
        $studentUser = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Student',
            'email' => 'bouysfideveloper@gmail.com',
            'password' => Hash::make('123456789'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $studentUser->roles()->attach($studentRole->id);
        
        Student::create([
            'user_id' => $studentUser->id,
            'gender' => 'Homme',
        ]);

        // Assistant
        $assistant = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Assistant',
            'email' => 'assistant@igp.edu',
            'password' => Hash::make('123456789'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $assistant->roles()->attach($assistantRole->id);
    }
}