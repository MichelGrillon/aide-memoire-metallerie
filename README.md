# aide-memoire-metallerie
Site PWA et APK pour une application d'aide mémoire de métallerie-soudeur

Objectifs :

- pouvoir se référer à des informations en cas d'oublis, de mémoire défaillante ou de doute => organisation par rubriques (calcul, références, etc)
- pouvoir effectuer quelques calculs (baraudage, percage, etc) directement en ayant des choix (DTU ou autres) => JavaScript
- l'application doit fonctionner hors réseaux (ni mobile, ni wifi) afin d'être utilisable partout et surtout en atelier => choix de PWA puis ensuite d'un APK
- le design, l'utilisation, l'UX doivent être proche voire identique à ce qui se fait pour mobile => CSS responsive
- on doit pouvoir faire des modifications de parametres et de données à la volée et les sauvegardés (y compris fichier JSON) => création de boutons "editer" et "sauvegarder"

La partie PWA :

Dans un premier temps, les codes utilisés ne permettaient pas une mise en cache dans les navigateurs mobiles (Chrome ou Firefox).
De ce fait, si on mettait le mobile en mode avion, ou si on coupait le wifi, le site était hors ligne.
Les codes correspondants dans le dossier A.

Dans un second temps, modification du code pour palier la non prise en charge/ chargement/modification du cache en ne prenant plus en compte le service worker (sw.js donc le JavaScript lié) ni le manifest.json afin d'être utilisable hors-ligne.
Les codes correspondants dossier B.

A noter : le fichier metallerie-pwa.html (qui fait office de page d'accueil) a deux encodages pour les images :

Dossier A :
<!-- AU LIEU DE ÇA : -->
img src="data:image/jpeg;base64,/9j/4AAQ..." alt="Exemple"
<!-- IL Y A : -->
img src="VOTRE_CODE_BASE64_COMPLET_ICI" alt="Ma vraie image"
Donc pas de dossier "images".

Dossier B :
<!-- AU LIEU DE ÇA : -->
img src="VOTRE_CODE_BASE64_COMPLET_ICI" alt="Ma vraie image"
<!-- IL Y A : -->
img src="data:image/jpeg;base64,/9j/4AAQ..." alt="Exemple"
Donc présence d'un dossier "images".

Structures :

Dossier A :
Pas de dossier, 3 fichiers : manifest.json, sw.js et metallerie-pwa.html.
Les styles CSS et les scripts JavaScripts de calculs et autres, sont intégré dans le fichier html.

Dossier B :
3 dossiers : css (avec le fichier styles.css), js (avec le fichier scripts.js) et images (avec toutes les images du site).
3 fichiers à la racine : manifest.json, sw.js et metallerie-pwa.html
Les styles CSS et les scripts JavaScripts ne sont pas dans le code du fichier html, ils sont appellés à partir de celui çi.


L'application APK :

Je voulais aller plus loin que le site, plus simple d'ajout (site pwa = copies des fichiers vers le mobile puis création du raccourcis vers l'accueil du mobile à partir du site).
Alors que pour l'apk, copie du fichier, installation de l'application automatique aprés la vérification de Google...
Je voulais aussi avoir une base pour créer une application.
Pour faciliter les chose, mon fichier "metallerie-pwa.html" a été renommé en "index.html".
J'ai utilisé le dossier B (donc avec les dossiers "js", "images" et "css", bref, toute sa structure).

Tout a été fait en ligne de commande :

1. Création initiale du projet :
- Installer Node.js et Capacitor : `npm install --global @capacitor/cli`
- Créer un dossier pour le projet et y placer les fichiers de la PWA (`index.html`, `manifest.json`,etc.)
- Initialiser Capacitor : `npx cap init nom-app com.example.nomapp`
- Ajouter Android : `npx cap add android`

2. Compilation initiale de l'APK :
- Copier les fichiers web dans le projet Android : `npx cap copy`
- Aller dans le dossier Android : `cd android`
- Compiler en debug : `gradlew.bat assembleDebug`
- Récupérer l'APK dans : `android/app/build/outputs/apk/debug/app-debug.apk`

Actuellement, l'APK n'est pas signé, cela sera fait lors d'une prochaine mise à jour (v2) qui concernera quelques bugs de mise en page (tableaux trops grands, etc..).
