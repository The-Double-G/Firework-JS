var canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var ctx = canvas.getContext("2d")

var fireworks = [] 

function createFirework(event) {
    var startX = canvas.width / 2 
    var startY = canvas.height 
    var endX = event.clientX 
    var endY = event.clientY 
    var speedFactor = 0.7  // Increased speed factor
    // Calculate distance
    var distanceX = endX - startX 
    var distanceY = endY - startY 

    // Calculate initial velocity components based on distance

    var t = Math.sqrt((2*Math.abs(distanceY))/speedFactor)
    var v = t*speedFactor
    //sqrt((2h)/g) = t
    //g*t = v
    
    

    var vx = distanceX / t
    var vy = -speedFactor * t

    var firework = new Firework(startX, startY, vx, vy, endY) 
    fireworks.push(firework) 
}

canvas.addEventListener('click', createFirework) 
//made by gurpreet
class Firework {
    constructor(x, y, vx, vy, targetY) {
        this.x = x 
        this.y = y 
        this.vx = vx 
        this.vy = vy 
        this.maxY = y  // Store the initial y-coordinate as the maximum height
        this.targetY = targetY 
        this.size = Math.random() * 4 + 2  // Increased size range
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`  // Brighter color
        this.explosionSize = Math.random() * 10 + 10  // Increased explosion size range
        this.isExploded = false 
        this.particles = [] 
        this.gravity = 0.7  // Increased gravity
    }

    update() {
        if (!this.isExploded) {
            this.x += this.vx 
            this.y += this.vy 

            // Update max height
            this.maxY = Math.max(this.maxY, this.y) 

            // Check if firework reaches max height
            if (this.vy >= 0 && this.y <= this.maxY) { // Check if vy is positive to avoid triggering when falling
                this.isExploded = true 
                this.explode() 
            }
        } else {
            var allParticlesGone = true 
            this.particles.forEach(particle => {
                particle.update() 
                if (particle.alpha > 0) {
                    allParticlesGone = false 
                }
            }) 

            // Remove firework if all particles are gone
            if (allParticlesGone) {
                this.particles = [] 
            }
        }

        this.vy += this.gravity  // Apply gravity to the firework
    }

    draw() {
        if (!this.isExploded) {
            ctx.beginPath() 
            ctx.fillStyle = this.color 
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2) 
            ctx.fill() 
        } else {
            this.particles.forEach(particle => {
                particle.draw() 
            }) 
        }
    }

    explode() {
        for (var i = 0 ; i < 100 ; i++) { // Increased number of particles
            var particle = new Particle(this.x, this.y, this.color, this.explosionSize) 
            this.particles.push(particle) 
        }
    }
}

class Particle {
    constructor(x, y, color, size) {
        this.x = x 
        this.y = y 
        this.size = size 
        this.color = color 
        this.vx = (Math.random() - 0.5) * 10  // Increased velocity range
        this.vy = (Math.random() - 0.5) * 10  // Increased velocity range
        this.alpha = 1 
        this.gravity = 0.05 
        this.rotation = Math.random() * Math.PI * 2 
        this.rotationSpeed = Math.random() * 0.2 - 0.1  // Increased rotation speed range
    }
//made by gurpreet
    update() {
        this.x += this.vx 
        this.y += this.vy 
        this.vy += this.gravity 
        this.alpha -= 0.02 
        this.alpha = Math.max(0, this.alpha) 
        this.size -= 0.05 
        this.rotation += this.rotationSpeed 
    }

    draw() {
        ctx.save() 
        ctx.translate(this.x, this.y) 
        ctx.rotate(this.rotation) 
        ctx.globalAlpha = this.alpha 
        ctx.fillStyle = this.color 
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size) 
        ctx.restore() 
    }
}
//made by gurpreet
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)' 
    ctx.fillRect(0, 0, canvas.width, canvas.height) 

    fireworks.forEach((firework, index) => {
        firework.update() 
        firework.draw() 

        if (firework.size <= 0.5 && firework.isExploded) {
            fireworks.splice(index, 1) 
        }
    }) 

    requestAnimationFrame(animate) 
}

animate() 
