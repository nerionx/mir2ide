function parseElseSay(code){
    if(scriptMode == "SAY"){
        scriptJS +="';";
    } 
     
    //End the current SAY mode
    scriptMode = "SAY";
    scriptJS +="}else{document.getElementById('simulatorSpeech').innerHTML='";
    openIf=true;
}