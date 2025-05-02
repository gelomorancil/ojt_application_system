<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentCompanyController;
use App\Http\Controllers\MoaController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MoaProcessController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentUploadingController;
use App\Http\Controllers\StudentFileController;
use App\Http\Controllers\FormsController;
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
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

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
    Route::post('/student/batch-delete', [StudentController::class, 'batchDelete'])->name('student.batch-delete');
});

//Student Management
Route::middleware(['auth'])->group(function () {
    Route::get('/student-companies', [StudentCompanyController::class, 'index'])->name('student_comp.index');
    Route::post('/student-companies', [StudentCompanyController::class, 'store'])->name('student_comp.store');
    Route::put('/student-companies/{studentCompany}', [StudentCompanyController::class, 'update'])->name('student_comp.update');
    Route::delete('/student-companies/{studentCompany}', [StudentCompanyController::class, 'destroy'])->name('student_comp.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
    Route::get('/companies/{id}/edit', [CompanyController::class, 'edit'])->name('companies.edit');
    Route::put('/companies/{id}', [CompanyController::class, 'update'])->name('companies.update');
    Route::delete('/companies/delete/{id}', [CompanyController::class, 'destroy'])->name('companies.destroy');
    Route::get('/companies/{id}/profile', [CompanyController::class, 'profile'])->name('companies.profile');
    Route::get('/companies/{companyId}/interns', [StudentCompanyController::class, 'getInternsByCompany']);

    // COMPANY PROFILE
    Route::get('/companies/{id}/profile',[CompanyController::class, 'details']);
    // MOA STORE FUNCTION
    Route::post('/moa', [MoaController::class, 'store'])->name('moa.store');
    // MOA DELETE FUNCTION
    Route::delete('/moa/{id}', [MoaController::class, 'destroy'])->name('moa.destroy');
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


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/compcourse', [ContactController::class, 'index'])->name('compcourse.index');
    // Route::get('/compcourse/create', [ContactController::class, 'create'])->name('compcourse.create');
    Route::post('/compcourse/store', [ContactController::class, 'store'])->name('compcourse.store');
    // Route::put('/compcourse/update', [ContactController::class, 'update'])->name('compcourse.update');
    Route::put('/compcourse/{id}', [ContactController::class, 'update'])->name('compcourse.update');
    Route::delete('/compcourse/{id}', [ContactController::class, 'destroy'])->name('compcourse.destroy');

});

Route::middleware('auth')->group(function () {
    Route::get('/moaprocess', [MoaProcessController::class, 'index'])->name('moaprocess.index');
    Route::post('/moaprocess', [MoaProcessController::class, 'store'])->name('moaprocess.store');
    Route::get('/moaprocess/{moaprocess}/edit', [MoaProcessController::class, 'edit'])->name('moaprocess.edit');
    Route::put('/moaProcess/{moaprocess}', [MoaProcessController::class, 'update'])->name('moaProcess.update');
    Route::get('/company/{id}', [MoaProcessController::class, 'showCompany'])->name('company.show');
    Route::get('/moa/download/{filename}', [MoaController::class, 'download'])->name('moa.download');


//Student Uploading Routing
Route::middleware('auth')->group(function () {
    Route::get('/studentuploading', [StudentUploadingController::class, 'index'])->name('studentuploading.index');
});

Route::get('/upload-students', [StudentUploadingController::class, 'index']);
Route::post('/upload-students', [StudentUploadingController::class, 'upload'])->name('upload.students');
Route::get('/students-list', [StudentUploadingController::class, 'getStudentsList']);

// Main page route
Route::get('/student-uploading', [StudentUploadingController::class, 'index'])->name('student.uploading');

// Routes for course and semester data fetching
Route::get('/get-courses', [StudentUploadingController::class, 'getCourses'])->name('get-courses');
Route::get('/get-semesters', [StudentUploadingController::class, 'getSemesters'])->name('get-semesters');

// Route for form submission
Route::post('/upload-students', [StudentUploadingController::class, 'upload'])->name('upload.students');

Route::post('/student-files', [StudentFileController::class, 'store'])->name('student-files.store');
Route::delete('/student-files/{id}', [StudentFileController::class, 'destroy'])->name('student-files.destroy');
Route::put('/student-files/{id}', [StudentFileController::class, 'update'])->name('student-files.update');



});
;
Route::post('/student/export', [StudentController::class, 'export'])->name('student.export');

Route::post('/student/{id}/update-remarks', [StudentController::class, 'updateRemarks'])->name('student.update-remarks');

// Downloadable Forms Routing
Route::middleware(['auth'])->group(function () {
    Route::get('/forms/{collegeId?}', [FormsController::class, 'index'])->name('forms.index');
});

// API routes
Route::prefix('api/forms')->name('api.forms.')->middleware(['auth'])->group(function () {
    Route::get('/{collegeId?}', [FormsController::class, 'index'])->name('index');
    Route::post('/upload', [FormsController::class, 'upload'])->name('upload');
    Route::get('/download/{id}', [FormsController::class, 'download'])->name('download');
    Route::delete('/delete/{id}', [FormsController::class, 'deleteForm'])->name('delete');
});

require __DIR__.'/auth.php';

require __DIR__.'/intern-auth.php';

