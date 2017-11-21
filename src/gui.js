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
    document.getElementById("simulatorEvents").innerHTML +="<br>"+msg;
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

function loadOptions(){
    //Load saved options if they exist
    if(window.localStorage.getItem("player")!==null){
        console.log("Loading Options");
        player = JSON.parse(window.localStorage.getItem("player"));
        server = JSON.parse(window.localStorage.getItem("server"));
        guild = JSON.parse(window.localStorage.getItem("guild"));
        map = JSON.parse(window.localStorage.getItem("map"));
        npc = JSON.parse(window.localStorage.getItem("npc"));
    }
    //Put them into the correct box on the UI
    for(var key in player){
        if(player.hasOwnProperty(key)){
            document.getElementById(key).value = player[key];
        }
    }
    for(var key in npc){
        if(npc.hasOwnProperty(key)){
            document.getElementById(key).value = npc[key];
        }
    }
    for(var key in map){
        if(map.hasOwnProperty(key)){
            document.getElementById(key).value = map[key];
        }
    }
    for(var key in server){
        if(server.hasOwnProperty(key)){
            document.getElementById(key).value = server[key];
        }
    }
    for(var key in guild){
        if(guild.hasOwnProperty(key)){
            document.getElementById(key).value = guild[key];
        }
    }
}