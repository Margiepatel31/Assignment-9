/*
File:
91.461 GUI Programming I  Assignment# 9: Implementing a Bit of Scrabble with Drag-and-Drop
Margie Patel, Umass Lowell Computer Science, Margie_Patel@student.uml.edu
Copyright (c) 2019 by Margie_Patel. All rights reserved.
updated by MP on December 19, 2019 at 8:00 PM
Description: The purposes of this assignment are to give you additional experience working with the jQuery UI
*/

"use strict";

var pieces = [
  {"letter":"A", "value":1,  "amount":9},
  {"letter":"B", "value":3,  "amount":2},
  {"letter":"C", "value":3,  "amount":2},
  {"letter":"D", "value":2,  "amount":4},
  {"letter":"E", "value":1,  "amount":12},
  {"letter":"F", "value":4,  "amount":2},
  {"letter":"G", "value":2,  "amount":3},
  {"letter":"H", "value":4,  "amount":2},
  {"letter":"I", "value":1,  "amount":9},
  {"letter":"J", "value":8,  "amount":1},
  {"letter":"K", "value":5,  "amount":1},
  {"letter":"L", "value":1,  "amount":4},
  {"letter":"M", "value":3,  "amount":2},
  {"letter":"N", "value":1,  "amount":6},
  {"letter":"O", "value":1,  "amount":8},
  {"letter":"P", "value":3,  "amount":2},
  {"letter":"Q", "value":10, "amount":1},
  {"letter":"R", "value":1,  "amount":6},
  {"letter":"S", "value":1,  "amount":4},
  {"letter":"T", "value":1,  "amount":6},
  {"letter":"U", "value":1,  "amount":4},
  {"letter":"V", "value":4,  "amount":2},
  {"letter":"W", "value":4,  "amount":2},
  {"letter":"X", "value":8,  "amount":1},
  {"letter":"Y", "value":4,  "amount":2},
  {"letter":"Z", "value":10, "amount":1},
  {"letter":"Blank", "value":0,  "amount":2}
];
var word = new Array(8);
var current = 0;
var tilecount = 0;
var TOTAL;

$(document).ready(function () {
    Create_Board(); //random tiles
    Drag_Drop(); //draggables and droppables
});

function Create_Board() {

    var letter;
    var rand;
    var remaining = 7 - current;

    Save_Word();
    //seven tiles
    for (var i = 0; i < remaining; i++) {
        rand = Math.floor((Math.random() * 25));      //random number
        letter = pieces[rand].letter;
        $("#holder").append(" <img id=\"" + letter + "\" class=\"rack\" src=\"images/" + letter + ".jpg\">")
        current++;
    }
    Drag_Drop(); //refresh the draggable code
}


function Drag_Drop() {
    //allow the tiles to be dropped back on the rack
    $("#holder").droppable({accept: '.rack', out: Letters});

    function Letters(event, ui) {
        current--;
    }

    //rack blocks (the letters) are draggable and snap to board blocks in the inside, if it's not a valid droppable then revert
    $(".rack").draggable({snap: ".block", snapMode: "inner", revert: 'invalid'});

    //if they're being dragged , make that array slot blank
    function Drag(event, ui) {
        if (ui.draggable.attr("id") == word[$(this).attr("id")]) {
            //remove tile from board
            word[$(this).attr("id")] = ""; //make it blank
            //tcount++;
        }
        update_Word(word);
    }

    //you can drag the rack blocks onto the board(.board_blocks)
    $(".block").droppable({accept: '.rack', drop: Drop, out: Drag});

    //run this function when a tile is dropped
    function Drop(event, ui) {
        var letter = ui.draggable.prop('id');          //take the ID of the draggable(letter tile) and assign it to letter
        var element = $(this).attr("id");              //take the ID of the droppable(the board tile) and assign it to element
        var number = parseInt(element);                 //make sure it's an int and not a string
        //a tile is added, increment tcount
        tilecount++;
        ////////////THIS CODE IS NOT WORKING ENTIRELY
        if (typeof word[number - 1] === 'undefined' && typeof word[number + 1] === 'undefined' && tilecount < 1) {
            console.log();
            console.log("tcount is:" + tcount);
            ui.draggable.draggable({revert: true});
        } else {
            word[number] = letter;
            update_Word(word);
        }


    }
}


