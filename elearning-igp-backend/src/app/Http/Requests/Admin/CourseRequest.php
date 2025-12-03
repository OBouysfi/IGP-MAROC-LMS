<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $courseId = $this->route('id');

        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code' . ($courseId ? ',' . $courseId : ''),
            'description' => 'nullable|string',
            'program_id' => 'nullable|exists:programs,id',
            'level' => 'nullable|string|max:50',
            'filiere_id' => 'nullable|exists:filieres,id',
            'professor_id' => 'nullable|exists:professors,id',
            'group_id' => 'required|exists:groups,id',
            'students_count' => 'nullable|integer|min:0',
            'max_students' => 'nullable|integer|min:1',
            'hours_total' => 'nullable|integer|min:0',
            'hours_completed' => 'nullable|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'schedule' => 'nullable|array', // ← CHANGÉ ICI
            'status' => 'nullable|in:À venir,En cours,Terminé',
            'materials' => 'nullable|array', // ← CHANGÉ ICI
            'credits' => 'nullable|integer|min:0',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Le nom du cours est obligatoire.',
            'code.required' => 'Le code du cours est obligatoire.',
            'code.unique' => 'Ce code de cours existe déjà.',
            'professor_id.exists' => 'Le professeur sélectionné n\'existe pas.',
            'group_id.required' => 'Le groupe est obligatoire.',
            'group_id.exists' => 'Le groupe sélectionné n\'existe pas.',
            'program_id.exists' => 'Le programme sélectionné n\'existe pas.',
            'filiere_id.exists' => 'La filière sélectionnée n\'existe pas.',
            'max_students.min' => 'Le nombre maximum d\'étudiants doit être au moins 1.',
            'end_date.after_or_equal' => 'La date de fin doit être après la date de début.',
        ];
    }
}