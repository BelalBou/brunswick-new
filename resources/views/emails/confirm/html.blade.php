<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de commande</title>
</head>
<body>
    @if($lang === 'en')
        <p>Hello {{ $customerName }},</p>
        <p>We confirm the validation of your order for {{ $when }}, it will be treated as soon as possible.</p>
        <h4>Summary</h4>
        <ul>
            @foreach($order['menus'] as $menu)
                @if($menu['quantity'] == 1)
                    <li>{{ $menu['size_en'] }} {{ $menu['title_en'] }}</li>
                @else
                    <li>{{ $menu['quantity'] }}x {{ $menu['size_en'] }} {{ $menu['title_en'] }}</li>
                @endif

                @if($menu['extras'])
                    @foreach($menu['extras'] as $extra)
                        <span>+ {{ $extra['title_en'] }}</span><br>
                    @endforeach
                @endif

                @if($menu['remark'])
                    <span>{{ $menu['remark'] }}</span><br>
                @endif
            @endforeach
        </ul>
        <p>Please check <a href="https://lunch.brunswick-marine.com">lunch.brunswick-marine.com</a> for more details about the orders.</p>
    @else
        <p>Bonjour {{ $customerName }},</p>
        <p>Nous vous confirmons la validation de votre commande pour le {{ $when }}, elle sera traitée dans les plus bref délais.</p>
        <h4>Résumé</h4>
        <ul>
            @foreach($order['menus'] as $menu)
                @if($menu['quantity'] == 1)
                    <li>{{ $menu['size'] }} {{ $menu['title'] }}</li>
                @else
                    <li>{{ $menu['quantity'] }}x {{ $menu['size'] }} {{ $menu['title'] }}</li>
                @endif

                @if($menu['extras'])
                    @foreach($menu['extras'] as $extra)
                        <span>+ {{ $extra['title'] }}</span><br>
                    @endforeach
                @endif

                @if($menu['remark'])
                    <span>{{ $menu['remark'] }}</span><br>
                @endif
            @endforeach
        </ul>
        <p>Merci de vérifier <a href="https://lunch.brunswick-marine.com">lunch.brunswick-marine.com</a> pour plus d'informations sur les commandes.</p>
    @endif

    <hr style="border: 0.5px solid #eeeeee">
    <br>
    <a href="https://lunch.brunswick-marine.com">
        <img src="https://s3.eu-west-3.amazonaws.com/imb-brunswick/Cafeteria.png" alt="Brunswick logo" title="Brunswick logo" style="display: block" width="360" height="120">
    </a>
</body>
</html> 