// make a system where you can score the likely hood of outcomes with a set of numbers
function markovObject(distro){
  this.input = distro;
  this.distributions = [];
  this.sums;
  this.findSums = function(){
    var out = this.input.map(a=>{
    	var sum = 0;
    	for (i=0 ; i < a.length; i++){
      		sum += a[i];
          }
    	return sum
    });
    this.sums = out;
  }
  this.findSums();

  for(i=0 ; i<this.input.length; i++){
    var runningTotal = 0

    let row = this.input[i].map((a,b)=>{

        runningTotal += a/this.sums[i]
        return(runningTotal)
    });

    this.distributions.push(row);

  }

}







var chords = ["I","ii","iii","IV","V","vi","vii",];
var distributions =[
  [20,10,10,20,25,10,5],
  [20,15,10,20,90,10,5],
  [10,10,10,70,15,50,0],
// IV
  [40,10,5,20,50,10,0],
// V
  [90,10,10,50,25,10,0],
// vi
  [80,30,10,20,25,10,0],
// vii
  [20,10,10,20,25,10,0],


];
var cur = new markovObject(distributions);

var lastChord = "I"
function inRange(lastChord){
  let currentDis = cur.distributions[chords.indexOf(lastChord)];
  let seed = Math.random();
  // console.log(seed, 'ranges: ', currentDis)
  let bottom = 0
  let foundIx = currentDis.findIndex(a=>{
     if(seed < a && seed > bottom){
       return true;
     }else{
       bottom = a;

     }
  })
  lastChord = chords[foundIx]
  return chords[foundIx];
}



//
