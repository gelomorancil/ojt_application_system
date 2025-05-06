<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "name" => "Student User",
            "email" => "student@gmail.com",
            "role" => UserRole::Student,
            "password" => Hash::make("CA2120046"),
        ]);
    }
}
