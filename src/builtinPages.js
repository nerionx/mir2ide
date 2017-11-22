//Contains code for all the built in pages such as shop etc
//All mirscript functions start with npc_ and are in capitals

function npc_BUY(){
    writeSimulatorEvent("Buy Window Opened");
}

function npc_SELL(){
    writeSimulatorEvent("Sell Window Opened");
}

function npc_BUYSELL(){
    writeSimulatorEvent("Buy and Sell window Opened");
}

function npc_REPAIR(){
    writeSimulatorEvent("Repair window opened");
}

function npc_SREPAIR(){
    writeSimulatorEvent("Special Repair window opened");
}

function npc_BUYBACK(){
    writeSimulatorEvent("Buyback window opened");
}

function npc_STORAGE(){
    writeSimulatorEvent("Storage window opened");
}

function npc_CONSIGN(){
    writeSimulatorEvent("Consignment Window Opened");
}

function npc_MARKET(){
    writeSimulatorEvent("TrustMerchant window opened");
}

function npc_CREATEGUILD(){
    writeSimulatorEvent("Create Guild Window Opened");
}

function npc_REQUESTWAR(){
    writeSimulatorEvent("Request War Window Opened");
}

function npc_SENDPARCEL(){
    writeSimulatorEvent("Send Mail Window Opened");
}

function npc_COLLECTPARCEL(){
    writeSimulatorEvent("Collect Mail Window Opened");
}

function npc_AWAKENING(){
    writeSimulatorEvent("Awakening window opened");
}

function npc_DISASSEMBLE(){
    writeSimulatorEvent("Dissasemble Window Opened");
}

function npc_DOWNGRADE(){
    document.getElementById("simulatorEvents"),innerHTML += "<br>Downgrade Window Opened";
}

function npc_RESET(){
    document.getElementById("simulatorEvents"),innerHTML += "<br>Reset window opened";
}

function npc_PEARLYBUY(){
    document.getElementById("simulatorEvents"),innerHTML += "<br>Pearl Buy Window Opened";
}

function npc_BUYUSED(){
    document.getElementById("simulatorEvents"),innerHTML += "<br>Buy Used Item Window Opened";
}

function npc_REFINE(){
    document.getElementById("simulatorEvents"),innerHTML += "<br>Refine Window Opened";
}

function npc_REFINECOLLECT(){
    document.getElementById("simulatorEvents"),innerHTML += "<br>Collected Recent Refine";
}

function npc_REFINECHECK(){
    document.getElementById("simulatorEvents"),innerHTML += "<br>Checked Recent Refine";
}

function npc_EXIT(){
    document.getElementById("simulatorSpeech").innerHTML = "";
    document.getElementById("simulatorEvents").innerHTML = "Script has Ended";

}