/*
 * Code pour la Web App du Quiz LACMÉ
 */

// Nom de l'onglet où les données seront sauvegardées
var SHEET_NAME = "QuizResponses";

/**
 * Fonction principale qui s'exécute lors d'une requête POST (envoi de données).
 */
function doPost(e) {
  try {
    // 1. Ouvre le Google Sheet actif et sélectionne l'onglet
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);

    // Si l'onglet n'existe pas, on le crée
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      // Ajoute l'en-tête Temps pour le chronomètre
      sheet.appendRow(["Timestamp", "Prenom", "Nom", "Email", "Score", "Temps"]);
    }

    // --- NOUVEAU : VÉRIFICATION DE L'EMAIL ---
    if (e.parameter.action === 'checkEmail') {
      var emailToCheck = e.parameter.email;
      var data = sheet.getDataRange().getValues();
      var exists = false;
      
      // On boucle sur les lignes (en ignorant la ligne 0 qui contient les en-têtes)
      for (var i = 1; i < data.length; i++) {
        // Dans l'en-tête, l'Email est en 4ème position : index 3
        if (data[i][3] === emailToCheck) {
          exists = true;
          break;
        }
      }
      
      // Renvoie le résultat de la vérification
      return ContentService
        .createTextOutput(JSON.stringify({ "exists": exists }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    // -----------------------------------------

    // 2. Comportement normal : Récupère les données envoyées depuis le quiz à la fin
    var prenom = e.parameter.prenom;
    var nom = e.parameter.nom;
    var email = e.parameter.email;
    var score = e.parameter.score;
    var temps = e.parameter.temps; // NOUVEAU : Récupère le temps de participation
    var timestamp = new Date();

    // 3. Ajoute une nouvelle ligne avec les données
    sheet.appendRow([timestamp, prenom, nom, email, score, temps]);

    // 4. Renvoie une réponse de succès au format JSON
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 5. En cas d'erreur, renvoie un message d'erreur
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fonction nécessaire pour que le navigateur autorise la connexion
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
