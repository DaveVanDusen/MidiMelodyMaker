function Lead(currentScale,patternLength){
  this.scale = currentScale;
  this.length = patternLength;
  this.pattern;
  this.out;
  this.createPattern = function(currentScale, patternLength){
    selector = floor(random(currentScale.length));
    let melody = [];
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
    this.pattern = melody;
  }


  }
