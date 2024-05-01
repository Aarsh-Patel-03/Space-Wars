function setMobileControls(){
    // controls for mobile device
    var plane = document.getElementById('plane');
    var playGround = document.getElementById("play-ground");
    
    var touchStartX, initialLeft;
    
    plane.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        initialLeft = plane.offsetLeft;
    });
    
    plane.addEventListener('touchmove', function (e) {
        var touchMoveX = e.touches[0].clientX;
        var moveX = touchMoveX - touchStartX;
    
        // Calculate the new left position
        var newLeft = initialLeft + moveX;
    
        // Ensure the plane stays within the visible range
        var maxLeft = window.innerWidth - plane.offsetWidth;
        newLeft = Math.max(70, Math.min(maxLeft, newLeft)+30);
    
        // Update the plane's left position
        plane.style.left = newLeft + 'px';
    });
    
    // Click event handling for shooting
    plane.addEventListener('click', function () {
        if (totalBullets > 0) {
            let heroBulletSound = document.getElementById("hero-shoot-sound");
            if (heroBulletSound !== null) {
                heroBulletSound.currentTime = 0;
                heroBulletSound.play().catch(function (error) {
                    console.error("Audio play error:", error);
                });
            }
            shoot();
            totalBullets--;
            document.getElementById("total-bullets").innerText = totalBullets;
        }
    });
    
}
