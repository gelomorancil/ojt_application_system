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
        Schema::create('tbl_student_apply', function (Blueprint $table) {
            $table->id();
            $table->integer('Comp_ID');
            $table->integer('Student_ID');
            $table->integer('Capacity');
            $table->string('AY');
            $table->string('Sem');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_student_apply');
    }
};
