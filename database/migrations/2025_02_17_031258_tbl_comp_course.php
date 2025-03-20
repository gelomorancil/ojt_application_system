<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('tbl_comp_course', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('Comp_ID'); // Foreign key to tbl_company
            $table->json('Course_id')->nullable(); // ✅ Changed to JSON
            $table->integer('Capacity')->nullable();
            $table->string('mode', 50)->nullable(); // On-site, Blended, Work from Home
            $table->string('name'); // Contact Person's Full Name
            $table->string('position');  // Contact Person's Position
            $table->string('email')->unique();
            $table->string('contact_number', 20);
            $table->timestamps();

            // Foreign Key Constraints (Uncomment if needed)
            // $table->foreign('Comp_ID')->references('id')->on('tbl_company')->onDelete('cascade');
        });
    }

    public function down() {
        Schema::dropIfExists('tbl_comp_course');
    }
};
