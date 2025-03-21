<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Menu;
use App\Models\Extra;
use App\Models\User;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Notifications\VendorMail;
use App\Notifications\ConfirmMail;
use Carbon\Carbon;
use App\Models\OrderMenu;
use App\Models\ExtraMenuOrder;
use App\Models\Setting;

class OrderController extends Controller
{
    /**
     * Liste toutes les commandes avec pagination
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'todayOnly' => 'nullable|boolean',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $query = Order::with(['user' => function($query) {
                $query->where('deleted', false)
                    ->select(['id', 'name', 'email_address', 'type']);
            }, 'menus' => function($query) {
                $query->where('deleted', false)
                    ->with(['menuSize', 'supplier'])
                    ->select(['menus.id', 'title', 'title_en', 'menu_size_id', 'supplier_id', 'pricing'])
                    ->orderBy('title', 'ASC');
            }])
            ->where('deleted', false);

        if ($request->todayOnly) {
            $query->whereDate('date', Carbon::today());
        }

        $query->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC');

        $total = $query->count();

        if ($request->limit) {
            $query->limit($request->limit);
        }
        if ($request->offset) {
            $query->offset($request->offset);
        }

        $orders = $query->get();

        return response()->json([
            'result' => $orders,
            'totalCount' => $total
        ]);
    }

    /**
     * Liste les commandes d'un client
     */
    public function listByCustomer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $userId = auth()->id();

        $query = Order::with(['user', 'menus' => function($query) {
                $query->where('deleted', false)
                    ->with('menuSize')
                    ->orderBy('title', 'ASC');
            }])
            ->where('user_id', $userId)
            ->where('deleted', false)
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC');

        $total = $query->count();

        if ($request->limit) {
            $query->limit($request->limit);
        }
        if ($request->offset) {
            $query->offset($request->offset);
        }

        $orders = $query->get();

