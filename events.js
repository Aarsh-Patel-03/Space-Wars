let planePower;
var counterFireInterval;
let moveLeft=true;

function play(){
    buttonClickSound();
    document.getElementById("home").style.display='none';
    document.getElementById("about-game").style.display='none';
    document.getElementById("play-ground").style.display='block';
    planePower=10;
    addPlane();
    document.getElementById("level-btn").disabled=false;
    setMobileControls();
}

function goToHome(){
  buttonClickSound();
  document.getElementById("about-game").style.display='none';
  let pg = document.getElementById("play-ground");
  pg.style.display='none';
  document.getElementById("home").style.display='block';
  var container = document.getElementById('play-ground'); 
  Array.from(container.children).forEach(function(child) {
    if (child.dataset.permanent !== "true") {
      container.removeChild(child);
    }
  });
  pg.dataset.value=0;
  clearInterval(counterFireInterval);
}

function playAudio() {
  let audio = document.getElementById("myAudio");
  console.log(audio);
  if (audio !== null) {
      audio.play().catch(function (error) {
          console.error("Audio play error:", error);
      });
  }
}

  
  function toggleAudio() {
    let btn = document.getElementById("sound");
    let audio = document.getElementById('myAudio');
    if (audio !== null) {
      btn.addEventListener("click", function () {
        if (audio.paused) {
          audio.play().catch(function (error) {
            console.error("Audio play error:", error);
          });
        } else {
          audio.pause();
        }
      });
    }
  }


function showAbout(){
    buttonClickSound();
    document.getElementById("about-game").style.display='block';
    document.getElementById("play-ground").style.display='none';
    document.getElementById("home").style.display='none';
}

function setDifficulty(btn){
  buttonClickSound();
  btn.parentNode.style.display="none";
  let level = document.getElementById("play-ground").dataset.value=btn.value;
  let elements = document.getElementsByClassName('pirate');

  let elementsArray = Array.from(elements);

  elementsArray.forEach(function(element) {
    element.parentNode.removeChild(element);
  });

  setLevel(level);
}

function setLevel(difficulty){

  //Make Level Button disable
  document.getElementById("level-btn").disabled=true;


  // Set PowerLine Full
  let pl = document.getElementById("power-line");
  pl.style.width=100+'px';

  //Check if counterFireInterval exist or not if it exist then clear Interval

    if(counterFireInterval){
      clearInterval(counterFireInterval);
    }
  
  let d = parseInt(difficulty);
  totalBullets = (d*10)+5;
  planePower=10;
  document.getElementById("total-bullets").innerText=totalBullets;
  let pg = document.getElementById("play-ground");
  let w =pg.offsetWidth;
  let spaceBetween;
  let ew;

  for(let i=1; i<=difficulty;i++){
    let enemy = document.createElement("div");
    enemy.className="pirate";
    enemy.dataset.power = 10;

    let powerLine = document.createElement("div");
    powerLine.className="enemy-power-line";
    pg.append(enemy);
    enemy.append(powerLine);
    ew = enemy.offsetWidth;
    spaceBetween = (w-(d*ew))/(d+1);
    enemy.style.left = ((i-1)*ew)+(spaceBetween*i)+'px';
  }
  counterFireInterval=setInterval(counterFire,2000);
}

