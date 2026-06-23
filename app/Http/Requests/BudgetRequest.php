<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category'    => 'required|in:venue,catering,decoration,photo_video,dress,ring,others',
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:1',
            'date'        => 'required|date',
            'status'      => 'required|in:planned,spent',
            'receipt'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
