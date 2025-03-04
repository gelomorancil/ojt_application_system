<?php

namespace App\Http\Controllers;

use App\Models\CompCourse;
use App\Models\Company;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompCourseController extends Controller
{
    public function index()
    {
        $CompCourses = CompCourse::with('Company', 'Course')->get();
        return Inertia::render('CompCourse/Index', ["CompCourses"=>$CompCourses]);
    }

    public function create()
    {
        $companies = Company::all();
        $courses = Course::all();

        return inertia('CompCourse/Create', compact('companies', 'courses'));
    }


    public function store(Request $request)
    {
        $request->validate([
            'Comp_ID' => 'required|exists:tbl_company,id',
            'Course_ID' => 'required|exists:tbl_course,id',
            'Capacity' => 'required|integer|min:1',
            'Mode' => 'required|in:On-site,Blended,Work from Home',
        ]);

        CompCourse::create($request->all());

        return redirect()->route('compcourse.index')->with('success', 'Internship opportunity added successfully!');
    }
}
