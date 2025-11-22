<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Year;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $premiere = Program::updateOrCreate(
            ['code' => 'AN1'],
            [
                'name' => '1ère année',
                'description' => 'Première année',
                'is_active' => true,
            ]
        );

        $deuxieme = Program::updateOrCreate(
            ['code' => 'AN2'],
            [
                'name' => '2ème année',
                'description' => 'Deuxième année',
                'is_active' => true,
            ]
        );

        $master = Program::updateOrCreate(
            ['code' => 'MST'],
            [
                'name' => 'Master',
                'description' => 'Programme Master',
                'is_active' => true,
            ]
        );

        Year::updateOrCreate(
            ['program_id' => $master->id, 'level' => 1],
            ['name' => 'Master 1', 'is_active' => true]
        );

        Year::updateOrCreate(
            ['program_id' => $master->id, 'level' => 2],
            ['name' => 'Master 2', 'is_active' => true]
        );

        Program::updateOrCreate(
            ['code' => 'LIC'],
            [
                'name' => 'Licence',
                'description' => 'Programme Licence',
                'is_active' => true,
            ]
        );
    }
}
