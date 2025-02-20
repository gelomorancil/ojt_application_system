<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CourseController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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

require __DIR__.'/auth.php';
