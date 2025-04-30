<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDateRangeToStudentFilesTable extends Migration
{
    public function up()
    {
        Schema::table('tbl_student_files', function (Blueprint $table) {
            $table->date('from_date')->nullable()->after('file_name'); // adjust the position as needed
            $table->date('to_date')->nullable()->after('from_date');
        });
    }

    public function down()
    {
        Schema::table('tbl_student_files', function (Blueprint $table) {
            $table->dropColumn(['from_date', 'to_date']);
        });
    }
}
