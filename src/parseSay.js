function parseElseSay(code){
    if(scriptMode == "SAY"){
        scriptJS +="';";
    } 
     
    //End the current SAY mode
    scriptMode = "SAY";
    scriptJS +="}else{document.getElementById('simulatorSpeech').innerHTML='";
    openIf=true;
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
        newSpeech = newSpeech.replaceAll("<$NPCNAME>",npc.nname);
        newSpeech = newSpeech.replaceAll("<$USERNAME>",player.name);
        newSpeech = newSpeech.replaceAll("<$MAP>",map.mname);
        newSpeech = newSpeech.replaceAll("<$X_COORD>",map.x);
        newSpeech = newSpeech.replaceAll("<$Y_COORD>",map.y);
        newSpeech = newSpeech.replaceAll("<$GAMEGOLD>",player.gold);
        newSpeech = newSpeech.replaceAll("<$LEVEL>",player.level);
        newSpeech = newSpeech.replaceAll("<$CLASS>",player.class);
        newSpeech = newSpeech.replaceAll("<$DATE>",simDate);
        newSpeech = newSpeech.replaceAll("<$USERCOUNT>",server.usercount);
        newSpeech = newSpeech.replaceAll("<$PKPOINT>",player.pk);
        newSpeech = newSpeech.replaceAll("<$GUILDWARTIME>",guild.wartime);
        newSpeech = newSpeech.replaceAll("<$GUILDWARFEE>",guild.warfee);
        newSpeech = newSpeech.replaceAll("<$PARCELAMOUNT>",player.parcelamount);
        newSpeech = newSpeech.replaceAll("<$HP>",player.hp);
        newSpeech = newSpeech.replaceAll("<$MAXHP>",player.maxhp);
        newSpeech = newSpeech.replaceAll("<$MP>",player.mp);
        newSpeech = newSpeech.replaceAll("<$MAXMP>",player.maxmp);
        newSpeech = newSpeech.replaceAll("<$ARMOUR>",player.armour);
        newSpeech = newSpeech.replaceAll("<$WEAPON>",player.weapon);
        newSpeech = newSpeech.replaceAll("<$RING_L>",player.lring);
        newSpeech = newSpeech.replaceAll("<$RING_R>",player.rring);
        newSpeech = newSpeech.replaceAll("<$BRACELET_L>",player.lbrace);
        newSpeech = newSpeech.replaceAll("<$BRACELET_R>",player.rbrace);
        newSpeech = newSpeech.replaceAll("<$NECKLACE>",player.necklace);
        newSpeech = newSpeech.replaceAll("<$BELT>",player.belt);
        newSpeech = newSpeech.replaceAll("<$BOOTS>",player.boots);
        newSpeech = newSpeech.replaceAll("<$HELMET>",player.helmet);
        newSpeech = newSpeech.replaceAll("<$AMULET>",player.amulet);
        newSpeech = newSpeech.replaceAll("<$STONE>",player.stone);
        newSpeech = newSpeech.replaceAll("<$TORCH>",player.torch);
        newSpeech = newSpeech.replaceAll("<$CREDIT>",player.credit);
        newSpeech = newSpeech.replaceAll("'","&quot"); //Quotes will break the js
        newSpeech = newSpeech.replaceAll('"',"&quot"); //Quotes will break the js
        newSpeech = newSpeech.replaceAll(" ","&nbsp;"); //Retain the spaces
    
    //More complicated replacements for conquest as it can have values we wont know beforehand
    var conqueststring;
    var newdata;
    for(var j=0;j<8;j++){
        if(j==0){conqueststring="<$CONQUESTOWN";newdata = guild.conquestowner}
        if(j==1){conqueststring="<$CONQUESTGUARD";newdata = guild.conquestguard}
        if(j==2){conqueststring="<$CONQUESTGATE"; newdata = guild.conquestgate}
        if(j==3){conqueststring="<$CONQUESTWALL";newdata = guild.conquestwall}
        if(j==4){conqueststring="<$CONQUESTSEIGE";newdata = guild.conquestsiege}
        if(j==5){conqueststring="<$CONQUESTGOLD";newdata = guild.conquestgold}
        if(j==6){conqueststring="<$CONQUESTRATE";newdata =guild.conquestrate}
        if(j==7){conqueststring="<$CONQUESTSCHEDULE";newdata = guild.conquestschedule}
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
            jsfunc[i] ="<span class=\"mirbutton\" onclick=\"npc_"+buttonFunction+"()\">"+buttonText+"</span>"
            jsreplace[i] = newSpeech.substr(k[i],j[i]-k[i]+1);
            
        }
    }
        for(var i=0;i<jsfunc.length;i++){
            newSpeech = newSpeech.replace(jsreplace[i],jsfunc[i]);
        }
    
    //Test for colours
    var l =[];
    var m = [];
    var colorReplacement = [];
    var colorReplace = [];

    if(newSpeech.includes("{")){
        //There could be multiple colours so we must find the index of all of them
        var colorIndices = getIndicesOf("{",newSpeech,false);
        //iterate through all of the colours found
        for(var i=0;i<colorIndices.length;i++){
            //find the end of the text
            l[i] = newSpeech.indexOf("/",colorIndices[i]);
            var colorText = newSpeech.substr(colorIndices[i]+1,l[i]-colorIndices[i]-1);
            //find the end of the colour
            m[i] = newSpeech.indexOf("}",colorIndices[i]);
            var setColor = newSpeech.substr(l[i]+1,m[i]-l[i]-1);
            colorReplace[i] = newSpeech.substr(colorIndices[i],m[i]-colorIndices[i]+1);
            colorReplacement[i] = "<span style=\"color: " + setColor + ";\">" + colorText + "</span>";
        }
        for(var i=0;i<colorReplacement.length;i++){

            newSpeech = newSpeech.replace(colorReplace[i],colorReplacement[i]);           
        }
    }

    //Test for invalid buttons
    var buttonTest = newSpeech.replaceAll("<span","");
    buttonTest = buttonTest.replaceAll("</span>","");
    console.log("button text = "+ buttonTest);
    if(buttonTest.includes("<") && buttonTest.includes(">")){
        writeError2("Invalid page links (possibly missing @)",currentLine,"critical");
    }

    //Test for invalid variables (All should of been replaced by now so look for <$ if it exists its invalid)
    if(newSpeech.includes("<$")){
        writeError("Invalid variable tag in #SAY mode ",currentLine+1);
    }

    

    //Add strings to speech array
        scriptJS += newSpeech +"<br>";
    
    }
}

