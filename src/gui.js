//functions for operating the gui


//Jquery stuff
$(function(){
    loadOptions();
    //FYI editor is the codemirror box

$("input#file-open").change(function(){
    var file = document.getElementById("file-open").files[0];
    var reader = new FileReader();
    reader.onload = function (e){
        
        editor.doc.setValue(e.target.result);
        
    }
    reader.readAsText(file);
    });

    //Code to save the file this method is used as it preserves line breaks properly.
$("#saveas").on("click",function(event){
    var textfile=null;
    currentCode = editor.doc.getValue();
    currentCode = currentCode.replace(/\n/g, "\r\n");
    var finishedCode = new Blob([currentCode],{type: "text/plain"});

    if(textfile!==null){
        window.URL.revokeObjectURL(textfile);
    }
    textfile=window.URL.createObjectURL(finishedCode);
    
    var link = document.getElementById("saveas");
    link.href=textfile;
    
    
});

});

//Vanilla JS stuff
function openFile(){
    document.getElementById("file-open").click();

}

//Call this with running code to add an event to the simulator modal (E.g. Simulator took an item)
function writeSimulatorEvent(msg){
    scriptJS += "document.getElementById('simulatorEvents').innerHTML +='<br>"+msg+"';";
}

function clearScript(){
    $('#yousure').modal('toggle');
    editor.doc.setValue("");
}
function saveAllOptions(){
    window.localStorage.setItem("player",JSON.stringify(player));
    window.localStorage.setItem("server",JSON.stringify(server));
    window.localStorage.setItem("guild",JSON.stringify(guild));
    window.localStorage.setItem("map",JSON.stringify(map));
    window.localStorage.setItem("npc",JSON.stringify(npc));

}

//Replacement for write error, allowing warnings aswelll as criticals which will stop parsing
function writeError2(msg,line=0,type="critical"){
    var classes="simconsole";
    var premessage="";
    if(type=="critical"){errors=true; classes="bg-danger text-white"; premessage = "Critical: "} //Critical error dont run the parsed code as it will be incorrect
    if(type=="good"){classes="bg-success text-white";}
    if(type=="warning"){classes="bg-warning text-white"; premessage = "Warning: "; hadWriteError=true;}
    if(!line==0){
        msg += " on line number " + (line+1);
    }
    document.getElementById("script-console").innerHTML += "<span style='display: block; width: 100%;' class='"+classes+"'>"+premessage+msg+"</span>";

}

function loadOptions(){
    //Load saved options if they exist
    if(window.localStorage.getItem("player")!==null){
        player = JSON.parse(window.localStorage.getItem("player"));
        server = JSON.parse(window.localStorage.getItem("server"));
        guild = JSON.parse(window.localStorage.getItem("guild"));
        map = JSON.parse(window.localStorage.getItem("map"));
        npc = JSON.parse(window.localStorage.getItem("npc"));
    }
    //Put them into the correct box on the UI
    for(var key in player){
        if(player.hasOwnProperty(key)){
            if(player[key]){document.getElementById(key).value = player[key]};
        }
    }
    for(var key in npc){
        if(npc.hasOwnProperty(key)){
            if(npc[key]!==""){document.getElementById(key).value = npc[key]};
        }
    }
    for(var key in map){
        if(map.hasOwnProperty(key)){
            if(map[key]!==""){document.getElementById(key).value = map[key]};
        }
    }
    for(var key in server){
        if(server.hasOwnProperty(key)){
            if(server[key]!==""){document.getElementById(key).value = server[key]};
        }
    }
    for(var key in guild){
        if(guild.hasOwnProperty(key)){
            if(guild[key]!==""){document.getElementById(key).value = guild[key]};
        }
    }
}

//Checks if a number is or can be converted to a valid integer
function isInt(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
  }

 function defaultOptions(save=false){
    player = {"gold":"1000","name":"Player","class":"Taoist","gender":"male","level":"22","petcount":"5","petlevel":"7","petname":"Oma Warrior",
                "pearls":"1000","isadmin":"false","isnew":"true","pk":"1","parcelamount":"3","hp":"100","mp":"100","maxhp":"100","maxmp":"100",
                "armour":"BaseDress(f)","weapon":"WoodenSword","lring":"DragonRing","rring":"RubyRing","lbrace":"MonkBrace","rbrace":"SilverBrace",
                "necklace":"SkillNecklace","belt":"ChainBelt","boots":"BlackBoots","helmet":"BronzeHelments","amulet":"Amulet",
                "stone":"DCStone","torch":"EternalFlame","credit":"1000","itemcheck":"true","flagcheck":"true","questcheck":"true"}
    map = {"x":"50","y":"100","mname":"BichonProvince"}
    npc = {"nname":"Anna"}
    guild ={"gname":"Default Guild","wartime":"30","warfee":"10000","ggold":"100000","conquestowner":"true","conquestguard":"Archer - Still Alive",
                "conquestgate":"Gate - Still Alive","conquestwall":"Wall - Still Alive","conquestsiege":"Siege - Still Alive",
                "conquestgold":"1000","conquestrate":"10","conquestschedule":"Enemy Guild","conquestavailable":"true","guardcost":"1000",
                "gatecost":"1000","siegecost":"1000","wallcost":"1000"}
    server ={"usercount":"10"}

    if(save==true){saveAllOptions()} //Clicked the defaults button

    loadOptions();
}