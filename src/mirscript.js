// a partial MIRSCRIPT grammar in simple JSON format
codemirror_define_grammar_mode("mirscript", {
  
  
// prefix ID for regular expressions used in the grammar
"RegExpID"                          : "RE::",

// Style model
"Style"                             : {

"comment"                      : "comment"
,"atom"                         : "atom"
,"keyword"                      : "keyword"
,"this"                         : "keyword"
,"builtin"                      : "builtin"
,"operator"                     : "operator"
,"identifier"                   : "variable"
,"property"                     : "attribute"
,"number"                       : "number"
,"string"                       : "string"
,"regex"                        : "string-2"

},

// Lexical model
"Lex"                               : {

"comment"                      : {"type":"comment","tokens":[
                              // line comment
                              // start, end delims  (null matches end-of-line)
                              [  ";",  null ],
                              // block comments
                              // start,  end    delims
                              [  ";*",   "*;" ]
                              ]}
,"identifier"                   : "RE::/[_A-Za-z$][_A-Za-z0-9$]*/"
,"property"                     : "RE::/[_A-Za-z$][_A-Za-z0-9$]*/"
,"number"                       : [
                              // floats
                              "RE::/\\d*\\.\\d+(e[\\+\\-]?\\d+)?/",
                              "RE::/\\d+\\.\\d*/",
                              "RE::/\\.\\d+/",
                              // integers
                              // hex
                              "RE::/0x[0-9a-fA-F]+L?/",
                              // binary
                              "RE::/0b[01]+L?/",
                              // octal
                              "RE::/0o[0-7]+L?/",
                              // decimal
                              "RE::/[1-9]\\d*(e[\\+\\-]?\\d+)?L?/",
                              // just zero
                              "RE::/0(?![\\dx])/"
                              ]
,"string"                       : {"type":"escaped-block","escape":"\\","tokens":
                              // start, end of string (can be the matched regex group ie. 1 )
                              [ "RE::/([\"])/",   1 ]
                              }
,"regex"                        : {"type":"escaped-block","escape":"\\","tokens":
                              // javascript literal regular expressions can be parsed similar to strings
                              [ "[",    "RE::#][gimy]{0,4}#" ]
                              }
,"operator"                     : {"tokens":[
                              "+", "-", "++", "--", "%", ">>", "<<", ">>>",
                              "*", "/", "^", "|", "&", "!", "~",
                              ">", "<", "<=", ">=", "!=", "!==",
                              "=", "==", "===", "+=", "-=", "%=",
                              ">>=", ">>>=", "<<=", "*=", "/=", "|=", "&="
                              ]}
,"delimiter"                    : {"tokens":[
                              "(", ")", "[", "]", "{", "}", "@", "=", ";", "?", ":",
                              "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "++", "--",
                              ">>=", "<<="
                              ]}
,"atom"                         : {"autocomplete":true,"tokens":[
                              "true", "false", 
                              "null", "undefined", 
                              "NaN", "Infinity"
                              ]}
,"keyword"                      : {"autocomplete":true,"tokens":[ 
                              "#IF", "#ACT", "#SAY", "#ELSESAY", "#ELSEACT"                                
                              ]}
,"builtin"                      : {"autocomplete":true,"tokens":[ 
                              "ISADMIN", "LEVEL", "CHECKITEM", 
                              "CHECKGOLD", "CHECKGENDER", "CHECKCLASS", "DAYOFWEEK", "HOUR","MIN","CHECKNAMELIST","CHECKPKPOINT","CHECKRANGE",
                              "CHECK", "CHECKHUM", "CHECKMON", "CHECKEXACTMON", "RANDOM","GROUPLEADER","GROUPCOUNT","CHECKPET","PETLEVEL","PETCOUNT","CHECKCALC","INGUILD", 
                              "CHECKMAP", "CHECKQUEST", "CHECKRELATIONSHIP", "CHECKWEDDINGRING", "CHECKCREDIT","HASBAGSPACE","ISNEWHUMAN","CHECKCONQUEST","AFFORDGUARD","AFFORDGATE", 
                              "AFFORDWALL", "AFFORDSIEGE","CONQUESTAVAILABLE","CONQUESTOWNER","CHECKPERMISSION","MOVE","INSTANCEMOVE","GIVEGOLD","TAKEGOLD","GIVEITEM","TAKEITEM","GIVEEXP",
                              "GIVEPET","REMOVEPET","CLEARPETS","ADDNAMELIST","DELNAMELIST","CLEARNAMELIST","GIVEHP","GIVEMP","CHANGELEVEL","SETPKPOINT","REDUCEPKPOINT","INCREASEPKPOINT",
                              "CHANGEGENDER","LOCALMESSAGE","GLOBALMESSAGE","GOTO","GIVESKILL","REMOVESKILL","SET","PARAM1","PARAM2","PARAM3","MONGEN","TIMERECALL","TIMERECALLGROUP",
                              "BREAKTIMERECALL","MONCLEAR","GROUPRECALL","GROUPTELEPORT","DELAYGOTO","MOV","CALC","GIVEBUFF","REMOVEBUFF","ADDTOGUILD","REMOVEFROMGUILD",
                              "REFRESHEFFECTS","CHANGEHAIR","CANGAINEXP","COMPOSEMAIL","ADDMAILITEM","ADDMAILGOLD","SENDMAIL","GROUPGOTO","ENTERMAP","GIVEPEARLS","TAKEPEARLS","MAKEWEDDINGRING",
                              "FORCEDIVORCE","LOADVALUE","SAVEVALUE","GIVECREDIT","TAKECREDIT","CONQUESTGUARD","CONQUESTGATE","CONQUESTWALL","CONQUESTSEIGE","TAKECONQUESTGOLD","SETCONQUESTRATE",
                              "STARTCONQUEST","SCHEDULECONQUEST","OPENGATE","CLOSEGATE"
                              ]}
,"tag"                          :{"autocomplete":true,"tokens":[
                              "<$NPCNAME>","<$USERNAME>","<$MAP>","<$X_COORD>","<$Y_COORD>","<$GAMEGOLD>","<$LEVEL>","<$CLASS>","<$DATE>","<$USERCOUNT>","<$PKPOINT>",
                              "<$GUILDWARTIME>","<$GUILDWARFEE>","<$PARCELAMOUNT>","<$HP>","<$MAXHP>","<$MP>","<$MAXMP>","<$ARMOUR>","<$WEAPON>","<$RING_L>","<$RING_R>",
                              "<$BRACELET_L>","<$BRACELET_R>","<$NECKLACE>","<$BELT>","<$BOOTS>","<$HELMET>","<$AMULET>","<$STONE>","<$TORCH>","<$CREDIT>"
                              ]}                                 

},

// Syntax model (optional)
"Syntax"                            : {

"dot_property"                  : {"sequence":[".", "property"]}
,"js"                           : "comment | tag | number | string | regex | keyword | operator | atom | (('}' | ')' | builtin | identifier | dot_property) dot_property*)"

},

// what to parse and in what order
"Parser"                            : [ ["js"] ]

})