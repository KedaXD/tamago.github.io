let mobilenet;
let classifier;
let predictor;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/yDuXEerW9/';
let video;
let flippedVideo;
let label = "";
let value = 0;
let bg;
let song;

let yoff = 0.0;
let egg;
let px = 960;
let py = 540;
let pr = 150;

let recognize = true;

let speed = 20;




  function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  }

  function modelReady() {
    console.log('Model is ready!!!');
    predictor.load('model.json', customModelReady);
  }

  function customModelReady () {
    console.log('Custom Model Ready!');
    predictor.predict(gotRegression);
  }
   
  function videoReady() {
    console.log('Video is ready!!!');
    predictor.predict(gotRegression);
  }

  function setup() {
    createCanvas(1920, 1080);
    bg = loadImage('tamagotchi.png');
    song = loadSound('music.mp3');
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    
    mobilenet = ml5.featureExtractor('MobileNet', modelReady);
    predictor = mobilenet.regression(video, videoReady);
    
    flippedVideo = ml5.flipImage(video);
    // Start classifying
    classifyVideo();
  }




  function draw() {
    background(bg);
    //song.play();
    // Draw the video
    //image(flippedVideo, 480, 0);

    // Draw the label
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width/2, height - 4);
    
    // Draw the blob
   
    //animations

    //idle
    if (label == "nothing") {
      if (px < 960) {
        px += 0.5;
      } else {
        px -= 0.5;
      }
      if (py < 540) {
        py += 0.5;
      } else {
        px -= 0.5;
      }
      if (pr < 150) {
       pr += 0.5;
      } else {
      pr -= 0.5;
      } 
    }

    if (label == "nothingplus") {
      if (px < 960) {
        px += 0.5;
      } else {
        px -= 0.5;
      }
      if (py < 540) {
        py += 0.2;
      } else {
        px -= 0.2;
      }
      if (pr < 150) {
       pr += 0.5;
      } else {
      pr -= 0.5;
      } 
    }

    if (label == "fanleft") {
      if (px > 250) {
        px -= 3;
      }
      if (pr > 100) {
        pr -= 1;
      }
    } 

    if (label == "fanleftplus") {
      if (px > 250) {
        px -= 3;
      }
      if (pr > 100) {
        pr -= 1;
      }
    } 

    if (label == "fanright") {
      if (px < 1920) {
        px += 3;
      }
      if (pr > 100) {
        pr -= 1;
      }
    }

      
    if (label == "fanrightplus") {
      if (px < 1920) {
        px += 3;
      }
      if (pr > 100) {
        pr -= 1;
      }
    }
    
    if (label == "fanfront") {
      if (pr > 50) {
        pr -= 1;
      }
    }

    if (label == "fanfrontplus") {
      if (pr > 100) {
        pr -= 1;
      }
    }

    if (label == "avocado") {
      if (pr <= 200) {
        pr += 2;
      }
    } 
    
    if (label == "avocadoplus") {
      if (py >= 540 || py <= 440) {
        speed = -speed;
      } 
      py = py + speed;
      // console.log(px);
      if (pr <= 200) {
        pr += 2;
      }
    }

    if (label == "mayo") {
      if (pr > 100) {
        pr -= 5;
      }
    }

    if (label == "mayoplus") {
      if (px >= 1010 || px <= 910) {
        speed = -speed;
      }
      px = px + speed;
      if (pr > 100) {
        pr -= 5;
      }
    }

  egg = new blob (px, py, pr);
  egg.display();


  

  noStroke();
  let eyeX = map (value, 0, 1, pr-50, -pr);
  let off = map (value, 0, 1, -pr*0.2, pr*0.35);
  fill('rgba(255, 255, 255, 1)');
  ellipse (eyeX, 0, pr, pr);
  fill(255, 190, 73);
  ellipse (eyeX-off, 0, pr*0.65, pr*0.65);
  fill(160, 81, 28);
  ellipse (eyeX-off, 0, pr*0.4, pr*0.4);
  fill(127, 65, 28);
  ellipse (eyeX-off, 0, pr*0.35, pr*0.35);
  fill('rgba(255, 255, 255, 0.7)');
  ellipse (eyeX-off-pr*0.12, -pr*0.12, pr*0.1, pr*0.1);

    
  }





  // Get a prediction for the current video frame
  function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
  }

  // When we get a result
  function gotResult(error, results) {
    // If there is an error
    if (error) {
      console.error(error);
      return;
    } else {
      confidence = results[0].confidence;
      if (confidence >= 0.95 && confidence < 0.999) {
        label = results[0].label;
        console.log(label, confidence);
        setTimeout (function(){classifyVideo();}, 2000);
      } else if (confidence >= 0.999) {
        label = results[0].label + "plus";
        console.log(label, confidence);
        setTimeout (function(){classifyVideo();}, 2000);
      } else {
        label = "nothing";
        classifyVideo();
      }
    }
  }

  function gotRegression(error, result) {
    if (error) {
      console.error(error);
    } else {
      // updated to work with newer version of ml5
      // value = result;
      value = result.value;
      //console.log(value);
      if (value >= 0.5) {
        if (px >= 650) {
        px -= 1.5;
        }
      } else if (value <= 0.15) {
        if (px <= 1350) {
        px += 1.5;
        }
      }
      predictor.predict(gotRegression);
    }
  }


class blob {
  constructor (_x, _y, _r) {
    this.position = createVector(_x, _y);
    this.radius = _r;
  }
  
  display () {
    noStroke ();
    translate(this.position.x, this.position.y);
    beginShape();
    var xoff = 0;

    let blobColor = color(255);
    blobColor.setAlpha(100 + 75*sin(millis()/1000));
   

    fill(blobColor);
    
    for (var a = 0; a < TWO_PI; a += 0.1) {
      var offset = map(noise(xoff, yoff), 0, 1, -25, 25);
      var rad = this.radius + offset;
      var x = rad * cos(a);
      var y = rad * sin(a);
      vertex(x, y);
      xoff += 0.1;
    }
    endShape();
    yoff += 0.01;

    
  }
}