function Save_Word() {

    for (var i = 0; i <= word.length; i++) {
        if (typeof word[i] === 'undefined') {
        } else {
            $("#" + word[i]).draggable('disable')
        }
    }
}

function update_Word(w) {
    var current = "";
    for (var i = 0; i < w.length; i++) {
        if (typeof w[i] === 'undefined') {

        } else {
            current += w[i];
        }
    }
    if (w) {
        document.getElementById('word').innerHTML = current;
        update_Score(word);
    }
    submit();
}

function submit(){

    find_word();
    var submitted = document.getElementById('word').innerHTML;
    console.log("submitted word: " + submitted);
    submitted = submitted.toLowerCase();
    if ( dict[submitted] ) {
        console.log("this is a real word: " + submitted);
        document.getElementById('messages').innerHTML = 'You have submitted a correct word! Congratulations.';

    }else{
        document.getElementById('messages').innerHTML = 'The word you have submitted is not a real word, sorry.';
        console.log("this is a not a real word.");
    }

}

function update_Score(word) {
    var total = 0;
    var add = 0;
    var dw = 0;
    //look through the array
    for (var i = 0; i < word.length; i++) {
        //find the letter in the scores array
        for (var j = 0; j < pieces.length; j++) {
            //if it's here
            if (word[i] != "" && (word[i] == pieces[j].letter)) {
                //if i == 2 (double letter score) then double the value
                if (i == 2) {
                    add = pieces[j].value * 2;
                    total += add;
                }if (i == 5) {
                    dw++;
                    add = pieces[j].value;
                    total += add;
                }if(i!=2 && i != 5) //else, just add the score normally
                {
                    total += pieces[j].value;
                }
            }
        }
    }
    if(dw!=0)
    {
        total = total * 2;
    }
    //put it in the score div
    document.getElementById('score').innerHTML = total.toString();
}

function reset()
{
    if(document.getElementById('message').innerHTML === "You have submitted a correct word! Congratulations.")
    {
        TOTAL += parseInt(document.getElementById('score').innerHTML);
        document.getElementById('total').innerHTML = "Total score: " + TOTAL;
        restart();
    }else{
        alert("Please submit a valid word and try again");
    }

}

function restart()
{
    var letter;
    var rand;
    var add  = 7;
    var string ="";

    current = 7;

    for(var i =0; i< word.length;i++)
    {
        word[i]="";
    }


    for(var i = 0; i < 7; i++)
    {
        rand = Math.floor((Math.random() * 25));      //random number 1-25
        letter = scores[rand].letter;                 //letter = the letter at the random spot in the scores array
        console.log(rand);
        string = string + (" <img id=\""+ letter + "\" class=\"rack\" src=\"images/" + letter + ".jpg\">"); //dynamically create images in the #rack div
    }

    console.log(images);

    document.getElementById('holder').innerHTML = string;
    Drag_Drop(); //refresh the draggable code

    document.getElementById('score').innerHTML = " ";
    document.getElementById('word').innerHTML = " ";
    document.getElementById('message').innerHTML = " ";

}

function next_round()
{
    restart();
    document.getElementById('totalscore').innerHTML = "";
}

var dict = {};

// Do a jQuery Ajax request for the text dictionary
$.get( "../dictionary.txt", function( txt ) {
    // Get an array of all the words
    var words = txt.split( "\n" );

    // And add them as properties to the dictionary lookup
    // This will allow for fast lookups later
    for ( var i = 0; i < words.length; i++ ) {
        dict[ words[i] ] = true;

    }
});

function find_word( word ) {
    // See if it's in the dictionary
    if ( dict[ word ] ) {
        // If it is, return that word
        return word;
    }

    // Otherwise, it isn't in the dictionary.
    return "_____";
}
