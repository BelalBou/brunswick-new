<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SettingController extends Controller
{
    /**
     * Liste des paramètres
     */
    public function index()
    {
        try {
            \Log::info('Début de la récupération des settings');
            
            $settings = Setting::all();
            \Log::info('Settings récupérés de la base de données', ['count' => $settings->count()]);
            
            // Convertir les dates en jours de la semaine (0 = Lundi, 6 = Dimanche)
            $settings->transform(function ($setting) {
                try {
                    if ($setting->start_period) {
                        $date = Carbon::parse($setting->start_period);
                        $setting->start_period = $date->dayOfWeek - 1; // -1 car Carbon commence à 1 (Lundi)
                        \Log::info('Conversion start_period', [
                            'original' => $setting->start_period,
                            'converted' => $date->dayOfWeek - 1
                        ]);
                    }
                    if ($setting->end_period) {
                        $date = Carbon::parse($setting->end_period);
                        $setting->end_period = $date->dayOfWeek - 1; // -1 car Carbon commence à 1 (Lundi)
                        \Log::info('Conversion end_period', [
                            'original' => $setting->end_period,
                            'converted' => $date->dayOfWeek - 1
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error('Erreur lors de la conversion des dates', [
                        'setting_id' => $setting->id,
                        'error' => $e->getMessage()
                    ]);
                }
                return $setting;
            });

            \Log::info('Settings convertis avec succès');
            return response()->json($settings);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des settings', [
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
        $validator = Validator::make($request->all(), [
            'time_limit' => 'required|string',
            'start_period' => 'required|integer|min:0|max:6',
            'end_period' => 'required|integer|min:0|max:6',
            'email_order_cc' => 'required|email',
            'email_supplier_cc' => 'required|email',
            'email_vendor_cc' => 'nullable|email'
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }

        try {
            $setting = Setting::findOrFail($id);
            
            // Convertir les jours de la semaine en dates (0 = Lundi, 6 = Dimanche)
            $startDate = now()->startOfWeek()->addDays($request->start_period);
            $endDate = now()->startOfWeek()->addDays($request->end_period);
            
            $setting->update([
                'time_limit' => $request->time_limit,
                'start_period' => $startDate,
                'end_period' => $endDate,
                'email_order_cc' => $request->email_order_cc,
                'email_supplier_cc' => $request->email_supplier_cc,
                'email_vendor_cc' => $request->email_vendor_cc
            ]);

            return response()->json($setting);

        } catch (\Exception $e) {
            \Log::error('Error updating setting', ['error' => $e->getMessage()]);
            return response()->json([
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
