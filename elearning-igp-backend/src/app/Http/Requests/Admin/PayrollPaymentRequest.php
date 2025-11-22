<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PayrollPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_date' => ['required', 'date'],
            'payment_reference' => ['required', 'string', 'max:255'],
            'payment_method' => ['required', 'in:virement,cheque,especes'],
            'comment' => ['nullable', 'string'],
        ];
    }
}