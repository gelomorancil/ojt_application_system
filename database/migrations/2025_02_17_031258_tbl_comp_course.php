<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_comp_course', function (Blueprint $table) {
            $table->id();
            $table->integer('Comp_ID');
            $table->string('Course');
            $table->integer('Capacity');
            $table->string('Mode', 20)->change();
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_comp_course');
    }
};
