var scriptJS; //Contains the npc script translated into javascript to run the simulator
var speechJS; //Contains the npc speech as a string, each page in a new array
var script = []; //Contains the script with each line seperated into its own index
var inPage = false; //are we currently inside a page
var scriptMode = "ACT"; //What mode are we currently in -SAY ACT IF
var currentLine = 0;

//Simulator variables
simGameGold = 10000; //How much gold the player is holding
simPlayerName = "Player"; //The name of the current player
simNPCName = "Anna"; //The name of the NPC
simX = "50" //The players current X position
simY = "100" //The players current Y position
simLevel = "22" //The players current level
simClass = "Taoist" //the players current class
simUserCount = "15" //The current server user count
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
simCredit = "1000" //Amount of gameshop credit
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

//Used for <$DATE> in #SAY
function getTodaysDate(){
    var today = new Date();
    var date = today.getDate() + "/"+(today.getMonth()+1) +"/"+today.getFullYear()
    return date;
}

function startParse(codebox){
    scriptJS = ""
    script = [];
    scriptMode = "ACT";
    currentLine = 0;
    inPage = false;
    errors = false;
    writeError("No Errors");
    errors = false;
    parseCode(codebox.value);
    console.log(scriptJS);

}

function parseCode(code){
    //General Sanity checks
    if(getLines(code)==0){return} //Check there is code
    if(!checkMain(code)){ return} //Check there is an entry point
    if(!code.includes("#")){writeError("No mode was ever specified, are you missing a #SAY,#ACT or #IF");return}

    //Loop through all the npc script and parse it line by line
    for(var i=0;i<script.length;i++){
        //Parse the code and translate to javascript
        currentLine = i;
        
        if(script[currentLine].includes("#SAY")){parseSay(script[currentLine])}
        if(script[currentLine].includes("#IF")){parseIf(script[currentLine])}
        if(script[currentLine].includes("#ACT")){parseAct(script[currentLine])}
        if(script[currentLine].includes("#ELSEACT")){parseElseAct(script[currentLine])}
        if(script[currentLine].includes("#ELSESAY")){parseElseSay(script[currentLine])}
        if(script[currentLine].includes("[@")){parsePage(script[currentLine])} //Is a new page
        
        //Parse the say commands
        if(scriptMode == "SAY"){
            parseSpeech(script[currentLine]); //We are in say mode, treat every line as text
        }
        if(scriptMode=="ACT"){
            parseGoto(script[currentLine]);
            parseGiveGold(script[currentLine]);
        }
        if(scriptMode == "IF"){
            parseCheckLevel(script[currentLine]);
            parseIsAdmin(script[currentLine]);
            parseCheckItem(script[currentLine]);
            parseCheckPKPoint(script[currentLine]);
            parseConquestAvailable(script[currentLine]);
            parseCheckGender(script[currentLine]);
        }

    }

    //End the script and run it
    if(errors==false){
        if(scriptMode == "SAY"){scriptJS+="';"} //Finish say command if it hasnt already ended
        if(scriptMode == "IF"){scriptJS+="1){}"; openIf=false; writeError("#IF started but not finished",currentLine)} //Finish IF commands (this should never be called on valid code so flag an errror)
        if(openIf==true){ //Did we do a comparison? is it still open... lets close it\\
            openIf=false; 
            scriptJS +="}"
        }
        scriptJS +="} function npc_EXIT(){} npc_MAIN();"
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
        msg2 += " on line number " + line;
    }
    document.getElementById("consolelog").innerHTML = msg2;
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


function parseSay(code){
 if(scriptMode=="IF"){
     scriptJS+="){"; //End the if query
 }
    
    
    scriptMode = "SAY";
    if(inPage == false){writeError("Syntax Error - #SAY should be contained inside a page are you mising [@MAIN]??",currentLine+1)}else{
        scriptJS +="document.getElementById('simulatorSpeech').innerHTML = '";
    }
    
}

function parseSpeech(code){
    
    if(code.includes("#SAY") == false && code.includes("#ELSESAY") == false){
        console.log(code.includes("#SAY"));
        var newSpeech = code;
        //Replace variables with strings
        newSpeech = newSpeech.replace("<$NPCNAME>",simNPCName);
        newSpeech = newSpeech.replace("<$USERNAME>",simPlayerName);
        newSpeech = newSpeech.replace("<$MAP>",simMapName);
        newSpeech = newSpeech.replace("<$X_COORD>",simX);
        newSpeech = newSpeech.replace("<$Y_COORD>",simY);
        newSpeech = newSpeech.replace("<$GAMEGOLD>",simGameGold);
        newSpeech = newSpeech.replace("<$LEVEL>",simLevel);
        newSpeech = newSpeech.replace("<$CLASS>",simClass);
        newSpeech = newSpeech.replace("<$DATE>",simDate);
        newSpeech = newSpeech.replace("<$USERCOUNT>",simUserCount);
        newSpeech = newSpeech.replace("<$PKPOINT>",simPK);
        newSpeech = newSpeech.replace("<$GUILDWARTIME>",simGuildWarTime);
        newSpeech = newSpeech.replace("<$GUILDWARFEE>",simGuildWarFee);
        newSpeech = newSpeech.replace("<$PARCELAMOUNT>",simParcelAmount);
        newSpeech = newSpeech.replace("<$HP>",simHP);
        newSpeech = newSpeech.replace("<$MAXHP>",simMaxHP);
        newSpeech = newSpeech.replace("<$MP>",simMP);
        newSpeech = newSpeech.replace("<$MAXMP>",simMaxMP);
        newSpeech = newSpeech.replace("<$ARMOUR>",simArmour);
        newSpeech = newSpeech.replace("<$WEAPON>",simWeapon);
        newSpeech = newSpeech.replace("<$RING_L>",simLRing);
        newSpeech = newSpeech.replace("<$RING_R>",simRRing);
        newSpeech = newSpeech.replace("<$BRACELET_L>",simLBracelet);
        newSpeech = newSpeech.replace("<$BRACELET_R>",simRBracelet);
        newSpeech = newSpeech.replace("<$NECKLACE>",simNecklace);
        newSpeech = newSpeech.replace("<$BELT>",simBelt);
        newSpeech = newSpeech.replace("<$BOOTS>",simBoots);
        newSpeech = newSpeech.replace("<$HELMET>",simHelmet);
        newSpeech = newSpeech.replace("<$AMULET>",simAmulet);
        newSpeech = newSpeech.replace("<$STONE>",simStone);
        newSpeech = newSpeech.replace("<$TORCH>",simTorch);
        newSpeech = newSpeech.replace("<$CREDIT>",simCredit);
        newSpeech = newSpeech.replaceAll("'","q"); //Quotes will break the js
        newSpeech = newSpeech.replaceAll('"',"q"); //Quotes will break the js
        newSpeech = newSpeech.replaceAll(" ","&nbsp;"); //Retain the spaces
    
    //More complicated replacements for conquest as it can have values we wont know beforehand
    var conqueststring;
    var newdata;
    for(var j=0;j<8;j++){
        if(j==0){conqueststring="<$CONQUESTOWN";newdata = simConquestOwner}
        if(j==1){conqueststring="<$CONQUESTGUARD";newdata = simConquestGuard}
        if(j==2){conqueststring="<$CONQUESTGATE"; newdata = simConquestGate}
        if(j==3){conqueststring="<$CONQUESTWALL";newdata = simConquestWall}
        if(j==4){conqueststring="<$CONQUESTSEIGE";newdata = simConquestSeige}
        if(j==5){conqueststring="<$CONQUESTGOLD";newdata = simConquestGold}
        if(j==6){conqueststring="<$CONQUESTRATE";newdata =simConquestRate}
        if(j==7){conqueststring="<$CONQUESTSCHEDULE";newdata = simConquestSchedule}
        var n = newSpeech.indexOf(conqueststring);
        if(n>-1){
            //found a conquest tag, find the end of it so we can remove it
            var m = newSpeech.indexOf(">",n); console.log(n);
            //split the speech, take out the variable and insert our own
            var o = newSpeech.substr(0,n) + newdata + newSpeech.substr(m+1,newSpeech.length);
            newSpeech = o;
        }
    }
    //Test for buttons
    var jsfunc = [];
    var k=[];
    var j=[];
    var jsreplace = [];
    if(newSpeech.includes("/@")){
        //we found a button but there could be multiple so find the index of every one and count them
        var buttonIndices = getIndicesOf("/@",newSpeech,false);
        //iterate through all the buttons found
        for(var i=0;i<buttonIndices.length;i++){
            //Find the end of the button
            j[i] = newSpeech.indexOf(">",buttonIndices[i]);
            //Find the start of the button
            k[i] = newSpeech.lastIndexOf("<",buttonIndices[i]); //Search Backwards
            var buttonText = newSpeech.substr(k[i]+1,buttonIndices[i]-k[i]-1);
            var buttonFunction =  newSpeech.substr(buttonIndices[i]+2,j[i]-buttonIndices[i]-2);
           
            //Write a javascript function
            buttonFunction = buttonFunction.replace("-","__"); //Functions in JS cannot have - in them so replace it with __
            buttonFunction = buttonFunction.toUpperCase();
            jsfunc[i] ="<span onclick=\"npc_"+buttonFunction+"()\">"+buttonText+"</span>"
            jsreplace[i] = newSpeech.substr(k[i],j[i]-k[i]+1);
            
        }
    }
        for(var i=0;i<jsfunc.length;i++){
            newSpeech = newSpeech.replace(jsreplace[i],jsfunc[i]);
        }
    
    //Test for colours


    //Test for invalid variables (All should of been replaced by now so look for <$ if it exists its invalid)
    if(newSpeech.includes("<$")){
        writeError("Invalid variable tag in #SAY mode ",currentLine+1);
    }

    //Add strings to speech array
        scriptJS += newSpeech +"<br>";
    
    }else{
        console.log("Failed to run on: "+ code);
    }
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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function sanityCheck(code){
    if(code.includes("[")){return true}
    if(code.includes("]")){return true}
    if(code.includes("<$")){return true}
    return false;
}