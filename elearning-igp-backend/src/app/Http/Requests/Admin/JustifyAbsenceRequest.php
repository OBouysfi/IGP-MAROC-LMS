<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class JustifyAbsenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'justification' => ['required', 'string', 'min:10'],
            'justification_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'justification.required' => 'La justification est requise.',
            'justification.min' => 'La justification doit contenir au moins 10 caractères.',
            'justification_file.mimes' => 'Le fichier doit être au format PDF, JPG, JPEG ou PNG.',
            'justification_file.max' => 'Le fichier ne doit pas dépasser 5 Mo.',
        ];
    }
}