<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FiliereRequest;
use App\Http\Resources\Admin\FiliereResource;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FiliereController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Filiere::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $filieres = $query->orderBy('name')->get();

        return response()->json([
            'data' => FiliereResource::collection($filieres),
        ]);
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total_filieres' => Filiere::count(),
            'active_filieres' => Filiere::where('is_active', true)->count(),
        ];

        return response()->json($stats);
    }

    public function store(FiliereRequest $request): JsonResponse
    {
        $filiere = Filiere::create($request->validated());
        return response()->json(['data' => new FiliereResource($filiere)], 201);
    }

    public function show($id): JsonResponse
    {
        $filiere = Filiere::findOrFail($id);
        return response()->json(['data' => new FiliereResource($filiere)]);
    }

    public function update(FiliereRequest $request, $id): JsonResponse
    {
        $filiere = Filiere::findOrFail($id);
        $filiere->update($request->validated());
        return response()->json(['data' => new FiliereResource($filiere)]);
    }

    public function destroy($id): JsonResponse
    {
        $filiere = Filiere::findOrFail($id);
        $filiere->delete();
        return response()->json(null, 204);
    }
}