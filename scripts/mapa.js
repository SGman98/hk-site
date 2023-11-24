// Se obtiene el canvas y el contexto
const canvas = document.getElementById("mapa");
const ctx = canvas.getContext("2d");

// Se crea la imagen y se le asigna la ruta
const image = new Image();
image.src = "../recursos/mapa-hallownest.webp";

// Variables para controlar el estado del mapa
let scale = 2;
let offsetX = -800;
let offsetY = -500;
let startX = 0;
let startY = 0;
let isDragging = false;
let minScale = 1;
let maxScale = 2;

// Función para dibujar la imagen
function drawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Se limpia el canvas
  ctx.drawImage(
    image,
    offsetX,
    offsetY,
    image.width * scale,
    image.height * scale,
  );
}

// Se asigna la acción de dibujar la imagen cuando la imagen se carga
image.onload = drawImage;

// Función para restringir el desplazamiento del mapa evitando que se salga de la pantalla
function restrictOffset() {
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;
  const minX = canvas.width - scaledWidth;
  const minY = canvas.height - scaledHeight;
  offsetX = Math.min(0, Math.max(offsetX, minX));
  offsetY = Math.min(0, Math.max(offsetY, minY));
}

// Se agrega un evento para detectar el movimiento de la rueda del mouse y realizar el zoom
canvas.addEventListener("wheel", function (e) {
  e.preventDefault(); // Se evita que la página haga scroll

  // Se obtiene la posición del mouse respecto al canvas
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  const prevScale = scale;
  if (e.deltaY < 0 && scale < maxScale) {
    scale += 0.1;
  } else if (e.deltaY > 0 && scale > minScale) {
    scale -= 0.1;
  }

  // Se calcula el desplazamiento del mapa para que el zoom se haga en el punto donde se encuentra el mouse
  offsetX = offsetX - (mouseX / prevScale - mouseX / scale) * scale;
  offsetY = offsetY - (mouseY / prevScale - mouseY / scale) * scale;

  restrictOffset(); // Se restringe el desplazamiento del mapa
  drawImage(); // Se vuelve a dibujar la imagen
});

// Funciones para controlar el desplazamiento del mapa
function onMouseDown(e) {
  isDragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
}

function onMouseMove(e) {
  if (isDragging) {
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    restrictOffset();
    drawImage();
  }
}

function onMouseUp() {
  isDragging = false;
}

// Se agregan los eventos para controlar el desplazamiento del mapa
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", onMouseUp);
