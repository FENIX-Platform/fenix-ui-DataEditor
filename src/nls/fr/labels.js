/*global define*/
define(function () {

    'use strict';

    return {

        "ok": "Ok",
        "cancel": "Annuler",
        "edit": "Modifier la ligne",
        "delete": "Supprimer la ligne",
        "confirmDelete": "Voulez-vous supprimer la ligne?",
        "unsavedData": "Certains changements n'ont pas été enregistrés, voulez-vous annuler quand même?",
        //"yearInterval": "L'année doit être numérique",
        //"monthInterval": "Le mois doit être numérique (1..12)",
        "btnClear": "Effacer toutes les données",
        "btnAdd": "Ajouter une ligne",


        nullDSDCols: 'Les colonnes dans le DSD ne sont pas définies.',
        nullCsvCols: 'Les colonnes dans le CSV ne sont pas définies.',
        wrongColumnCount: 'Décompte de colonne incorrect',
        missingDSDHeader: 'L\'en-tête du DSD est manquant',
        unknownCodes: 'Codes inconnus',
        csvDuplicate : 'Certaines lignes du CSV sont dupliquées',

        // errthrown
        columnError : 'Au moins une colonne doit être définie',
        missingCodelist: 'Liste des codes manquants pour la colonne ',
        missingCodelistSpecificStart: 'Liste des codes manquants ',
        missingCodelistSpecificEnd: ' pour la colonne ',


        "nullKey": "Les champs clés ne peuvent pas être vides",
        "sameKeyVals": "Les champs clés ne peuvent pas être dupliqués",
        "unknownCode": "Code inconnu",
        "invalidYear": "L'année n'est pas valable",
        "invalidMonth": "Le mois n'est pas valable",
        "invalidDate": "La date n'est pas valable",
        "invalidNumber": "Le nombre n'est pas valable",
        "invalidBool": "Le booléen n'est pas valable",

        "NAN": "La valeur n'est pas numérique",
        "OutOfRange": "La valeur est hors de l'intervalle autorisé",
        "Null": "La valeur ne peut pas être vide",
        "line": "ligne",
        "codelist" : "codeliste",
        "column" : "colonne",
        "CodeListError": "Toutes les lignes contiennent un code erroné. Veuillez vérifier que les codelistes dans le DSD soient correctes",

        "DataMatchColumn" : "Veuillez faire correspondre les colonnes du DSD avec celles du CSV",
        "DataDuplicateFound" : "Des valeurs dupliquées ont été trouvées, voulez-vous conserver les données anciennes ou les remplacer par les nouvelles valeurs que vous venez de télécharger?",
        "btnDataMergeKeepNew" : "Remplacer par les valeurs nouvelles",
        "btnDataMergeKeepOld" : "Conserver les valeurs anciennes"

    }
});