var scaleRatio = [0,2,4,5,7,9,11];
var fillTimings = [1,2,4,8,16,32,0];
var fillTiming = 0; var drumComplexity = 1;
var currentScale = [];
var rootNote = 40;
var counter = 0, chordCounter = 0;
var chordIteration = 8;
var patternLength = 8;
var chord,lead,drums;
var tempo = 120;
var backbeat = true;
var selector, lastselector;
var subdivisions = [0,2,3,4,8,16,32,64];
var strumSpeed = 2;
var chordRhythm, lastChord, lastNote, thisNote;
var MIDI;
bpmChanged = false;

function setup(){
  frameRate(tempo*2/60);
  currentScale = createScale(scaleRatio, 3);
  lead = new Lead(currentScale, patternLength);
  chord = new Chord(currentScale, patternLength,chordIteration);
  drums = new Drums(patternLength);
  bass = new Bass(currentScale,chord.otherProg);
}

WebMidi.enable(function (err) {
  if(err){
    console.log("Wib MIBI not working", err);
  }

  MIDI = WebMidi.outputs[0];

  drums.out = 1;
  lead.out = 2;
  chord.out = 3;
  bass.out = 4;

  for(i = 0; i < WebMidi.outputs.length; i++){
    $('.output').append("<option>"+ WebMidi.outputs[i].name +"</option>");
  }

  for(i = 0; i < chord.romans.length;i++){
    $('.romans').append("<div class='toggle chordbutton'>"+chord.romans[i]+"</div>")
  }

  $('.chordbutton').click(function() {
    $(this).toggleClass('nochord');
  })

  $( '.output' ).change(function() {
    let selected = $(".output option:selected").index();
    selected = selected-1;
    MIDI = WebMidi.outputs[selected];
  });


  $('.drumfeel').click(function(){
    $('.drumfeel').removeClass('selected');
    $(this).addClass('selected');
    drums.mode = $('.drumfeel').index(this);
  });
})

$(document).ready(function(){
  //Tempo Callback
  $('#bpm').change(function(){
    tempo = $('#bpm').val();
    bpmChanged = true;
  });

  // $('input[type=range]').on('input', function () {
  //     $(this).trigger('change');
  // });

  $("[type=range]").change(function(){
    let newval=$(this).val();
    let currIx = $('.slider').index(this);
    switch(currIx){
      case 0:
      strumSpeed = subdivisions[newval];
      break;
      case 1:
      chord.newRhythm(newval);
      break;
      case 2:
      console.log('Yup!')
      break;
      case 3:

      break;
      case 4:
      break;
      case 5:
      fillTiming = fillTimings[6-newval];
      break;
      case 6:
      drums.complexity = 100-newval;
      break;
      case 7:
      bass.attentiveness = newval;
      break;
      case 8:
      bass.busyness = newval;
      break;

    }
  });
});

function draw () {
  if(bpmChanged){
    frameRate(tempo*2/60);
    bpmChanged = false;
    $('#bpm').val(tempo);
  }
  counter = frameCount%patternLength;
  // 2 bars per chord
  chordCounter = floor(frameCount/chord.chordLength)%chord.chordLength;


  // Determines which type of drum beat was generated
  // drumArray = backbeat ? [drums[0][counter],drums[1][counter],drums[2][counter]] :
    // drums[counter];
  if(MIDI !== undefined){
  drums.play(counter,MIDI,tempo);
  //Chord Triggering
  bass.pluck(chordCounter,counter,MIDI,tempo);
  chord.strum(chordCounter,MIDI,tempo, strumSpeed);
  }

  if(fillTiming != 0 && chordCounter%fillTiming == 0){
    drums.fill(MIDI,tempo);
  }



}
