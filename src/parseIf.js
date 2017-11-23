var openIf = false; //If function is still open and will need closing down on transitioning to another #mode
var openIf2 = false; //we are inside an if or else
function parseIf(code){
    //Start an if tag and set mode
    if(scriptMode == "SAY"){
        scriptJS +="';";
    }
    scriptMode = "IF"
    scriptJS += "if(true "; //The true is a default test which will always pass (It will stop JS errors if the user uses an incorrect #IF function)
    openIf = true
}

function parseCheckLevel(code){
    if(code.includes("LEVEL" && !code.includes("PET"))){
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
        scriptJS +="player.level " + operator + " " + checkLevel;
    }
}
function parseIsAdmin(code){
    if(code.includes("ISADMIN")){
        checkOpenIf();
        scriptJS += "player.isadmin == 'true'";
        openif = true;
    }
}

//Item checks dont look for the item it just has a flag set to pass for fail
function parseCheckItem(code){
    if(code.includes("CHECKITEM")){
        checkOpenIf();
        scriptJS += "player.itemcheck == 'true'";
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
            scriptJS +="player.gold " + operator + " " + checkgold;
        }
    }
function parseCheckCredit(code){
    if(code.includes("CHECKCREDIT")){
        checkOpenIf()
        code = code.replaceAll("checkcredit ","");
        if(isInt(code)==false){
            writeError2("Invalid credit value (must be integer)",currentLine,"critical");
        }else{
            scriptJS+="player.credit <= "+code;
        }
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
            scriptJS +="player.pk " + operator + " " + checkpk;
        }
    }
//Expects a flag however we dont support them fully we just check if we are support to pass this check via a true false option in the sim
function parseCheck(code){
    if(code.includes("CHECK ")){ //Space is required after check as there are multiple commands which include the string "CHECK"
        checkOpenIf();        
        scriptJS += "player.flagcheck == 'true'";
        openIf=true;
    }
}
//Expects a quest flag but we just check a simulator option to pass quest checks (true/false)
function parseCheckQuest(code){
    if(code.includes("CHECKQUEST")){ //Space is required after check as there are multiple commands which include the string "CHECK"
        checkOpenIf();        
        scriptJS += "player.questcheck == 'true'";
        openIf=true;
    }
}

function parseConquestAvailable(code){
    if(code.includes("CONQUESTAVAILABLE")){
        checkOpenIf();        
        scriptJS += "guild.conquestavailable == 'true'";
        openIf=true;
    }
}
//Expects the conquest number as a variable but we are just gonna pass it based on a true or false in the options
function parseConquesOwner(code){
    if(code.includes("CONQUESTOWNER")){
        checkOpenIf();
        scriptJS +="guild.conquestowner == 'true'";
    }
}

function parseAffordGuard(code){
    if(code.includes("AFFORDGUARD")){
        checkOpenIf();
        scriptJS+="guild.guardcost <= guild.ggold"
    }
}

function parseAffordWall(code){
    if(code.includes("AFFORDWALL")){
        checkOpenIf();
        scriptJS+="guild.wallcost <= guild.ggold"
    }
}


function parseAffordGate(code){
    if(code.includes("AFFORDGATE")){
        checkOpenIf();
        scriptJS+="guild.gatecost <= guild.ggold"
    }
}


function parseAffordSiege(code){
    if(code.includes("AFFORDSIEGE")){
        checkOpenIf();
        scriptJS+="guild.seigecost <= guild.ggold"
    }
}
function parseCheckGender(code){
    if(code.includes("CHECKGENDER")){
        checkOpenIf();
        var checkvalue = code.replace("CHECKGENDER ","");
        scriptJS += "player.gender == '"+checkvalue+"'";
    }
}

//RANDOM script command takes a random number from 0 to value entered, and returns true if the result is the value entered
//E.g. RANDOM 10 (Has a 10% chance of being true)

function parseRandom(code){
    if(code.includes("RANDOM")){
        checkOpenIf();
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
        checkOpenIf();
        //Is there a space after INGUILD, if so lets assume there is an overload
        if(code.includes("INGUILD ")){
            var guildName = code.replace("INGUILD ","");
            //Sanity check - did we actually recover a guildname? or was the space after inguild a mistake
            if(guildName !== ""){
                scriptJS +="guild.gname == '" + guildName+"'"; //Compare the 2 guild names
            }else{
                //If we get here technically the syntax on INGUILD is incorrect (there is an extra space), however the game wont care so dont error
                scriptJS+= "guild.gname !== ''"; //We didnt find a guild name so just check if in any guild
            }
        }else{
            scriptJS += "guild.gname !== ''"; //Check if any guild
        }
    }
}

function parseCheckPets(code){
    if(code.includes("CHECKPETS")){
        checkOpenIf();
        code = code.replaceAll("CHECKPET ","");
        scriptJS +="player.petname.toUpperCase() == '"+ code+"'";
    }
}

function parsePetLevel(code){
    if(code.includes("PETLEVEL")){
        checkOpenIf();
        code = code.replaceAll("PETLEVEL ","");
        var searchterms = /\d+/;
        var petcompare = parseInt(code.match(searchterms)); //get the integer
        code = code.replace(petcompare,"");
        if(isInt(petcompare)==false){
            writeError2("Syntax Error, no value for comparison",currentLine,"critical");
        }else{
            if(petcompare==""){
                writeError2("Syntax Error, operator for comparison",currentLine,"critical");
            }else{
                if(code.includes("=") && !code.includes("==")){writeError2("Syntax Error, = should be ==",currentLine,"warning")};
                scriptJS+="player.petlevel "+code+" "+petcompare;
            }
        }
    }
}

function parseIsNewHuman(code){
    if(code.includes("ISNEWHUMAN")){
        checkOpenIf();
        scriptJS +="player.isnew == 'true'";
    }
}
//Expects one parameter which is the map name as a string
function parseCheckMap(code){
    if(code.toUpperCase().includes("CHECKMAP")){
        checkOpenIf();
        code = code.replaceAll("CHECKMAP ","");
        scriptJS +="map.mname == '"+code+"'";
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

