var scriptJS; //Contains the npc script translated into javascript to run the simulator
var speechJS; //Contains the npc speech as a string, each page in a new array
var script = []; //Contains the script with each line seperated into its own index
var inPage = false; //are we currently inside a page
var scriptMode = "ACT"; //What mode are we currently in -SAY ACT IF
var currentLine = 0;
var hadWriteError=false;

//Simulator variables
simGameGold = 10000; //How much gold the player is holding
simPlayerName = "Player"; //The name of the current player
simNPCName = "Anna"; //The name of the NPC
simX = "50"; //The players current X position
simY = "100"; //The players current Y position
simLevel = "22"; //The players current level
simGender = "male";
simClass = "Taoist"; //the players current class
simGuildName = "Default Guild"; //The players current guild - if blank assume no guild
simUserCount = "15"; //The current server user count
simDate = getTodaysDate();
simIsAdmin = false; //is the player an admin
simItemName = [];
simItemAmount = []; //This should be an inventory object but meh //hack
simPK = "1"; //How many PK points the player has
simGuildWarTime = "30" ; //How many minutes the guild war has left
simGuildWarFee = "10000" ; //How much a guild war costs
simParcelAmount = "3"; //How many parcels the player has waiting to be collected
simHP = 100; //How much hp the player has
simMP = 100; //How much mp the player has
simMaxHP = 100; //What the players max hp is
simMaxMP = 100; //what the players max mp is
simArmour = "BaseDress(f)"; //The name of the armour the player is wearing
simWeapon = "WoodenSword"; //The name of the weapon the player is currently holding
simLRing = "DragonRing"; //The name of the left ring
simRRing = "RubyRing"; //The name of the right ring
simLBracelet = "MonkBrace"; //The name of the left bracelet
simRBracelet = "SilverBracelet"; //The name of the right bracelet
simNecklace = "SkillNecklace"; //the name of the necklace
simBelt = "ChainBelt"; //The name of the belt
simBoots = "BlackBoots";
simHelmet = "BronzeHelmet";
simAmulet = "Amulet"; //The name of the amulet (not count)
simStone = "DCStone";
simTorch = "EternalFlame"; //Name of torch not dura
simCredit = "1000"; //Amount of gameshop credit
simConquestOwner = false //should I conquest war owner checks
simConquestGuard = "Archer - Still Alive";
simConquestGate = "Gate - Still Alive";
simConquestWall = "Wall - Still Alive";
simConquestSeige = "Seige - Still Alive";
simConquestGold = 1000; //How much gold in conquest storage
simConquestRate = 10; //Intrest rate on conquest npcs
simConquestSchedule = "BadAssGuild"; //Do any guild has a war sheduled
simMapName = "BichonProvince";
simItem = true; //should we pass item checks
simConquestAvailable = true;
simGuildGold = 1000000; //How much gold the guild has
simGuardCost = 1000;
simGateCost = 1000;
simSiegeCost = 1000;
simWallCost = 1000;
simPassFlag = true; //Will it pass flag checks
simQuestDone = true; //Are the quest complete?

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
    parseCode(codebox,run);
    console.log(scriptJS);

}

function parseCode(code, run=true){
    //General Sanity checks
    if(getLines(code)==0){return} //Check there is code
    if(!checkMain(code)){ return} //Check there is an entry point
    if(!code.includes("#")){writeError("No mode was ever specified, are you missing a #SAY,#ACT or #IF");return}
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
    if(errors==false){writeError2("No Errors",0,"good")}
    //End the script and run it
    if(errors==false && run==true){
        if(scriptMode == "SAY"){scriptJS+="';"} //Finish say command if it hasnt already ended
        if(scriptMode == "IF"){scriptJS+="1){}"; openIf=false; writeError("#IF started but not finished",currentLine)} //Finish IF commands (this should never be called on valid code so flag an errror)
        if(openIf==true){ //Did we do a comparison? is it still open... lets close it\\
            openIf=false; 
            scriptJS +="}"
        }
        $('#simulatorModal').modal("show");
        scriptJS +="} npc_MAIN();"
        console.log(scriptJS);
        window.eval(scriptJS);
    

    }
}
    //Try and get the main function of code
function checkMain(code){
    var code2 = code.toUpperCase();
    if(!code2.includes("[@MAIN]")){
        writeError("Script does not have [@MAIN] Entry point")
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

//Replacement for write error, allowing warnings aswelll as criticals which will stop parsing
function writeError2(msg,line=0,type="critical"){
    var classes="simconsole";
    if(type=="critical"){errors=true; classes="bg-danger text-white"} //Critical error dont run the parsed code as it will be incorrect
    if(type=="good"){classes="bg-success text-white"}
    if(!line==0){
        msg += " on line number " + (line+1);
    }
    document.getElementById("script-console").innerHTML += "<span style='display: block; width: 100%;' class='"+classes+"'>"+msg+"</span>";

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