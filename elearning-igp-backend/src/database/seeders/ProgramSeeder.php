<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Year;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $master = Program::create([
            'name' => 'Master',
            'code' => 'MST',
            'description' => 'Programme Master',
            'is_active' => true,
        ]);

        Year::create([
            'program_id' => $master->id,
            'name' => '1ère année Master',
            'level' => 1,
            'is_active' => true,
        ]);

        Year::create([
            'program_id' => $master->id,
            'name' => '2ème année Master',
            'level' => 2,
            'is_active' => true,
        ]);

        $licence = Program::create([
            'name' => 'Licence',
            'code' => 'LIC',
            'description' => 'Programme Licence',
            'is_active' => true,
        ]);

        Year::create([
            'program_id' => $licence->id,
            'name' => '1ère année Licence',
            'level' => 1,
            'is_active' => true,
        ]);

        Year::create([
            'program_id' => $licence->id,
            'name' => '2ème année Licence',
            'level' => 2,
            'is_active' => true,
        ]);

        Year::create([
            'program_id' => $licence->id,
            'name' => '3ème année Licence',
            'level' => 3,
            'is_active' => true,
        ]);
    }
}