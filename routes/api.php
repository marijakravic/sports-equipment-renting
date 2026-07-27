<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EquipmentItemController;
use App\Http\Controllers\Api\EquipmentStateController;
use App\Http\Controllers\Api\EquipmentTypeController;
use App\Http\Controllers\Api\AgeController;
use App\Http\Controllers\Api\SportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/additems', [EquipmentItemController::class, 'store']);
Route::post('/equipment-items', [EquipmentItemController::class, 'store']);
Route::post('/basket', [EquipmentItemController::class, 'basketItems']);


Route::get('/sports', [SportController::class, 'index']);
Route::get('/equipmentTypes', [EquipmentTypeController::class, 'index']);
Route::get('/ages', [AgeController::class, 'index']);
Route::get('/states', [EquipmentStateController::class, 'index']);
Route::get('//equipmentTypes/{sportId}', [EquipmentTypeController::class, 'bySport']);
Route::get('/equipment-items', [EquipmentItemController::class, 'index']);
Route::get('/equipment-items', [EquipmentItemController::class, 'index']);
Route::get('/sports', [SportController::class, 'index']);
Route::get('/sports/{id}/equipment', [SportController::class, 'getEquipment']);
Route::get('/equipment', [EquipmentItemController::class, 'searchAll']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
