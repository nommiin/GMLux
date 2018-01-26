GMLux = {
    Line: 1, Column: 0,
    Tokens: {
        "object": function() {
            tHead = tPosition;
            tTail = GMLux.SeekChar("="); tPosition = tTail;
            tObject = tInput.substring(tHead, tTail).trim();
            output.value += "/*GMLux Object Creation*/ " + tObject + " = ds_map_create();"; GMLux.Objects[tObject] = [];
            tHead = GMLux.SeekChar("{"); tPosition = tHead;
            tTail = GMLux.SeekChar("}"); tPosition = tTail;
            GMLux.Properties(tObject, tInput.substring(tHead + 1, tTail));
            if (tInput[tTail + 1] == ";") {tPosition++;}
            console.log("Position: " + tPosition);
        },
        "function": function() {console.log("yuhuhu")}
    },
    Objects: [

    ],
    SeekChar: function(char, input=tInput, position=tPosition) {
        while (input[position++] != char) {
            if (position > tInput.length) {
                console.error("Could not find character \"" + char + "\" in script");
                return -1;
            }
        }
        console.log("Found character \"" + char + "\" in input");
        //tPosition = position - 1;
        return position - 1;
    },
    Properties: function(object, properties, position=0) {
        head = position;
        while (position < properties.length) {
            if (properties[position++] == ":") {
                var pName = properties.substring((head), position - 1).trim();
                head = position;

                var t = 1, s = false;
                while (properties[position++] != ",") {
                    if (properties[position] == "\"") {
                        console.log(properties[position - 2]);
                        if (properties[position - 2] != "\\") {
                            s = !s;
                            console.log("string - " + ((s) ? "start" : "end"))
                            
                        }
                    }

                    if (properties[position + 1] == ",") {
                        if (s) {position += 2;}
                        console.log("possible end")
                    }

                    if (position >= properties.length) {
                        t = 0;
                        break;
                    }
                }
                var pValue = properties.substring((head), position - t).trim();
                head = position;

                output.value += " " + object + "[? \"" + pName + "\"] = " + pValue + ";";
                GMLux.Objects[object].push(pName);
                console.log("Property: " + pName + " = " + pValue);
            }
            
        }
        //output.value += "\n";
    },
    Transpile: function(input, output) {
        for(tInput = input.value, tPosition = 0; tPosition < tInput.length; tPosition++) {
            var tFound = false;
            // Tokens
            for(tToken in GMLux.Tokens) {
                if (tInput.substring(tPosition, tPosition + tToken.length) == tToken) {
                    tPosition += tToken.length;// GMLux.SeekChar(tInput, tPosition + tToken.length, "{");
                    GMLux.Tokens[tToken]();
                    tFound = true;
                }
            } // End of Token Loop
            for(tObject in GMLux.Objects) {
                if (tInput.substring(tPosition, tPosition + tObject.length) == tObject) {
                    output.value += tObject + "[? \"";
                    tPosition = GMLux.SeekChar(".") + 1;
                    GMLux.Objects[tObject].forEach(function(tProperty) {
                        if (tInput.substring(tPosition, tPosition + tProperty.length) == tProperty) {
                            output.value += tProperty + "\"]";
                        }
                    });
                    tFound = true;
                }
                
            }

            if (tFound == false) {
                output.value += tInput[tPosition];
            }
        } // End of Input Loop
        output.value += "\n/*GMLux Object Destruction*/ ";
        for(tObject in GMLux.Objects) {
            output.value += "ds_map_destroy(" + tObject + ");\n";
        }
        
    }
}