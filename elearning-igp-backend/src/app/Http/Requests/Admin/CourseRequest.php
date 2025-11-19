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
            'program' => 'nullable|in:DEUG,Licence,Master',
            'level' => 'nullable|string|max:50',
            'filiere' => 'nullable|string|max:100',
            'professor_id' => 'nullable|exists:professors,id',
            'students_count' => 'nullable|integer|min:0',
            'max_students' => 'nullable|integer|min:1',
            'hours_total' => 'nullable|integer|min:0',
            'hours_completed' => 'nullable|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'schedule' => 'nullable|array',
            'schedule.*.day' => 'required|string',
            'schedule.*.time' => 'required|string',
            'schedule.*.room' => 'required|string',
            'status' => 'nullable|in:À venir,En cours,Terminé',
            'materials' => 'nullable|array',
            'materials.*' => 'string',
            'credits' => 'nullable|integer|min:0',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Le nom du cours est obligatoire.',
            'code.required' => 'Le code du cours est obligatoire.',
            'code.unique' => 'Ce code de cours existe déjà.',
            'program.in' => 'Le programme sélectionné n\'est pas valide.',
            'professor_id.exists' => 'Le professeur sélectionné n\'existe pas.',
            'max_students.min' => 'Le nombre maximum d\'étudiants doit être au moins 1.',
            'end_date.after_or_equal' => 'La date de fin doit être après la date de début.',
        ];
    }
}