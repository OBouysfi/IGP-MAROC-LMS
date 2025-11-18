<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $studentId = $this->route('student');
        $student = \App\Models\Student::findOrFail($studentId);
        
        return [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $student->user_id,
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:Homme,Femme',
            'birth_date' => 'nullable|date|before:today',
            'nationality' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:500',
            'filiere' => 'nullable|string|max:100',
            'program' => 'nullable|in:DEUG,Licence,Master',
            'level' => 'nullable|string|max:50',
            'group' => 'nullable|string|max:50',
            'inscription_amount' => 'nullable|numeric|min:0',
            'monthly_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:À jour,En retard,Suspendu',
            'dossier_status' => 'nullable|in:Complet,Incomplet',
            'admin_comments' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'first_name.string' => 'Le prénom doit être du texte.',
            'last_name.string' => 'Le nom doit être du texte.',
            'email.email' => 'L\'email doit être valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'phone.max' => 'Le téléphone ne peut pas dépasser 20 caractères.',
            'birth_date.date' => 'La date de naissance doit être une date valide.',
            'birth_date.before' => 'La date de naissance doit être dans le passé.',
            'gender.in' => 'Le sexe doit être Homme ou Femme.',
            'program.in' => 'Le programme sélectionné n\'est pas valide.',
            'inscription_amount.numeric' => 'Le montant d\'inscription doit être un nombre.',
            'monthly_amount.numeric' => 'Le montant mensuel doit être un nombre.',
            'payment_status.in' => 'Le statut de paiement n\'est pas valide.',
            'dossier_status.in' => 'Le statut du dossier n\'est pas valide.',
        ];
    }
}