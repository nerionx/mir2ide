This is a javascript application for debugging and testing legend of mir 2 npc scripts without having to
add them ingame.

It is very incomplete but the groundwork is there and initial tests show it to be sound.

TODO:
Add colour parsing for #SAY
Add the rest of the user variables so they can be changed
Add support for [QUESTS]
Add support for [ITEMS]

Most of the #ACT commands are missing
finishing adding the #IF commands

Add more sanity checks it is important the app displays an error with the script line rather than a console error on the 
generated javascript as this is useless to an end user.

parseSpeech() probably needs refactoring

Prettify the entire APP