function counterFire() {
  let pg = document.getElementById("play-ground");
  let h = window.innerHeight;
  let enemies = document.getElementsByClassName('pirate');
  let myPlane = document.getElementById("plane");
  let powerLine = myPlane.children[0];
  let enemiesArray = Array.from(enemies);
  let l=enemiesArray.length;
  let leftValue, topValue, widthValue, heightValue;

  enemiesArray.forEach(function (element) {
    leftValue = element.offsetLeft;
    topValue = element.offsetTop;
    widthValue = element.offsetWidth;
    heightValue = element.offsetHeight;

    if (moveLeft) {
      element.style.left = leftValue - 20 + 'px';
    }
    else {
      element.style.left = leftValue + 20 + 'px';
    }

    element.style.top = topValue + 20 + 'px';

    if (planeOverlap(myPlane, element)) {
          myPlane.remove();
          clearInterval(counterFireInterval);
          setTimeout(goToHome, 5000);
    }

    let enemyBullet = document.createElement("div");
    enemyBullet.className = "pirateBullet";
    enemyBullet.style.left = leftValue + (widthValue / 2) + 'px';
    enemyBullet.style.top = topValue + heightValue + 10 + 'px';
    pg.appendChild(enemyBullet);

    let enemyBulletInterval = setInterval(function () {
      if (parseInt(enemyBullet.style.top) < h - 10) {
        if (planeOverlap(myPlane,enemyBullet)) {
          damageSound();
          planePower--;
          powerLine.style.width=(powerLine.offsetWidth-10)+'px';
          if (planePower <= 0) {
            gameOverSound();
            myPlane.remove();
            clearInterval(counterFireInterval);
            setTimeout(goToHome, 5000);
          }
          
          enemyBullet.remove();
          clearInterval(enemyBulletInterval);
        } 
        else {
          enemyBullet.style.top = parseInt(enemyBullet.style.top) + 10 + 'px';
        }
      } 
      else {
        enemyBullet.remove();
        clearInterval(enemyBulletInterval);
      }
    }, 50000/h);
  });

  if (l > 0) {
    if (moveLeft && parseInt(enemiesArray[0].style.left) <= 40) {
        moveLeft = false;
    } else if (!moveLeft && parseInt(enemiesArray[l-1].style.left) >=pg.offsetWidth-widthValue-40) {
        moveLeft = true;
    }
  }
  if(totalBullets==0 && pg.getElementsByClassName("bullet").length==0){
    gameOverSound();
    clearInterval(counterFireInterval);
    setTimeout(goToHome, 5000);
  }
}
function planeOverlap(plane,bullet){
  let pl,pt,pw,ph;
  let bl,bt,bw,bh;
  let widthCheck,heightCheck;

  pl=plane.offsetLeft;
  pt=plane.offsetTop;
  pw=plane.offsetWidth;
  ph=plane.offsetHeight;

  bl=bullet.offsetLeft;
  bt=bullet.offsetTop;
  bw=bullet.offsetWidth;
  bh=bullet.offsetHeight;

  widthCheck = ((bl+bw)>pl-pw/2) && ((bl+bw)<(pl+pw/2));
  heightCheck = ((bt+bh)>pt) && ((bt+bh)<(pt+ph));

  return widthCheck && heightCheck;

}

function addPlane(){
  let pg=document.getElementById("play-ground");
  let p = document.createElement("div");
  p.id="plane";
  p.className="plane";
  let powerLine = document.createElement("div");
  powerLine.className="power-line";
  powerLine.id="power-line";
  pg.append(p);
  p.append(powerLine);
}

function selectLevel(){
  buttonClickSound();
  var difficultyLevel = document.getElementById("difficultyLevel");
            if (difficultyLevel.style.display === "none") {
                difficultyLevel.style.display = "flex";
            } else {
                difficultyLevel.style.display = "none";
            }
}

function startAnimation() {
  let animatedElement = document.getElementById("main-frame");
  animatedElement.style.animation = "slide 10s linear infinite";
}

function stopAnimation() {
  let animatedElement = document.getElementById("main-frame");
  animatedElement.style.animation = ""; 
}

// window.addEventListener("resize", function () {
//   var animatedElement = document.getElementById("main-frame");
//   var viewportHeight = window.innerHeight || document.documentElement.clientWidth;

//   animatedElement.style.animationDuration = 10 + viewportHeight / 100 + "s"; 
// });

function buttonClickSound(){
  let audio = document.getElementById("button-sound");
  // console.log(audio);
  if (audio !== null) {
    audio.currentTime=0;
      audio.play().catch(function (error) {
          console.error("Audio play error:", error);
      });
  }
}

function fireworksSound(){
  let audio = document.getElementById("fireworks-sound");
  // console.log(audio);
  if (audio !== null) {
    audio.currentTime=0;
      audio.play().catch(function (error) {
          console.error("Audio play error:", error);
      });
  }
}

function gameOverSound(){
  let audio = document.getElementById("game-over-sound");
  // console.log(audio);
  if (audio !== null) {
    audio.currentTime=0;
      audio.play().catch(function (error) {
          console.error("Audio play error:", error);
      });
  }
}

function damageSound(){
  let audio = document.getElementById("damage-sound");
  // console.log(audio);
  if (audio !== null) {
    audio.currentTime=0;
      audio.play().catch(function (error) {
          console.error("Audio play error:", error);
      });
  }
}
