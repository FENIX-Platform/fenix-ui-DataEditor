define(['jquery',
    'fx-DataEditor/js/DataEditor/helpers/Validator_CSV_Errors',
],
    function ($, Err) {

        function Validator_CSV() { };

        Validator_CSV.prototype.validate = function (dsdCols, csvCols, csvData) {
            var toRet = [];

            if (!dsdCols) {
                toRet.push({ type: Err.DSD_COLUMNS_NULL });
                return toRet;
            }
            if (!csvCols) {
                toRet.push({ type: Err.CSV_COLUMNS_NULL });
                return toRet;
            }
            if (dsdCols.length != csvCols.length) {
                toRet.push({ type: Err.WRONG_COLUMN_COUNT });
                return toRet;
            }
            for (var i = 0; i < dsdCols.length; i++) {
                if (dsdCols[i].id != csvCols[i]) {
                    toRet.push({ type: Err.WRONG_COLUMN_ID, index: i });
                }
            }

            return toRet;
        };
        return new Validator_CSV();
    })