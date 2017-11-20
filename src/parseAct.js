function parseAct(code){
    if(scriptMode == "SAY"){
        scriptJS +="';"
        scriptMode == "ACT";
    }
    if(scriptMode == "IF"){
        scriptJS +="){";
    }
    scriptMode = "ACT";
}

function parseElseAct(){
    //End the current SAY mode
    if(scriptMode == "SAY"){
        scriptJS +="';"
        scriptMode == "ACT";
    }
    scriptMode = "ACT";
    scriptJS +="}else{";
    openIf=true;
}

function parseGoto(code){
    if(code.includes("GOTO @")){
        code = code.replace("GOTO @","");
        code = code.replace("-","__");
        code = code.toUpperCase();
        scriptJS +="npc_" + code + "()";
    }
}
//Changes page after a certain time has passed, expects DELAYGOTO [pagename] [time]
function parseDelayGoto(code){
    if(code.includes("DELAYGOTO")){
        //Sanity Check
        if(!code.includes("@")){writeError("No goto page specified",currentLine);}
        
        //Parse
        code = code.replace("DELAYGOTO @","");


    }
}

function parseGiveGold(code){
    if(code.includes("GIVEGOLD")){
        code = code.replace("GIVEGOLD ","");
        try{
        simGameGold += parseInt(code);
        }
        catch(err){
            writeError2("Invalid gold amount, must be an integer e.g. GIVEGOLD 100",currentLine,"critical");
        }
    }
}

function parseTakeGold(code){
    if(code.includes("TAKEGOLD")){
        code = code.replace("TAKEGOLD ","");
        try{
            simGameGold -= parseInt(code);
        }
        catch(err){
            writeError2("Invalid gold amount, must be an integer e.g. TAKEGOLD 100",currentLine,"critical");
        }
        
    }
}

function parseGiveItem(code){
    if(code.includes("GIVEITEM")){
        console.log(code);
        //Do a regex search for an integer
        var searchterms = /\d+/;
        var itemamount = parseInt(code.match(searchterms));
        if(!itemamount){itemamount = 1} //NPC script does not require an amount to be set, so default to one
    
    //Remove the commmand and amount from the string, this should leave us with the item name
    code = code.replace("GIVEITEM ","");
    console.log(code);
    var itemname = code.replace(itemamount,"");
    console.log("itemname = "+itemname+" itemnumber " + itemamount);
    scriptJS +="document.getElementById('simulatorEvents').innerHTML += '<br>Added " + itemamount + "x " + itemname + " to inventory';"; 
    }
}

//Move moves a value into a variable, because we are using eval we dont need to define an area to store these beforehand just append simVar_ to every variable name to avoid conflicts
function parseMov(code){
    if(code.includes("MOV ")){
        var newcode = code.replace("MOV ",""); //Our string now only contains the variable name and the value
        var a = newcode.indexOf(" ");
        var mirvar = newcode.substr(0,a); //Only contains the variable name
        newcode = newcode.replace(mirvar+ " ",""); //Only contains the variable value

        scriptJS += "var simVar_" + mirvar + " = " + newcode +";";
    }
}

//Adds variables and values together
function parseCalc(code){
    if(code.includes("CALC")){
        code = code.replace("CALC ","");

    }
}
