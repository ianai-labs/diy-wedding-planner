<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@demo.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // 20 demo users
        $partnerNames = ['Sarah', 'Dinda', 'Rina', 'Maya', 'Putri', 'Nadia', 'Sinta', 'Dewi', 'Alya', 'Bunga',
                         'Citra', 'Luna', 'Karin', 'Tari', 'Vina', 'Wulan', 'Yuki', 'Zara', 'Amel', 'Bella'];
        $budgets = [50000000, 75000000, 100000000, 120000000, 150000000, 85000000, 60000000, 200000000, 90000000, 110000000,
                     130000000, 45000000, 70000000, 160000000, 95000000, 55000000, 140000000, 80000000, 105000000, 175000000];

        for ($i = 1; $i <= 20; $i++) {
            $month = rand(1, 12);
            $day = rand(1, 28);
            $year = $month >= 6 ? 2026 : 2027;

            User::create([
                'name'         => "Demo User $i",
                'email'        => "user{$i}@demo.com",
                'password'     => Hash::make('password'),
                'partner_name' => $partnerNames[$i - 1],
                'wedding_date' => "{$year}-" . str_pad($month, 2, '0', STR_PAD_LEFT) . '-' . str_pad($day, 2, '0', STR_PAD_LEFT),
                'total_budget' => $budgets[$i - 1],
                'role'         => 'user',
            ]);
        }
    }
}
