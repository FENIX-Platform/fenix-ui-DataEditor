define([
'jquery',
 '../../../nls/labels'
],
function ($, mlRes) {


    var ValidationResultsViewer = function (lang) {
        this.lang = lang;
        this.$valResGrid;
    };

    //Render - creation
    ValidationResultsViewer.prototype.render = function (container) {
        this.$valResGrid = container;
    }

    ValidationResultsViewer.prototype.setValidationResults = function (valRes) {
        this.$valResGrid.html();
        if (!valRes)  return;
        var toAdd = "";

        //console.log(this.lang,mlRes);

        toAdd = '<table><tbody>';

        for (var i = 0; i < valRes.length; i++) {
            toAdd += '<tr><td>';
            if (valRes[i].dataIndex) {
                toAdd += mlRes[this.lang.toLowerCase()][valRes[i].error];
                toAdd += ", "+mlRes[this.lang.toLowerCase()]['line']+": " + valRes[i].dataIndex;
                if (valRes[i].cListUID) toAdd += "; "+mlRes[this.lang.toLowerCase()]['codelist']+": " + valRes[i].cListUID;
                if (valRes[i].colId) {
                    var column = valRes[i].colId[this.lang.toUpperCase()] || valRes[i].colId[Object.keys(valRes[i].colId)[0]];
                    toAdd += "; "+mlRes[this.lang.toLowerCase()]['column']+": " + column;
                }
            }
            toAdd += '</tr></td>';
            //toAdd += "</br>";
        }
        toAdd += '</table></tbody>';

        this.$valResGrid.html(toAdd);
    }

    return ValidationResultsViewer;
});