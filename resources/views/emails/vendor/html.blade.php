<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Récapitulatif des commandes</title>
</head>
<body>
    <p>Bonjour Caissier,</p>
    <p>Voici un récapitulatif des articles commandés :</p>
    
    @foreach($vendors as $vendor)
        <h4>{{ $vendor['name'] }}</h4>
        <ul>
            @foreach($vendor['orders'] as $order)
                <li>Catégorie « {{ $order['categoryName'] }} » : {{ $order['count'] }} articles</li>
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