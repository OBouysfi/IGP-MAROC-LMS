<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Professor;
use App\Models\User;
use App\Http\Requests\Admin\ProfessorRequest;
use App\Http\Resources\Admin\ProfessorResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ProfessorController extends Controller
{
    public function index(Request $request)
    {
        $query = Professor::with('user');

        if ($request->department) {
            $query->where('department', $request->department);
        }
        if ($request->contract_type) {
            $query->where('contract_type', $request->contract_type);
        }
        if ($request->status) {
            $isActive = $request->status === 'Actif';
            $query->whereHas('user', function($q) use ($isActive) {
                $q->where('is_active', $isActive);
            });
        }

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            })->orWhere('specialization', 'like', "%{$search}%");
        }

        $professors = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => ProfessorResource::collection($professors)
        ]);
    }

    public function stats()
    {
        $totalProfessors = Professor::count();
        $activeProfessors = Professor::whereHas('user', function($q) {
            $q->where('is_active', true);
        })->count();
        $inactiveProfessors = $totalProfessors - $activeProfessors;
        $newThisSemester = Professor::where('hire_date', '>=', now()->subMonths(6))->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_professors' => $totalProfessors,
                'active_professors' => $activeProfessors,
                'inactive_professors' => $inactiveProfessors,
                'new_this_semester' => $newThisSemester,
            ]
        ]);
    }

    public function show($id)
    {
        $professor = Professor::with('user')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new ProfessorResource($professor)
        ]);
    }

    public function store(ProfessorRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'is_active' => true,
            ]);

            $user->assignRole('professor');

            $professor = Professor::create([
                'user_id' => $user->id,
                'gender' => $request->gender,
                'birth_date' => $request->birth_date,
                'nationality' => $request->nationality,
                'address' => $request->address,
                'hire_date' => $request->hire_date ?? now(),
                'department' => $request->department,
                'specialization' => $request->specialization,
                'contract_type' => $request->contract_type ?? 'CDI',
                'hourly_rate' => $request->hourly_rate ?? 0,
                'total_hours_month' => $request->total_hours_month ?? 0,
                'qualifications' => $request->qualifications ?? [],
                'bio' => $request->bio,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Professeur créé avec succès',
                'data' => new ProfessorResource($professor->load('user'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du professeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(ProfessorRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            $professor = Professor::findOrFail($id);

            // Mettre à jour user
            if ($request->has(['first_name', 'last_name', 'email', 'phone'])) {
                $professor->user->update([
                    'first_name' => $request->first_name ?? $professor->user->first_name,
                    'last_name' => $request->last_name ?? $professor->user->last_name,
                    'email' => $request->email ?? $professor->user->email,
                    'phone' => $request->phone ?? $professor->user->phone,
                ]);
            }

            // Mettre à jour professor
            $professor->update($request->except(['first_name', 'last_name', 'email', 'phone', 'password']));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Professeur mis à jour avec succès',
                'data' => new ProfessorResource($professor->load('user'))
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du professeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $professor = Professor::findOrFail($id);
            $user = $professor->user;
            
            $professor->delete();
            $user->delete();

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Professeur supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du professeur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleActive($id)
    {
        try {
            $professor = Professor::findOrFail($id);
            
            $newStatus = $professor->user->is_active == 1 ? 0 : 1;
            
            DB::table('users')
                ->where('id', $professor->user_id)
                ->update(['is_active' => $newStatus]);
            
            return response()->json([
                'success' => true,
                'message' => $newStatus ? 'Professeur activé' : 'Professeur désactivé',
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }
}