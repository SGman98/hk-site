// Se obtiene el canvas y el contexto
const canvas = document.getElementById("mapa");
const ctx = canvas.getContext("2d");

// Se crea la imagen y se le asigna la ruta
const image = new Image();
image.src = "./recursos/mapa-hallownest.webp";

// Variables para controlar el estado del mapa
let scale = 2;
let offsetX = -800;
let offsetY = -500;
let startX = 0;
let startY = 0;
let isDragging = false;
let minScale = 1;
let maxScale = 3;
let hoveredPin = null;
let pinRadius = 20;

const locations = [
  {
    x: 650,
    y: 420,
    name: "Ciudad de Lágrimas",
    href: "lugar.html#ciudad-de-lagrimas",
  },
  { x: 650, y: 320, name: "Lago Azul", href: "lugar.html#lago-azul" },
  { x: 580, y: 520, name: "Canales Reales", href: "lugar.html#canales-reales" },
  {
    x: 590,
    y: 380,
    name: "Santuario de Almas",
    href: "lugar.html#santuario-de-almas",
  },
  {
    x: 660,
    y: 360,
    name: "Torre del Vigía",
    href: "lugar.html#torre-del-vigia",
  },
  {
    x: 720,
    y: 380,
    name: "Casa de los Placeres",
    href: "lugar.html#casa-de-los-placeres",
  },
  { x: 780, y: 400, name: "Torre del Amor", href: "lugar.html#torre-del-amor" },
  {
    x: 750,
    y: 445,
    name: "Estación del Rey",
    href: "lugar.html#estacion-del-rey",
  },
];

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
  drawPins();
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

function drawPins() {
  locations.forEach((location) => {
    const { x, y } = location;

    const scaledX = x * scale + offsetX;
    const scaledY = y * scale + offsetY;

    const image = new Image();
    image.src = "./recursos/marcador.webp";
    ctx.filter = "drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.5))";
    ctx.drawImage(
      image,
      scaledX - pinRadius,
      scaledY - pinRadius,
      pinRadius * 2,
      pinRadius * 2,
    );
  });

  if (hoveredPin) {
    const { x, y, name } = hoveredPin;
    const scaledX = x * scale + offsetX;
    const scaledY = y * scale + offsetY;
    ctx.font = "18px Trajan Pro Regular";
    const textWidth = ctx.measureText(name).width;
    const textHeight = ctx.measureText("M").width;
    ctx.fillStyle = "black";
    ctx.fillRect(
      scaledX - textWidth / 2 - 2,
      scaledY - textHeight - 2,
      textWidth + 4,
      textHeight + 4,
    );
    ctx.fillStyle = "white";
    ctx.fillText(name, scaledX - textWidth / 2, scaledY - 2);
  }
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

// Se agrega evento para hover en los pins
canvas.addEventListener("mousemove", function (e) {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;
  hoveredPin = locations.find((location) => {
    const scaledX = location.x * scale + offsetX;
    const scaledY = location.y * scale + offsetY;
    const distance = Math.sqrt(
      Math.pow(mouseX - scaledX, 2) + Math.pow(mouseY - scaledY, 2),
    );
    return distance < pinRadius;
  });

  if (hoveredPin) canvas.style.cursor = "pointer";
  else canvas.style.cursor = "default";

  drawImage();
});

// Se agrega evento para click en los pins
canvas.addEventListener("click", function (e) {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;
  const clickedPin = locations.find((location) => {
    const scaledX = location.x * scale + offsetX;
    const scaledY = location.y * scale + offsetY;
    const distance = Math.sqrt(
      Math.pow(mouseX - scaledX, 2) + Math.pow(mouseY - scaledY, 2),
    );
    return distance < pinRadius;
  });
  if (clickedPin) {
    window.location.href = clickedPin.href;
  }
});

// Variables para controlar el estado del mapa en dispositivos móviles
let lastTouchX, lastTouchY;

// Eventos para detectar movimiento de los dedos en el mapa y realizar el zoom
canvas.addEventListener("touchstart", function (e) {
  if (e.touches.length === 2) {
    lastTouchX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
    lastTouchY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
  } else if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX - offsetX;
    startY = e.touches[0].clientY - offsetY;
  }
});

canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  if (isDragging && e.touches.length === 1) {
    offsetX = e.touches[0].clientX - startX;
    offsetY = e.touches[0].clientY - startY;
  } else if (e.touches.length === 2) {
    const currentTouchX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
    const currentTouchY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

    const deltaScaleX = (currentTouchX - lastTouchX) / 1000;
    const deltaScaleY = (currentTouchY - lastTouchY) / 1000;

    const prevScale = scale;
    scale += (deltaScaleX + deltaScaleY) / 2;

    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

    offsetX -= (midX / prevScale - midX / scale) * scale;
    offsetY -= (midY / prevScale - midY / scale) * scale;

    lastTouchX = currentTouchX;
    lastTouchY = currentTouchY;
  }
  restrictOffset();
  drawImage();
});

canvas.addEventListener("touchend", function (e) {
  isDragging = false;
  const touchX =
    e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
  const touchY =
    e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;

  const clickedPin = locations.find((location) => {
    const scaledX = location.x * scale + offsetX;
    const scaledY = location.y * scale + offsetY;
    const distance = Math.sqrt(
      Math.pow(touchX - scaledX, 2) + Math.pow(touchY - scaledY, 2),
    );
    return distance < pinRadius;
  });

  if (clickedPin) {
    window.location.href = clickedPin.href;
  }
});
