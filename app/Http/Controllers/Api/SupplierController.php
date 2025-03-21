<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\User;
use App\Notifications\AwayMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SupplierController extends Controller
{
    /**
     * Liste tous les fournisseurs
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'admin' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $query = Supplier::with(['users' => function($query) {
                $query->where('deleted', false)
                    ->select(['id', 'name', 'email_address', 'type', 'supplier_id']);
            }])
            ->where('deleted', false);

        // Si ce n'est pas un admin, on filtre les fournisseurs qui ne sont pas en congé
        if (!$request->admin) {
            $query->whereRaw('now() NOT BETWEEN away_start AND away_end');
        }

        $suppliers = $query->orderBy('name', 'ASC')
            ->get(['id', 'name', 'email_address', 'email_address2', 'email_address3', 'for_vendor_only', 'away_start', 'away_end']);

        return response()->json($suppliers);
    }

    /**
     * Ajoute un nouveau fournisseur
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'emailAddress' => 'required|email',
            'emailAddress2' => 'nullable|email',
            'emailAddress3' => 'nullable|email',
            'forVendorOnly' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $supplier = Supplier::create([
                'name' => $request->name,
                'email_address' => $request->emailAddress,
                'email_address2' => $request->emailAddress2,
                'email_address3' => $request->emailAddress3,
                'for_vendor_only' => $request->forVendorOnly ?? false,
                'deleted' => false
            ]);

            return response()->json($supplier);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifie un fournisseur existant
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'emailAddress' => 'required|email',
            'emailAddress2' => 'nullable|email',
            'emailAddress3' => 'nullable|email',
            'forVendorOnly' => 'nullable|boolean',
            'awayStart' => 'nullable|date',
            'awayEnd' => 'nullable|date'
        ]);

        if ($validator->fails() || !is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $supplier = Supplier::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$supplier) {
                return response()->json([
                    'error' => 'supplier not found'
                ], 404);
            }

            $supplier->update([
                'name' => $request->name,
                'email_address' => $request->emailAddress,
                'email_address2' => $request->emailAddress2,
                'email_address3' => $request->emailAddress3,
                'for_vendor_only' => $request->forVendorOnly ?? false,
                'away_start' => $request->awayStart ? Carbon::parse($request->awayStart) : null,
                'away_end' => $request->awayEnd ? Carbon::parse($request->awayEnd) : null
            ]);

            return response()->json($supplier);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime logiquement un fournisseur
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $supplier = Supplier::where('id', $id)
                ->where('deleted', false)
                ->first();

            if (!$supplier) {
                return response()->json([
                    'error' => 'supplier not found'
                ], 404);
            }

            $supplier->update(['deleted' => true]);

            return response()->json([
                'message' => 'Supplier deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Envoyer les notifications d'absence aux utilisateurs concernés
     */
    private function sendAwayNotifications(Supplier $supplier)
    {
        $users = User::where('deleted', false)
            ->whereIn('type', ['administrator', 'user'])
            ->get();

        foreach ($users as $user) {
            $user->notify(new AwayMail([
                'supplierName' => $supplier->name,
                'awayStart' => $supplier->away_start,
                'awayEnd' => $supplier->away_end
            ]));
        }
    }

    public function show($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            return response()->json($supplier);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
