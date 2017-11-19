var openIf = false; //If function is still open and will need closing down on transitioning to another #mode
var openIf2 = false; //we are inside an if or else
function parseIf(code){
    //Start an if tag and set mode
    if(scriptMode == "SAY"){
        scriptJS +="';";
    }
    scriptMode = "IF"
    scriptJS += "if(";
    
}

function parseCheckLevel(code){
    if(code.includes("LEVEL")){
        checkOpenIf();
        //Get the operator
        if(code.includes(">=")){ var operator = ">="; code = code.replace(">= ","")}
        if(code.includes("<=")){ var operator = "<="; code = code.replace("<= ","")}
        if(code.includes("==")){ var operator = "=="; code = code.replace("== ","")}
        if(code.includes("!=")){ var operator = "!="; code = code.replace("!= ","")}
        if(code.includes(" > ")){ var operator = ">"; code = code.replace("> ","")}
        if(code.includes(" < ")){ var operator = "<"; code = code.replace("< ","")}
        //Get the test value
        var checkLevel = code.replace("LEVEL ","");
        openIf = true;
        scriptJS +="simLevel " + operator + " " + checkLevel;
    }
}
function parseIsAdmin(code){
    if(code.includes("ISADMIN")){
        checkOpenIf();
        scriptJS += "simIsAdmin == true";
        openif = true;
    }
}

//Item checks dont look for the item it just has a flag set to pass for fail
function parseCheckItem(code){
    if(code.includes("CHECKITEM")){
        checkOpenIf();
        scriptJS += "simItem == true";
        openIf = true;
    }
}

function parseCheckGold(code){
    if(code.includes("CHECKGOLD")){
            checkOpenIf()
            //Get the operator
            if(code.includes(">=")){ var operator = ">="; code = code.replace(">= ","")}
            if(code.includes("<=")){ var operator = "<="; code = code.replace("<= ","")}
            if(code.includes("==")){ var operator = "=="; code = code.replace("== ","")}
            if(code.includes("!=")){ var operator = "!="; code = code.replace("!= ","")}
            if(code.includes(" > ")){ var operator = ">"; code = code.replace("> ","")}
            if(code.includes(" < ")){ var operator = "<"; code = code.replace("< ","")}
            if(!operator){var operator=">="}; //Default to greater than or equals if no operator is specified
            //Get the test value
            var checkgold = code.replace("CHECKGOLD ","");
            openIf = true;
            scriptJS +="simGameGold " + operator + " " + checkgold;
        }
    }


function parseCheckPKPoint(code){
    if(code.includes("CHECKPKPOINT")){
            checkOpenIf()
            //Get the operator
            if(code.includes(">=")){ var operator = ">="; code = code.replace(">= ","")}
            if(code.includes("<=")){ var operator = "<="; code = code.replace("<= ","")}
            if(code.includes("==")){ var operator = "=="; code = code.replace("== ","")}
            if(code.includes("!=")){ var operator = "!="; code = code.replace("!= ","")}
            if(code.includes(" > ")){ var operator = ">"; code = code.replace("> ","")}
            if(code.includes(" < ")){ var operator = "<"; code = code.replace("< ","")}
            //Get the test value
            var checkpk = code.replace("CHECKPKPOINT ","");
            openIf=true;
            scriptJS +="simPK " + operator + " " + checkpk;
        }
    }

function parseConquestAvailable(code){
    if(code.includes("CONQUESTAVAILABLE")){
        checkOpenIf();        
        scriptJS += "simConquestAvailable == true";
        openIf=true;
    }
}
//Expects the conquest number as a variable but we are just gonna pass it based on a true or false in the options
function parseConquesOwner(code){
    if(code.includes("CONQUESTOWNER")){
        scriptJS +="simConquestOwner == true";
    }
}

function parseAffordGuard(code){
    if(code.includes("AFFORDGUARD")){
        scriptJS+="simGuardCost <= simGuildGold"
    }
}

function parseAffordWall(code){
    if(code.includes("AFFORDWALL")){
        scriptJS+="simWallCost <= simGuildGold"
    }
}


function parseAffordGate(code){
    if(code.includes("AFFORDGATE")){
        scriptJS+="simGateCost <= simGuildGold"
    }
}


function parseAffordSiege(code){
    if(code.includes("AFFORDSIEGE")){
        scriptJS+="simSiegeCost <= simGuildGold"
    }
}
function parseCheckGender(code){
    if(code.includes("CHECKGENDER")){
        checkOpenIf();
        var checkvalue = code.replace("CHECKGENDER ","");
        scriptJS += "simGender == "+checkvalue;
    }
}

//RANDOM script command takes a random number from 0 to value entered, and returns true if the result is the value entered
//E.g. RANDOM 10 (Has a 10% chance of being true)

function parseRandom(code){
    if(code.includes("RANDOM")){
        var randomNumber = code.replace("RANDOM ","");
        if(!isNaN(parseInt(randomNumber,10))){
            scriptJS += "Math.floor(Math.random()*"+randomNumber+") == "+ randomNumber;
        }else{
            writeError("RANDOM must be followed by a valid integer e.g. RANDOM 10",currentLine);
        }
    }
}
//has 2 behaviors, without an overload it checks if the player is in a guild, with an overload it checks if the player is in the specified guild
function parseInGuild(code){
    if(code.includes("INGUILD")){
        //Is there a space after INGUILD, if so lets assume there is an overload
        if(code.includes("INGUILD ")){
            var guildName = code.replace("INGUILD ","");
            //Sanity check - did we actually recover a guildname? or was the space after inguild a mistake
            if(guildName !== ""){
                scriptJS +="simGuildName == '" + guildName+"'"; //Compare the 2 guild names
            }else{
                //If we get here technically the syntax on INGUILD is incorrect (there is an extra space), however the game wont care so dont error
                scriptJS+= "simGuildName !== ''"; //We didnt find a guild name so just check if in any guild
            }
        }else{
            scriptJS += "simGuildName !== ''"; //Check if any guild
        }
    }
}
function checkOpenIf(){;
    if(openIf==true && scriptMode == "IF"){
        scriptJS += " && "; //looks like we are checking for multiple values so we add an AND
    }
}

function closeIf(){
    //used for closing openif conditions
    openIf=false;
    scriptJS +="}";
}

