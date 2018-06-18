

var melody = [];
var scaleRatio = [0,2,4,5,7,9,11];
var currentScale = [];
var rootNote = 50;
var counter;
var patternLength = 32;
var chord, lead;
var chordCounter = 0;
var drums, drum;
var tempo = 120;
var bpmChanged = false;
var backbeat = true;
var lineardrums = false;
var noteOff;
var chordOff;
var selector, lastselector;
var chordRhythm, lastChord, lastNote, thisNote;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noteOff = 1000*60/tempo;
  chordOff = 2*1000*60/tempo;
  frameRate(tempo/60);
  currentScale = createScale(scaleRatio, 3);
  //This makes the melody
  themelody = melodymaker(currentScale, patternLength);
  rootNote = rootNote-12;
  //This makes the chord progression
  theprogression = chordprogression(currentScale, patternLength);
  if(backbeat){
  drums = [hihat(patternLength), snare(patternLength), kick(patternLength)];
  }
  if(lineardrums){
  drums = linearbeat(patternLength);
  }
  chordRhythm = euclideanrhythm(patternLength, 10);
  leadRhythm = euclideanrhythm(patternLength, 22);

}





WebMidi.enable(function (err) {
  if(err){
    console.log("WebMidi is fucked, Dave", err);
  }
  //Chord Dropdown
  drum = WebMidi.outputs[0];
  lead = WebMidi.outputs[1];
  chord = WebMidi.outputs[2];
  for(var i = 0; i < WebMidi.outputs.length; i++){
    $('.chordoutput').append("<option>"+ WebMidi.outputs[i].name +"</option>");
  }

  $( '.chordoutput' ).change(function() {
    chordIndex = $(".chordoutput option:selected").index();
    chordIndex = chordIndex-1;
    chord = WebMidi.outputs[chordIndex];
    //console.log(drums);
  });

  //Lead Output
  for(i = 0; i < WebMidi.outputs.length; i++){
    $('.leadoutput').append("<option>"+ WebMidi.outputs[i].name +"</option>");
  }

  $( '.leadoutput' ).change(function() {
    leadIndex = $(".leadoutput option:selected").index();
    leadIndex = leadIndex-1;
    lead = WebMidi.outputs[leadIndex];
  });

  for(i = 0; i < WebMidi.outputs.length; i++){
  $('.drumoutput').append("<option>"+ WebMidi.outputs[i].name +"</option>");
  }

  $( '.drumoutput' ).change(function() {
    drumIndex = $(".drumoutput option:selected").index();
    drumIndex = drumIndex-1;
    drum = WebMidi.outputs[drumIndex];
  });
});

$(document).ready(function(){
  //Tempo Callback
  $('#bpm').change(function(){
    tempo = $('#bpm').val();
    console.log($('#bpm').val());
    bpmChanged = true;
  });
});

function draw() {
//Allows the tempo to change
  if(bpmChanged){
    frameRate(tempo/60);
    bpmChanged = false;
    //console.log("tempo ", tempo);
    $('#bpm').val(tempo);
    }

    counter = frameCount%patternLength;
    chordCounter = floor(frameCount/16)%patternLength




    //Which style drum beat dog?
    drumArray = backbeat ? [drums[0][counter],drums[1][counter],drums[2][counter]] :
      drums[counter];




    thisChord = voicings(theprogression[chordCounter]);
    thisChord = shuffleArray(thisChord);
    //console.log(thisChord);

    //Sends the MIDI out
    if(chord && chordRhythm[counter]){
    if(lastChord){
    chord.stopNote(lastChord, 1);
    }
    // chord.playNote(theprogression[chordCounter], 1);
    legatochords(thisChord, chord, tempo);
    lastChord = thisChord;

    }
    if(lead && leadRhythm[counter]){
    if(lastNote){
    lead.stopNote(lastNote, 1);
    }
    thisNote = themelody[counter]
    // chord.playNote(theprogression[chordCounter], 1);
    lead.playNote(thisNote, 1/*,{time: "+50"}*/);
    lastNote = thisNote;
    }

    if(drum){
      if(simpleprob(3,4)){
      drum.playNote(drumArray, 3/*,{time: "+50"}*/);
      drum.stopNote(drumArray, 3, {time: "+500"});
      } else {
        drumFill(drum,tempo,[3]);
        drum.playNote(drumArray, 3/*,{time: "+50"}*/);
        drum.stopNote(drumArray, 3, {time: "+500"});

      }
    }

}
