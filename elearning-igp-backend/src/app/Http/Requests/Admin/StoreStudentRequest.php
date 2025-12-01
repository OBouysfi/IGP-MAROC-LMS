<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|min:8',
            'gender' => 'nullable|in:Homme,Femme',
            'birth_date' => 'nullable|date|before:today',
            'nationality' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'enrolled_date' => 'nullable|date',
            'filiere_id' => 'nullable|exists:filieres,id',
            'program_id' => 'nullable|exists:programs,id',
            'level' => 'nullable|string|max:50',
            'group_ids' => 'nullable|array',
            'group_ids.*' => 'exists:groups,id',
            'inscription_amount' => 'nullable|numeric|min:0',
            'monthly_amount' => 'nullable|numeric|min:0',
        ];
    }
}