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
        Schema::create('tbl_student_files', function (Blueprint $table) {
            $table->id();
            $table->string('Student_Num');
            $table->string('file_name');
            $table->string('category'); // 'Pre-Deployment', 'Deployment', etc.
            $table->timestamps(); // includes 'created_at' for upload date
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_student_files', function (Blueprint $table) {
            $table->dropForeign(['Student_Num']);
        });

        Schema::dropIfExists('tbl_student_files');
    }
};
