# Hero tipográfico para disidente.org

Prototipo autónomo de una landing de pantalla completa inspirado en el vídeo de
referencia. Las palabras forman una superficie tipográfica fija que ocupa toda
la pantalla. Los términos negativos aparecen en rojo y el resto conserva
una animación cruzada entre negro y transparencia. La retícula, el grano, el
tamaño y el peso permanecen inmóviles; tampoco se permite el zoom del
navegador. No utiliza el vídeo original, no requiere librerías y no tiene
scroll.

## Personalización rápida

- Vocabulario: editar `words` al inicio de `app.js`.
- Colores: editar las variables de `:root` en `styles.css`.
- Densidad y tamaño del texto: editar `stepY` y `fontSize` en `app.js`.
- Favicon: `favicon-32.png`, `favicon.png` y `apple-touch-icon.png`.

## Integración

Se puede copiar el bloque `.hero` y sus tres archivos a cualquier proyecto web.
La animación usa Canvas 2D, limita la densidad de píxeles para cuidar el
rendimiento y se detiene cuando el sistema pide reducir el movimiento.
