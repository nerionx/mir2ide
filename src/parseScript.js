var scriptJS; //Contains the npc script translated into javascript to run the simulator
var speechJS; //Contains the npc speech as a string, each page in a new array
var script = []; //Contains the script with each line seperated into its own index
var inPage = false; //are we currently inside a page
var scriptMode = "ACT"; //What mode are we currently in -SAY ACT IF
var currentLine = 0;
var hadWriteError=false;

//Simulator variables
var player = {}, map = {}, npc = {}, guild ={}, server ={}
var simDate = getTodaysDate();


//Used for <$DATE> in #SAY
function getTodaysDate(){
    var today = new Date();
    var date = today.getDate() + "/"+(today.getMonth()+1) +"/"+today.getFullYear()
    return date;
}

function startParse(run=true){
    codebox = editor.doc.getValue();
    document.getElementById("script-console").innerHTML = ""; //Reset the console
    document.getElementById("simulatorEvents").innerHTML =""; //Reset the events
    scriptJS = ""
    script = [];
    scriptMode = "ACT";
    currentLine = 0;
    inPage = false;
    errors = false;
    hadWriteError=false;
    parseCode(codebox,run);
    console.log(scriptJS);

}

function parseCode(code, run=true){
    //General Sanity checks
    if(getLines(code)==0){return} //Check there is code
    if(!checkMain(code)){ return} //Check there is an entry point
    if(!code.includes("#")){writeError2("No mode was ever specified, are you missing a #SAY,#ACT or #IF",0,"critical");return}
    checkDupePages();

    //Loop through all the npc script and parse it line by line
    for(var i=0;i<script.length;i++){
        //Parse the code and translate to javascript
        currentLine = i;
        //Do single line sanity checks
        //Check for double ]] [[ it happens alot
        if(script[currentLine].includes("[[") || script[currentLine].includes("]]")){
            writeError2("Syntax Error (Double brackets)",currentLine,"critical");
        }
        //Check if the line is a comment, do nothing if it is
        if(!script[currentLine].includes(";")){
            if(script[currentLine].toUpperCase().includes("#SAY")){parseSay(script[currentLine])}
            if(script[currentLine].toUpperCase().includes("#IF")){parseIf(script[currentLine])}
            if(script[currentLine].toUpperCase().includes("#ACT")){parseAct(script[currentLine])}
            if(script[currentLine].toUpperCase().includes("#ELSEACT")){parseElseAct(script[currentLine])}
            if(script[currentLine].toUpperCase().includes("#ELSESAY")){parseElseSay(script[currentLine])}
            if(script[currentLine].toUpperCase().includes("[@")){parsePage(script[currentLine])} //Is a new page
            if(script[currentLine].toUpperCase().includes('[QUESTS]')){parseQuests(script[currentLine])}
            if(script[currentLine].toUpperCase().includes('[TRADE]')){parseQuests(script[currentLine])}
            if(script[currentLine].toUpperCase().includes('[TYPES]')){parseQuests(script[currentLine])}
            //Parse the say commands
            if(scriptMode == "SAY"){
                parseSpeech(script[currentLine]); //We are in say mode, treat every line as text
            }
            if(scriptMode=="ACT"){
                parseGoto(script[currentLine].toUpperCase());
                parseGiveGold(script[currentLine].toUpperCase());
                parseMov(script[currentLine].toUpperCase());
                parseTakeGold(script[currentLine].toUpperCase());
                parseGiveItem(script[currentLine]); //Has player string in it, dont convert to uppercase yet
                parseMove(script[currentLine]); //Ditto
                parseGiveExp(script[currentLine].toUpperCase());
                parseGivePet(script[currentLine]);
                parseClearPets(script[currentLine].toUpperCase());
            }
            if(scriptMode == "IF"){
                parseCheckLevel(script[currentLine].toUpperCase());
                parseIsAdmin(script[currentLine].toUpperCase());
                parseCheckItem(script[currentLine].toUpperCase());
                parseCheckPKPoint(script[currentLine].toUpperCase());
                parseConquestAvailable(script[currentLine].toUpperCase());
                parseCheckGender(script[currentLine].toUpperCase());
                parseRandom(script[currentLine].toUpperCase());
                parseInGuild(script[currentLine].toUpperCase());
                parseCheckGold(script[currentLine].toUpperCase());
                parseConquesOwner(script[currentLine].toUpperCase());
                parseAffordGate(script[currentLine].toUpperCase());
                parseAffordGuard(script[currentLine].toUpperCase());
                parseAffordSiege(script[currentLine].toUpperCase());
                parseAffordWall(script[currentLine].toUpperCase());
                parseCheck(script[currentLine].toUpperCase());
                parseCheckQuest(script[currentLine].toUpperCase());
                parseCheckPets(script[currentLine].toUpperCase());
                parsePetLevel(script[currentLine].toUpperCase());
            }
            if(scriptMode == "TRADE"){
                //Nothign in here yet but we might write a handler later
            }
            if(scriptMode == "QUEST"){
                //Nothign in here yet but we might write a handler later
            }
            if(scriptMode == "TYPES"){
                //Nothign in here yet but we might write a handler later
            }

        }
    }
    if(errors==false && hadWriteError==false){writeError2("No Errors",0,"good")}
    //End the script and run it
    if(errors==false && run==true){
        if(scriptMode == "SAY"){scriptJS+="';"} //Finish say command if it hasnt already ended
        if(scriptMode == "IF"){scriptJS+="1){}"; openIf=false; writeError2("#IF started but not finished",currentLine,"critical")} //Finish IF commands (this should never be called on valid code so flag an errror)
        if(openIf==true){ //Did we do a comparison? is it still open... lets close it\\
            openIf=false; 
            scriptJS +="}"
        }
        $('#simulatorModal').modal("show");
        scriptJS +="} npc_MAIN();"
        window.eval(scriptJS);
    

    }
}
    //Try and get the main function of code
