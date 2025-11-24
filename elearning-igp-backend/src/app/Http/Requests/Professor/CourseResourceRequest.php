<?php

namespace App\Http\Requests\Professor;

use Illuminate\Foundation\Http\FormRequest;

class CourseResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:pdf,video,document,link'],
            'file' => ['required_if:type,pdf,video,document', 'file', 'max:102400'], // 100MB
            'url' => ['required_if:type,link', 'url'],
            'description' => ['nullable', 'string'],
        ];
    }
}