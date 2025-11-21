<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attendable_type' => ['required', 'in:App\Models\User,App\Models\Professor'],
            'attendable_id' => ['required', 'integer'],
            'schedule_id' => ['nullable', 'exists:schedules,id'],
            'course_name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'type' => ['required', 'in:absent,retard,justifié'],
            'comment' => ['nullable', 'string'],
        ];
    }
}