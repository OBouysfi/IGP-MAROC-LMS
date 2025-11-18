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
            'filiere' => 'nullable|string|max:100',
            'program' => 'nullable|in:DEUG,Licence,Master',
            'level' => 'nullable|string|max:50',
            'group' => 'nullable|string|max:50',
            'inscription_amount' => 'nullable|numeric|min:0',
            'monthly_amount' => 'nullable|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email doit être valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'phone.max' => 'Le téléphone ne peut pas dépasser 20 caractères.',
            'birth_date.date' => 'La date de naissance doit être une date valide.',
            'birth_date.before' => 'La date de naissance doit être dans le passé.',
            'gender.in' => 'Le sexe doit être Homme ou Femme.',
            'program.in' => 'Le programme sélectionné n\'est pas valide.',
            'inscription_amount.numeric' => 'Le montant d\'inscription doit être un nombre.',
            'inscription_amount.min' => 'Le montant d\'inscription ne peut pas être négatif.',
            'monthly_amount.numeric' => 'Le montant mensuel doit être un nombre.',
            'monthly_amount.min' => 'Le montant mensuel ne peut pas être négatif.',
        ];
    }
}