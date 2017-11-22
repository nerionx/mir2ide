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
function parseGiveExp(code){
    if(code.includes("GIVEEXP")){
        code = code.replace("GIVEEXP ");
        if(isInt(code)){
            writeSimulatorEvent("Gave " + code + "exp to player"); 
        }else{
            writeError2("Invalid EXP Amount - Value is not an integer",currentLine,"critical");
        }

    }
}
function parseGiveGold(code){
    if(code.includes("GIVEGOLD")){
        code = code.replace("GIVEGOLD ","");
        try{
        player.gold += parseInt(code);
        writeSimulatorEvent("Added " + code + " to players gold"); 
        
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
            player.gold -= parseInt(code);
            writeSimulatorEvent("Took " + code + " from players gold"); 
            
        }
        catch(err){
            writeError2("Invalid gold amount, must be an integer e.g. TAKEGOLD 100",currentLine,"critical");
        }
        
    }
}

function parseGiveItem(code){
    console.log("giveitem");
    if(code.toUpperCase().includes("GIVEITEM")){
        //Do a regex search for an integer
        var searchterms = /\d+/;
        var itemamount = parseInt(code.match(searchterms));
        if(!itemamount){itemamount = 1} //NPC script does not require an amount to be set, so default to one
    
    //Remove the commmand and amount from the string, this should leave us with the item name
    code = code.replaceAll("GIVEITEM ","");
    console.log(code);
    var itemname = code.replace(itemamount,"");
    writeSimulatorEvent("Added "+ itemamount + "x " + itemname + " to inventory"); 
    }
}

//Move moves a value into a variable, because we are using eval we dont need to define an area to store these beforehand just append simVar_ to every variable name to avoid conflicts
function parseMov(code){
    if(code.toUpperCase().includes("MOV ")){
        var newcode = code.replaceAll("MOV ",""); //Our string now only contains the variable name and the value
        var a = newcode.indexOf(" ");
        var mirvar = newcode.substr(0,a); //Only contains the variable name
        newcode = newcode.replace(mirvar+ " ",""); //Only contains the variable value

        scriptJS += "var simVar_" + mirvar + " = " + newcode +";";
        writeSimulatorEvent("Wrote: "+newcode+ " to variable: " + mirvar); 
        
    }
}

//Adds variables and values together
function parseCalc(code){
    if(code.includes("CALC")){
        code = code.replaceAll("CALC ","");

    }
}

//NPC is going to teleport the player, we dont actually move the player but we need to show it in the events log, Also parses instancemove
function parseMove(code){
    if(code.toUpperCase().includes("MOVE") || code.toUpperCase().includes("INSTANCEMOVE")){
        code=code.replaceAll("instancemove ","");
        code=code.replaceAll("move ","");
        writeSimulatorEvent("Moved player to: "+ code);
    }
}

//This function can accept up to 3 variables, name, amount, level (max level is usually 7 - warn if greater)
function parseGivePet(code){
    if(code.toUpperCase().includes("GIVEPET")){
        code = code.replaceAll("GIVEPET ","");
        //Find the first space
        var a = code.indexOf(" ");
        if(a>-1){
            var petname = code.substr(0,a);
            //remove the petname from the code
            code =code.replaceAll(petname+" ","");
            a = code.indexOf(" ");
            if(a>-1){
                var petamount = code.substr(0,a+1);
                if(petamount>5){writeError2("Pet amount greater than 5, this is unusual",currentLine,"warning");}
                if(petamount<0){writeError2("Pet amount less than 0",currentLine,"critical");}
                code=code.replace(petamount,""); //Dont do a replaceAll here the pet amount and level could be the same
                if(code!==""){
                    var petlevel = parseInt(code);
                    if(petlevel>7){writeError2("Pet level greater than 7 (This is unusual)",currentLine,"warning")}
                    if(petlevel<0){writeError2("Pet Level less than 0",currentLine,"critical")}
                }else{
                    //No petlevel set so use default
                    var petlevel = 0;
                }
            }else{
                //No values for level or amount so set defaults
                var petlevel = 0;
                var petamount = 1;
            }
        }else{
            writeError2("Invalid Parameters for GIVEPET [MonsterName] [Amount] [Level]",currentLine,"critical");
        }
        if(petname!==""){
            writeSimulatorEvent("Gave the player "+ petamount + "x "+petname+" at level "+petlevel);
            player.petcount = petamount;
            player.petname = petname;
            player.petlevel = petlevel;
        }
    }
}

function parseClearPets(code){  
    if(code.includes("CLEARPET")){
        if(player.petname){
            player.petname = "";
            player.petcount = 0;
            player.petlevel = 0;
            writeSimulatorEvent("Killed the players pets");
        }else{
            writeSimulatorEvent("Tried to clear pets, but none existed");
        }
    }
}


