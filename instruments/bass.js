function Bass(currentScale,progression){
  this.scale = currentScale;
  this.patternLength = patternLength;
  this.chordprog = progression.map(a=>a.slice(0,6));
  this.chordLength = chordIteration;
  this.currentChord;
  this.lastChord
  this.out;
  this.mode=0;
  this.fillDivisions;
  this.lastCounter;
  this.beat = 0
  this.rootNote;
  this.busyness = 1;
  this.attentiveness = 3;
  this.octave = 0;

  this.pluck = function(chordCounter,counter,MIDI,tempo, subdivision){
    // if(this.lastChord){
    //    MIDI.stopNote(this.lastChord, this.out);
    //  }
    let noteOn = 0;
    let incrementer = floor(1000*(60/(tempo*subdivision)));
    let sustain = floor(1000*(60*2/(tempo)))
    let currentChord = this.chordprog[chordCounter].map(a=>a-this.octave);


    let rootNote = currentChord[0];
    for (var i = 0; i < this.attentiveness; i++) {currentChord.push(rootNote);}
    if(rootNote !== this.rootNote){
      this.beat = 0;
    }
    this.rootNote = rootNote;
    this.currentChord = currentChord;
    if(this.beat === 0){
      MIDI.playNote(rootNote, this.out, {time: "+"+noteOn, velocity:(0.3+Math.random())/2});
      MIDI.stopNote(rootNote, this.out, {time: "+"+noteOn+sustain});
    }else{
      if(simpleprob(this.busyness,100)){
      let thisNote = currentChord[picker(currentChord.length)];
      MIDI.playNote(thisNote, this.out, {time: "+"+noteOn, velocity:(0.3+Math.random())/2});
      MIDI.stopNote(thisNote, this.out, {time: "+"+noteOn+sustain});
      }
    }
    this.beat += 1;

      }

  }