        return response()->json([
            'result' => $orders,
            'totalCount' => $total
        ]);
    }

    /**
     * Liste les commandes d'un fournisseur
     */
    public function listBySupplier(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'todayOnly' => 'nullable|boolean',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer'
        ]);

        if ($validator->fails() || !is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $query = Order::with(['user' => function($query) {
                $query->where('deleted', false)
                    ->select(['id', 'name', 'email_address', 'type']);
            }, 'menus' => function($query) use ($id) {
                $query->where('deleted', false)
                    ->whereHas('supplier', function($query) use ($id) {
                        $query->where('id', $id);
                    })
                    ->with(['menuSize', 'supplier'])
                    ->orderBy('title', 'ASC');
            }])
            ->where('deleted', false);

        if ($request->todayOnly) {
            $query->whereDate('date', Carbon::today());
        }

        $query->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC');

        $total = $query->count();

        if ($request->limit) {
            $query->limit($request->limit);
        }
        if ($request->offset) {
            $query->offset($request->offset);
        }

        $orders = $query->get();

        return response()->json([
            'result' => $orders,
            'totalCount' => $total
        ]);
    }

    /**
     * Liste les commandes pour plusieurs fournisseurs
     */
    public function listBySuppliers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $query = Order::with(['user' => function($query) {
                $query->where('deleted', false)
                    ->select(['id', 'name', 'email_address', 'type']);
            }, 'menus' => function($query) use ($request) {
                $query->where('deleted', false)
                    ->whereHas('supplier', function($query) use ($request) {
                        $query->whereIn('id', $request->ids);
                    })
                    ->with(['menuSize', 'supplier'])
                    ->orderBy('title', 'ASC');
            }])
            ->where('deleted', false)
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC');

        $total = $query->count();

        if ($request->limit) {
            $query->limit($request->limit);
        }
        if ($request->offset) {
            $query->offset($request->offset);
        }

        $orders = $query->get();

        return response()->json([
            'result' => $orders,
            'totalCount' => $total
        ]);
    }

    /**
     * Liste les commandes pour plusieurs clients
     */
    public function listByCustomers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $query = Order::with(['user' => function($query) use ($request) {
                $query->whereIn('id', $request->ids)
                    ->whereIn('type', ['customer', 'administrator'])
                    ->where('deleted', false)
                    ->select(['id', 'name', 'email_address', 'type']);
            }, 'menus' => function($query) {
                $query->where('deleted', false)
                    ->with(['supplier'])
                    ->orderBy('title', 'ASC');
            }])
            ->where('deleted', false)
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC');

        $total = $query->count();

        if ($request->limit) {
            $query->limit($request->limit);
        }
        if ($request->offset) {
            $query->offset($request->offset);
        }

        $orders = $query->get();

        return response()->json([
            'result' => $orders,
            'totalCount' => $total
        ]);
    }

    /**
     * Liste les commandes pour une date donnée
     */
    public function listByDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        $user = auth()->user();
        $whereSupplier = [];

        if ($user->type === 'supplier' && $user->supplier_id) {
            $whereSupplier['id'] = $user->supplier_id;
        }

        $query = Order::with(['user' => function($query) {
                $query->where('deleted', false)
                    ->select(['id', 'name', 'email_address', 'type']);
            }, 'menus' => function($query) use ($whereSupplier) {
                $query->where('deleted', false)
                    ->with(['menuSize', 'supplier' => function($query) use ($whereSupplier) {
                        if (!empty($whereSupplier)) {
                            $query->where($whereSupplier);
                        }
                    }])
                    ->orderBy('title', 'ASC');
            }])
            ->whereDate('date', $request->date)
            ->where('deleted', false)
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC');

        $total = $query->count();

        if ($request->limit) {
            $query->limit($request->limit);
        }
        if ($request->offset) {
            $query->offset($request->offset);
        }

        $orders = $query->get();

        return response()->json([
            'result' => $orders,
            'totalCount' => $total
        ]);
    }

    /**
     * Liste les extras des commandes
     */
    public function listExtras()
    {
        $extras = ExtraMenuOrder::with(['extra' => function($query) {
                $query->select(['id', 'title', 'title_en', 'pricing']);
            }])
            ->where('deleted', false)
            ->orderBy('id', 'ASC')
            ->get(['id', 'pricing', 'extra_id', 'order_menu_id']);

        return response()->json($extras);
    }

    /**
     * Ajoute une nouvelle commande
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userId' => 'required|integer',
            'date' => 'required|date',
            'menus' => 'required|array',
            'menus.*.id' => 'required|integer',
            'menus.*.quantity' => 'required|integer',
            'menus.*.remark' => 'nullable|string',
            'menus.*.date' => 'required|date',
            'menus.*.extras' => 'nullable|array',
            'menus.*.extras.*.id' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Vérifier l'utilisateur
            $user = User::where('id', $request->userId)
                ->where('deleted', false)
                ->first();

            if (!$user) {
                return response()->json([
                    'error' => 'wrong user'
                ], 400);
            }

            // Vérifier les paramètres
            $settings = Setting::first();
            if (!$settings) {
                return response()->json([
                    'error' => 'wrong setting'
                ], 400);
            }

            // Créer la commande
            $order = Order::create([
                'user_id' => $request->userId,
                'date' => $request->date,
                'deleted' => false
            ]);

            // Ajouter les menus
            foreach ($request->menus as $menuData) {
                $menu = Menu::where('id', $menuData['id'])
                    ->where('deleted', false)
                    ->first();

                if ($menu) {
                    $orderMenu = OrderMenu::create([
                        'order_id' => $order->id,
                        'menu_id' => $menu->id,
                        'remark' => $menuData['remark'] ?? null,
                        'pricing' => $menu->pricing,
                        'quantity' => $menuData['quantity'],
                        'date' => $menuData['date'],
                        'article_not_retrieved' => false,
                        'deleted' => false
                    ]);

                    // Ajouter les extras
                    if (!empty($menuData['extras'])) {
                        foreach ($menuData['extras'] as $extraData) {
                            $extra = Extra::where('id', $extraData['id'])
                                ->where('deleted', false)
                                ->first();

                            if ($extra) {
                                ExtraMenuOrder::create([
                                    'pricing' => $extra->pricing,
                                    'extra_id' => $extra->id,
                                    'order_menu_id' => $orderMenu->id,
                                    'deleted' => false
                                ]);
                            }
                        }
                    }
                }
            }

            DB::commit();

            // TODO: Envoyer l'email de confirmation
            // sendConfirmMail($order, $settings);

            return response()->json($order);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime logiquement une commande
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $user = auth()->user();
            $whereCondition = ['id' => $id];

            if ($user->type === 'customer') {
                $whereCondition['user_id'] = $user->id;
            }

            $order = Order::where($whereCondition)
                ->where('deleted', false)
                ->first();

            if (!$order) {
                return response()->json([
                    'error' => 'order not found'
                ], 404);
            }

            $order->update(['deleted' => true]);

            return response()->json([
                'message' => 'Order deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifie un menu dans une commande
     */
    public function editMenu(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'orderId' => 'required|integer',
            'menuId' => 'required|integer',
            'quantity' => 'required|integer',
            'remark' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $orderMenu = OrderMenu::where('order_id', $request->orderId)
                ->where('menu_id', $request->menuId)
                ->first();

            if (!$orderMenu) {
                return response()->json([
                    'error' => 'order menu not found'
                ], 404);
            }

            $orderMenu->update([
                'quantity' => $request->quantity,
                'remark' => $request->remark
            ]);

            return response()->json($orderMenu);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime un menu d'une commande
     */
    public function deleteMenu(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'orderId' => 'required|integer',
            'menuId' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $orderMenu = OrderMenu::where('order_id', $request->orderId)
                ->where('menu_id', $request->menuId)
                ->first();

            if (!$orderMenu) {
                return response()->json([
                    'error' => 'order menu not found'
                ], 404);
            }

            $orderMenu->delete();

            return response()->json([
                'message' => 'Menu deleted from order successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marque un article comme récupéré ou non
     */
    public function editArticleCarriedAway(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'orderId' => 'required|integer',
            'menuId' => 'required|integer',
            'checked' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'wrong parameters'
            ], 400);
        }

        try {
            $orderMenu = OrderMenu::where('order_id', $request->orderId)
                ->where('menu_id', $request->menuId)
                ->first();

            if (!$orderMenu) {
                return response()->json([
                    'error' => 'order menu not found'
                ], 404);
            }

            $orderMenu->update([
                'article_not_retrieved' => $request->checked
            ]);

            return response()->json($orderMenu);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste les commandes d'un client (alias pour listByCustomer)
     */
    public function listForCustomer(Request $request)
    {
        return $this->listByCustomer($request);
    }
}
