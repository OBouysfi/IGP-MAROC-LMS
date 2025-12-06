# 🔧 Guide de Résolution : Problème de Stockage des Fichiers

## 📋 Symptômes
- Les fichiers ne sont pas stockés sur le serveur
- `file_path` enregistré en base de données = `"0"` au lieu du chemin réel
- URL générée : `https://lms.igp-maroc.com/storage/0` (404)
- Le projet fonctionne en local mais pas en production (VPS)

---

## ✅ Solution Complète

### 1. Configuration Laravel (`.env`)

Vérifiez que le fichier `.env` contient :

```env
FILESYSTEM_DISK=public
# OU (ancienne version Laravel)
FILESYSTEM_DRIVER=public
```

**Vérification dans le container :**
```bash
docker exec -it igp_backend_app bash
php artisan tinker
config('filesystems.default')
# Doit afficher : "public"
```

**Si ça affiche "local", videz le cache :**
```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

---

### 2. Lien Symbolique

Créez le lien symbolique entre `public/storage` et `storage/app/public` :

```bash
docker exec -it igp_backend_app bash
php artisan storage:link
```

**Vérification :**
```bash
ls -la public/ | grep storage
# Doit afficher : storage -> ../storage/app/public
```

---

### 3. Permissions des Dossiers ⚠️ **CRITIQUE**

C'était le problème principal. Les dossiers de stockage doivent avoir les bonnes permissions.

**Solution rapide (développement) :**
```bash
docker exec -it igp_backend_app bash
chmod -R 777 storage/app/public/
```

**Solution sécurisée (production recommandée) :**
```bash
chmod -R 775 storage/app/public/
chown -R www-data:www-data storage/app/public/
```

**Dossiers concernés :**
- `storage/app/public/avatars`
- `storage/app/public/course-resources`
- `storage/app/public/documents`
- `storage/app/public/justifications`
- `storage/app/public/professor-documents`

---

### 4. Configuration Nginx - Limite de Taille d'Upload

Éditez `/etc/nginx/sites-available/lms.igp-maroc.com` :

```nginx
server {
    listen 443 ssl http2;
    server_name lms.igp-maroc.com;
    
    # Autoriser les fichiers jusqu'à 200MB
    client_max_body_size 200M;
    client_body_timeout 300s;

    # Route pour servir les fichiers du storage
    location ^~ /storage/ {
        proxy_pass http://127.0.0.1:88/storage/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # API Laravel
    location ^~ /api {
        client_max_body_size 200M;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        proxy_pass http://127.0.0.1:88;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Frontend Next.js
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name lms.igp-maroc.com;
    return 301 https://$server_name$request_uri;
}
```

**Recharger Nginx :**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 5. Configuration PHP (Limites d'Upload)

Vérifiez les limites PHP :

```bash
docker exec -it igp_backend_app bash
php -i | grep -E "upload_max_filesize|post_max_size"
```

Si nécessaire, modifiez `php.ini` :
```ini
upload_max_filesize = 200M
post_max_size = 200M
max_execution_time = 300
memory_limit = 256M
```

---

### 6. Nettoyage des Données Corrompues

Supprimez les anciens documents avec `file_path = "0"` :

```bash
docker exec -it igp_backend_app bash
php artisan tinker
```

```php
use App\Models\ProfessorDocument;

// Compter les documents corrompus
$count = ProfessorDocument::where('file_path', '0')->count();
echo "Documents corrompus: {$count}\n";

// Supprimer
ProfessorDocument::where('file_path', '0')->delete();
echo "Suppression terminée\n";
```

---

## 🧪 Tests de Vérification

### Test 1 : Configuration Laravel
```bash
docker exec -it igp_backend_app bash
php artisan tinker
config('filesystems.default')
# Doit afficher : "public"
```

### Test 2 : Stockage manuel
```php
use Illuminate\Support\Facades\Storage;

Storage::disk('public')->put('test.txt', 'Test content');
Storage::disk('public')->exists('test.txt');
# Doit afficher : true

Storage::disk('public')->url('test.txt');
# Doit afficher : "https://lms.igp-maroc.com/storage/test.txt"
```

### Test 3 : Vérifier l'URL dans le navigateur
```
https://lms.igp-maroc.com/storage/test.txt
```
Le fichier doit s'afficher (pas de 404).

### Test 4 : Upload réel depuis la plateforme
1. Uploader un document via l'interface professeur
2. Vérifier que l'URL est correcte (pas `/storage/0`)
3. Cliquer sur le fichier pour vérifier qu'il est accessible

---

## 🔍 Diagnostic en Cas de Problème

### Vérifier les logs Laravel
```bash
docker exec -it igp_backend_app tail -f storage/logs/laravel.log
```

### Vérifier les logs Nginx
```bash
sudo tail -f /var/log/nginx/error.log
```

### Vérifier l'espace disque
```bash
docker exec -it igp_backend_app df -h
```

### Vérifier les fichiers uploadés
```bash
docker exec -it igp_backend_app bash
ls -la storage/app/public/professor-documents/
```

---

## 📝 Checklist Finale

- [ ] `FILESYSTEM_DISK=public` dans `.env`
- [ ] `config('filesystems.default')` retourne `"public"`
- [ ] Lien symbolique `public/storage` existe
- [ ] Permissions `775` ou `777` sur `storage/app/public/`
- [ ] Propriétaire `www-data:www-data` sur les dossiers
- [ ] `client_max_body_size 200M;` dans Nginx
- [ ] Route `/storage/` configurée dans Nginx
- [ ] Nginx rechargé : `sudo systemctl reload nginx`
- [ ] Containers Docker redémarrés
- [ ] Test manuel fonctionne (Tinker)
- [ ] Upload depuis la plateforme fonctionne
- [ ] URL des fichiers accessible dans le navigateur

---

## 🎯 Résumé de la Cause Racine

Le problème principal était **les permissions insuffisantes** sur le dossier `storage/app/public/`. 

Laravel ne pouvait pas écrire les fichiers, donc `storeAs()` retournait `false` (converti en `"0"` lors de l'enregistrement en base de données), créant des URLs invalides comme `/storage/0`.

**Solution finale :** `chmod -R 777 storage/app/public/` (ou `775` avec `www-data`)

---

## 📚 Références

- [Documentation Laravel - File Storage](https://laravel.com/docs/filesystem)
- [Nginx - Client Max Body Size](http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
- [Docker - File Permissions](https://docs.docker.com/storage/bind-mounts/#configure-the-selinux-label)









---------------------------------------------------------------------------------------------------------------------------

### Fixed : error connexion
docker exec -it igp_backend_app bash

# Corrigez la config nginx
cat > /etc/nginx/http.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html/public;
    
    index index.php index.html;
    
    client_max_body_size 100m;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# Rechargez nginx
nginx -t
nginx -s reload

exit


curl -X POST https://lms.igp-maroc.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bouysfi.othman@gmail.com","password":"123456789"}' \
  -k

-------------------------------------------------------------------------------------------------------

## Fixed probleme files :

docker exec -it igp_backend_app bash

# Permissions 777 pour tous les sous-dossiers de storage/app/public/
chmod -R 777 storage/app/public/avatars
chmod -R 777 storage/app/public/course-resources
chmod -R 777 storage/app/public/documents
chmod -R 777 storage/app/public/justifications
chmod -R 777 storage/app/public/professor-documents

# Ou en une seule commande pour tout le dossier public
chmod -R 777 storage/app/public/

# Vérification
ls -la storage/app/public/
-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------

cd /home/igp/elearning-igp-backend/docker
./fix-permissions.sh

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------