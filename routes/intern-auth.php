<?php

use App\Http\Controllers\Intern\Auth\LoginController;
use App\Http\Controllers\Intern\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\InternStudentCompanyController;
use Inertia\Inertia;

Route::prefix('intern')->middleware('guest.intern')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('intern.register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])->name('intern.login');
    Route::post('login', [LoginController::class, 'store']);
});


Route::prefix('intern')->middleware('auth:intern')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Intern/Dashboard');
    })->name('intern.dashboard');

    Route::get('/companylist', [CompanyController::class, 'internIndex'])->name('intern.companylist');

    Route::middleware(['auth:intern'])->group(function () {
        Route::get('/intern/profile/{student}', [InternStudentCompanyController::class, 'show'])->name('intern.studentdetails');
    });


    Route::post('logout', [LoginController::class, 'destroy'])
        ->name('intern.logout');
});
