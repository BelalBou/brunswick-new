<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyMail;
use App\Models\User;
use App\Notifications\DailyMail as DailyMailNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Setting;
use App\Models\Supplier;
use App\Models\Order;
use App\Models\Menu;
use App\Models\MenuSize;
use App\Models\Category;
use App\Models\ExtraMenuOrder;
use App\Models\Extra;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class DailyMailController extends Controller
{
    /**
     * Liste des emails quotidiens envoyés
     */
    public function index()
    {
        $dailyMails = DailyMail::where('deleted', false)
            ->where('sent', true)
            ->orderBy('date', 'DESC')
            ->get(['id', 'date', 'sent', 'error']);

        return response()->json($dailyMails);
    }

    /**
     * Création d'un email quotidien
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'content' => 'required|string',
            'content_en' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }

        // Vérifier si un email existe déjà pour cet utilisateur à cette date
        $existingMail = DailyMail::where('user_id', $request->user_id)
            ->whereDate('date', $request->date)
            ->where('deleted', false)
            ->first();

        if ($existingMail) {
            return response()->json([
                'error' => 'Un email existe déjà pour cet utilisateur à cette date'
            ], 400);
        }

        try {
            $dailyMail = DailyMail::create([
                'user_id' => $request->user_id,
                'date' => $request->date,
                'content' => $request->content,
                'content_en' => $request->content_en,
                'deleted' => false
            ]);

            return response()->json($dailyMail, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la création de l\'email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détails d'un email quotidien
     */
    public function show($id)
    {
        $dailyMail = DailyMail::with(['user'])
            ->where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$dailyMail) {
            return response()->json([
                'error' => 'Email non trouvé'
            ], 404);
        }

        return response()->json($dailyMail);
    }

    /**
     * Mise à jour d'un email quotidien
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'content_en' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }

        $dailyMail = DailyMail::where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$dailyMail) {
            return response()->json([
                'error' => 'Email non trouvé'
            ], 404);
        }

        try {
            $dailyMail->update([
                'content' => $request->content,
                'content_en' => $request->content_en
            ]);

            return response()->json($dailyMail);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour de l\'email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suppression d'un email quotidien (suppression logique)
     */
    public function destroy($id)
    {
        $dailyMail = DailyMail::where('id', $id)
            ->where('deleted', false)
            ->first();

        if (!$dailyMail) {
            return response()->json([
                'error' => 'Email non trouvé'
            ], 404);
        }

        try {
            $dailyMail->update(['deleted' => true]);

            return response()->json([
                'message' => 'Email supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression de l\'email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifie et envoie les emails quotidiens
     */
    public function check()
    {
        try {
            // Vérifie si un email a déjà été envoyé aujourd'hui
            $existingMail = DailyMail::whereDate('date', Carbon::today())
                ->where('deleted', false)
                ->first();

            if ($existingMail) {
                return response()->json([
                    'error' => 'daily mail already sent'
                ], 400);
            }

            // Vérifie les paramètres
            $settings = Setting::first();
            if (!$settings) {
                return response()->json([
                    'error' => 'wrong setting'
                ], 400);
            }

            // Vérifie la période
            $currentPeriod = Carbon::now()->dayOfWeek;
            $startPeriod = (int)$settings->start_period;
            $endPeriod = (int)$settings->end_period;

            if ($startPeriod > $currentPeriod || $currentPeriod > $endPeriod) {
                return response()->json([
                    'error' => 'period out of range'
                ], 400);
            }

            // Vérifie l'heure limite
            $limitTime = Carbon::createFromFormat('Y-m-d H:i:s', 
                Carbon::today()->format('Y-m-d') . ' ' . $settings->time_limit
            )->addMinutes(5);

            if (Carbon::now()->lessThanOrEqualTo($limitTime)) {
                return response()->json([
                    'error' => 'current time before time limit'
                ], 400);
            }

            // Récupère les fournisseurs
            $suppliers = Supplier::where('deleted', false)->get();
            if ($suppliers->isEmpty()) {
                return response()->json([
                    'error' => 'wrong supplier'
                ], 400);
            }

            // Récupère les extras des commandes
            $extraMenuOrders = ExtraMenuOrder::with('extra')
                ->where('deleted', false)
                ->get();

            $error = '';
            $vendors = [];

            // Pour chaque fournisseur
            foreach ($suppliers as $supplier) {
                $orders = Order::with(['user', 'menu.supplier', 'menu.menuSize', 'menu.category'])
                    ->whereDate('date', Carbon::today())
                    ->where('deleted', false)
                    ->where('email_send', false)
                    ->whereHas('menu', function ($query) use ($supplier) {
                        $query->where('supplier_id', $supplier->id)
                            ->where('deleted', false);
                    })
                    ->whereHas('user', function ($query) {
                        $query->where('deleted', false);
                    })
                    ->get();

                if ($orders->isNotEmpty()) {
                    $formattedOrders = [];
                    $supplierObj = ['name' => $supplier->name, 'orders' => []];

                    // Groupe les commandes par utilisateur
                    $ordersByUser = $orders->groupBy('user_id');
                    foreach ($ordersByUser as $userOrders) {
                        $orderObj = [
                            'customerName' => $userOrders->first()->user->last_name . ' ' . 
                                           $userOrders->first()->user->first_name,
                            'menus' => []
                        ];

                        foreach ($userOrders as $order) {
                            $order->email_send = true;
                            $order->save();

                            foreach ($order->menu as $menu) {
                                $menuObj = [
                                    'quantity' => $menu->pivot->quantity,
                                    'remark' => $menu->pivot->remark,
                                    'size' => $menu->menuSize ? $menu->menuSize->title : '',
                                    'title' => $menu->title,
                                    'extras' => $extraMenuOrders->where('order_menu_id', $menu->pivot->id)
                                ];
                                $orderObj['menus'][] = $menuObj;
                            }
                        }
                        $formattedOrders[] = $orderObj;
                    }

                    // Groupe les commandes par catégorie pour le récapitulatif vendeur
                    $ordersByCategory = $orders->groupBy('menu.first.category_id');
                    foreach ($ordersByCategory as $categoryOrders) {
                        $vendorObj = [
                            'categoryName' => $categoryOrders->first()->menu->first()->category->title,
                            'count' => $categoryOrders->sum(function ($order) {
                                return $order->menu->sum('pivot.quantity');
                            })
                        ];
                        $supplierObj['orders'][] = $vendorObj;
                    }

                    // Envoi l'email au fournisseur
                    try {
                        Mail::send('emails.daily', [
                            'supplierName' => $supplier->name,
                            'orders' => $formattedOrders
                        ], function ($message) use ($supplier) {
                            $message->to($supplier->email_address)
                                   ->bcc('webcafe@esi-informatique.com')
                                   ->subject('Vos commandes du jour');
                        });
                    } catch (\Exception $e) {
                        $error = $e->getMessage();
                        Log::error('Error sending daily mail: ' . $error);
                    }

                    $vendors[] = $supplierObj;
                }
            }

            // Envoi le récapitulatif aux vendeurs si nécessaire
            if (!empty($vendors)) {
                try {
                    Mail::send('emails.vendor', [
                        'vendors' => $vendors
                    ], function ($message) use ($settings) {
                        $message->to($settings->email_vendor_cc)
                               ->bcc('webcafe@esi-informatique.com')
                               ->subject('Récapitulatif des articles commandés');
                    });
                } catch (\Exception $e) {
                    Log::error('Error sending vendor mail: ' . $e->getMessage());
                }
            }

            // Enregistre l'envoi
            $dailyMail = DailyMail::create([
                'date' => Carbon::now(),
                'sent' => empty($error),
                'error' => $error,
                'deleted' => false
            ]);

            return response()->json($dailyMail);

        } catch (\Exception $e) {
            Log::error('Error in daily mail check: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Envoi manuel des emails quotidiens
     */
    public function sendDailyMails()
    {
        return $this->check();
    }

    /**
     * Récupération des emails pour un utilisateur sur une période donnée
     */
    public function getUserMails(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }

        try {
            $mails = DailyMail::with(['user'])
                ->where('user_id', $userId)
                ->whereBetween('date', [$request->start_date, $request->end_date])
                ->where('deleted', false)
                ->orderBy('date', 'DESC')
                ->get();

            return response()->json($mails);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des emails: ' . $e->getMessage()
            ], 500);
        }
    }
}
