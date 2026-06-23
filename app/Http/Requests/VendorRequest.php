<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:200',
            'category' => 'required|in:photography,decoration,catering,mua,mc,venue,others',
            'contact'  => 'required|string|max:50',
            'address'  => 'nullable|string',
            'notes'    => 'nullable|string',
            'rating'   => 'nullable|integer|min:1|max:5',
        ];
    }
}
