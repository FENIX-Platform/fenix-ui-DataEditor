define(
    ['jquery'],
function ($) {
    this.defConfig = {
        'fSep': ',',
        'rSep': '\r\n',
        'quot': '"',
        'head': false,
        'trim': true
    }


    function CSV_To_Dataset(config,separator) {
        this.config = {
            'fSep': separator,
            'rSep': '\r\n',
            'quot': '"',
            'head': false,
            'trim': true
        };
        //defConfig.fSep = separator;
        $.extend(true, this.config,/* defConfig,*/ config);
        this.stringsArr;
    };

    CSV_To_Dataset.prototype.convert = function (csv) {
        this.stringsArr = toStringArray(csv, this.config);
        _cleanEmptyCols(this.stringsArr);
    };
    //Removes empty columns left by Excel
    function _cleanEmptyCols(data) {
        for (var c = data[0].length - 1; c >= 0 ; c--) {
            if (data[0][c].trim() == "") {
                _removeEmptyCol(data, c);
            }
        }
    };
    function _removeEmptyCol(data, colIndex) {
        for (var r = 0; r < data.length; r++) {
            data[r].splice(colIndex, 1);
        }
    };
    CSV_To_Dataset.prototype.getColumns = function () {
        return stringArrToCol(this.stringsArr);
    };
    CSV_To_Dataset.prototype.getData = function () {
        return stringArrToData(this.stringsArr);
    };
    function stringArrToCol(data) {
        if (!data)
            throw new Error("Nothing to parse");
        if (!data[0])
            throw new Error("Nothing to parse");

        return data[0];
    };
    function stringArrToData(data) {
        var toRet = [];
        for (i = 1; i < data.length; i++)
            toRet.push(data[i]);
        return toRet;
    };


    //Convert a CSV to a multidimentional strings array
    function toStringArray(str, o) {
        var a = [['']];
        for (var r = f = p = q = 0; p < str.length; p++) {
            switch (c = str.charAt(p)) {
                case o.quot:
                    if (q && str.charAt(p + 1) == o.quot) {
                        a[r][f] += o.quot;
                        ++p;
                    } else {
                        q ^= 1;
                    }
                    break;
                case o.fSep:
                    if (!q) {
                        if (o.trim) {
                            a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        }
                        a[r][++f] = '';
                    } else {
                        a[r][f] += c;
                    }
                    break;
                case o.rSep.charAt(0):
                    if (!q && (!o.rSep.charAt(1) || (o.rSep.charAt(1) && o.rSep.charAt(1) == str.charAt(p + 1)))) {
                        if (o.trim) {
                            a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        }
                        a[++r] = [''];
                        a[r][f = 0] = '';
                        if (o.rSep.charAt(1)) {
                            ++p;
                        }
                    } else {
                        a[r][f] += c;
                    }
                    break;
                default:
                    a[r][f] += c;
            }
        }
        if (o.head) {
            a.shift()
        }
        if (a[a.length - 1].length < a[0].length) {
            a.pop()
        }
        return a;
    };

    return CSV_To_Dataset;
});