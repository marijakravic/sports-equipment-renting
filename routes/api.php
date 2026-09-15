<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EquipmentItemController;
use App\Http\Controllers\Api\EquipmentStateController;
use App\Http\Controllers\Api\EquipmentTypeController;
use App\Http\Controllers\Api\AgeController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SportController;
use App\Http\Controllers\Api\WorkerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/additems', [EquipmentItemController::class, 'store']);
Route::post('/equipment-items', [EquipmentItemController::class, 'store']);
Route::post('/basket', [EquipmentItemController::class, 'basketItems']);

Route::get('/sports', [SportController::class, 'index']);
Route::get('/equipmentTypes', [EquipmentTypeController::class, 'index']);
Route::get('/ages', [AgeController::class, 'index']);
Route::get('/states', [EquipmentStateController::class, 'index']);
Route::get('/equipmentTypes/{sportId}', [EquipmentTypeController::class, 'bySport']);
Route::get('/equipment-items', [EquipmentItemController::class, 'index']);
Route::get('/equipment-items/{equipmentItem}', [EquipmentItemController::class, 'show']);
Route::get('/sports/{id}/equipment', [SportController::class, 'getEquipment']);
Route::get('/equipment', [EquipmentItemController::class, 'searchAll']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
    Route::post('/reservations/{reservation}/equipment-items', [ReservationController::class, 'addEquipmentItem']);
    Route::put('/equipment-items/{equipmentItem}', [EquipmentItemController::class, 'update']);
    Route::put('/reservations/{reservation}/activate', [ReservationController::class, 'activate']);
    Route::put('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
    Route::put('/reservations/{reservation}/complete', [ReservationController::class, 'complete']);
    Route::get('/reservations/{reservation}/receipt', [ReservationController::class, 'receipt']);
    Route::post('/workers', [WorkerController::class, 'store'])->middleware('admin');
    Route::post('/sports', [SportController::class, 'store'])->middleware('admin');
    Route::put('/sports/{sport}', [SportController::class, 'update'])->middleware('admin');
    Route::delete('/sports/{sport}', [SportController::class, 'destroy'])->middleware('admin');
    Route::post('/equipmentTypes', [EquipmentTypeController::class, 'store'])->middleware('admin');
    Route::put('/equipmentTypes/{equipmentType}', [EquipmentTypeController::class, 'update'])->middleware('admin');
    Route::delete('/equipmentTypes/{equipmentType}', [EquipmentTypeController::class, 'destroy'])->middleware('admin');
});
