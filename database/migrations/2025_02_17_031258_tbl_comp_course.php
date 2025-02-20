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
            $table->unsignedBigInteger('Course_ID');
            $table->string('Course');
            $table->integer('Capacity');
            $table->enum('Mode', ['On-site', 'Blended', 'Work from Home']);
            $table->timestamps();

            // $table->foreign('Comp_ID')->references('id')->on('tbl_company')->onDelete('cascade');
            // $table->foreign('Course_ID')->references('id')->on('tbl_course')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_comp_course');
    }
};
