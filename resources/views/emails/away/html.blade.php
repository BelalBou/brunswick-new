<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Notification d'absence</title>
</head>
<body>
    @if($lang === 'en')
        <p>Hello {{ $customerName }},</p>
        <p>The supplier is on vacation you will not receive the following order.</p>
        <h4>Summary</h4>
        <ul>
            <li>{{ $menu['title_en'] }}</li>
        </ul>
        <p>Please check <a href="https://lunch.brunswick-marine.com">lunch.brunswick-marine.com</a> for more details about the orders.</p>
    @else
        <p>Bonjour {{ $customerName }},</p>
        <p>Le fournisseur est en vacance vous ne recevrez pas la commande suivante</p>
        <h4>Résumé</h4>
        <ul>
            <li>{{ $menu['title'] }}</li>
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