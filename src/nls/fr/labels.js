/*global define*/
define(function () {

    'use strict';

    return {

        "ok": "Ok",
        "cancel": "Annuler",
        "confirmDelete": "Supprimer?",
        "unsavedData": "Certains changements n'ont pas été enregistrés, annuler quand même?",
        //"yearInterval": "L'année doit être numérique",
        //"monthInterval": "Le mois doit être numérique (1..12)",

        nullDSDCols: 'Les colonnes DSD ne sont pas définies.',
        nullCsvCols: 'Les colonnes CSV ne sont pas définies.',
        wrongColumnCount: 'Compte de colonne erronée',
        missingDSDHeader: 'L\'en-tête DSD est manquant',
        unknownCodes: 'Codes inconnus',
        csvDuplicate : 'Lignes CSV dupliquées',


        "nullKey": "Les champs clés ne peuvent pas être vides",
        "sameKeyVals": "Les champs clés ne peuvent pas être dupliqués",
        "unknownCode": "Code inconnu",
        "invalidYear": "L'année n'est pas valable",
        "invalidMonth": "Le mois n'est pas valable",
        "invalidDate": "La date n'est pas valable",
        "invalidNumber": "Le nombre n'est pas valable",
        "invalidBool": "Booléen n'est pas valable",

        "NAN": "La valeur n'est pas numérique",
        "OutOfRange": "La valeur est hors de la plage autorisée",
        "Null": "La valeur ne peut pas être vide",
        "line": "ligne",
        "codelist" : "liste de codes",
        "column" : "colonne",
        "CodeListError": "Toutes les lignes ont une mauvaise liste de codes. Veuillez vérifier le DSD pour le bon type de liste de codes.",

        "DataMatchColumn" : "Faites correspondre les colonnes DSD avec les colonnes CSV",
        "DataDuplicateFound" : "Certaines valeurs dupliquées trouvées, conserver les données anciennes ou remplacer par les nouvelles valeurs que vous venez de télécharger?",
        "btnDataMergeKeepNew" : "Remplacer par une nouvelle valeur",
        "btnDataMergeKeepOld" : "Conserver les anciennes valeurs"

    }
});