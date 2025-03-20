<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dictionary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class DictionaryController extends Controller
{
    /**
     * Liste des entrées du dictionnaire
     */
    public function index()
    {
        $entries = Dictionary::where('deleted', false)
            ->orderBy('tag', 'ASC')
            ->get(['id', 'tag', 'translation_fr', 'translation_en']);

        return response()->json($entries);
    }

    /**
     * Détails d'une entrée du dictionnaire
     */
    public function show($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $entry = Dictionary::where('id', $id)
            ->where('deleted', false)
            ->first(['id', 'tag', 'translation_fr', 'translation_en']);

        if (!$entry) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        return response()->json($entry);
    }

    /**
     * Création d'une entrée du dictionnaire
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tag' => 'required|string',
            'translationFr' => 'required|string',
            'translationEn' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $entry = Dictionary::create([
                'tag' => $request->tag,
                'translation_fr' => $request->translationFr,
                'translation_en' => $request->translationEn,
                'deleted' => false
            ]);

            return response()->json($entry);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mise à jour d'une entrée du dictionnaire
     */
    public function update(Request $request, $id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'tag' => 'required|string',
            'translationFr' => 'required|string',
            'translationEn' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $result = Dictionary::where('id', $id)->update([
                'tag' => $request->tag,
                'translation_fr' => $request->translationFr,
                'translation_en' => $request->translationEn
            ]);

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suppression d'une entrée du dictionnaire (suppression logique)
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $result = Dictionary::where('id', $id)->update([
                'deleted' => true
            ]);

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère les traductions pour une langue donnée
     */
    public function getTranslations($lang)
    {
        if (!in_array($lang, ['fr', 'en'])) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $entries = Dictionary::where('deleted', false)
            ->orderBy('tag', 'ASC')
            ->get(['tag', 'translation_' . $lang . ' as translation']);

        $translations = [];
        foreach ($entries as $entry) {
            $translations[$entry->tag] = $entry->translation;
        }

        return response()->json($translations);
    }
}
