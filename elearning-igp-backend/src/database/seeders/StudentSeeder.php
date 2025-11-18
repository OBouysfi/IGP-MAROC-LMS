<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer tous les users avec rôle student
        $students = User::role('student')->get();

        foreach ($students as $user) {
            // Créer le profil étudiant s'il n'existe pas
            if (!$user->student) {
                Student::create([
                    'user_id' => $user->id,
                    'gender' => 'Homme',
                    'birth_date' => '2000-01-01',
                    'nationality' => 'Marocaine',
                    'address' => 'Casablanca, Maroc',
                    'enrolled_date' => now(),
                    'filiere' => 'Développement',
                    'program' => 'Master',
                    'level' => '1ère année',
                    'group' => 'DEV-M1-A',
                    'inscription_amount' => 5000,
                    'monthly_amount' => 2500,
                ]);
            }
        }
    }
}