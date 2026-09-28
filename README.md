# AD LMS

Plateforme d’apprentissage de l’anglais professionnel pour le parcours TP Assistant de Direction (AD).
Dupliquée depuis la LMS CADGA le 28/09/2026 ; les contenus propres aux AD (accueil téléphonique en anglais) restent à adapter.

## Développement

Prérequis : Node.js 22.13 ou supérieur.

```bash
npm install
npm run dev
```

Variables d’environnement à définir sur Vercel (reprendre celles du projet CADGA) : `ELEVENLABS_API_KEY` et les autres clés utilisées par les routes `/api`.
