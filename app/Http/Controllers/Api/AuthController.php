<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    /**
     * Authentifie un utilisateur et retourne un token Sanctum
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emailAddress' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters - invalid email or no password provided'
            ], 400);
        }

        $user = User::with('supplier')
            ->where('email_address', $request->emailAddress)
            ->where('deleted', false)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Les informations de connexion sont incorrectes.'
            ], 401);
        }

        // Définir la durée du token en fonction du type d'utilisateur
        $tokenDuration = 12 * 60; // 12 heures pour tous les utilisateurs
        
        // Supprimer les anciens tokens
        $user->tokens()->delete();

        // Créer un nouveau token avec des permissions spécifiques
        $abilities = [$user->type];
        
        $token = $user->createToken('auth-token', $abilities, now()->addMinutes($tokenDuration))->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'expires_at' => now()->addMinutes($tokenDuration)
        ]);
    }

    /**
     * Déconnexion de l'utilisateur
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Réinitialisation du mot de passe
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emailAddress' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Email invalide'
            ], 400);
        }

        $user = User::where('email_address', $request->emailAddress)
            ->where('deleted', false)
            ->first();

        if (!$user) {
            return response()->json([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }

        // Générer un token de réinitialisation
        $token = Hash::make(uniqid());
        $user->reset_password_token = $token;
        $user->save();

        // Envoyer l'email de réinitialisation
        $user->notify(new \App\Notifications\ResetPasswordMail([
            'token' => $token,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name
        ]));

        return response()->json([
            'message' => 'Email de réinitialisation envoyé'
        ]);
    }

    /**
     * Finalisation de l'inscription
     */
    public function finalizeRegistration(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'password' => 'required|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Paramètres invalides'
            ], 400);
        }

        $user = User::where('registration_token', $request->token)
            ->where('deleted', false)
            ->where('pending_registration', true)
            ->first();

        if (!$user) {
            return response()->json([
                'error' => 'Token invalide ou expiré'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->registration_token = null;
        $user->pending_registration = false;
        $user->save();

        return response()->json([
            'message' => 'Inscription finalisée avec succès'
        ]);
    }
}
