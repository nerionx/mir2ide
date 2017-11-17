//functions for operating the gui


//Jquery stuff
$(function(){

$("input#file-open").change(function(){
    var file = document.getElementById("file-open").files[0];
    var reader = new FileReader();
    reader.onload = function (e){
        var editorspan = document.getElementById("editor");
        editorspan.innerText = e.target.result;
    }
    reader.readAsText(file);
    });
});

//Vanilla JS stuff
function openFile(){
    document.getElementById("file-open").click();
    document.getElementById("editor").text = document.getElementById("file-open").innerText;
}
