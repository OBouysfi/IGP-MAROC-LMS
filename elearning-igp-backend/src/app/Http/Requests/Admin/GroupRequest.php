<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Récupérer l'ID depuis l'URL
        $groupId = $this->route('id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('groups')->ignore($groupId)],
            'program' => ['required', 'string', 'max:100'],
            'level' => ['required', 'string', 'max:100'],
            'filiere' => ['required', 'string', 'max:100'],
            'max_students' => ['required', 'integer', 'min:1'],
            'delegate' => ['nullable', 'string', 'max:255'],
            'delegate_email' => ['nullable', 'email', 'max:255'],
            'student_ids' => ['sometimes', 'array'],
            'student_ids.*' => ['integer', 'exists:users,id'],
            'course_ids' => ['sometimes', 'array'],
            'course_ids.*' => ['integer', 'exists:courses,id'],
            'schedule' => ['nullable', 'array'],
            'schedule.*.day' => ['string'],
            'schedule.*.time' => ['string'],
            'schedule.*.course' => ['string'],
            'schedule.*.room' => ['string'],
        ];
    }
}