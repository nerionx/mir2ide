function parseAct(code){
    if(scriptMode == "SAY"){
        scriptJS +="';"
        scriptMode == "ACT";
    }
}

function parseElseAct(){
    //End the current SAY mode
    if(scriptMode == "SAY"){
        scriptJS +="';"
        scriptMode == "ACT";
    }
    scriptMode = "ACT";
    scriptJS +="}else{";
    openIf2=true;
}

function parseGoto(code){
    if(code.includes("GOTO @")){
        code = code.replace("GOTO @","");
        code = code.replace("-","__");
        code = code.toUpperCase();
        scriptJS +="npc_" + code + "()";
    }
}

function parseGiveGold(code){
    if(code.includes("GIVEGOLD")){
        code = code.replace("GIVEGOLD ","");
        simGold += parseInt(code);
    }
}

function parseGiveItem(code){
    if(code.includes("GIVEITEM")){
        //Do a regex search for an integer
        var searchterms = /\d+/;
        var itemamount = parseInt(code.match(searchterms));
        if(!itemamount){itemamount = 1} //NPC script does not require an amount to be set, so default to one
    }
    //Remove the commmand and amount from the string, this should leave us with the item name
    code = code.replace("GIVEITEM ");
    var itemname = code = code.replace(itemamount);
    AddItem(itemname, itemamount);
}

function AddItem(itemname, itemamount){
    //Add items to the array
    simItemName[simItemName.length] = itemname;
    simItemAmount[simItemName.length] = itemamount;
    refreshPage();
}