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
        Schema::table('tbl_comp_course', function (Blueprint $table) {
            $table->string('email')->after('Comp_ID'); 
            $table->string('Position')->after('email'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_comp_course', function (Blueprint $table) {
            $table->dropColumn(['email', 'Position']); // Remove columns if rollback
        });
    }
};
