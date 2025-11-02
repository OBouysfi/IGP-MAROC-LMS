Projet LMS IGP-Maroc

C’est une plateforme de formation en ligne pour IGP-Maroc permettant aux étudiants et professeurs d’accéder aux cours, documents et sessions live.

Stack technique :

Backend : Laravel + MySQL + Redis

Frontend : Next.js

Live Video : Jitsi Meet intégré

Containerisation : Docker / docker-compose

Ports utilisés (locaux) :

Backend Laravel : 87

Frontend Next.js : 3002

MySQL : 3311

Redis : 6385

phpMyAdmin : 8080

Objectif :
Offrir un LMS moderne, rapide et scalable, accessible aux étudiants et professeurs, avec gestion d’utilisateurs, accès aux cours et suivi des formations live.

Frontend → http://localhost:3002
Backend → http://localhost:87/api/login

docker run -p 3001:3000 --name igp_frontend_container igp_frontend

///////////////////==========================///////////////////////=
Ce qu'on a accompli:
✅ Base de données

Migrations complètes (users, roles, permissions, programs, courses, sessions, attendance)
Spatie Permission (roles: admin, professor, student)
Models avec relations

✅ Auth API Professionnelle

Register (validation complète)
Login avec rate limiting
2FA par email (code 6 chiffres, expiration 10min)
Verify 2FA + token Sanctum
Resend 2FA code
Device tracking
Login logs & attempts
Account locking après tentatives échouées
Me (user info)
Logout & Logout all devices
Password reset (forgot/reset)

✅ Sécurité

Rate limiting (5 tentatives/minute login)
Sanctum tokens avec expiration
2FA obligatoire
Device tracking (IP, browser, platform)
Login logs complets
Account locking automatique

Prochaines étapes possibles:

Admin Panel API (gérer users, courses, programs)
Professor Panel API (créer sessions Jitsi, attendance)
Student Panel API (voir cours, rejoindre sessions)
Intégration Next.js (consommer l'API)


************************************************
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   │
│   ├── login/                  # Student/Professor login
│   │   └── page.tsx
│   │
│   ├── register/               # Student/Professor register
│   │   └── page.tsx
│   │
│   ├── verify-2fa/             # 2FA verification
│   │   └── page.tsx
│   │
│   ├── forgot-password/        # Password reset
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── login/              # Admin login séparé
│   │   │   └── page.tsx
│   │   ├── layout.tsx          # Admin layout
│   │   └── dashboard/
│   │
│   ├── professor/
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │
│   └── student/
│       ├── layout.tsx
│       └── dashboard/