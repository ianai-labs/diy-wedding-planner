<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name', 'category', 'price', 'contact', 'address', 'notes', 'rating',
])]
class Vendor extends Model
{
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'price' => 'decimal:2',
        ];
    }
}
