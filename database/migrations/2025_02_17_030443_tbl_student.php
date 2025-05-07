<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('Course_ID')->nullable();  // Make the Course_ID nullable
            $table->enum('role', ['user', 'student'])->default('user');
            $table->string('Fname');
            $table->string('Lname');
            $table->string('Student_Num')->unique();
            $table->string('Year');
            $table->timestamp('Read')->nullable();
            $table->string('Remarks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_student');
    }
};
