<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $programId = $this->route('id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('programs')->ignore($programId)],
            'description' => ['nullable', 'string'],
            'duration_years' => ['required', 'integer', 'min:1', 'max:10'],
            'levels' => ['nullable', 'array'],
            'inscription_fee' => ['required', 'numeric', 'min:0'],
            'monthly_fee' => ['required', 'numeric', 'min:0'],
            'requirements' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}