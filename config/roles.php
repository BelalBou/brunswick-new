<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Rôles d'utilisateur
    |--------------------------------------------------------------------------
    |
    | Définition des rôles d'utilisateur et de leurs permissions
    |
    */

    'types' => [
        'administrator' => [
            'label' => 'Administrateur',
            'token_duration' => '12h',
            'permissions' => ['*'], // Accès total
        ],
        'supplier' => [
            'label' => 'Fournisseur',
            'token_duration' => '10m',
            'permissions' => [
                'menus.manage',
                'orders.view',
            ],
        ],
        'vendor' => [
            'label' => 'Caissier',
            'token_duration' => '10m',
            'permissions' => [
                'orders.manage',
                'menus.view',
            ],
        ],
        'customer' => [
            'label' => 'Employé',
            'token_duration' => '10m',
            'permissions' => [
                'orders.manage',
                'menus.view',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Permissions par défaut
    |--------------------------------------------------------------------------
    |
    | Permissions accordées à tous les utilisateurs authentifiés
    |
    */
    'default_permissions' => [
        'menus.view',
        'orders.view',
        'dictionary.view',
        'settings.view',
    ],
]; 