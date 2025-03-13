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
        Schema::create('tbl_moa_process', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('Comp_ID'); // Foreign key to tbl_company
            $table->date('For_Review')->nullable();
            $table->date('For_Coordinator')->nullable();
            $table->date('For_VCAA')->nullable();
            $table->date('For_Company')->nullable();
            $table->date('For_Notarization')->nullable();
            $table->date('Expiry')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_moa_process');
    }
};
