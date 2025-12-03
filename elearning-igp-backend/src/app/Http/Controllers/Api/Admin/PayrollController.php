<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PayrollPaymentRequest;
use App\Http\Resources\Admin\PayrollResource;
use App\Models\Payroll;
use App\Models\PayrollDetail;
use App\Models\Professor;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayrollController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $payrolls = Payroll::where('month', $month)->where('year', $year)->get();

        $stats = [
            'total_to_pay' => $payrolls->sum('net_salary'),
            'total_hours' => $payrolls->sum('hours_worked'),
            'professors_count' => $payrolls->count(),
            'paid_count' => $payrolls->where('payment_status', 'payé')->count(),
            'pending_count' => $payrolls->where('payment_status', 'en_attente')->count(),
        ];

        return response()->json($stats);
    }

    public function index(Request $request): JsonResponse
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $query = Payroll::with(['professor.user', 'details'])
            ->where('month', $month)
            ->where('year', $year);

        if ($request->filled('department')) {
            $query->whereHas('professor', fn($q) => $q->where('department', $request->department));
        }

        if ($request->filled('status')) {
            $query->where('payment_status', $request->status);
        }

        if ($request->filled('contract_type')) {
            $query->whereHas('professor', fn($q) => $q->where('contract_type', $request->contract_type));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('professor.user', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $payrolls = $query->get();

        return response()->json(['data' => PayrollResource::collection($payrolls)]);
    }

    public function generate(Request $request): JsonResponse
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        Log::info("🚀 Génération paie: Mois={$month}, Année={$year}");

        $professors = Professor::with('user')->where('hourly_rate', '>', 0)->get();
        
        Log::info("👨‍🏫 {$professors->count()} professeurs trouvés");

        DB::beginTransaction();
        try {
            $generatedCount = 0;
            $skippedCount = 0;
            
            foreach ($professors as $professor) {
                // Vérifier si existe déjà
                $existing = Payroll::where('professor_id', $professor->id)
                    ->where('month', $month)
                    ->where('year', $year)
                    ->first();

                if ($existing) {
                    $skippedCount++;
                    continue;
                }

                // ✅ NOUVEAU: Utiliser AttendanceLog (heures réelles validées)
                $logs = \App\Models\AttendanceLog::where('professor_id', $professor->id)
                    ->where('validated', true) // Seulement les heures validées
                    ->whereYear('date', $year)
                    ->whereMonth('date', $month)
                    ->with(['course', 'group'])
                    ->get();

                Log::info("📊 Prof #{$professor->id}: {$logs->count()} présences validées");

                $totalHours = 0;
                $courseDetails = [];

                foreach ($logs as $log) {
                    $totalHours += $log->hours_worked; // Heures réelles

                    $courseKey = ($log->course_id ?? 0) . '-' . ($log->group_id ?? 0);
                    
                    if (!isset($courseDetails[$courseKey])) {
                        $courseDetails[$courseKey] = [
                            'course_id' => $log->course_id,
                            'course_name' => $log->course->name ?? 'Cours',
                            'group_name' => $log->group->name ?? 'Groupe',
                            'hours' => 0,
                        ];
                    }
                    
                    $courseDetails[$courseKey]['hours'] += $log->hours_worked;
                    
                    Log::info("  ⏰ Log #{$log->id}: {$log->clock_in} → {$log->clock_out} = {$log->hours_worked}h");
                }

                // 💰 Calcul salaire
                $grossSalary = $totalHours * $professor->hourly_rate;
                $netSalary = $grossSalary;

                Log::info("💵 Total: {$totalHours}h × {$professor->hourly_rate} MAD = {$netSalary} MAD");

                // Si aucune heure, skip (prof n'a pas travaillé ce mois)
                if ($totalHours == 0) {
                    Log::info("⚠️ Prof #{$professor->id}: 0 heures, skip");
                    $skippedCount++;
                    continue;
                }

                // ✅ Créer la fiche de paie
                $payroll = Payroll::create([
                    'professor_id' => $professor->id,
                    'month' => $month,
                    'year' => $year,
                    'hourly_rate' => $professor->hourly_rate,
                    'hours_worked' => $totalHours,
                    'bonus' => 0,
                    'deductions' => 0,
                    'gross_salary' => $grossSalary,
                    'net_salary' => $netSalary,
                    'payment_status' => 'en_attente',
                ]);

                // Créer les détails
                foreach ($courseDetails as $detail) {
                    PayrollDetail::create([
                        'payroll_id' => $payroll->id,
                        'course_id' => $detail['course_id'],
                        'course_name' => $detail['course_name'],
                        'group_name' => $detail['group_name'],
                        'hours' => $detail['hours'],
                        'amount' => $detail['hours'] * $professor->hourly_rate,
                    ]);
                }

                $generatedCount++;
            }

            DB::commit();
            
            Log::info("✅ Terminé: {$generatedCount} créés, {$skippedCount} ignorés");
            
            return response()->json([
                'message' => "{$generatedCount} fiche(s) de paie générée(s)",
                'generated' => $generatedCount,
                'skipped' => $skippedCount,
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("❌ ERREUR: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['message' => 'Erreur: ' . $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id): JsonResponse
    {
        $payroll = Payroll::findOrFail($id);

        $validated = $request->validate([
            'bonus' => ['nullable', 'numeric', 'min:0'],
            'deductions' => ['nullable', 'numeric', 'min:0'],
        ]);

        $bonus = $validated['bonus'] ?? $payroll->bonus;
        $deductions = $validated['deductions'] ?? $payroll->deductions;
        $grossSalary = ($payroll->hours_worked * $payroll->hourly_rate) + $bonus;
        $netSalary = $grossSalary - $deductions;

        $payroll->update([
            'bonus' => $bonus,
            'deductions' => $deductions,
            'gross_salary' => $grossSalary,
            'net_salary' => $netSalary,
        ]);

        return response()->json(['data' => new PayrollResource($payroll->fresh(['professor.user', 'details']))]);
    }

    public function confirmPayment(PayrollPaymentRequest $request, $id): JsonResponse
    {
        $payroll = Payroll::findOrFail($id);

        $payroll->update([
            'payment_status' => 'payé',
            'payment_date' => $request->payment_date,
            'payment_reference' => $request->payment_reference,
            'payment_method' => $request->payment_method,
            'comment' => $request->comment,
        ]);

        return response()->json(['data' => new PayrollResource($payroll->fresh(['professor.user', 'details']))]);
    }

    public function confirmMultiplePayments(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:payrolls,id'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'in:virement,cheque,especes'],
        ]);

        $payrolls = Payroll::whereIn('id', $validated['ids'])->get();

        foreach ($payrolls as $payroll) {
            $payroll->update([
                'payment_status' => 'payé',
                'payment_date' => $validated['payment_date'],
                'payment_reference' => 'VIR-' . now()->format('Y-m') . '-' . str_pad($payroll->id, 3, '0', STR_PAD_LEFT),
                'payment_method' => $validated['payment_method'],
            ]);
        }

        return response()->json(['message' => count($validated['ids']) . ' paiements confirmés']);
    }

    public function history(Request $request): JsonResponse
    {
        $query = Payroll::with(['professor.user'])
            ->where('payment_status', 'payé')
            ->orderBy('payment_date', 'desc');

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        $payments = $query->get()->map(fn($p) => [
            'id' => $p->id,
            'month' => $this->getMonthName($p->month),
            'year' => $p->year,
            'professor_name' => $p->professor->user->first_name . ' ' . $p->professor->user->last_name,
            'amount' => (float) $p->net_salary,
            'payment_date' => $p->payment_date->format('Y-m-d'),
            'reference' => $p->payment_reference,
        ]);

        return response()->json(['data' => $payments]);
    }

    public function getDepartments(): JsonResponse
    {
        $departments = Professor::distinct()->pluck('department')->filter()->sort()->values();
        return response()->json(['data' => $departments]);
    }

    private function getMonthName(int $month): string
    {
        $months = [
            1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
            5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
            9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre'
        ];
        return $months[$month] ?? '';
    }
}