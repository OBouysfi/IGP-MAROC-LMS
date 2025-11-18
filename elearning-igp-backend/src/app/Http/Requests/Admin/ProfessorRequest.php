<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProfessorRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $professorId = $this->route('id');
        $userId = null;

        if ($professorId) {
            $professor = \App\Models\Professor::find($professorId);
            $userId = $professor ? $professor->user_id : null;
        }

        $rules = [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email' . ($userId ? ',' . $userId : ''),
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:Homme,Femme',
            'birth_date' => 'nullable|date|before:today',
            'nationality' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'hire_date' => 'nullable|date',
            'department' => 'nullable|string|max:100',
            'specialization' => 'nullable|string|max:255',
            'contract_type' => 'nullable|in:CDI,CDD,Vacataire',
            'hourly_rate' => 'nullable|numeric|min:0',
            'total_hours_month' => 'nullable|integer|min:0',
            'qualifications' => 'nullable|array',
            'qualifications.*' => 'string',
            'bio' => 'nullable|string',
        ];

        // ✅ Seulement pour la création
        if (!$professorId) {
            $rules['password'] = 'required|min:8';
        }

        return $rules;
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
            'contract_type.in' => 'Le type de contrat sélectionné n\'est pas valide.',
            'hourly_rate.numeric' => 'Le taux horaire doit être un nombre.',
            'hourly_rate.min' => 'Le taux horaire ne peut pas être négatif.',
            'total_hours_month.integer' => 'Les heures mensuelles doivent être un nombre entier.',
            'total_hours_month.min' => 'Les heures mensuelles ne peuvent pas être négatives.',
        ];
    }
}