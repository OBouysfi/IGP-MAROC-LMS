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
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $professorRole = Role::firstOrCreate(['name' => 'professor', 'guard_name' => 'web']);
        $studentRole = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $assistantRole = Role::firstOrCreate(['name' => 'assistant', 'guard_name' => 'web']);

        // --- Main Super Admin (Othman)
        $admin = User::create([
            'first_name' => 'Othman',
            'last_name' => 'Be',
            'email' => 'bouysfi.othman@gmail.com',
            'password' => Hash::make('123456789'),
            'phone' => '+212637208455',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->roles()->attach($adminRole->id);

        // --- Additional Super Admins ---
        $superAdmins = [
            [
                'first_name' => 'Tilila',
                'last_name' => 'Admin',
                'email' => 'tilila@igp-maroc.com',
                'phone' => '+212600000001',
            ],
            [
                'first_name' => 'Leila',
                'last_name' => 'Admin',
                'email' => 'leila@igp-maroc.com',
                'phone' => '+212600000002',
            ],
        ];

        foreach ($superAdmins as $adminData) {
            $user = User::create([
                'first_name' => $adminData['first_name'],
                'last_name' => $adminData['last_name'],
                'email' => $adminData['email'],
                'password' => Hash::make('123456789'),
                'phone' => $adminData['phone'],
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
            $user->roles()->attach($adminRole->id);
        }

        // ------------------------------------------
        // Les autres seeders restent COMMENTÉS
        // ------------------------------------------

        // // Professor
        // $professorUser = User::create([...]);
        // $professorUser->roles()->attach($professorRole->id);
        // Professor::create([...]);

        // // Student
        // $studentUser = User::create([...]);
        // $studentUser->roles()->attach($studentRole->id);
        // Student::create([...]);

        // // Assistant
        // $assistant = User::create([...]);
        // $assistant->roles()->attach($assistantRole->id);
    }
}
