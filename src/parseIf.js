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
            //Get the test value
            var checkgold = code.replace("CHECKGOLD ","");
            openIf = true;
            scriptJS +="simGold " + operator + " " + checkgold;
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

function parseCheckGender(code){
    if(code.includes("CHECKGENDER")){
        checkOpenIf();
        var checkvalue = code.replace("CHECKGENDER ","");
        scriptJS += "simGender == "+checkvalue;
    }
}

//RANDOM script command takes a random number from 0 to value entered, and returns true if the result is the value entered
//E.g. RANDOM 10 (Has a 10% chance of being true)

function parseRandom(){
    if(code.includes("RANDOM")){
        var randomNumber = code.replace("RANDOM ","");
        if(!isNaN(parseInt(randomNumber,10))){
            scriptJS += "Math.floor(Math.random()*"+randomNumber+") == "+ randomNumber;
        }else{
            writeError("RANDOM must be followed by a valid integer e.g. RANDOM 10",currentLine);
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

