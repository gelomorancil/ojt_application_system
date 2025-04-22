<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('tbl_student_files', function (Blueprint $table) {
        $table->boolean('needs_letter_of_intent')->default(false);
    });
}

public function down()
{
    Schema::table('tbl_student_files', function (Blueprint $table) {
        $table->dropColumn('needs_letter_of_intent');
    });
}

};
