// Variables globales utilisées dans l'application
let currentPage = "sommaire"; // Page courante affichée
let editMode = false; // Mode édition activé ou non
let appData = {}; // Objet pour stocker les données de l'application

// Initialisation au chargement complet de la page
document.addEventListener("DOMContentLoaded", function () {
  loadData(); // Charger les données sauvegardées dans le localStorage
  showPage("sommaire"); // Afficher la page "sommaire" par défaut
});

// Fonction de navigation entre les pages
function showPage(pageId) {
  // Masquer toutes les pages en supprimant la classe 'active'
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  // Afficher la page ciblée en ajoutant la classe 'active'
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
    currentPage = pageId; // Mettre à jour la page courante

    // Afficher ou masquer la barre de navigation selon la page
    const nav = document.getElementById("navigation");
    if (pageId === "sommaire") {
      nav.style.display = "none"; // Cacher la nav sur la page sommaire
    } else {
      nav.style.display = "flex"; // Afficher la nav sur les autres pages
    }

    // Faire défiler la page vers le haut pour une meilleure expérience utilisateur
    window.scrollTo(0, 0);
  }
}

/// ==================== CALCUL BARREAUDAGE ====================
let currentStep = 1; // Étape actuelle dans le calcul de barreaudage
let barreaudageData = {}; // Objet pour stocker les données intermédiaires

// Passer à l'étape suivante dans l'interface
function nextStep(step) {
  document.getElementById("step" + currentStep).classList.remove("active"); // Cacher l'étape actuelle
  currentStep = step; // Mettre à jour l'étape courante
  document.getElementById("step" + currentStep).classList.add("active"); // Afficher la nouvelle étape
}

// Revenir à l'étape précédente
function prevStep(step) {
  document.getElementById("step" + currentStep).classList.remove("active");
  currentStep = step;
  document.getElementById("step" + currentStep).classList.add("active");
}

// Met à jour l'affichage du DTU sélectionné dans le step1
function updateDTUText() {
  const intervalle = document.getElementById("intervalle").value;
  document.getElementById("dtu-value").textContent = intervalle + " mm";
  // Relancer le calcul étape 2 si valeurs déjà saisies
  calculateStep2();
}

// Calculs spécifiques à l'étape 2 du barreaudage
function calculateStep2() {
  // Récupérer les valeurs saisies par l'utilisateur et les convertir en nombres
  const cote = parseFloat(document.getElementById("cote-poteaux").value);
  const epaisseur = parseFloat(
    document.getElementById("epaisseur-barreaux").value
  );

  // Récupérer la valeur de l'intervalle choisi dans le step1 (90 ou 110 mm)
  const intervalle = parseInt(document.getElementById("intervalle").value, 10);

  // Vérifier que les trois valeurs sont valides (non nulles)
  if (cote && epaisseur && intervalle) {
    // Calcul du nombre d'intervalles nécessaires (arrondi vers le haut)
    const nbIntervalles = Math.ceil(cote / intervalle);

    // Stocker les données dans l'objet barreaudageData
    barreaudageData.cote = cote;
    barreaudageData.epaisseur = epaisseur;
    barreaudageData.nbIntervalles = nbIntervalles;
    barreaudageData.intervalle = intervalle;

    // Afficher le calcul à l'utilisateur (ex : "300 / 110 = 2.73 = 3 intervalles")
    document.getElementById(
      "calc-step2"
    ).textContent = `${cote} / ${intervalle} = ${(cote / intervalle).toFixed(
      2
    )} = ${nbIntervalles} intervalles`;

    document.getElementById("nb-intervalles").textContent = nbIntervalles;
    document.getElementById("result-step2").style.display = "block";
    document.getElementById("next-step2").style.display = "inline-block";

    // Calculer le nombre de barreaux (intervalles - 1)
    barreaudageData.nbBarreaux = nbIntervalles - 1;
    document.getElementById(
      "calc-step3"
    ).textContent = `${nbIntervalles} - 1 = ${barreaudageData.nbBarreaux}`;
    document.getElementById("nb-barreaux").textContent =
      barreaudageData.nbBarreaux;

    // Calculer la cote cumulée des barreaux (nombre × épaisseur)
    barreaudageData.coteCumuleeBarreaux =
      barreaudageData.nbBarreaux * epaisseur;
    document.getElementById(
      "calc-step4"
    ).textContent = `${barreaudageData.nbBarreaux} × ${epaisseur} = ${barreaudageData.coteCumuleeBarreaux}`;
    document.getElementById("cote-cumulee-barreaux").textContent =
      barreaudageData.coteCumuleeBarreaux;

    // Calculer la cote cumulée des intervalles (total - barreaux)
    barreaudageData.coteCumuleeIntervalles =
      cote - barreaudageData.coteCumuleeBarreaux;
    document.getElementById(
      "calc-step5"
    ).textContent = `${cote} - ${barreaudageData.coteCumuleeBarreaux} = ${barreaudageData.coteCumuleeIntervalles}`;
    document.getElementById("cote-cumulee-intervalles").textContent =
      barreaudageData.coteCumuleeIntervalles;

    // Calculer la cote entre chaque barreau (intervalles répartis uniformément)
    barreaudageData.coteEntreBarreaux = (
      barreaudageData.coteCumuleeIntervalles / nbIntervalles
    ).toFixed(1);
    document.getElementById(
      "calc-step6"
    ).textContent = `${barreaudageData.coteCumuleeIntervalles} / ${nbIntervalles} = ${barreaudageData.coteEntreBarreaux}`;
    document.getElementById("cote-entre-barreaux").textContent =
      barreaudageData.coteEntreBarreaux;
  }
}

