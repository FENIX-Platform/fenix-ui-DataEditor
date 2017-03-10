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
                toAdd += mlRes[this.lang.toLowerCase()][valRes[i].type];
                var lines = "";
                if (Array.isArray(valRes[i].dataIndex)) {
                    $.each(valRes[i].dataIndex, function(index,obj){
                        if (valRes[i].error != 'csvDuplicate')
                            $("#tblDataBody tr:nth-child("+(obj+1)+")")
                                .css('background-color','rgba(255,0,0,0.1)')
                                .css('color','red');
                        lines += obj+1 + " ";
                    });
                } else {
                    lines = valRes[i].dataIndex;
                }
                toAdd += ", "+mlRes[this.lang.toLowerCase()]['line']+": " + lines;
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