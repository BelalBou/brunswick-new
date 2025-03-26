<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
    /**
     * Liste des paramètres
     */
    public function index()
    {
        try {
            Log::info('Début de la récupération des settings');
            
            $settings = Setting::all();
            Log::info('Settings récupérés de la base de données', ['count' => $settings->count()]);

            $settings->transform(function ($setting) {
                try {
                    // Convertir les périodes en entiers
                    $setting->start_period = (int) $setting->start_period;
                    $setting->end_period = (int) $setting->end_period;

                    // S'assurer que les valeurs sont dans la plage 0-6
                    $setting->start_period = max(0, min(6, $setting->start_period));
                    $setting->end_period = max(0, min(6, $setting->end_period));

                    Log::info('Setting converti avec succès', [
                        'id' => $setting->id,
                        'time_limit' => $setting->time_limit,
                        'start_period' => $setting->start_period,
                        'end_period' => $setting->end_period
                    ]);

                    return $setting;
                } catch (\Exception $e) {
                    Log::error('Erreur lors du traitement du setting', [
                        'setting_id' => $setting->id,
                        'error' => $e->getMessage()
                    ]);
                    
                    // En cas d'erreur, retourner des valeurs par défaut
                    $setting->start_period = 0;
                    $setting->end_period = 4;
                    return $setting;
                }
            });

            Log::info('Settings convertis avec succès', [
                'data' => $settings->toArray()
            ]);
            
            return response()->json($settings);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Une erreur est survenue lors de la récupération des paramètres',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Création d'un paramètre
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|unique:settings,key',
            'value' => 'required|string',
            'value_en' => 'required|string',
            'time_limit' => 'required|integer',
            'start_period' => 'required|date|after:now',
            'end_period' => 'required|date|after_or_equal:start_period',
            'email_order_cc' => 'required|email',
            'email_supplier_cc' => 'required|email',
            'email_vendor_cc' => 'nullable|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }

        $setting = Setting::create([
            'key' => $request->key,
            'value' => $request->value,
            'value_en' => $request->value_en,
            'time_limit' => $request->time_limit,
            'start_period' => $request->start_period,
            'end_period' => $request->end_period,
            'email_order_cc' => $request->email_order_cc,
            'email_supplier_cc' => $request->email_supplier_cc,
            'email_vendor_cc' => $request->email_vendor_cc,
            'deleted' => false
        ]);

        Cache::forget('settings');
        Cache::forget('settings_fr');
        Cache::forget('settings_en');

        return response()->json($setting, 201);
    }

    /**
     * Détails d'un paramètre
     */
    public function show($id)
    {
        $setting = Setting::findOrFail($id);
        return response()->json($setting);
    }

    /**
     * Mise à jour d'un paramètre
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Début de la mise à jour du setting', ['id' => $id, 'data' => $request->all()]);

            $setting = Setting::findOrFail($id);

            $validated = $request->validate([
                'time_limit' => 'required|date_format:H:i',
                'start_period' => 'required|integer|min:0|max:6',
                'end_period' => 'required|integer|min:0|max:6',
                'email_order_cc' => 'required|string',
                'email_supplier_cc' => 'required|string',
                'email_vendor_cc' => 'required|string',
            ]);

            // Convertir les jours en entiers
            $startPeriod = (int) $validated['start_period'];
            $endPeriod = (int) $validated['end_period'];

            Log::info('Mise à jour du setting', [
                'time_limit' => $validated['time_limit'],
                'start_period' => $startPeriod,
                'end_period' => $endPeriod
            ]);

            $setting->update([
                'time_limit' => $validated['time_limit'],
                'start_period' => $startPeriod,
                'end_period' => $endPeriod,
                'email_order_cc' => $validated['email_order_cc'],
                'email_supplier_cc' => $validated['email_supplier_cc'],
                'email_vendor_cc' => $validated['email_vendor_cc'],
            ]);

            Log::info('Setting mis à jour avec succès', ['setting' => $setting->toArray()]);

            return response()->json([
                'message' => 'Setting mis à jour avec succès',
                'setting' => $setting
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du setting', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la mise à jour du setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suppression d'un paramètre (suppression logique)
     */
    public function destroy($id)
    {
        $setting = Setting::where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$setting) {
            return response()->json([
                'error' => 'Paramètre non trouvé'
            ], 404);
        }

        $setting->deleted = true;
        $setting->save();

        Cache::forget('settings');
        Cache::forget('settings_fr');
        Cache::forget('settings_en');

        return response()->json([
            'message' => 'Paramètre supprimé avec succès'
        ]);
    }

    /**
     * Récupérer tous les paramètres pour une langue spécifique
     */
    public function getSettingsByLang($lang)
    {
        $settings = Setting::where('language', $lang)->get();
        return response()->json($settings);
    }

    /**
     * Récupérer un paramètre par sa clé
     */
    public function getByKey($key)
    {
        $setting = Setting::where('key', $key)->first();
        
        if (!$setting) {
            return response()->json([
                'error' => 'setting not found'
            ], 404);
        }

        return response()->json($setting);
    }

    /**
     * Récupérer un paramètre par sa clé et la langue
     */
    public function getByKeyAndLanguage($key, $language)
    {
        $setting = Setting::where('key', $key)
            ->where('language', $language)
            ->first();
        
        if (!$setting) {
            return response()->json([
                'error' => 'setting not found'
            ], 404);
        }

        return response()->json($setting);
    }
}
