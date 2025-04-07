<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentCompanyController;
use App\Http\Controllers\MoaController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompCourseController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MoaProcessController;
use App\Http\Controllers\StudentUploadingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

//Dashboard Routes
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Student Routing
Route::get('/student', [StudentController::class, 'index'])
    ->middleware(['auth'])
    ->name('student');

// Show Create Student Form (GET)
Route::get('/student/create', function () {
    return Inertia::render('Student/Partials/Create_Student');
})->middleware(['auth'])->name('student.create');

// CRUD Routes (Protected by Auth Middleware)
Route::middleware('auth')->group(function () {
    Route::post('/student', [StudentController::class, 'store'])->name('student.store');
    Route::get('/student/{id}', [StudentController::class, 'show'])->name('student.show');
    Route::get('/student/{id}/edit', [StudentController::class, 'edit'])->name('student.edit');
    Route::put('/student/{id}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('/student/{id}', [StudentController::class, 'destroy'])->name('student.destroy');
});

// Student Management
Route::post('/save-student-company', [StudentCompanyController::class, 'saveStudentCompany']);

// Moa Routing
Route::middleware('auth')->group(function () {
    Route::get('/moa', [MoaController::class, 'index'])->name('moa');
    Route::get('/moa/create', function () {
        return Inertia::render('Moa/Partials/Create_Moa');
    })->name('moa.create');

    Route::post('/moa', [MoaController::class, 'store'])->name('moa.store');
    Route::get('/moa/{id}', [MoaController::class, 'show'])->name('moa.show');
    // Route::get('/moa/{id}/edit', [MoaController::class, 'edit'])->name('moa.edit');
    Route::patch('/moa/{id}', [MoaController::class, 'update'])->name('moa.update');
    Route::delete('/moa/{id}', [MoaController::class, 'destroy'])->name('moa.destroy');
    Route::get('/moa/download/{file_name}/{file_type}', [MoaController::class, 'download'])->name('moa.download');
    Route::get('/moa/preview/{file_name}', [MoaController::class, 'preview'])
    ->where('file_name', '.*') // Allows handling filenames with spaces or special characters
    ->name('moa.preview');
});

Route::middleware('auth')->group(function () {
    Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
    Route::get('/companies/{id}/edit', [CompanyController::class, 'edit'])->name('companies.edit');
    Route::put('/companies/{id}', [CompanyController::class, 'update'])->name('companies.update');
    Route::delete('/companies/delete/{id}', [CompanyController::class, 'destroy'])->name('companies.destroy');
    Route::get('/companies/{id}/profile', [CompanyController::class, 'profile'])->name('companies.profile');


    // COMPANY PROFILE
    Route::get('/companies/{id}/profile',[CompanyController::class, 'details']);
});


// Route for displaying the courses page
 Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/courses', [CourseController::class, 'index'])->name('course.index');
    Route::get('/courses/create', [CourseController::class, 'create'])->name('course.create');
    Route::post('/courses', [CourseController::class, 'store'])->name('course.store');
    Route::get('/courses/edit/{id}', [CourseController::class, 'edit'])->name('course.edit');
    Route::put('/courses/{id}', [CourseController::class, 'update'])->name('course.update');
    Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->name('course.destroy');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/company/{id}/contacts', [CompanyController::class, 'showContacts'])->name('company.contacts');
    Route::post('/contacts', [ContactController::class, 'store'])->name('contact.store');
    Route::put('/contacts/{id}', [ContactController::class, 'update'])->name('contact.update');
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy'])->name('contact.destroy');
});

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/compcourse', [ContactController::class, 'index'])->name('compcourse.index');
//     Route::post('/compcourse/store', [ContactController::class, 'store'])->name('compcourse.store');
//     Route::put('/compcourse/{id}', [ContactController::class, 'update'])->name('compcourse.update');
//     Route::delete('/compcourse/{id}', [ContactController::class, 'destroy'])->name('compcourse.destroy');
// });

Route::middleware('auth')->group(function () {
    Route::get('/moaprocess', [MoaProcessController::class, 'index'])->name('moaprocess.index');
    // Route::get('/moaprocess/create', [MoaProcessController::class, 'create'])->name('moaprocess.create');
    Route::post('/moaprocess', [MoaProcessController::class, 'store'])->name('moaprocess.store');
    Route::get('/moaprocess/{moaprocess}/edit', [MoaProcessController::class, 'edit'])->name('moaprocess.edit');
    Route::put('/moaProcess/{moaprocess}', [MoaProcessController::class, 'update'])->name('moaProcess.update');

    Route::delete('/moa-process/{id}', [MoaProcessController::class, 'destroy'])->name('moaProcess.destroy');
    Route::get('/company/{id}', [MoaProcessController::class, 'showCompany'])->name('company.show');

//Student Uploading Routing
Route::middleware('auth')->group(function () {
    Route::get('/studentuploading', [StudentUploadingController::class, 'index'])->name('studentuploading.index');
});

Route::get('/upload-students', [StudentUploadingController::class, 'index']);
Route::post('/upload-students', [StudentUploadingController::class, 'upload'])->name('upload.students');
Route::get('/students-list', [StudentUploadingController::class, 'getStudentsList']);

// Main page route
Route::get('/student-uploading', [StudentUploadingController::class, 'index'])->name('student.uploading');

// API routes for data fetching
Route::get('/api/get-courses', [StudentUploadingController::class, 'getCourses']);
Route::get('/api/get-school-years', [StudentUploadingController::class, 'getSchoolYears']);
Route::get('/api/get-semesters', [StudentUploadingController::class, 'getSemesters']);

// Route for form submission
Route::post('/upload-students', [StudentUploadingController::class, 'upload'])->name('upload.students');

});

require __DIR__.'/auth.php';