<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->has('studentId') && !$this->has('student_id')) {
            $this->merge(['student_id' => $this->studentId]);
        }
        
        if ($this->has('professorId') && !$this->has('professor_id')) {
            $this->merge(['professor_id' => $this->professorId]);
        }
        
        if ($this->has('scheduleId') && !$this->has('schedule_id')) {
            $this->merge(['schedule_id' => $this->scheduleId]);
        }

        if ($this->has('courseName') && !$this->has('course_name')) {
            $this->merge(['course_name' => $this->courseName]);
        }

        if ($this->has('startTime') && !$this->has('start_time')) {
            $this->merge(['start_time' => $this->startTime]);
        }

        if ($this->has('endTime') && !$this->has('end_time')) {
            $this->merge(['end_time' => $this->endTime]);
        }
    }

    public function rules(): array
    {
        return [
            'student_id' => ['nullable', 'integer', 'exists:students,id'],
            'professor_id' => ['nullable', 'integer', 'exists:professors,id'],
            'schedule_id' => ['nullable', 'integer', 'exists:schedules,id'],
            'course_name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'type' => ['required', 'in:absent,retard,justifié'],
            'justification' => ['nullable', 'string'],
            'justification_file' => ['nullable', 'string', 'max:255'],
            'justified_at' => ['nullable', 'date'],
            'comment' => ['nullable', 'string'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (!$this->student_id && !$this->professor_id) {
                $validator->errors()->add('student_id', 'Étudiant ou professeur requis.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'student_id.exists' => 'L\'étudiant sélectionné n\'existe pas.',
            'professor_id.exists' => 'Le professeur sélectionné n\'existe pas.',
            'course_name.required' => 'Le nom du cours est requis.',
            'date.required' => 'La date est requise.',
            'start_time.required' => 'L\'heure de début est requise.',
            'end_time.required' => 'L\'heure de fin est requise.',
            'end_time.after' => 'L\'heure de fin doit être après l\'heure de début.',
            'type.required' => 'Le type d\'absence est requis.',
            'type.in' => 'Le type doit être: absent, retard ou justifié.',
        ];
    }
}