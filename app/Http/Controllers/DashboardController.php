<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\Student;
use App\Models\Course;
use App\Models\MoaProcess;

class DashboardController extends Controller
{

public function index()
{
    $totalCompanies = Company::count();
    $totalStudents = Student::count();
    $totalCourses = Course::count();
    $moaExpiry = MoaProcess::select('Expiry')->get(); // Get Expiry from MoaProcess
    // dd($moaExpiry);

    return Inertia::render('Dashboard', [
        'dashboardData' => [
            'totalCompanies' => $totalCompanies,
            'totalStudents' => $totalStudents,
            'totalCourses' => $totalCourses,
            'moaExpiry' => $moaExpiry, // Send MoaProcess expiry count
        ]
    ]);
}

}
