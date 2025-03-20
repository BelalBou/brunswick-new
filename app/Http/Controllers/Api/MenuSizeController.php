<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuSizeController extends Controller
{
    /**
     * Liste toutes les tailles de menu
     */
    public function index()
    {
        $menuSizes = MenuSize::where('deleted', false)
            ->orderBy('title', 'ASC')
            ->get(['id', 'title', 'title_en']);

        return response()->json($menuSizes);
    }

    /**
     * Ajoute une nouvelle taille de menu
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'titleEn' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $menuSize = MenuSize::create([
                'title' => $request->title,
                'title_en' => $request->titleEn,
                'deleted' => false
            ]);

            return response()->json($menuSize);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche une taille de menu spécifique
     */
    public function show($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $menuSize = MenuSize::where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$menuSize) {
            return response()->json([
                'error' => 'menu size not found'
            ], 404);
        }

        return response()->json($menuSize);
    }

    /**
     * Modifie une taille de menu existante
     */
    public function update(Request $request, $id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'titleEn' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $menuSize = MenuSize::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$menuSize) {
                return response()->json([
                    'error' => 'menu size not found'
                ], 404);
            }

            $menuSize->update([
                'title' => $request->title,
                'title_en' => $request->titleEn
            ]);

            return response()->json($menuSize);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime logiquement une taille de menu
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $menuSize = MenuSize::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$menuSize) {
                return response()->json([
                    'error' => 'menu size not found'
                ], 404);
            }

            $menuSize->update(['deleted' => true]);

            return response()->json([
                'message' => 'Menu size deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
