# Hero tipográfico para disidente.org

Prototipo autónomo de una landing de pantalla completa, inspirado en el vídeo
de referencia. Las palabras funcionan como píxeles y forman un perfil humano
animado. No utiliza el vídeo original, no requiere librerías y no tiene scroll.

## Personalización rápida

- Vocabulario: editar `words` al inicio de `app.js`.
- Colores: editar las variables de `:root` en `styles.css`.
- Titular y texto: editar `index.html`.
- Silueta: modificar `portraitPath()` en `app.js`.

## Integración

Se puede copiar el bloque `.hero` y sus tres archivos a cualquier proyecto web.
La animación usa Canvas 2D, limita la densidad de píxeles para cuidar el
rendimiento y se detiene cuando el sistema pide reducir el movimiento.
