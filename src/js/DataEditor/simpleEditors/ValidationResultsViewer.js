define([
'jquery',
 '../../../nls/labels'
],
function ($, mlRes) {


    var ValidationResultsViewer = function () {
        this.$valResGrid;
    };

    //Render - creation
    ValidationResultsViewer.prototype.render = function (container) {
        this.$valResGrid = container;
        console.log("ValidationResultsViewer redered");
    }

    ValidationResultsViewer.prototype.setValidationResults = function (valRes) {
        this.$valResGrid.html();
        if (!valRes)
            return;
        var toAdd = "";

        toAdd = '<table><tbody>';

        for (var i = 0; i < valRes.length; i++) {
            toAdd += '<tr><td>';
            toAdd += mlRes[valRes[i].error];
            if (valRes[i].dataIndex)
                toAdd += " line: " + valRes[i].dataIndex;
            toAdd += '</tr></td>';
            //toAdd += "</br>";
        }
        toAdd += '</table></tbody>';

        this.$valResGrid.html(toAdd);
    }

    return ValidationResultsViewer;
});