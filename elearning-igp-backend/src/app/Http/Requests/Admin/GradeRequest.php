<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'grades' => ['required', 'array'],
            'grades.*.student_id' => ['required', 'exists:users,id'],
            'grades.*.grade' => ['required', 'numeric', 'min:0', 'max:20'],
            'grades.*.status' => ['sometimes', 'in:validé,rattrapage,absent'],
            'grades.*.comment' => ['nullable', 'string'],
        ];
    }
}