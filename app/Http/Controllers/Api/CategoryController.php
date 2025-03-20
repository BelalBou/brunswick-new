<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Liste toutes les catégories
     */
    public function index()
    {
        $categories = Category::where('deleted', false)
            ->orderBy('order', 'ASC')
            ->orderBy('title', 'ASC')
            ->get(['id', 'title', 'title_en', 'order', 'supplier_id']);

        return response()->json($categories);
    }

    /**
     * Liste les catégories d'un fournisseur
     */
    public function listBySupplier($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $categories = Category::where('supplier_id', $id)
            ->where('deleted', false)
            ->orderBy('order', 'ASC')
            ->orderBy('title', 'ASC')
            ->get(['id', 'title', 'title_en', 'order', 'supplier_id']);

        return response()->json($categories);
    }

    /**
     * Ajoute une nouvelle catégorie
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'titleEn' => 'required|string',
            'order' => 'required|integer',
            'supplierId' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $category = Category::create([
                'title' => $request->title,
                'title_en' => $request->titleEn,
                'order' => $request->order,
                'supplier_id' => $request->supplierId,
                'deleted' => false
            ]);

            return response()->json($category);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifie une catégorie existante
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'titleEn' => 'required|string',
            'order' => 'required|integer',
            'supplierId' => 'required|integer'
        ]);

        if ($validator->fails() || !is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $category = Category::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$category) {
                return response()->json([
                    'error' => 'category not found'
                ], 404);
            }

            $category->update([
                'title' => $request->title,
                'title_en' => $request->titleEn,
                'order' => $request->order,
                'supplier_id' => $request->supplierId
            ]);

            return response()->json($category);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime logiquement une catégorie
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $category = Category::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$category) {
                return response()->json([
                    'error' => 'category not found'
                ], 404);
            }

            $category->update(['deleted' => true]);

            return response()->json([
                'message' => 'Category deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
