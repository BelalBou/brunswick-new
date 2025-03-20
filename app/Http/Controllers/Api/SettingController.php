<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    /**
     * Liste des paramètres
     */
    public function index()
    {
        $settings = Setting::select([
            'id',
            'time_limit',
            'start_period',
            'end_period',
            'email_order_cc',
            'email_supplier_cc',
            'email_vendor_cc'
        ])->get();

        return response()->json($settings);
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
            'timeLimit' => 'required|string',
            'startPeriod' => 'required|integer',
            'endPeriod' => 'required|integer',
            'emailOrderCc' => 'required|email',
            'emailSupplierCc' => 'required|email',
            'emailVendorCc' => 'nullable|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $setting = Setting::findOrFail($id);
            
            $setting->update([
                'time_limit' => $request->timeLimit,
                'start_period' => $request->startPeriod,
                'end_period' => $request->endPeriod,
                'email_order_cc' => $request->emailOrderCc,
                'email_supplier_cc' => $request->emailSupplierCc,
                'email_vendor_cc' => $request->emailVendorCc
            ]);

            return response()->json($setting);

        } catch (\Exception $e) {
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
