var lives = [];
var intervals = [];
var balloonGeneratingInterval;
var hp;
var body;
var level;
var points;
var totalBalloons;
var objective;
var process;
var painIndicator;
const POINTS_PER_BALLOON = 100;
const ID = "balloon";

function init(p) {
    body = (p || document.getElementsByTagName("BODY")[0]);
    level= 0;
    points = 0;
    hp = 5;
}

function startGame() {
    document.getElementById("button").disabled = true;
    document.getElementById("level").innerHTML = level;
    objective = 10 + level*5;
    process = 0;
    totalBalloons = 0;
    balloonGeneratingInterval = setInterval(function() {
        process++;
        newBalloon();
        if (process==objective) clearInterval(balloonGeneratingInterval);
    }, 1000-level*50);
}

function endGame() {
    document.getElementById("button").disabled = false;
    if (hp>0) level++;
    else {
        level = 0;
        points = 0;
        hp = 5;
    }
}

function newBalloon() {
    var num = lives.length;
    var id = ID+num;
    var div = document.createElement("DIV");
    div.style.width = "0px";
    div.style.height = "0px";
    div.style.position="relative";
    div.className="balloonContainer";
    lives[num] = Math.floor(Math.random() * 5);
    div.appendChild(createBalloonDiv(id, lives[num]));
    body.appendChild(div);
    intervals[num] = setInterval( function () {
        var el = document.getElementById(id);
        if (el.style.top=="0px") el.style.opacity="0.0";
        else if (el.style.top=="-25px") {
            playerLostLife();
            setTimeout( function() { el.style.display = "none";}, 1100);
            var ref = Number(id.substr(id.length - 1, id.length));
            clearInterval(intervals[ref]);
            intervals[ref] = null;
        }
        el.style.top = (Number(el.style.top.substr(0, el.style.top.length - 2))-1) +"px";
    }, 40-level);
}

function createBalloonDiv(id, lives) {
    var parent = document.createElement("DIV");
    parent.id = id;
    parent.style.position = "relative";
    parent.style.width = "25px";
    parent.style.height = "25px";
    parent.style.opacity = "0.0";
    parent.style.color = "white";
    parent.style.fontSize = "11px";
    parent.style.boxSizing = "border-box";
    parent.style.paddingTop = "3px";
    parent.style.paddingLeft = "5px";
    parent.style.cursor = "default";
    parent.innerHTML = lives + 1;
    var top = Number(body.style.height.substr(0, body.style.height.length - 2));
    console.log(top);
    parent.style.top = top + "px";
    var rand = Math.floor(Math.random() * Number(body.style.width.substr(0, body.style.width.length-2)));
    parent.style.left = rand+"px";
    parent.style.backgroundImage = "url(img/balloon.png)";
    parent.onclick = function() {clicked(parent);} ;
    setTimeout(function() {
        parent.style.opacity="1.0";
    }, 500);
    return parent;
}

function clicked(el) {
    var id = el.id;
    var num = id.substr(7, id.length);
    if (lives[num]==0) {
        lives[num] = -1;
        el.innerHTML = "";
        el.style.backgroundImage = "url(img/bang.png)";
        clearInterval(intervals[num]);
        setTimeout( function () {
            el.style.display = "none";
        }, 500);
        points += POINTS_PER_BALLOON;
        document.getElementById("points").innerHTML = points;
        totalBalloons++;
        if (totalBalloons == objective) endGame();
    } else if (lives[num]>0) {
        lives[num]--;
        el.innerHTML = lives[num] + 1;
        createDamageMark(el.style.left, el.style.top);
    }
}

function createDamageMark(x, y) {
    var div = document.createElement("DIV");
    var num = document.getElementsByClassName("damageMark").length;
    div.style.position = "relative";
    var posX = Number(x.substr(0, x.length - 2)) + 35;
    var posY = Number(y.substr(0, y.length - 2));
    div.style.top = posY + "px";
    div.style.left = posX + "px";
    div.style.width = "30px";
    div.style.height = "30px";
    div.innerHTML = "-1";
    div.className = "damageMark";
    div.id = "damageMark"+num;
    body.appendChild(div);
    setTimeout(function() {
        document.getElementById(div.id).style.display = "none";
    }, 500);
}

function playerLostLife() {
    var hp = Number(document.getElementById("hpLeft").innerHTML);
    totalBalloons++;
    hp--;
    document.getElementById("painIndicator").style.opacity = "1.0";
    painIndicator = setInterval(function() {
        var el = document.getElementById("painIndicator");
        if (el.style.opacity == 0.0) clearInterval(painIndicator);
        else el.style.opacity -= 0.1;
    }, 10);
    document.getElementById("hpLeft").innerHTML = hp.toString();
    if (hp <= 0 || totalBalloons==objective) endGame();
}