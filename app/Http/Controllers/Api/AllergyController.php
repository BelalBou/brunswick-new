<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Allergy;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AllergyController extends Controller
{
    /**
     * Liste toutes les allergies
     */
    public function index()
    {
        $allergies = Allergy::where('deleted', false)
            ->orderBy('description', 'ASC')
            ->get(['id', 'description', 'description_en']);

        return response()->json($allergies);
    }

    /**
     * Ajoute une nouvelle allergie
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'required|string',
            'descriptionEn' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $allergy = Allergy::create([
                'description' => $request->description,
                'description_en' => $request->descriptionEn,
                'deleted' => false
            ]);

            return response()->json($allergy);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifie une allergie existante
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'required|string',
            'descriptionEn' => 'required|string'
        ]);

        if ($validator->fails() || !is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $allergy = Allergy::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$allergy) {
                return response()->json([
                    'error' => 'allergy not found'
                ], 404);
            }

            $allergy->update([
                'description' => $request->description,
                'description_en' => $request->descriptionEn
            ]);

            return response()->json($allergy);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime logiquement une allergie
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $allergy = Allergy::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$allergy) {
                return response()->json([
                    'error' => 'allergy not found'
                ], 404);
            }

            $allergy->update(['deleted' => true]);

            return response()->json([
                'message' => 'Allergy deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Attache des menus à une allergie
     */
    public function attachMenus(Request $request, $id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'menuIds' => 'required|array',
            'menuIds.*' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $allergy = Allergy::findOrFail($id);
            $allergy->menus()->sync($request->menuIds);

            return response()->json([
                'message' => 'Menus attachés avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détache des menus d'une allergie
     */
    public function detachMenus(Request $request, $id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'menuIds' => 'required|array',
            'menuIds.*' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $allergy = Allergy::findOrFail($id);
            $allergy->menus()->detach($request->menuIds);

            return response()->json([
                'message' => 'Menus détachés avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
