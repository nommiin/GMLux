GMLux = {
    Transpile: function(input, output) {
        tInput = input.value; tOutput = output; tFound = false; tLocal = false; tOutput.value = "";
        for(tColumn = 0; tColumn < tInput.length; tColumn++) {
            // Token Loop
            for(tToken in GMLux.Tokens) {
                if (tInput.substring(tColumn, tColumn + tToken.length) == tToken) {
                    tColumn += tToken.length;
                    GMLux.Tokens[tToken]();
                    tFound = true;
                }
            }

            // Object Loop
            for(tObject in GMLux.Objects) {
                if (tInput.substring(tColumn, tColumn + tObject.length) == tObject) {
                    tColumn = GMLux.SeekChar(".");
                    tOutput.value += tObject + "[";
                    GMLux.Objects[tObject].forEach(function(tProperty, tIndex) {
                        if (tInput.substring(tColumn, tColumn + tProperty.length) == tProperty) {
                            tOutput.value += "/*" + tProperty + "*/" + tIndex + "]";
                            tColumn += tProperty.length - 1;
                            tFound = true;
                        }
                    });
                }
            }

            // Normal Character
            ((tFound) ? (tFound = false) : (tOutput.value += tInput[tColumn]));
        }

        // Cleanup Objects
        for(tObject in GMLux.Objects) {

        }
    },
    Properties: function(tObject, tProperties, tPosition=0) {
        var tMarker = tPosition, tString = false, tOrder = 0;
        while (tPosition < tProperties.length) {
            while (tProperties[tPosition++] != ",") {
                if (tPosition > tProperties.length) {
                    break;
                } else if (tProperties[tPosition] == "\"") {
                    if (tProperties[tPosition - 1] != "\\") {
                        tString = !tString;
                    }
                } else if (tProperties[tPosition] == ",") {
                    if (tString) {tPosition++;}
                }
            }
            GMLux.Property(tObject, tProperties.substring(tMarker, tPosition - 1).trim(), tOrder++);
            tMarker = tPosition;
        }
        tOutput.value += "];"
    },
    Property: function(tObject, tProperty, tOrder=0) {
        tHead = GMLux.SeekChar(":", 0, tProperty);
        tOutput.value += ((tOrder == 0) ? "" : ", ") + "/*" + tProperty.substring(0, tHead - 1) + "*/" + tProperty.substring(tHead, tProperty.length).trim();
        GMLux.Objects[tObject].push(tProperty.substring(0, tHead - 1));
    },
    SeekChar: function(tChar, tPosition=tColumn, _tInput=tInput) {
        while (_tInput[tPosition++] != tChar) {
            if (tPosition > tInput.length) {
                console.error("Unable to find character \"" + tChar + "\" in input.");
                break;
            }
        }
        return tPosition;
    },
    SkipChar: function(tChar, tPosition=tColumn, _tInput=tInput) {
        var c = 0;
        while (_tInput[tPosition++] == tChar);
        return tPosition;
    },
    Tokens: {
        "var": function() {
            tLocal = (tInput.substring(GMLux.SkipChar(" ") - 1, GMLux.SkipChar(" ") + 5) == "object");
        },
        "object": function() {
            // Object Name
            tHead = tColumn;
            tTail = GMLux.SeekChar("="); tColumn = tTail;
            tObject = tInput.substring(tHead, tTail - 1).trim();
            tOutput.value += "/*GMLuxCreate*/ " + ((tLocal) ? "var " : "") + tObject + " = [";
            GMLux.Objects[tObject] = [];
            
            // Object Properties
            tHead = GMLux.SeekChar("{", tTail + 1); tColumn = tHead;
            tTail = GMLux.SeekChar("}");            tColumn = tTail;
            GMLux.Properties(tObject, tInput.substring(tHead, tTail - 1).trim());

            tLocal = false;
        },
        "#gmlux": function() {
            // Transpiler Options
            tHead = GMLux.SeekChar("\n");
            switch (tInput.substring(tColumn, tHead).trim()) {
                case "gms1": {GMLux.Version = 1; break;}
                case "gms2": {GMLux.Version = 2; break;}
            }
            tColumn = tHead - 1;
        }
    },
    Objects: {},
    Version: 2
}