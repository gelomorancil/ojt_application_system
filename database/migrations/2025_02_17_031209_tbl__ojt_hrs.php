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
        Schema::create('tbl_ojt_hrs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('Course_ID');
            $table->integer('Hrs');
            $table->enum('Sem', ['First', 'Second', 'Summer']);
            $table->string('Year');
            $table->timestamps();

            $table->foreign('Course_ID')->references('id')->on('tbl_course')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_ojt_hrs');
    }
};
