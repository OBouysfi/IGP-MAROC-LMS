<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentDocumentRequest;
use App\Http\Requests\Admin\ValidateDocumentRequest;
use App\Http\Resources\Admin\StudentDocumentResource;
use App\Models\StudentDocument;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class StudentDocumentController extends Controller
{
    private $requiredDocuments = [
        'cin' => 'CIN ou Passeport',
        'photo' => 'Photo d\'identité',
        'diplome' => 'Diplôme ou Attestation de réussite',
        'releve' => 'Relevé de notes',
        'medical' => 'Certificat médical',
        'assurance' => 'Attestation d\'assurance',
        'domicile' => 'Justificatif de domicile',
        'cv' => 'CV',
    ];

    public function stats(): JsonResponse
    {
        // Total students
        $totalStudents = User::role('student')->count();
        
        // Students with all documents validated
        $completeCount = User::role('student')
            ->get()
            ->filter(function($user) {
                $validatedDocs = StudentDocument::where('student_id', $user->student->id ?? 0)
                    ->where('status', 'validé')
                    ->count();
                return $validatedDocs >= count($this->requiredDocuments);
            })
            ->count();
        
        // Pending documents
        $pendingCount = StudentDocument::where('status', 'en_attente')->count();
        
        // Incomplete dossiers
        $incompleteCount = $totalStudents - $completeCount;

        $stats = [
            'total_dossiers' => $totalStudents,
            'complete_dossiers' => $completeCount,
            'incomplete_dossiers' => $incompleteCount,
            'pending_validation' => $pendingCount,
        ];

        return response()->json($stats);
    }

    public function dossiers(Request $request): JsonResponse
    {
        $query = User::role('student')
            ->with(['student.groups', 'student.filiere', 'student.program']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('filiere')) {
            $query->whereHas('student', fn($q) => $q->where('filiere_id', $request->filiere));
        }

        if ($request->filled('program')) {
            $query->whereHas('student', fn($q) => $q->where('program_id', $request->program));
        }

        $students = $query->get()->map(function($user) {
            // ✅ Charger les VRAIS documents depuis la base de données
            $studentId = $user->student->id ?? null;
            
            if (!$studentId) {
                return null; // Skip si pas de profil étudiant
            }

            $documents = StudentDocument::where('student_id', $studentId)->get();
            
            // Créer les documents manquants (qui n'existent pas en base)
            $existingTypes = $documents->pluck('type')->toArray();
            $allDocuments = collect();
            
            foreach ($this->requiredDocuments as $type => $name) {
                $existingDoc = $documents->firstWhere('type', $type);
                
                if ($existingDoc) {
                    // Document existe en base
                    $allDocuments->push($existingDoc);
                } else {
                    // Document manquant
                    $allDocuments->push(new StudentDocument([
                        'id' => null,
                        'name' => $name,
                        'type' => $type,
                        'status' => 'manquant',
                        'uploaded_at' => null,
                        'validated_at' => null,
                        'comment' => null,
                    ]));
                }
            }

            $documentsRequired = count($this->requiredDocuments);
            $documentsProvided = $allDocuments->whereNotIn('status', ['manquant'])->count();
            $documentsValidated = $allDocuments->where('status', 'validé')->count();

            $dossierStatus = 'incomplet';
            if ($documentsValidated === $documentsRequired) {
                $dossierStatus = 'complet';
            } elseif ($allDocuments->where('status', 'en_attente')->count() > 0) {
                $dossierStatus = 'en_attente';
            }

            return [
                'id' => $user->id,
                'student_id' => $studentId, // ✅ ID de la table students
                'student_name' => $user->first_name . ' ' . $user->last_name,
                'student_email' => $user->email,
                'program' => $user->student?->program?->name ?? '-',
                'filiere' => $user->student?->filiere?->name ?? '-',
                'group' => $user->student?->groups?->first()?->name ?? '-',
                'dossier_status' => $dossierStatus,
                'documents_required' => $documentsRequired,
                'documents_provided' => $documentsProvided,
                'documents_validated' => $documentsValidated,
                'last_update' => $allDocuments->max('updated_at')?->format('Y-m-d') ?? $user->updated_at->format('Y-m-d'),
                'documents' => StudentDocumentResource::collection($allDocuments),
            ];
        })->filter(); // ✅ Enlever les null

        return response()->json(['data' => $students->values()]);
    }
    public function upload(StudentDocumentRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('documents', $filename, 'public');

        $document = StudentDocument::updateOrCreate(
            [
                'student_id' => $request->student_id,
                'type' => $request->type,
            ],
            [
                'name' => $request->name,
                'file_path' => $path,
                'status' => 'en_attente',
                'uploaded_at' => now(),
                'comment' => $request->comment,
            ]
        );

        return response()->json(['data' => new StudentDocumentResource($document)], 201);
    }

    public function validate(ValidateDocumentRequest $request, $id): JsonResponse
    {
        $document = StudentDocument::findOrFail($id);
        
        $data = [
            'status' => $request->status,
            'comment' => $request->comment,
        ];

        if ($request->status === 'validé') {
            $data['validated_at'] = now();
        }

        $document->update($data);

        return response()->json(['data' => new StudentDocumentResource($document)]);
    }

    public function destroy($id): JsonResponse
    {
        $document = StudentDocument::findOrFail($id);
        
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }
        
        $document->delete();
        
        return response()->json(null, 204);
    }

    public function download($id)
    {
        $document = StudentDocument::findOrFail($id);

        if (!$document->file_path) {
            return response()->json(['message' => 'Fichier non trouvé'], 404);
        }

        $path = Storage::disk('public')->path($document->file_path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'Fichier non trouvé'], 404);
        }

        $mime = mime_content_type($path); // <-- essentiel

        return response()->download(
            $path,
            $document->name . '.' . pathinfo($path, PATHINFO_EXTENSION), // filename propre
            ['Content-Type' => $mime] // <-- MIME correct
        );
    }



    public function getRequiredDocuments(): JsonResponse
    {
        return response()->json(['data' => $this->requiredDocuments]);
    }

}