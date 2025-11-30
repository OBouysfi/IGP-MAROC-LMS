<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Http\Requests\Admin\StoreStudentRequest;
use App\Http\Requests\Admin\UpdateStudentRequest;
use App\Http\Resources\Admin\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with('user');

        // Filtres
        if ($request->filiere) {
            $query->where('filiere', $request->filiere);
        }
        if ($request->nationality) {
            $query->where('nationality', $request->nationality);
        }
        if ($request->program) {
            $query->where('program', $request->program);
        }
        if ($request->status) {
            $isActive = $request->status === 'Actif';
            $query->whereHas('user', function($q) use ($isActive) {
                $q->where('is_active', $isActive);
            });
        }

        // Recherche
        if ($request->search) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $students = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => StudentResource::collection($students)
        ]);
    }

    public function stats()
    {
        $totalStudents = Student::count();
        $activeStudents = Student::whereHas('user', function($q) {
            $q->where('is_active', true);
        })->count();
        $inactiveStudents = $totalStudents - $activeStudents;
        $newThisMonth = Student::whereMonth('created_at', now()->month)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_students' => $totalStudents,
                'active_students' => $activeStudents,
                'inactive_students' => $inactiveStudents,
                'new_this_month' => $newThisMonth,
            ]
        ]);
    }

    public function show($id)
    {
        $student = Student::with('user')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new StudentResource($student)
        ]);
    }

    public function store(StoreStudentRequest $request)
    {
        try {
            DB::beginTransaction();

            // Créer l'utilisateur
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'is_active' => true,
            ]);

            // Assigner le rôle student
            $user->assignRole('student');

            // Créer le profil étudiant
            $student = Student::create([
                'user_id' => $user->id,
                'gender' => $request->gender,
                'birth_date' => $request->birth_date,
                'nationality' => $request->nationality,
                'address' => $request->address,
                'enrolled_date' => $request->enrolled_date ?? now(),
                'filiere' => $request->filiere,
                'program' => $request->program,
                'level' => $request->level,
                'group' => $request->group,
                'inscription_amount' => $request->inscription_amount ?? 0,
                'monthly_amount' => $request->monthly_amount ?? 0,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Étudiant créé avec succès',
                'data' => new StudentResource($student->load('user'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'étudiant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            \Log::info("Update student ID: " . $id);
            
            $student = Student::findOrFail($id);
            \Log::info("Student trouvé: " . $student->id);
            
            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $student->user_id,
                'phone' => 'nullable|string|max:20',
                'gender' => 'nullable|in:Homme,Femme',
                'birth_date' => 'nullable|date',
                'nationality' => 'nullable|string',
                'address' => 'nullable|string',
                'filiere' => 'nullable|string',
                'program' => 'nullable|in:DEES,Bachelor,Master',
                'level' => 'nullable|string',
                'group' => 'nullable|string',
                'inscription_amount' => 'nullable|numeric',
                'monthly_amount' => 'nullable|numeric',
            ], [
                'email.unique' => 'Cet email est déjà utilisé.',
                'program.in' => 'Le programme sélectionné n\'est pas valide.',
            ]);

            // Mettre à jour user
            if (isset($validated['first_name']) || isset($validated['last_name']) || 
                isset($validated['email']) || isset($validated['phone'])) {
                
                $student->user->update([
                    'first_name' => $validated['first_name'] ?? $student->user->first_name,
                    'last_name' => $validated['last_name'] ?? $student->user->last_name,
                    'email' => $validated['email'] ?? $student->user->email,
                    'phone' => $validated['phone'] ?? $student->user->phone,
                ]);
            }

            // Mettre à jour student
            $studentData = array_diff_key($validated, array_flip(['first_name', 'last_name', 'email', 'phone']));
            $student->update($studentData);

            return response()->json([
                'success' => true,
                'message' => 'Étudiant mis à jour avec succès',
                'data' => $student->load('user')
            ]);

        } catch (\Exception $e) {
            \Log::error("Erreur update: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $student = Student::findOrFail($id);
            $user = $student->user;
            
            $student->delete();
            $user->delete();

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Étudiant supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'étudiant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleActive($id)
    {
        $student = Student::findOrFail($id);
        $user = $student->user;
        
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'Étudiant activé avec succès' : 'Étudiant désactivé avec succès',
        ]);
    }
}