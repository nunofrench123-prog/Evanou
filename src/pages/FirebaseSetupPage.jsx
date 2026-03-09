import { Plane, Heart, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group mt-2">
      <pre className="bg-gray-900 text-green-400 text-sm rounded-xl p-4 overflow-x-auto font-mono whitespace-pre-wrap">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        title="Copier"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

const STEPS = [
  {
    num: 1,
    title: 'Créer un projet Firebase',
    content: (
      <ol className="space-y-2 text-gray-600 text-sm">
        <li>
          1. Allez sur{' '}
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-500 hover:underline font-medium inline-flex items-center gap-1"
          >
            console.firebase.google.com <ExternalLink className="w-3 h-3" />
          </a>
        </li>
        <li>2. Cliquez sur <strong>« Ajouter un projet »</strong></li>
        <li>3. Donnez un nom à votre projet (ex : <em>evanou</em>)</li>
        <li>4. Suivez les étapes et cliquez sur <strong>« Créer le projet »</strong></li>
      </ol>
    ),
  },
  {
    num: 2,
    title: "Récupérer la configuration Firebase",
    content: (
      <ol className="space-y-2 text-gray-600 text-sm">
        <li>1. Dans la console Firebase, cliquez sur l'icône <strong>⚙️ Paramètres</strong> puis <strong>Paramètres du projet</strong></li>
        <li>
          2. Faites défiler jusqu'à <strong>« Vos applications »</strong> et cliquez sur l'icône
          Web <strong>« &lt;/&gt; »</strong>
        </li>
        <li>3. Donnez un nom à l'app (ex : <em>evanou-web</em>) et cliquez sur <strong>« Enregistrer l'application »</strong></li>
        <li>
          4. Copiez les valeurs de <code className="bg-gray-100 px-1 rounded">firebaseConfig</code> affichées
        </li>
      </ol>
    ),
  },
  {
    num: 3,
    title: 'Activer Email/Mot de passe (Authentication)',
    content: (
      <ol className="space-y-2 text-gray-600 text-sm">
        <li>1. Dans le menu de gauche, cliquez sur <strong>« Authentication »</strong></li>
        <li>2. Cliquez sur <strong>« Commencer »</strong></li>
        <li>
          3. Dans l'onglet <strong>« Méthodes de connexion »</strong>, activez{' '}
          <strong>« E-mail/Mot de passe »</strong>
        </li>
        <li>4. Cliquez sur <strong>« Enregistrer »</strong></li>
      </ol>
    ),
  },
  {
    num: 4,
    title: 'Créer la base de données Firestore',
    content: (
      <ol className="space-y-2 text-gray-600 text-sm">
        <li>1. Dans le menu de gauche, cliquez sur <strong>« Firestore Database »</strong></li>
        <li>2. Cliquez sur <strong>« Créer une base de données »</strong></li>
        <li>3. Choisissez <strong>« Mode production »</strong> et cliquez sur <strong>« Suivant »</strong></li>
        <li>4. Choisissez une région (ex : <em>europe-west1</em>) et cliquez sur <strong>« Activer »</strong></li>
        <li>
          5. Dans l'onglet <strong>« Règles »</strong>, remplacez les règles par :
        </li>
        <CodeBlock>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
        </CodeBlock>
        <li>6. Cliquez sur <strong>« Publier »</strong></li>
      </ol>
    ),
  },
  {
    num: 5,
    title: 'Créer le fichier .env',
    content: (
      <>
        <p className="text-gray-600 text-sm mb-2">
          À la racine du projet, créez un fichier <code className="bg-gray-100 px-1 rounded">.env</code> et
          copiez-y les valeurs Firebase :
        </p>
        <CodeBlock>
{`VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id`}
        </CodeBlock>
        <p className="text-gray-500 text-xs mt-2">
          💡 Un fichier <code className="bg-gray-100 px-1 rounded">.env.example</code> se trouve déjà dans le projet comme modèle.
        </p>
      </>
    ),
  },
  {
    num: 6,
    title: 'Relancer le serveur de développement',
    content: (
      <>
        <p className="text-gray-600 text-sm mb-2">
          Après avoir créé le fichier <code className="bg-gray-100 px-1 rounded">.env</code>, arrêtez et
          relancez le serveur :
        </p>
        <CodeBlock>{`npm run dev`}</CodeBlock>
        <p className="text-gray-500 text-xs mt-2">
          ⚠️ Vite ne recharge pas automatiquement les nouvelles variables d'environnement — un redémarrage est nécessaire.
        </p>
      </>
    ),
  },
];

export default function FirebaseSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 shadow-xl mb-4">
            <Plane className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            Evanou
          </h1>
          <p className="text-gray-500 mt-1 flex items-center justify-center gap-1.5">
            Nos voyages <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> à deux
          </p>
        </div>

        {/* Warning banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex gap-3">
          <span className="text-2xl shrink-0">⚙️</span>
          <div>
            <h2 className="font-bold text-amber-800 text-base">Configuration Firebase manquante</h2>
            <p className="text-amber-700 text-sm mt-1">
              L'application ne peut pas démarrer car Firebase n'est pas encore configuré.
              Suivez les étapes ci-dessous pour connecter votre projet Firebase.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 mb-3">{step.title}</h3>
                  {step.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Done note */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-green-800 text-sm">
              Une fois la configuration terminée
            </h3>
            <p className="text-green-700 text-sm mt-1">
              Rechargez cette page et vous serez redirigé vers la page de connexion pour créer vos
              deux comptes (le vôtre et celui de votre copine). Toutes les modifications seront
              synchronisées en temps réel entre vos deux appareils 🎉
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 mb-4">
          Votre espace privé pour organiser vos aventures 🌍
        </p>
      </div>
    </div>
  );
}
