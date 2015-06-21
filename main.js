var lives = [];
var intervals = [];
var balloonGeneratingInterval;
var hp;
var body;
var level;
var points;
var refPoints;
var objective;
var process;
const POINTS_PER_BALLOON = 100;
const ID = "balloon";

function init(p) {
    body = (p || document.getElementsByTagName("BODY")[0]);
    level= 0;
    points = 0;
    refPoints = 0;
    hp = 5;
}

function startGame() {
    document.getElementById("button").disabled = true;
    document.getElementById("level").innerHTML = level;
    objective = 10 + level*5;
    process = 0;
    balloonGeneratingInterval = setInterval(function() {
        process++;
        newBalloon();
        if (process==objective) clearInterval((balloonGeneratingInterval));
    }, 1000-level*50);
}

function endGame() {
    document.getElementById("button").disabled = false;
    level++;
    refPoints = points;
}

function newBalloon() {
    var num = lives.length;
    var id = ID+num;
    var div = document.createElement("DIV");
    div.style.width = "0px";
    div.style.height = "0px";
    div.style.position="relative";
    div.className="balloonContainer";
    div.appendChild(createBalloonDiv(id))
    body.appendChild(div);
    lives[num] = Math.floor(Math.random() * 5);
    intervals[num] = setInterval( function () {
        var el = document.getElementById(id);
        if (el.style.top=="-25px") {
            playerLostLife();
            var ref = Number(id.substr(id.length - 1, id.length));
            clearInterval(intervals[ref]);
            intervals[ref] = null;
        }
        el.style.top = (Number(el.style.top.substr(0, el.style.top.length - 2))-1) +"px";
    }, 40-level);
}

function createBalloonDiv(id) {
    var parent = document.createElement("DIV");
    parent.id = id;
    parent.style.position = "relative";
    parent.style.width = "25px";
    parent.style.height = "25px";
    var top = Number(body.style.height.substr(0, body.style.height.length - 2));
    console.log(top);
    parent.style.top = top + "px";
    var rand = Math.floor(Math.random() * Number(body.style.width.substr(0, body.style.width.length-2)))
    parent.style.left = rand+"px";
    parent.appendChild(createBalloonImg());
    parent.onclick = function() {clicked(parent);} ;
    return parent;
}

function createBalloonImg() {
    var img = document.createElement("IMG");
    img.src = "balloon.png";
    return img;
}

function clicked(el) {
    var id = el.id;
    var num = id.substr(7, id.length);
    var balloon = el.firstChild;
    if (lives[num]==0) {
        lives[num] = -1;
        balloon.src = "bang.png";
        clearInterval(intervals[num]);
        setTimeout( function () {
            el.style.display = "none";
        }, 500);
        points += POINTS_PER_BALLOON;
        document.getElementById("points").innerHTML = points;
        if (points - refPoints == objective*POINTS_PER_BALLOON) endGame();
    } else if (lives[num]>0) {
        lives[num]--;
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
    div.className="damageMark";
    div.id = "damageMark"+num;
    body.appendChild(div);
    setTimeout(function() {
        document.getElementById(div.id).style.display = "none";
    }, 500);
}

function playerLostLife() {
    var hp = Number(document.getElementById("hpLeft").innerHTML);
    hp--;
    document.getElementById("hpLeft").innerHTML = (hp-1);
}