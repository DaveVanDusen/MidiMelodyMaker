 function voicings(arr){
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

// Selects a value within an array
 function picker(posses){
  thisTime = floor(random(posses));
  return thisTime;
 }

 function simpleprob(integer, outof){
  randomval = ceil(random(outof));
  if(randomval > integer){
    return false;
  }

  if(randomval <= integer){
    return true;
  }

 }

function hihat(length){
  pattern = [];
  for(i = 0; i < length; i++){
    selector = round(random(1,7));
    if(selector >= 3){
      pattern.push(42);
    }
    if (selector === 2){
      pattern.push(46);
    }
    if(selector === 1){
      pattern.push(0);
    }

  }
  return pattern;
}

function snare(length){
  pattern = [];
  for(i = 0; i < length; i++){
    //beat 2
    if(i%4 === 2){
      pattern.push(38);
    }
    else{
      selector = floor(random(16))
      if (selector <=1){
        pattern.push(38);
      }
      else{
        pattern.push(0);
      }

    }
  }
  return pattern;
}

function kick(length){
  pattern = [];
  for(i = 0; i < length; i++){
      if(i%4 === 0){
      pattern.push(36);
    }
    if(i%4 === 2){
      pattern.push(0);
    }

    if (i%4 === 1){
      selector = floor(random(2));
      if(selector < 1){
        pattern.push(0);
      }else{
        pattern.push(36);
      }
    }
        if (i%4 === 3){
      selector = floor(random(10));
      if(selector < 8){
        pattern.push(0);
      }else{
        pattern.push(36);
      }
    }
  }
  return pattern;
}

function linearbeat(length){
  pattern = [];
  soundSearch = true;
  drums = [36,38,42,50,52];
  for(i = 0; i < length; i++){
      if(i%8 === 0){
        pattern.push(drums[0]);
      }
      if(i%8 === 4){
        pattern.push(drums[1]);
      } else {
        selector = floor(random(5));
        while(soundSearch){
            if(drums[selector] != pattern[i-1]){
              soundSearch = false;
            } else {
              selector = floor(random(5));
            }
         }
     pattern.push(drums[selector]);
    }
  }
  return pattern;
}

function euclideanrhythm(beats, accents){
  //initialize the character array
  array = [];
  groups = beats;
  leftItems = accents;
    for(i = 0; i < beats; i++){
      if(i < accents){
        array[i] = "1";
      }else{
        array[i] = "0";
      }
    }
  //start distributing the accents
  while(groups-leftItems > 1){
      //which group is larger
      if(groups-leftItems > leftItems){
        transferCount = leftItems;
      } else {
        transferCount = groups-leftItems;
      }

    for(i = 0; i < transferCount;i++){
      array[i] = array[i] + array[groups-transferCount+i];
      groups--;
    }
    leftItems = transferCount;
  }
  output = "";
  for(i = 0; i < groups; i++){
    output += array[i];
    }
  array = [];
  for(i = 0; i < output.length; i++){
      array.push(parseInt(output[i]));
    }
  return array;
  }

function createScale(scaleRatio, octaves){
  currentScale = [];
  for(h = 0; h < octaves; h++){
    for (var i = 0; i < scaleRatio.length; i++){
       currentScale.push(scaleRatio[i] + rootNote + (12*h));
    }
  }
  return currentScale;
}


function melodymaker(scale, patternLength){
  selector = floor(random(currentScale.length));
  melody = [];
  for(var j = 0; j < patternLength; j++){
      if(selector < 0){
        selector = selector + currentScale.length;
      }
      // console.log(selector)
      melody.push(currentScale[selector%12]);
      lastselector = selector;

      switch(picker(8)){
        case 0:
        case 1:
        case 2:
        selector = lastselector + 1;
        break;

        case 3:
        case 4:
        case 5:
        selector = lastselector - 1
        break;

        case 6:
        case 7:
        selector = round(random(15));
        break;
      }
    }
  return melody;
}

function createChords(currentScale){
  allChords = [];
  for(var j = 0; j < 7; j++){
    currentChord = [];
    for(i = 0; i < 3; i++){
      for(k = 0; k < 3; k++){
        chordIndex = (j + (2*k) + (i * 7))%currentScale.length;
        currentChord.push(currentScale[chordIndex]);

      }

    }
    allChords.push(currentChord);
  }
  return allChords
}

function chordprogression(currentScale, patternLength){
  let selector = floor(random(currentScale.length));
  let progression = [];
  for(var j = 0; j < patternLength; j++){
    selector = selector < 0 ? selector + currentScale.length : selector;
    rootNote = currentScale[selector%currentScale.length];
    currentChord = [];
    for(i = 0; i < 3; i++){
      for(k = 0; k < 4; k++){
        chordIndex = (selector + (2*k) + (i * 7))%currentScale.length;
        currentChord.push(currentScale[chordIndex]);
      }
    }
    progression.push(currentChord);
    lastselector = selector;
    switch(picker(8)){
      case 0:
      case 1:
      selector = lastselector - 3;
      break;

      case 2:
      case 3:
      selector = lastselector + 3;
      break;


      case 4:
      case 5:
      selector = lastselector - 1
      break;

      case 6:
      case 7:
      selector = round(random(currentScale.length));
      break;
    }
  }
  return progression;
}

function legatochords(currentChord, midiChannel, tempo, subdivision){
  noteOn = 0;
  incrementer = floor(1000*(60/(tempo*subdivision)));
  for(i = 0; i < currentChord.length; i++){
    midiChannel.playNote(currentChord[i], 1 , {time: "+"+noteOn});
    noteOn += incrementer;
  }
}


function drumFill(midiChannel, tempo,subdivisionArray){
  let noteOn = 0;
  let drumsOptions = [38,41,43,45];
  let drumChoice = drumsOptions.filter(function(){return Math.round(Math.random())})
  drumChoice = !drumChoice.length ? [[38,42,42,45][picker(4)]]: drumChoice;
  curSubdivision = subdivisionArray[picker(subdivisionArray.length)]
  incrementer = floor(1000*(60/(tempo*curSubdivision)));

  for(i = 0; i < curSubdivision; i++){
    if(simpleprob(7,8)){
    // console.log("drumChoice:  ",drumChoice)
    midiChannel.playNote(drumChoice[picker(drumChoice.length)], 1 , {time: "+"+noteOn});
    }
    noteOn += incrementer;
  }
}

function shuffleArray(array){
  outputArray = [];
  index = floor(random(array.length));
  while(array.length){
    outputArray.push(array[index]);
    array.splice(index,1);
    index = floor(random(array.length));
  }
  return outputArray;
}

function strumSpeed(sliderPosition){
  let possibleSpeeds = [2,3,4,8,16,24]
}
