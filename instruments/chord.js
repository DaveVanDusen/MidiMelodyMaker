function Chord(currentScale,patternLength,chordIteration){
  this.scale = currentScale;
  this.patternLength = patternLength;
  this.chordprog;
  this.romans = ["I","ii","iii","IV","V","vi","vii",];
  this.chordLength = chordIteration;
  this.progression = chordprogression(currentScale,patternLength);
  this.availableChords = createChords(this.scale);
  this.chordSize = this.availableChords[0].length;
  this.busyness = 1;
  this.markovProgression = function(patternLength){
    let chordprog = [];
    for (var i = 0; i < patternLength; i++) {
      chordprog.push(lastChord)
      lastChord = inRange(lastChord);
      chords.indexOf(lastChord)
    }
    this.chordprog = chordprog;
    let output = chordprog.map(a => {
      return this.availableChords[this.romans.indexOf(a)]
    })
    return output;
  }
  this.otherProg = this.markovProgression(patternLength);
  this.currentChord;
  this.lastChord
  this.out;

  this.createProgression = function(){
    this.progression = chordprogression(this.scale, this.patternLength);
  }

  this.rhythm = euclideanrhythm(this.chordLength, this.busyness);
  this.beat = 0;

  this.newRhythm = function(amount){
    this.busyness = Math.ceil(this.chordLength * (amount/100));
    if(this.busyness<=this.chordLength){
    this.rhythm = euclideanrhythm(this.chordLength, this.busyness);
    }
  }

  this.voicings = function(arr,numStrings){
    let maximum = Math.floor(arr.length * Math.random())
    var voicing = arr.slice();
     for(i = 0; i < 3; i++){
     //Removes a random note from the chord
     mutedNote = ceil(random(voicing.length-1));
      //the root
     voicing.splice(mutedNote,1);
     }
     return voicing;
  }

  this.lastCounter;
  this.strum = function(chordCounter,MIDI,tempo, subdivision){
    let currentNotes = voicings(this.otherProg[chordCounter]);
    if(simpleprob(1,2)){
      this.currentChord = currentNotes.sort(function(a, b){return a-b})
    }else{
      this.currentChord =  currentNotes.sort(function(a, b){return b-a})
    }

    let currentRoman = this.chordprog[chordCounter];
    let nextRoman = this.chordprog[(chordCounter+1)%this.patternLength]
    if(this.lastCounter !== chordCounter){
    $('.chordbutton').removeClass('current');
    $('.chordbutton').removeClass('next');
    this.beat = 0;
    }
    $('.chordbutton:eq('+this.romans.indexOf(currentRoman)+')').addClass('current');

    if(this.beat>Math.floor(this.chordLength/2) && currentRoman !== nextRoman){
      $('.chordbutton:eq('+this.romans.indexOf(nextRoman)+')').addClass('next');
    }

    let noteOn = 0;
    let incrementer = floor(1000*(60/(tempo*subdivision)));
    let sustain = Math.floor(1000*(60/(tempo)))

    let currentChord = this.currentChord;
    // console.log(this.beat);
    if(this.rhythm[this.beat]){
        for(i = 0; i < currentChord.length; i++){
          MIDI.playNote(currentChord[i], this.out , {time: "+"+noteOn, velocity:(0.3+Math.random())/3});
          MIDI.stopNote(currentChord[i], this.out , {time: "+"+noteOn+sustain});
          noteOn += incrementer;

        }

        this.lastChord = this.currentChord;
        this.lastCounter = chordCounter;

      }

      this.beat += 1;
      this.beat = this.beat%this.chordLength;


  }


}
