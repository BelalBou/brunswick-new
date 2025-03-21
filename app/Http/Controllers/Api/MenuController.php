<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\AllergyMenu;
use App\Models\ExtraMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class MenuController extends Controller
{
    /**
     * Liste tous les menus
     */
    public function index()
    {
        $menus = Menu::with(['menuSize'])
            ->where('deleted', false)
            ->orderBy('title', 'ASC')
            ->get();

        return response()->json($menus);
    }

    /**
     * Liste les menus d'un fournisseur
     */
    public function listBySupplier($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $menus = Menu::with(['supplier', 'category', 'allergies', 'menuSize', 'extras'])
                ->where('deleted', false)
                ->where('supplier_id', $id)
                ->orderBy('title', 'ASC')
                ->get();

            return response()->json($menus);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajoute un nouveau menu
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'titleEn' => 'required|string',
            'pricing' => 'required|numeric',
            'supplierId' => 'required|integer',
            'categoryId' => 'required|integer',
            'description' => 'nullable|string',
            'descriptionEn' => 'nullable|string',
            'sizeId' => 'nullable|integer',
            'picture' => 'nullable|string',
            'allergyIds' => 'nullable|array',
            'allergyIds.*' => 'integer',
            'extraIds' => 'nullable|array',
            'extraIds.*' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $menu = Menu::create([
                'title' => $request->title,
                'title_en' => $request->titleEn,
                'description' => $request->description,
                'description_en' => $request->descriptionEn,
                'menu_size_id' => $request->sizeId > 0 ? $request->sizeId : null,
                'pricing' => $request->pricing,
                'supplier_id' => $request->supplierId,
                'category_id' => $request->categoryId,
                'picture' => $request->picture,
                'deleted' => false
            ]);

            // Gestion des allergies
            if ($request->allergyIds && count($request->allergyIds) > 0) {
                foreach ($request->allergyIds as $allergyId) {
                    AllergyMenu::create([
                        'menu_id' => $menu->id,
                        'allergy_id' => $allergyId,
                        'deleted' => false
                    ]);
                }
            }

            // Gestion des extras
            if ($request->extraIds && count($request->extraIds) > 0) {
                foreach ($request->extraIds as $extraId) {
                    ExtraMenu::create([
                        'menu_id' => $menu->id,
                        'extra_id' => $extraId,
                        'deleted' => false
                    ]);
                }
            }

            return response()->json($menu);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifie un menu existant
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
            'categoryId' => 'required|integer',
            'description' => 'nullable|string',
            'descriptionEn' => 'nullable|string',
            'sizeId' => 'nullable|integer',
            'picture' => 'nullable|string',
            'allergyIds' => 'nullable|array',
            'allergyIds.*' => 'integer',
            'extraIds' => 'nullable|array',
            'extraIds.*' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $menu = Menu::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$menu) {
                return response()->json([
                    'error' => 'menu not found'
                ], 404);
            }

            $updateData = [
                'title' => $request->title,
                'title_en' => $request->titleEn,
                'description' => $request->description,
                'description_en' => $request->descriptionEn,
                'menu_size_id' => $request->sizeId > 0 ? $request->sizeId : null,
                'pricing' => $request->pricing,
                'supplier_id' => $request->supplierId,
                'category_id' => $request->categoryId
            ];

            if ($request->has('picture')) {
                $updateData['picture'] = $request->picture;
            }

            $menu->update($updateData);

            // Gestion des allergies
            if ($request->has('allergyIds')) {
                AllergyMenu::where('menu_id', $id)->delete();
                if (count($request->allergyIds) > 0) {
                    foreach ($request->allergyIds as $allergyId) {
                        AllergyMenu::create([
                            'menu_id' => $id,
                            'allergy_id' => $allergyId,
                            'deleted' => false
                        ]);
                    }
                }
            }

            // Gestion des extras
            if ($request->has('extraIds')) {
                ExtraMenu::where('menu_id', $id)->delete();
                if (count($request->extraIds) > 0) {
                    foreach ($request->extraIds as $extraId) {
                        ExtraMenu::create([
                            'menu_id' => $id,
                            'extra_id' => $extraId,
                            'deleted' => false
                        ]);
                    }
                }
            }

            return response()->json($menu);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime logiquement un menu
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $menu = Menu::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$menu) {
                return response()->json([
                    'error' => 'menu not found'
                ], 404);
            }

            $menu->update(['deleted' => true]);

            return response()->json([
                'message' => 'Menu deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajoute une image pour un menu
     */
    public function addPicture(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'picture' => 'required|file|image|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $path = $request->file('picture')->store('menus', 's3');

            if (!$path) {
                return response()->json([
                    'error' => 'an issue happened while trying to transfer the picture'
                ], 400);
            }

            return response()->json([
                'path' => $path
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
