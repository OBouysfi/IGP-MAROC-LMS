<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'group_id' => ['required', 'exists:groups,id'],
            'professor_id' => ['nullable', 'exists:professors,id'],
            'room' => ['required', 'string', 'max:100'],
            'day' => ['required', 'in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi,Dimanche'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'type' => ['required', 'in:cours,td,tp,examen'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_recurring' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }
}