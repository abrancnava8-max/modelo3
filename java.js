const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Dimensiones fijas del lienzo original (proporciones de aspecto)
const ANCHO_BASE = 1200;
const ALTO_BASE = 700;

canvas.width = ANCHO_BASE;
canvas.height = ALTO_BASE;

// Paleta de colores para las partículas (Formato RGBA sin cerrar para aplicar opacidad dinámica)
const ROJO = "rgba(255, 60, 90, ";
const ROSA = "rgba(255, 105, 180, ";
const BLANCO = "rgba(255, 255, 255, ";
const COLORES = [ROJO, ROSA, BLANCO];

class Particula {
    constructor(x, y) {
        // Desplazamiento aleatorio inicial alrededor del trazo del corazón
        this.x = x + (Math.random() * 8 - 4);
        this.y = y + (Math.random() * 8 - 4);

        // Velocidades iniciales (explosión sutil)
        this.vx = Math.random() * 1.2 - 0.6;
        this.vy = Math.random() * 1.2 - 0.6;

        this.tamano = Math.floor(Math.random() * 4) + 2; // Tamaños entre 2px y 5px
        this.colorBase = COLORES[Math.floor(Math.random() * COLORES.length)];

        this.vida = Math.floor(Math.random() * 61) + 80; // Duración del ciclo de vida (80 a 140 frames)
        this.vidaMax = this.vida;
    }

    actualizar() {
        this.x += this.vx;
        this.y += this.vy;

        // Flotación suave hacia arriba (gravedad negativa)
        this.vy -= 0.003;
        this.vida--;
    }

    dibujar() {
        // Desvanecimiento progresivo basado en la vida restante
        let alpha = this.vida / this.vidaMax;
        alpha = Math.max(0, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + alpha + ")";
        ctx.fill();
    }

    estaViva() {
        return this.vida > 0;
    }
}

// Genera las coordenadas usando la ecuación matemática del corazón
function generarCorazon(cx, cy) {
    const puntos = [];
    for (let i = 0; i < 360; i += 2) {
        let t = i * Math.PI / 180; // Convertir grados a radianes

        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t)
        );

        let escala = 13;
        let px = cx + x * escala;
        let py = cy + y * escala;

        puntos.push({ x: px, y: py });
    }
    return puntos;
}

// Inicialización de elementos
const puntosCorazon = generarCorazon(ANCHO_BASE / 2, 470);
let particulas = [];

const mensaje = "I LOVE YOU CECIA";
ctx.font = "bold 110px Arial";
const anchoTexto = ctx.measureText(mensaje).width;
const textoX = (ANCHO_BASE - anchoTexto) / 2;
const textoY = 180;

// Bucle principal de animación ejecutado por el navegador
function animar() {
    // Fondo negro sólido en cada frame
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Renderizar texto informativo
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 110px Arial";
    ctx.fillText(mensaje, textoX, textoY);

    // Inyectar 14 partículas nuevas por frame distribuidas en el corazón
    for (let i = 0; i < 14; i++) {
        const puntoAleatorio = puntosCorazon[Math.floor(Math.random() * puntosCorazon.length)];
        particulas.push(new Particula(puntoAleatorio.x, puntoAleatorio.y));
    }

    // Filtrar partículas muertas, actualizar y dibujar las que siguen vivas
    particulas = particulas.filter(p => {
        p.actualizar();
        if (p.estaViva()) {
            p.dibujar();
            return true;
        }
        return false;
    });

    requestAnimationFrame(animar);
}

// Ajuste responsivo para pantallas de móviles y monitores manteniendo las proporciones
function ajustarPantalla() {
    const escalaX = window.innerWidth / ANCHO_BASE;
    const escalaY = window.innerHeight / ALTO_BASE;
    const escala = Math.min(escalaX, escalaY);

    canvas.style.width = `${ANCHO_BASE * escala}px`;
    canvas.style.height = `${ALTO_BASE * escala}px`;
}

// Escuchar cambios de tamaño de ventana e iniciar la app
window.addEventListener('resize', ajustarPantalla);
ajustarPantalla();
animar();