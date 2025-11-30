<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'group_id' => ['required', 'integer', 'exists:groups,id'],
            'professor_id' => ['required', 'integer', 'exists:users,id'],
            'type' => ['required', 'string', 'in:partiel,final,rattrapage,controle'],
            'date' => ['required', 'date'],
            'time' => ['required', 'string'],
            'duration' => ['required', 'string'],
            'room' => ['required', 'string', 'max:255'],
            'coefficient' => ['required', 'numeric', 'min:0.5', 'max:5'],
        ];
    }

    public function messages(): array
    {
        return [
            'course_id.required' => 'Le cours est obligatoire',
            'course_id.exists' => 'Le cours sélectionné n\'existe pas',
            'group_id.required' => 'Le groupe est obligatoire',
            'group_id.exists' => 'Le groupe sélectionné n\'existe pas',
            'professor_id.required' => 'Le professeur est obligatoire',
            'professor_id.exists' => 'Le professeur sélectionné n\'existe pas',
            'type.required' => 'Le type d\'examen est obligatoire',
            'type.in' => 'Le type d\'examen doit être: partiel, final, rattrapage ou controle',
            'date.required' => 'La date est obligatoire',
            'date.date' => 'La date est invalide',
            'time.required' => 'L\'heure est obligatoire',
            'duration.required' => 'La durée est obligatoire',
            'room.required' => 'La salle est obligatoire',
            'coefficient.required' => 'Le coefficient est obligatoire',
            'coefficient.numeric' => 'Le coefficient doit être un nombre',
            'coefficient.min' => 'Le coefficient minimum est 0.5',
            'coefficient.max' => 'Le coefficient maximum est 5',
        ];
    }
}