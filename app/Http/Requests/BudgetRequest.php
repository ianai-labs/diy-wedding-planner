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
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'category'    => $isUpdate ? 'sometimes|in:venue,catering,decoration,photo_video,dress,ring,others' : 'required|in:venue,catering,decoration,photo_video,dress,ring,others',
            'description' => $isUpdate ? 'sometimes|string|max:255' : 'required|string|max:255',
            'amount'      => $isUpdate ? 'sometimes|numeric|min:1' : 'required|numeric|min:1',
            'date'        => $isUpdate ? 'sometimes|date' : 'required|date',
            'status'      => $isUpdate ? 'sometimes|in:planned,spent' : 'required|in:planned,spent',
            'receipt'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
