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
        $totalStudents = User::where('role', 'student')->count();
        
        // Étudiants avec dossier complet (tous documents validés)
        $completeCount = User::where('role', 'student')
            ->whereHas('documents', function($q) {
                $q->where('status', 'validé');
            }, '=', count($this->requiredDocuments))
            ->count();
        
        // Documents en attente
        $pendingCount = StudentDocument::where('status', 'en_attente')->count();
        
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
        $query = User::where('role', 'student')
            ->with(['group', 'documents']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('group', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('status')) {
            // Filtrer par statut de dossier
        }

        if ($request->filled('filiere')) {
            $query->whereHas('group', fn($q) => $q->where('filiere', $request->filiere));
        }

        if ($request->filled('program')) {
            $query->whereHas('group', fn($q) => $q->where('program', $request->program));
        }

        $students = $query->get()->map(function($student) {
            $documents = $student->documents;
            
            // Créer les documents manquants
            $existingTypes = $documents->pluck('type')->toArray();
            foreach ($this->requiredDocuments as $type => $name) {
                if (!in_array($type, $existingTypes)) {
                    $documents->push(new StudentDocument([
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
            $documentsProvided = $documents->whereNotIn('status', ['manquant'])->count();
            $documentsValidated = $documents->where('status', 'validé')->count();

            // Déterminer le statut du dossier
            $dossierStatus = 'incomplet';
            if ($documentsValidated === $documentsRequired) {
                $dossierStatus = 'complet';
            } elseif ($documents->where('status', 'en_attente')->count() > 0) {
                $dossierStatus = 'en_attente';
            }

            return [
                'id' => $student->id,
                'student_name' => $student->name,
                'student_email' => $student->email,
                'program' => $student->group->program ?? '-',
                'filiere' => $student->group->filiere ?? '-',
                'group' => $student->group->name ?? '-',
                'dossier_status' => $dossierStatus,
                'documents_required' => $documentsRequired,
                'documents_provided' => $documentsProvided,
                'documents_validated' => $documentsValidated,
                'last_update' => $student->documents->max('updated_at')?->format('Y-m-d') ?? $student->updated_at->format('Y-m-d'),
                'documents' => StudentDocumentResource::collection($documents),
            ];
        });

        return response()->json(['data' => $students]);
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

    public function download($id): JsonResponse
    {
        $document = StudentDocument::findOrFail($id);
        
        if (!$document->file_path) {
            return response()->json(['message' => 'Fichier non trouvé'], 404);
        }

        $path = Storage::disk('public')->path($document->file_path);
        
        if (!file_exists($path)) {
            return response()->json(['message' => 'Fichier non trouvé'], 404);
        }

        return response()->download($path);
    }

    public function getRequiredDocuments(): JsonResponse
    {
        return response()->json(['data' => $this->requiredDocuments]);
    }
}