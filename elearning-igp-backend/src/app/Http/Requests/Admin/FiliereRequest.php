<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FiliereRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $filiereId = $this->route('id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('filieres')->ignore($filiereId)],
            'description' => ['nullable', 'string'],
            'program_ids' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}