function checkMain(code){
    var code2 = code.toUpperCase();
    if(!code2.includes("[@MAIN]")){
        writeError2("Script does not have [@MAIN] Entry point",0,"critical");
        return false;
    }
    return true;
}

function writeError(msg,line=0){
    var msg2 = msg;
    errors = true;
    if(!line==0){
        msg2 += " on line number " + (line+1);
    }
    document.getElementById("script-console").innerHTML = msg2;
    }
//Gets the next line of code out of the script for parsing
function getLines(code){
    script = code.split("\n");
    console.log("Script is " + script.length + " lines");
    return script.length;
}

//Pages = functions in javascript
function parsePage(code){   
    if(inPage==true){
        //End the last function
        if(scriptMode == "SAY"){
            scriptJS +="';"; //End the current translated say function
        }
        if(openIf==true){
            scriptJS +="}";
            openIf=false;
        }
        scriptMode="ACT";
        scriptJS +="}"; //End the last page
    }
    //Get rid of the brackets so we can use the pagename as a function name
    var pagename = code.replace("[@","");
    var pagename = pagename.replace("-","__"); //JS functions cannot have - in them, but it is common in mir

    pagename = pagename.replace("]","");
    pagename = pagename.toUpperCase();
    //Start a new page and create js translation
    inPage = true;
    scriptJS += "function npc_" + pagename + "(){";
}




//Search for multiple occurances of somethign in a string
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

//Old replaceall function dont remove until we know the new one works properly
String.prototype.replaceAllOld = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

//Case insensitive replaceAll
String.prototype.replaceAll = function(strReplace, strWith) {
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};
function sanityCheck(code){
    if(code.includes("[")){return true}
    if(code.includes("]")){return true}
    if(code.includes("<$")){return true}
    return false;
}
//Look for duplicate page names, this code works but its pretty slow.. It could be better (Create a list of pagenames instead of checking every line for example)
function checkDupePages(){
    for(var i=0;i<script.length;i++){
        if(script[i].includes("[@")){
            for(var j=0;j<script.length;j++){
                if(j != i){
                    if(script[i].toUpperCase() == script[j].toUpperCase()){writeError2("Duplicate Page name " + script[i],i,"critical")}
                }
            }
        }
    }
}
function refreshSim(){
    startParse();
}

function parseQuests(){
    if(scriptMode=="SAY"){scriptJS+="';"}
    if(scriptMode=="IF"){scriptJS +='}'}
    scriptMode="QUEST";
}

function parseTypes(){
    if(scriptMode=="SAY"){scriptJS+="';"}
    if(scriptMode=="IF"){scriptJS +='}'}
    scriptMode="TYPES";
}

function parseTrade(){
    if(scriptMode=="SAY"){scriptJS+="';"}
    if(scriptMode=="IF"){scriptJS +='}'}
    scriptMode="TRADE";
}