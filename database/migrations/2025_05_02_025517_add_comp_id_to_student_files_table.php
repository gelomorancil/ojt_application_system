<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('tbl_student_files', function (Blueprint $table) {
        $table->unsignedBigInteger('Comp_ID')->nullable()->after('Student_Num');
        $table->foreign('Comp_ID')->references('id')->on('company')->onDelete('set null');
    });
}

public function down()
{
    Schema::table('tbl_student_files', function (Blueprint $table) {
        $table->dropForeign(['Comp_ID']);
        $table->dropColumn('Comp_ID');
    });
}

};
