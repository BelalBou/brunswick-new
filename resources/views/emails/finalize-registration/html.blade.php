<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Finalisation de l'inscription</title>
</head>
<body>
    @if($lang === 'en')
        <p>Hello {{ $customerName }},</p>
        <p>To finalize your registration, please click on the link below:</p>
        <a href="{{ $passwordLink }}">Finalize my registration</a>
    @else
        <p>Bonjour {{ $customerName }},</p>
        <p>Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="{{ $passwordLink }}">Finaliser mon inscription</a>
    @endif

    <hr style="border: 0.5px solid #eeeeee">
    <br>
    <a href="https://lunch.brunswick-marine.com">
        <img src="https://s3.eu-west-3.amazonaws.com/imb-brunswick/Cafeteria.png" alt="Brunswick logo" title="Brunswick logo" style="display: block" width="360" height="120">
    </a>
</body>
</html> 