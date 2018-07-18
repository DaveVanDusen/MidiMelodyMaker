function Drums(patternLength){

  this.length = patternLength;
  this.hats;
  this.kick;
  this.snare;
  this.out;
  this.mode = 0;
  this.complexity = 100;
  this.fillDivisions = [2,4];
  this.makeBeat = function(length){
      let pattern = [];
      for(i = 0; i < length; i++){
        //hihats
        let currentBeat = [];
        let selector = round(random(1,7));
        if(selector >= 3){
          currentBeat.push(42);
        }
        if (selector === 2){
          currentBeat.push(46);
        }

      switch(i%4){
        case 0:
          currentBeat.push(36);
          break;
        case 1:
          // if(simpleprob(2,16)){
          //   currentBeat.push(38);
          // }
          break;
        case 2:
          currentBeat.push(38);
          break;
        case 3:
          // if(simpleprob(2,10)){
          //   currentBeat.push(36);
          // }else if(simpleprob(3,10)){
          //   currentBeat.push(38);
          // }
        break;
      }
      pattern.push(currentBeat);
    }
    return pattern;
  }
  this.beats = this.makeBeat(patternLength);

  this.play = function(counter,MIDI,tempo){
    MIDI.playNote(this.beats[counter],this.out);
    switch(this.mode){
      case 0:
      this.fillDivisions = [2,2,2,2,2,2,2,4,4,4];
      break;
      case 1:
        MIDI.playNote(42,this.out, {time: '+'+floor(1000*(60/(tempo*4)))});
        this.fillDivisions = [2,2,2,2,2,2,4];
      break;
      case 2:
        MIDI.playNote(42,this.out, {time: '+'+floor(1000*(60/(tempo*3)))});
        this.fillDivisions = [1.5,3];
      break;
    }

    // MIDI.playNote(42,this.out, {time: '+'+floor(1000*(60/(tempo*4)))});
  }

  this.fill = function(MIDI,tempo){
    let noteOn = 0;
    let drumsOptions = [38,41,43,45];
    let drumChoice = drumsOptions.filter(function(){return Math.round(Math.random())})
    drumChoice = !drumChoice.length ? [[38,42,42,45][picker(4)]]: drumChoice;
    curSubdivision = this.fillDivisions[picker(this.fillDivisions.length)]
    incrementer = floor(1000*(60/(tempo*curSubdivision)));

    for(i = 0; i < curSubdivision; i++){
      if(simpleprob(this.complexity,100)){
        // console.log("drumChoice:  ",drumChoice)
      MIDI.playNote(drumChoice[picker(drumChoice.length)], this.out , {time: "+"+noteOn, velocity:(0.4+Math.random())/2});
      }
      noteOn += incrementer;
    }
  }


}