// Réinitialiser tous les champs et l'état du calcul de barreaudage
function resetBarreaudage() {
  currentStep = 1; // Revenir à l'étape 1
  // Retirer la classe active de toutes les étapes
  document
    .querySelectorAll(".step")
    .forEach((step) => step.classList.remove("active"));
  document.getElementById("step1").classList.add("active"); // Activer la première étape

  // Vider les champs de saisie
  document.getElementById("cote-poteaux").value = "";
  document.getElementById("epaisseur-barreaux").value = "";

  // Réinitialiser le choix de l'intervalle à 110 mm (valeur par défaut)
  document.getElementById("intervalle").value = "110";
  document.getElementById("dtu-value").textContent = "110 mm";

  // Cacher les résultats affichés
  document.getElementById("result-step2").style.display = "none";
  document.getElementById("next-step2").style.display = "none";

  // Réinitialiser l'objet de données
  barreaudageData = {};
}

// ==================== VITESSE ROTATION PERÇAGE ====================
// Met à jour la vitesse de coupe en fonction du métal sélectionné
function updateVC() {
  const select = document.getElementById("metal-type"); // Liste déroulante des métaux
  const vcInput = document.getElementById("vitesse-coupe"); // Champ vitesse de coupe

  if (select.value) {
    vcInput.value = select.value; // Mettre à jour le champ vitesse coupe
    calculateRotation(); // Calculer la vitesse de rotation
  }
}

// Calculer la vitesse de rotation en tours/minutes (RPM)
function calculateRotation() {
  const vc = parseFloat(document.getElementById("vitesse-coupe").value); // vitesse de coupe (m/min)
  const d = parseFloat(document.getElementById("diametre-foret").value); // diamètre du foret (mm)

  if (vc && d) {
    // Formule de calcul de vitesse rotation : (1000 * Vc) / (pi * diamètre)
    const r = Math.round((1000 * vc) / (3.14159 * d));

    // Afficher les résultats calculés dans la page
    document.getElementById("vitesse-rotation").textContent = r;
    document.getElementById("vc-used").textContent = vc;
    document.getElementById("d-used").textContent = d;
    document.getElementById("rotation-result").style.display = "block"; // Montrer la section résultat
  }
}

