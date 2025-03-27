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

        // Count only MOA Processes where expiry is not null
        $expiryCount = MoaProcess::whereNotNull('Expiry')->count();

        return Inertia::render('Dashboard', [
            'dashboardData' => [
                'totalCompanies' => $totalCompanies,
                'totalStudents' => $totalStudents,
                'totalCourses' => $totalCourses,
                'expiryCount' => $expiryCount, // Only count where expiry is set
            ]
        ]);
    }

}
