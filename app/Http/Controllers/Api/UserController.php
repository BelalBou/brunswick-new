<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs
     */
    public function index(Request $request)
    {
        $query = User::with('supplier')->where('deleted', false);

        // Filtrage par type si spécifié
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrage par fournisseur si spécifié
        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        return response()->json($query->get());
    }

    /**
     * Création d'un utilisateur
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emailAddress' => 'required|email|unique:users,email_address',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'type' => 'required|in:administrator,supplier,user',
            'supplier_id' => 'required_if:type,supplier|exists:suppliers,id',
            'language' => 'required|in:fr,en'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }

        // Générer un token d'inscription
        $registrationToken = Str::random(60);

        $user = User::create([
            'email_address' => $request->emailAddress,
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'type' => $request->type,
            'supplier_id' => $request->supplier_id,
            'language' => $request->language,
            'registration_token' => $registrationToken,
            'pending_registration' => true,
            'deleted' => false
        ]);

        // Envoyer l'email de finalisation d'inscription
        $user->notify(new \App\Notifications\FinalizeRegistrationMail([
            'token' => $registrationToken,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name
        ]));

        return response()->json($user, 201);
    }

    /**
     * Détails d'un utilisateur
     */
    public function show($id)
    {
        $user = User::with('supplier')
            ->where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$user) {
            return response()->json([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }

        return response()->json($user);
    }

    /**
     * Mise à jour d'un utilisateur
     */
    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$user) {
            return response()->json([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'emailAddress' => 'email|unique:users,email_address,' . $id,
            'firstName' => 'string',
            'lastName' => 'string',
            'type' => 'in:administrator,supplier,user',
            'supplier_id' => 'exists:suppliers,id',
            'language' => 'in:fr,en'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }

        // Mise à jour des champs
        if ($request->has('emailAddress')) $user->email_address = $request->emailAddress;
        if ($request->has('firstName')) $user->first_name = $request->firstName;
        if ($request->has('lastName')) $user->last_name = $request->lastName;
        if ($request->has('type')) $user->type = $request->type;
        if ($request->has('supplier_id')) $user->supplier_id = $request->supplier_id;
        if ($request->has('language')) $user->language = $request->language;

        $user->save();

        return response()->json($user);
    }

    /**
     * Suppression d'un utilisateur (suppression logique)
     */
    public function destroy($id)
    {
        $user = User::where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$user) {
            return response()->json([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }

        $user->deleted = true;
        $user->save();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}