// ==================== ESCALIER ====================
// Calculer les dimensions optimales d'un escalier selon la loi de Blondel
function calculateEscalier() {
  const hauteur = parseFloat(document.getElementById("hauteur-totale").value); // hauteur totale de l'escalier en cm
  const giron =
    parseFloat(document.getElementById("giron-souhaite").value) || 24; // giron souhaité (profondeur marche), valeur par défaut = 24 cm

  if (hauteur) {
    // Calculer la hauteur idéale de marche selon Blondel : 2H + G = 64 cm (en réalité 60-65 cm)
    const hauteurMarche = Math.round((640 - giron) / 2);

    // Calculer nombre de marches total
    const nbMarches = Math.round(hauteur / hauteurMarche);

    // Calcul hauteur réelle de chaque marche arrondie au dixième
    const hauteurReelle = Math.round((hauteur / nbMarches) * 10) / 10;

    // Appliquer la formule de Blondel avec les valeurs calculées
    const formuleBlondel = 2 * hauteurReelle + giron;

    // Calculer la longueur totale (sans la dernière marche)
    const longueurTotale = Math.round((nbMarches - 1) * giron);

    // Afficher tous les résultats calculés dans la page
    document.getElementById("hauteur-marche").textContent =
      hauteurReelle + " cm";
    document.getElementById("nb-marches").textContent = nbMarches;
    document.getElementById("formule-blondel").textContent =
      formuleBlondel.toFixed(1);
    document.getElementById("longueur-totale").textContent =
      longueurTotale + " cm";

    // Validation visuelle : vérifier si la formule de Blondel est conforme (entre 60 et 65 cm)
    const validation = document.getElementById("validation-blondel");
    if (formuleBlondel >= 600 && formuleBlondel <= 650) {
      validation.innerHTML =
        '<p style="color: #22c55e;">✅ Conforme à la loi de Blondel (60-65cm)</p>';
    } else {
      validation.innerHTML =
        '<p style="color: #f59e0b;">⚠️ Hors norme Blondel (recommandé: 60-65cm)</p>';
    }

    // Afficher la section des résultats
    document.getElementById("escalier-result").style.display = "block";
  }
}

// ==================== PLIAGE-COUDAGE ====================
// Calcul des paramètres pour un pliage/coudage d'une tôle
function calculatePliage() {
  const ri = parseFloat(document.getElementById("rayon-interieur").value); // rayon intérieur pliage (mm)
  const ep = parseFloat(document.getElementById("epaisseur-tole").value); // épaisseur tôle (mm)
  const angle = parseFloat(document.getElementById("angle-pliage").value); // angle pliage (degrés)

  if (ri && ep && angle) {
    // Calcul du rapport entre rayon intérieur et épaisseur
    const rapport = (ri / ep).toFixed(2);
    let positionFn, rayonFn;

    // Déterminer la position de la fibre neutre et son rayon selon le rapport ri/ep
    if (ri / ep <= 1) {
      positionFn = "1/3 épaisseur côté intérieur";
      rayonFn = ri + ep / 3;
    } else if (ri / ep <= 2) {
      positionFn = "2/5 épaisseur côté intérieur";
      rayonFn = ri + (2 * ep) / 5;
    } else {
      positionFn = "1/2 épaisseur côté intérieur (milieu)";
      rayonFn = ri + ep / 2;
    }

    // Calcul de la longueur développée du pliage
    const longueurDev =
      Math.round(((3.14159 * rayonFn * angle) / 180) * 100) / 100;

    // Affichage des résultats dans la page
    document.getElementById("rapport-ri-ep").textContent = rapport;
    document.getElementById("position-fn").textContent = positionFn;
    document.getElementById("rayon-fn").textContent = rayonFn.toFixed(2);
    document.getElementById("longueur-dev-pliage").textContent = longueurDev;
    document.getElementById("pliage-result").style.display = "block";
  }
}

