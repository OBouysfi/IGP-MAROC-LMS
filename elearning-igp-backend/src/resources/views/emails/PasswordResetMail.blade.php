<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Réinitialisation du mot de passe</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #C1272D;
        }
        .header h2 {
            color: #C1272D;
            font-size: 28px;
            margin: 0;
        }
        .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background-color: #C1272D; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
        }
        .button:hover {
            background-color: #8B1B1F;
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
            font-size: 12px; 
            color: #666;
            text-align: center;
        }
        .alert {
            background-color: #fff5f5;
            padding: 15px;
            border-left: 4px solid #C1272D;
            margin: 20px 0;
            border-radius: 4px;
        }
        .link {
            word-break: break-all;
            color: #C1272D;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔐 Réinitialisation du mot de passe</h2>
        </div>
        
        <p>Bonjour {{ $user->first_name }} {{ $user->last_name }},</p>
        
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte IGP Maroc.</p>
        
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{ $url }}" class="button">Réinitialiser mon mot de passe</a>
        </p>
        
        <div class="alert">
            <p><strong>Si le bouton ne fonctionne pas</strong>, copiez et collez ce lien dans votre navigateur :</p>
            <p><a href="{{ $url }}" class="link">{{ $url }}</a></p>
        </div>
        
        <p><strong>⏰ Ce lien expirera dans 60 minutes</strong> pour des raisons de sécurité.</p>
        
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre compte reste sécurisé.</p>
        
        <p>Pour des raisons de sécurité, ne partagez pas cet email avec qui que ce soit.</p>
        
        <div class="footer">
            <p>Cet email a été envoyé automatiquement. Veuillez ne pas répondre à ce message.</p>
            <p>Si vous avez besoin d'aide, contactez notre équipe support.</p>
            <p>&copy; {{ date('Y') }} IGP MAROC. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>