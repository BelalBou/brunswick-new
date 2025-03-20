<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuSizeController;
use App\Http\Controllers\Api\ExtraController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AllergyController;
use App\Http\Controllers\Api\DictionaryController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DailyMailController;

// Routes publiques
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);
Route::post('auth/finalize-registration', [AuthController::class, 'finalizeRegistration']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Déconnexion
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Routes pour administrateur uniquement
    Route::middleware(['auth:sanctum', 'role:administrator'])->group(function () {
        // Gestion des utilisateurs
        Route::apiResource('users', UserController::class);
        Route::get('users/list/customers', [UserController::class, 'listCustomers']);
        
        // Gestion des fournisseurs
        Route::apiResource('suppliers', SupplierController::class);
        
        // Gestion des catégories
        Route::prefix('categories')->middleware(['auth:sanctum'])->group(function () {
            Route::get('/list', [CategoryController::class, 'index']);
            Route::get('/list/{id}', [CategoryController::class, 'index']);
            Route::get('/list_supplier/{id}', [CategoryController::class, 'listBySupplier']);
            
            Route::middleware(['role:administrator'])->group(function () {
                Route::post('/add', [CategoryController::class, 'store']);
                Route::put('/edit/{id}', [CategoryController::class, 'update']);
                Route::delete('/delete/{id}', [CategoryController::class, 'destroy']);
            });
        });
        
        // Gestion des tailles de menu
        Route::prefix('menu_sizes')->middleware(['auth:sanctum'])->group(function () {
            Route::get('/list', [MenuSizeController::class, 'index']);
            
            Route::middleware(['role:administrator'])->group(function () {
                Route::post('/add', [MenuSizeController::class, 'store']);
                Route::put('/edit/{id}', [MenuSizeController::class, 'update']);
                Route::delete('/delete/{id}', [MenuSizeController::class, 'destroy']);
            });
        });
        
        // Gestion des extras
        Route::prefix('extras')->middleware(['auth:sanctum'])->group(function () {
            Route::get('/list_supplier/{id}', [ExtraController::class, 'listBySupplier']);
            
            Route::middleware(['role:administrator'])->group(function () {
                Route::post('/add', [ExtraController::class, 'store']);
                Route::put('/edit/{id}', [ExtraController::class, 'update']);
                Route::delete('/delete/{id}', [ExtraController::class, 'destroy']);
            });
        });
        
        // Gestion des allergies
        Route::prefix('allergies')->middleware(['auth:sanctum'])->group(function () {
            Route::get('/list', [AllergyController::class, 'index']);
            
            Route::middleware(['role:administrator'])->group(function () {
                Route::post('/add', [AllergyController::class, 'store']);
                Route::put('/edit/{id}', [AllergyController::class, 'update']);
                Route::delete('/delete/{id}', [AllergyController::class, 'destroy']);
                Route::post('/{id}/menus', [AllergyController::class, 'attachMenus']);
                Route::delete('/{id}/menus', [AllergyController::class, 'detachMenus']);
            });
        });
        
        // Gestion du dictionnaire
        Route::prefix('dictionnaries')->middleware(['auth:sanctum'])->group(function () {
            Route::get('/list', [DictionaryController::class, 'index']);
            Route::get('/list/{id}', [DictionaryController::class, 'show']);
            Route::get('/translations/{lang}', [DictionaryController::class, 'getTranslations']);
            
            Route::middleware(['role:administrator'])->group(function () {
                Route::post('/add', [DictionaryController::class, 'store']);
                Route::put('/edit/{id}', [DictionaryController::class, 'update']);
                Route::delete('/delete/{id}', [DictionaryController::class, 'destroy']);
            });
        });
        
        // Gestion des paramètres
        Route::apiResource('settings', SettingController::class);
        Route::get('settings/key/{key}', [SettingController::class, 'getByKey']);
        Route::get('settings/key/{key}/language/{language}', [SettingController::class, 'getByKeyAndLanguage']);
        
        // Gestion des emails quotidiens
        Route::apiResource('daily-mails', DailyMailController::class);
        Route::post('daily-mails/send', [DailyMailController::class, 'sendDailyMails']);
        Route::middleware(['role:administrator'])->group(function () {
            Route::post('/', [DailyMailController::class, 'store']);
            Route::put('/{id}', [DailyMailController::class, 'update']);
            Route::delete('/{id}', [DailyMailController::class, 'destroy']);
            Route::post('/send', [DailyMailController::class, 'sendDailyMails']);
            Route::get('/check', [DailyMailController::class, 'check']);
        });
    });

    // Routes pour administrateur et fournisseur
    Route::middleware(['auth:sanctum', 'role:administrator,supplier'])->group(function () {
        // Gestion des menus (création/modification/suppression)
        Route::apiResource('menus', MenuController::class)->except(['index', 'show']);
    });

    // Routes accessibles par tous les utilisateurs authentifiés
    Route::get('menus', [MenuController::class, 'index']);
    Route::get('menus/{id}', [MenuController::class, 'show']);
    Route::get('dictionary/translations/{lang}', [DictionaryController::class, 'getTranslations']);
    Route::get('settings/by-lang/{lang}', [SettingController::class, 'getSettingsByLang']);

    // Routes pour les commandes
    Route::prefix('orders')->group(function () {
        // Routes de base pour les commandes
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/{id}', [OrderController::class, 'show']);

        // Routes pour administrateur
        Route::middleware(['role:administrator'])->group(function () {
            Route::post('/list-customers', [OrderController::class, 'listCustomers']);
            Route::post('/list-suppliers', [OrderController::class, 'listSuppliers']);
        });

        // Routes pour administrateur, client et caissier
        Route::middleware(['role:administrator,customer,vendor'])->group(function () {
            Route::post('/', [OrderController::class, 'store']);
            Route::put('/{id}', [OrderController::class, 'update']);
            Route::delete('/{id}', [OrderController::class, 'destroy']);
            Route::put('/delete-menu', [OrderController::class, 'deleteMenu']);
            Route::put('/article-not-retrieved', [OrderController::class, 'setArticleNotRetrieved']);
        });

        // Routes spécifiques par rôle
        Route::middleware(['role:administrator,supplier'])->group(function () {
            Route::post('/list-date', [OrderController::class, 'listByDate']);
        });

        Route::middleware(['role:customer'])->group(function () {
            Route::post('/list-customer', [OrderController::class, 'listForCustomer']);
        });

        Route::middleware(['role:supplier'])->group(function () {
            Route::post('/list-supplier/{id}', [OrderController::class, 'listForSupplier']);
        });
    });

    // Routes pour les emails quotidiens
    Route::prefix('daily_mails')->middleware(['auth:sanctum'])->group(function () {
        Route::get('/list', [DailyMailController::class, 'index']);
        Route::get('/check', [DailyMailController::class, 'check']);
        
        Route::middleware(['role:administrator'])->group(function () {
            Route::post('/add', [DailyMailController::class, 'store']);
            Route::get('/list/{id}', [DailyMailController::class, 'show']);
            Route::put('/edit/{id}', [DailyMailController::class, 'update']);
            Route::delete('/delete/{id}', [DailyMailController::class, 'destroy']);
            Route::get('/user/{userId}', [DailyMailController::class, 'getUserMails']);
            Route::post('/send', [DailyMailController::class, 'sendDailyMails']);
        });
    });

    // Routes pour les paramètres
    Route::prefix('settings')->middleware(['auth:sanctum'])->group(function () {
        Route::get('/list', [SettingController::class, 'index']);
        Route::put('/edit/{id}', [SettingController::class, 'update'])->middleware('role:administrator');
    });
}); 