// ==================== DÉVELOPPÉ CINTRAGE ====================
// Calcul des longueurs développées lors du cintrage d'un profilé
function calculateCintrage() {
  const ep = parseFloat(document.getElementById("epaisseur-profile").value); // épaisseur profilé (mm)
  const ri = parseFloat(document.getElementById("rayon-int-cintrage").value); // rayon intérieur cintrage (mm)
  const angle = parseFloat(document.getElementById("angle-cintrage").value); // angle cintrage (degrés)
  const longueursDroites =
    parseFloat(document.getElementById("longueurs-droites").value) || 0; // longueurs droites avant/après cintrage (mm)

  if (ep && ri && angle) {
    // Calcul du rayon fibre neutre
    const rfn = ri - ep / 2;

    // Calcul longueur développée cintrée selon angle
    const ldCintree = Math.round(((3.14159 * rfn * angle) / 180) * 100) / 100;

    // Longueur totale = longueur cintrée + droites
    const ldTotale = ldCintree + longueursDroites;

    // Cote machine selon angle (si pli à 180°, diviser par 2)
    const coteMachine = ldCintree / (angle === 180 ? 2 : 1);

    // Afficher les résultats dans la page
    document.getElementById("rfn-cintrage").textContent = rfn.toFixed(1);
    document.getElementById("ld-cintree").textContent = ldCintree;
    document.getElementById("ld-totale-cintrage").textContent = ldTotale;
    document.getElementById("cote-machine").textContent =
      coteMachine.toFixed(1);
    document.getElementById("cintrage-result").style.display = "block";
  }
}

// ==================== CALCUL SOUDAGE ====================
// Calcul intensité pour soudage MMA selon diamètre électrode
function calculateMMA() {
  const diametre = parseFloat(
    document.getElementById("diametre-electrode").value
  );
  if (diametre) {
    // Formule : intensité = 50 × (diamètre - 1)
    const intensite = 50 * (diametre - 1);
    document.getElementById("intensite-mma").textContent = intensite;
    document.getElementById("longueur-arc").textContent = diametre;
    document.getElementById("mma-result").style.display = "block";
  }
}

// Calcul intensité pour soudage MIG selon tension
function calculateMIG() {
  const tension = parseFloat(document.getElementById("tension-mig").value);
  if (tension) {
    // Formule : intensité = (tension - 14) × 20
    const intensite = (tension - 14) * 20;
    // Vérification tension adaptée
    const tensionVerif = 14 + 0.05 * intensite;

    // Affichage des résultats
    document.getElementById("intensite-mig").textContent = intensite;
    document.getElementById("tension-verif").textContent =
      tensionVerif.toFixed(1);
    document.getElementById("mig-result").style.display = "block";
  }
}

// ==================== FILTRES ET RECHERCHE DANS TABLES ====================
// Fonction générique pour filtrer les lignes d'un tableau selon une recherche
function filterTableBySearch(tableId, search) {
  const table = document.getElementById(tableId);
  if (!table) return; // Protection si la table n'existe pas

  const rows = table.getElementsByTagName("tr");
  const searchLower = search.toLowerCase();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchLower) ? "" : "none";
  }
}

// Fonctions spécifiques aux différents tableaux qui utilisent filterTableBySearch
function filterProcedes(search) {
  filterTableBySearch("procedes-table", search);
}

function filterVitesseCoupe(search) {
  filterTableBySearch("vitesse-coupe-table", search);
}

function filterDiametrePercage(search) {
  filterTableBySearch("diametre-percage-table", search);
}

// Filtrer les tables sous #classification-vis (plusieurs tableaux)
function filterClassificationVis(search) {
  const tables = document.querySelectorAll("#classification-vis table");
  const searchLower = search.toLowerCase();

  tables.forEach((table) => {
    const rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchLower) ? "" : "none";
    }
  });
}

// Filtrer des sections dans le contenu des poutrelles
function filterPoutrelles(search) {
  const content = document.getElementById("poutrelles-content");
  if (!content) return;

  const sections = content.querySelectorAll(
    'div[style*="background: rgba(255,255,255,0.05)"]'
  );
  const searchLower = search.toLowerCase();

  sections.forEach((section) => {
    const text = section.textContent.toLowerCase();
    section.style.display = text.includes(searchLower) ? "" : "none";
  });
}

