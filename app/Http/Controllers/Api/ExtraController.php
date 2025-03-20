<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Extra;
use App\Models\Supplier;
use App\Models\MenuSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ExtraController extends Controller
{
    /**
     * Liste des extras
     */
    public function index(Request $request)
    {
        $query = Extra::with(['supplier', 'menuSize', 'menus'])
            ->where('deleted', false);

        // Filtrage par fournisseur
        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filtrage par taille de menu
        if ($request->has('menu_size_id')) {
            $query->where('menu_size_id', $request->menu_size_id);
        }

        return response()->json($query->get());
    }

    /**
     * Liste des extras par fournisseur
     */
    public function listBySupplier($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $extras = Extra::with(['menuSize' => function ($query) {
                $query->select(['id', 'title', 'title_en']);
            }])
            ->where('supplier_id', $id)
            ->where('deleted', false)
            ->orderBy('title', 'ASC')
            ->get(['id', 'title', 'title_en', 'pricing', 'supplier_id', 'menu_size_id']);

        return response()->json($extras);
    }

    /**
     * Création d'un extra
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'titleEn' => 'required|string',
            'pricing' => 'required|numeric',
            'supplierId' => 'required|integer',
            'menuSizeId' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $extra = Extra::create([
                'title' => $request->title,
                'title_en' => $request->titleEn,
                'pricing' => $request->pricing,
                'supplier_id' => $request->supplierId,
                'menu_size_id' => $request->menuSizeId,
                'deleted' => false
            ]);

            return response()->json($extra);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détails d'un extra
     */
    public function show($id)
    {
        $extra = Extra::with(['supplier', 'menuSize', 'menus'])
            ->where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$extra) {
            return response()->json([
                'error' => 'Extra non trouvé'
            ], 404);
        }

        return response()->json($extra);
    }

    /**
     * Mise à jour d'un extra
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
            'titleEn' => 'required|string',
            'pricing' => 'required|numeric',
            'supplierId' => 'required|integer',
            'menuSizeId' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $extra = Extra::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$extra) {
                return response()->json([
                    'error' => 'extra not found'
                ], 404);
            }

            $extra->update([
                'title' => $request->title,
                'title_en' => $request->titleEn,
                'pricing' => $request->pricing,
                'supplier_id' => $request->supplierId,
                'menu_size_id' => $request->menuSizeId
            ]);

            return response()->json($extra);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suppression d'un extra (suppression logique)
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $extra = Extra::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$extra) {
                return response()->json([
                    'error' => 'extra not found'
                ], 404);
            }

            $extra->update(['deleted' => true]);

            return response()->json([
                'message' => 'Extra deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
