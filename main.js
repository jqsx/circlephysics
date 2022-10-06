/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;


const circle = document.getElementById('circle');
var player = {
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 30,
        y: 0
    }
}

const body = document.getElementById('body');

var circles = [];
for (let i = 0; i < 10; i++) {
    body.innerHTML += '<div class="circle" id="' + i + '"></div>'
    circles.push({
        position: {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        },
        velocity: {
            x: (0.5 - Math.random()) * Math.random() * 10,
            y: (0.5 - Math.random()) * Math.random() * 10
        },
        circle: i,
        radius: 100
    });
}

window.addEventListener('mousedown', (event) => {
    const mouse = {
            position: {
                x: event.pageX,
                y: event.pageY
            }
        }
        //console.log(mouse.position);
    for (let i = 0; i < circles.length; i++) {
        let distance = getMag({ x: circles[i].position.x - mouse.position.x, y: circles[i].position.y - mouse.position.y })
        console.log(distance);
        if (distance < 100) {
            let v = getBounceDirection(circles[i], mouse);
            circles[i].velocity = { x: v.x * distance, y: v.y * distance };
        }
    }
});

function isColliding(circle, other) {
    return Math.sqrt(Math.pow(circle.position.x - other.position.x, 2) + Math.pow(circle.position.y - other.position.y, 2)) <= 100;
}

function getBounceDirection(circle, other) {
    let a = {
        x: (other.position.x - circle.position.x) * -1,
        y: (other.position.y - circle.position.y) * -1
    };
    let nor = normalize(a);
    if (nor === NaN)
        return {
            x: (0.5 - Math.random()) * Math.random() * 10,
            y: (0.5 - Math.random()) * Math.random() * 10
        }
    else
        return normalize(a);
}

function getMag(vec) {
    return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y - 4.79 / 2, 2));
}

function normalize(vec) {
    vec.x /= getMag(vec);
    vec.y /= getMag(vec);
    return vec;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function multiplyVector(vec, a) {
    return { x: vec.x * a, y: vec.y * a };
}

function addVector(vec, vac) {
    return { x: vec.x + vac.x, y: vec.y + vac.y };
}

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

var last = [];
setInterval(() => {
    var newpos = [];
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].position.x == NaN || circles[i].position.y == NaN || circles[i].velocity.x == NaN || circles[i].velocity.y == NaN) {
            let c = {
                position: {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                },
                velocity: {
                    x: (0.5 - Math.random()) * Math.random() * 10,
                    y: (0.5 - Math.random()) * Math.random() * 10
                },
                circle: i,
                radius: 100
            }
            circles[i].position = c.position;
            circles[i].velocity = c.velocity;
        }
        circles[i].position.x += circles[i].velocity.x;
        circles[i].position.y += circles[i].velocity.y;
        circles[i].velocity.x *= 0.95;
        //player.velocity.x -= Math.sign(player.velocity.x);
        circles[i].velocity.y += 1;
        if (circles[i].position.y > window.innerHeight - 100) {
            circles[i].position.y = window.innerHeight - 100;
            circles[i].velocity.y = -circles[i].velocity.y * 0.9 + 10;
        } else if (circles[i].position.y < 0) {
            circles[i].position.y = 0;
            circles[i].velocity.y = -circles[i].velocity.y / 2 * 0.9 + 10;
        }
        if (circles[i].position.x > window.innerWidth - 100) {
            circles[i].position.x = window.innerWidth - 100;
            circles[i].velocity.x = -circles[i].velocity.x * 0.9 + 10;
        } else if (circles[i].position.x < 0) {
            circles[i].position.x = 0;
            circles[i].velocity.x = -circles[i].velocity.x * 0.9 + 10;
        }

        if (last.length != 0) {
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(last[i].x, last[i].y);
            ctx.lineTo(circles[i].position.x, circles[i].position.y);
            ctx.stroke();
            ctx.closePath();
        }
        newpos.push(circles[i].position);
        circles.forEach((other) => {
            if (other.circle != circles[i].circle && isColliding(other, circles[i])) {
                let v = getBounceDirection(circles[i], other);
                let w = multiplyVector(v, -1);
                let distance = 100 - getMag({ x: circles[i].position.x - other.position.x, y: circles[i].position.y - other.position.y })
                    //circles[i].radius = clamp(100 - distance, 50, 100);
                circles[i].position = addVector(circles[i].position, multiplyVector(v, distance / 2));
                other.position = addVector(other.position, multiplyVector(w, distance / 2));
                let c_vec = { x: v.x * (getMag(other.velocity) / 1.1 + distance / 100), y: v.y * (getMag(other.velocity) / 1.1 + distance / 100) };
                other.velocity = { x: w.x * (getMag(circles[i].velocity) / 1.1 + distance / 100), y: w.y * (getMag(circles[i].velocity) / 1.1 + distance / 100) };
                circles[i].velocity = c_vec;
            }
        })
        if (circles[i].position.x == NaN || circles[i].position.y == NaN || circles[i].velocity.x == NaN || circles[i].velocity.y == NaN) {
            let c = {
                position: {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                },
                velocity: {
                    x: (0.5 - Math.random()) * Math.random() * 10,
                    y: (0.5 - Math.random()) * Math.random() * 10
                },
                circle: i,
                radius: 100
            }
            circles[i].position = c.position;
            circles[i].velocity = c.velocity;
        }
        let distancefromboost = getMag({ x: circles[i].position.x - window.innerWidth / 2, y: circles[i].position.y - window.innerHeight })
        if (distancefromboost < 100) {
            let v = getBounceDirection(circles[i], {
                position: {
                    x: window.innerWidth / 2,
                    y: window.innerHeight
                }
            });
            circles[i].velocity = {
                x: v.x * 100,
                y: v.y * 100
            }
        }

        const _circle = document.getElementById(i);
        _circle.style.transform = 'translate(' + circles[i].position.x + 'px ,' + circles[i].position.y + 'px)' + ' scale(' + circles[i].radius / 100 + ', ' + circles[i].radius / 100 + ')';
        _circle.style.borderColor = "rgb(" + Math.floor(Math.abs(Math.cos(i)) * 255) + ", " + Math.floor(Math.abs(Math.cos(i * 2)) * 255) + ", " + Math.floor(Math.abs(Math.cos(i * 3)) * 255) + ")";
        circles[i].radius = lerp(circles[i].radius, 100, 0.1);
        //_circle.innerHTML = "x: " + Math.round(circles[i].velocity.x * 100) / 100 + " y: " + Math.round(circles[i].velocity.y * 100) / 100;
    }
    last = newpos;
}, 1000 / 30);