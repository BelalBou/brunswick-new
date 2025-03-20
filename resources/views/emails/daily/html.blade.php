<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Commandes du jour</title>
</head>
<body>
    <p>Bonjour {{ $supplierName }},</p>
    <p>Voici les commandes du jour :</p>
    
    @foreach($orders as $order)
        <h4>{{ $order['customerName'] }}</h4>
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
    @endforeach

    <p>Merci de vérifier <a href="https://lunch.brunswick-marine.com">lunch.brunswick-marine.com</a> pour plus d'informations sur les commandes.</p>
    
    <hr style="border: 0.5px solid #eeeeee">
    <br>
    <a href="https://lunch.brunswick-marine.com">
        <img src="https://s3.eu-west-3.amazonaws.com/imb-brunswick/Cafeteria.png" alt="Brunswick logo" title="Brunswick logo" style="display: block" width="360" height="120">
    </a>
</body>
</html> 