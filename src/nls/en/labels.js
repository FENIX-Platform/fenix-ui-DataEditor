/*global define*/
define(function () {

    'use strict';

    return {

        "ok": "Ok",
        "cancel": "Cancel",
        "confirmDelete": "Delete?",
        "unsavedData": "Some changes are unsaved, cancel anyway?",
        //"yearInterval": "Year must be a number ",
        //"monthInterval": "Month must be a number (1..12)",

        nullDSDCols: 'DSD columns are not setted.',
        nullCsvCols: 'CSV columns are not setted.',
        wrongColumnCount: 'Wrong Column Count',
        missingDSDHeader: 'DSD Header is missing',
        unknownCodes: 'Unknow codes',


        "nullKey": "Key fields cannot be empty",
        "sameKeyVals": "Key fields cannot be duplicated",
        "unknownCode": "Unknown code",
        "invalidYear": "Year is not valid",
        "invalidMonth": "Month is not valid",
        "invalidDate": "Date is not valid",
        "invalidNumber": "Number is not valid",
        "invalidBool": "Boolean is not valid",

        "NAN": "Value is not a number",
        "OutOfRange": "Value is out of the allowed range",
        "Null": "Value cannot be blank",
        "line": "line",
        "CodeListError": "All lines have wrong codelist. Please check the DSD for the right kind of codelist.",

        "DataMatchColumn" : "Match the DSD columns with the CSV ones",
        "DataDuplicateFound" : "Some duplicated values found, keep old data or replace with the new values just uploaded?",
        "btnDataMergeKeepNew" : "Replace with new value",
        "btnDataMergeKeepOld" : "Keep old values"
    }
});
