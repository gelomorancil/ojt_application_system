<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompCourseController;
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

    Route::get('/company', [CompanyController::class, 'index'])->middleware(['auth', 'verified'])->name('company');
    Route::get('/company/create', [CompanyController::class, 'create'])->middleware(['auth', 'verified'])->name('company.create');
    Route::post('/company', [CompanyController::class, 'store'])->middleware(['auth', 'verified'])->name('company.store');
    Route::get('/company/{company}/edit', [CompanyController::class, 'edit'])->middleware(['auth', 'verified'])->name('company.edit');
    Route::put('/company/{company}', [CompanyController::class, 'update'])->middleware(['auth', 'verified'])->name('company.update');
    Route::delete('/company/{id}', [CompanyController::class, 'destroy'])->middleware(['auth', 'verified'])->name('company.destroy');
    Route::get('/company/{id}/contacts', [CompanyController::class, 'showContacts'])->name('company.contacts');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/compcourse', [CompCourseController::class, 'index'])->name('compcourse.index');
    Route::get('/compcourse/create', [CompCourseController::class, 'create'])->name('compcourse.create');
    Route::post('/compcourse', [CompCourseController::class, 'store'])->name('compcourse.store');

});

require __DIR__.'/auth.php';