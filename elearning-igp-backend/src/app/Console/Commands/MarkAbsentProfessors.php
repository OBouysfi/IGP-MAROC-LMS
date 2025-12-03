<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Schedule;
use App\Models\JitsiSession;
use App\Models\AttendanceLog;
use Carbon\Carbon;

class MarkAbsentProfessors extends Command
{
    protected $signature = 'attendance:mark-absent';
    protected $description = 'Marquer automatiquement les absences des professeurs';

    public function handle()
    {
        $today = Carbon::today();
        $dayOfWeek = $today->dayOfWeek;
        $markedCount = 0;

        $this->info("🔍 Vérification des absences pour le {$today->format('d/m/Y')}...");

        // ✅ 1. COURS PRÉSENTIELS
        $schedules = Schedule::with(['course', 'group'])
            ->where('day', $dayOfWeek)
            ->get();

        $this->info("📋 {$schedules->count()} cours présentiels prévus aujourd'hui");

        foreach ($schedules as $schedule) {
            // Vérifier si le prof a pointé
            $hasClocked = AttendanceLog::where('professor_id', $schedule->professor_id)
                ->where('schedule_id', $schedule->id)
                ->where('date', $today)
                ->exists();

            if (!$hasClocked) {
                $start = Carbon::parse($schedule->start_time);
                $end = Carbon::parse($schedule->end_time);
                $hoursScheduled = $end->diffInMinutes($start) / 60;

                AttendanceLog::create([
                    'professor_id' => $schedule->professor_id,
                    'course_id' => $schedule->course_id,
                    'group_id' => $schedule->group_id,
                    'schedule_id' => $schedule->id,
                    'date' => $today,
                    'clock_in' => null,
                    'clock_out' => null,
                    'hours_worked' => 0,
                    'hours_scheduled' => $hoursScheduled,
                    'status' => 'absent',
                    'type' => $schedule->type ?? 'cours',
                    'location' => $schedule->room ?? 'N/A',
                    'notes' => 'Absence automatique - Aucun pointage détecté',
                    'validated' => false, // Admin doit valider
                    'validated_by' => null,
                    'validated_at' => null,
                ]);

                $markedCount++;
                $this->warn("❌ Absence: {$schedule->course->name} ({$schedule->start_time}-{$schedule->end_time})");
            }
        }

        // ✅ 2. SESSIONS LIVE
        $liveSessions = JitsiSession::with(['course', 'group'])
            ->where('session_date', $today)
            ->whereIn('status', ['planifiée', 'terminée'])
            ->get();

        $this->info("📡 {$liveSessions->count()} sessions live prévues aujourd'hui");

        foreach ($liveSessions as $session) {
            $hasClocked = AttendanceLog::where('professor_id', $session->professor_id)
                ->where('course_id', $session->course_id)
                ->where('date', $today)
                ->where('type', 'session_live')
                ->exists();

            if (!$hasClocked) {
                AttendanceLog::create([
                    'professor_id' => $session->professor_id,
                    'course_id' => $session->course_id,
                    'group_id' => $session->group_id,
                    'schedule_id' => null,
                    'date' => $today,
                    'clock_in' => null,
                    'clock_out' => null,
                    'hours_worked' => 0,
                    'hours_scheduled' => $session->duration / 60,
                    'status' => 'absent',
                    'type' => 'session_live',
                    'location' => 'En ligne',
                    'notes' => 'Absence automatique - Session non démarrée',
                    'validated' => false, // Admin doit valider
                    'validated_by' => null,
                    'validated_at' => null,
                ]);

                $markedCount++;
                $this->warn("❌ Absence: Session live {$session->course->name} ({$session->start_time})");
            }
        }

        if ($markedCount === 0) {
            $this->info("✅ Aucune absence détectée - Tous les profs ont pointé!");
        } else {
            $this->info("✅ {$markedCount} absence(s) marquée(s) automatiquement");
        }

        return 0;
    }
}