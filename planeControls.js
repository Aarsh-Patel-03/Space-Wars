var totalBullets=0;
$(document).keydown(function (e) {
    let myPlane = document.getElementById('plane');
    if(myPlane){
        let pg = document.getElementById("play-ground");
    let p = $(".plane");
    let leftValue = myPlane.offsetLeft;
    let enemyCount=parseInt(pg.dataset.value);
    if(pg.style.display=="block" && enemyCount!=0){
        if (e.keyCode == 37) {
            if (parseInt(leftValue) > 60) {
                p.animate({ left: "-=30" }, 10);
            }
        }
        if (e.keyCode == 39) {
            if (parseInt(leftValue) < 540) {
                p.animate({ left: "+=30" }, 10);
            }
        }
        if (e.keyCode == 32 && totalBullets>0) {
            let heroBulletSound = document.getElementById("hero-shoot-sound");
            if (heroBulletSound !== null) {
                heroBulletSound.currentTime = 0;
                heroBulletSound.play().catch(function (error) {
                    console.error("Audio play error:", error);
                });
            }
             shoot();
             totalBullets--;
             document.getElementById("total-bullets").innerText=totalBullets;
        }
    }
    }
    
});

function shoot() {
  let myPlane = document.getElementById('plane');
  let f = document.getElementById("play-ground");
  let enemies = document.getElementsByClassName("pirate");
  let enemiesArray = Array.from(enemies);
  let h = window.innerHeight;
  let b = document.createElement("div");
  let leftValue = myPlane.offsetLeft;
  let topValue = myPlane.offsetTop;
  let widthValue = myPlane.offsetWidth;
  b.className = "bullet";
  b.style.left = leftValue + 'px';
  b.style.top = topValue-30 + 'px';
  f.appendChild(b);
   setInterval(function () {
       if (parseInt(b.style.top)>10) {
           if (enemyOverlap(enemiesArray, b)) {
                b.remove();
            } 
            else {
               b.style.top = parseInt(b.style.top) - 10 + 'px';
            }
        } 
        else {
           b.remove();
        }
    }, 50000/h);
}

function enemyOverlap(enemiesArray,bullet){
  let pl,pt,pw,ph;
  let bl,bt,bw,bh;
  let widthCheck,heightCheck;
  let returnFlag = false;
  let enemyPower;

  bl=bullet.offsetLeft;
  bt=bullet.offsetTop;
  bw=bullet.offsetWidth;
  bh=bullet.offsetHeight;

  enemiesArray.forEach(element => {

    enemyPower=element.children[0];

    pl=element.offsetLeft;
    pt=element.offsetTop;
    pw=element.offsetWidth;
    ph=element.offsetHeight;

    widthCheck = ((bl+bw)>pl) && ((bl+bw)<(pl+pw));
    heightCheck = ((bt+bh)>pt) && ((bt+bh)<(pt+ph));

    if(widthCheck && heightCheck){
        element.dataset.power--;
        enemyPower.style.width=(enemyPower.offsetWidth-10)+'px';
        if(element.dataset.power<=0){
            element.remove();
            checkWin();
        }
        returnFlag= true;
    } 
  });
return returnFlag;
}

function fireworks(){
    let pg = document.getElementById("play-ground");
    let shot;
        shot = document.createElement("div");
        shot.className="firework";
        pg.appendChild(shot);
        setTimeout(function(){
            pg.removeChild(shot);
            //Make Level Button able to click again
            document.getElementById("level-btn").disabled=false;

        },10000)
        fireworksSound();
        setTimeout(fireworksSound,2000);
        setTimeout(fireworksSound,4000);
        setTimeout(fireworksSound,6000);
        setTimeout(fireworksSound,8000);
}

function checkWin(){
    let f = document.getElementById("play-ground");
    let enemies = document.getElementsByClassName("pirate");
    let enemiesArray = Array.from(enemies);
    if(enemiesArray.length==0 && f.dataset.value>0){
        f.dataset.value=0;
        clearInterval(counterFireInterval);
        fireworks();
        // setTimeout(goToHome, 10000);
    }
}