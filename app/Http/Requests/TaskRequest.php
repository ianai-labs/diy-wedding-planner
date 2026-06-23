<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:200',
            'category'    => 'required|in:H-365,H-180,H-90,H-30,H-7',
            'description' => 'nullable|string',
            'deadline'    => 'nullable|date',
            'status'      => 'required|in:pending,progress,completed',
            'priority'    => 'required|in:low,medium,high',
        ];
    }
}
