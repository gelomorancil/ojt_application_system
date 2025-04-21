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
        Schema::create('tbl_moa', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('Comp_ID');
            $table->string('File_name');
            $table->string('File_type');
            $table->string('File');
            $table->date('Start');
            $table->date('End');
            $table->string('uploaded_by');
            $table->timestamps();

            $table->foreign('Comp_ID')->references('id')->on('tbl_company')->onDelete('cascade');
            // $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_moa');
    }
};