// ==================== RECHERCHE GLOBALE DANS LES PAGES ====================
// Recherche texte dans toutes les pages sauf le sommaire
function globalSearch(search) {
  if (search.length < 2) return; // Ne lancer la recherche qu'à partir de 2 caractères

  const searchLower = search.toLowerCase();
  const pages = document.querySelectorAll(".page");
  const results = [];

  pages.forEach((page) => {
    if (page.id === "sommaire") return; // Ignorer le sommaire

    const content = page.textContent.toLowerCase();
    if (content.includes(searchLower)) {
      const title = page.querySelector("h2").textContent; // Récupérer le titre de la page
      results.push({
        title: title,
        id: page.id,
      });
    }
  });

  if (results.length > 0) {
    console.log("Résultats trouvés:", results);

    // Si un seul résultat, afficher directement la page correspondante
    if (results.length === 1) {
      showPage(results[0].id);
    }
  }
}

// ==================== FONCTIONS POUR AGRANDIR LES IMAGES ====================
function agrandirImage(img) {
  const modal = document.getElementById("modal");
  const imageAgrandie = document.getElementById("imageAgrandie");

  if (modal && imageAgrandie) {
    modal.style.display = "block";
    imageAgrandie.src = img.src;
  }
}

function fermerModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// ==================== MODE ÉDITION ====================
// Basculer entre mode édition et mode consultation
function toggleEditMode() {
  editMode = !editMode; // Inverser l'état du mode édition
  const btn = document.getElementById("editModeBtn");
  const pages = document.querySelectorAll(".page");

  if (editMode) {
    btn.textContent = "👁️ Mode Consultation"; // Modifier le texte du bouton
    btn.style.background = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"; // Couleur verte
    // Ajouter la classe "edit-mode" aux pages sauf le sommaire pour activer édition
    pages.forEach((page) => {
      if (page.id !== "sommaire") {
        page.classList.add("edit-mode");
      }
    });
  } else {
    btn.textContent = "✏️ Mode Édition"; // Texte bouton mode édition
    btn.style.background = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"; // Couleur orange
    // Retirer la classe "edit-mode" pour désactiver édition
    pages.forEach((page) => page.classList.remove("edit-mode"));
  }
}

// ==================== SAUVEGARDE ET IMPORT/EXPORT DES DONNÉES ====================
// Charger les données sauvegardées dans localStorage
function loadData() {
  const saved = localStorage.getItem("metallerie-data");
  if (saved) {
    try {
      appData = JSON.parse(saved);
    } catch (e) {
      console.error("Erreur chargement données:", e);
      appData = {};
    }
  }
}

// Sauvegarder les données dans localStorage
function saveData() {
  localStorage.setItem("metallerie-data", JSON.stringify(appData));
}

// Exporter les données sous forme de fichier JSON téléchargeable
function exportData() {
  const dataStr = JSON.stringify(appData, null, 2); // Format JSON lisible
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName =
    "metallerie-data-" + new Date().toISOString().split("T")[0] + ".json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click(); // Déclencher le téléchargement automatiquement
}

// Importer des données depuis un fichier JSON sélectionné par l'utilisateur
function importData(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        appData = imported;
        saveData(); // Sauvegarder localement les données importées
        alert("Données importées avec succès !");
        location.reload(); // Recharger la page pour appliquer les données
      } catch (error) {
        alert("Erreur lors de l'import : " + error.message);
      }
    };
    reader.readAsText(file); // Lire le contenu du fichier importé
  }
}

// ==================== SERVICE WORKER POUR PWA ====================
// Vérifier si le navigateur supporte les Service Workers
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("../sw.js")
      .then(function (registration) {
        console.log("ServiceWorker enregistré:", registration.scope);
      })
      .catch(function (error) {
        console.log("Erreur ServiceWorker:", error);
      });
  });
}

// ==================== AUTO-SAUVEGARDE ====================
// Sauvegarde automatique toutes les 30 secondes pour éviter perte de données
setInterval(saveData, 30000);
