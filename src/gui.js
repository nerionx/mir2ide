//functions for operating the gui


//Jquery stuff
$(function(){

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

function loadOptions(){
    
}