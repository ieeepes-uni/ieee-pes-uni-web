# Mini web IEEE PES UNI

Sitio estático, sin backend, sin base de datos, sin registros. Costo: **$0** (GitHub Pages).

## Estructura

```
index.html             → estructura de la página
css/style.css           → estilos
js/script.js            → carga publicaciones, eventos y videos
assets/logo-white.png   → logo horizontal (fondo oscuro, para el header)
assets/logo-color.png   → logo horizontal (fondo claro, para el footer)
data/posts.json         → EDITA AQUÍ cada publicación nueva
data/events.json        → EDITA AQUÍ cada evento destacado (con foto)
data/videos.json        → EDITA AQUÍ los 3 videos destacados
```

## Cómo publicar algo nuevo (sin tocar código)

Abre `data/posts.json` directamente en GitHub (botón del lápiz ✏️) y agrega un bloque como este al inicio del arreglo:

```json
{
  "titulo": "Título de la publicación",
  "fecha": "2026-08-21",
  "resumen": "Uno o dos renglones de resumen.",
  "enlace": "https://... (opcional, puede quedar vacío: \"\")"
}
```

No importa el orden en que las agregues: el sitio las ordena automáticamente por fecha, de la más reciente a la más antigua.

## Cómo agregar un evento destacado (con foto)

Edita `data/events.json`. Cada evento tiene estos campos:

```json
{
  "titulo": "Nombre del evento",
  "fecha": "2026-09-15",
  "descripcion": "Breve descripción del evento.",
  "imagen": "https://drive.google.com/uc?export=view&id=ID_DE_DRIVE",
  "enlace": "https://... (enlace a la publicación del evento, opcional)"
}
```

Para la foto del evento puedes usar:
- **Google Drive**: sube la foto, compártela como "Cualquier persona con el enlace", copia el ID del link de compartir, y usa `https://drive.google.com/uc?export=view&id=TU_ID_AQUI`.
- **Directamente en el repositorio**: crea una carpeta `fotos/` en el repositorio, sube la imagen, y pon la ruta `fotos/nombre-de-la-foto.jpg`.

Si `"imagen"` queda vacío, la tarjeta aparece con un fondo sólido sin foto.

## Cómo adjuntar un PDF con vista previa y descarga

Agrega el campo `"pdf"` a cualquier publicación en `posts.json`. Dos formas de llenarlo:

**A) Google Drive (lo más simple si ya suben ahí sus archivos):**
1. Sube el PDF a Drive.
2. Clic derecho → Compartir → cambia a "Cualquier persona con el enlace" (rol: Lector).
3. Copia ese link tal cual (se ve así: `https://drive.google.com/file/d/ABC123.../view?usp=sharing`) y pégalo en `"pdf"`.

El sitio detecta que es un link de Drive y genera automáticamente la vista previa y el botón de descarga.

**B) Subir el PDF al mismo repositorio (sin depender de Drive):**
1. Crea una carpeta `documentos/` en el repositorio y sube ahí el PDF.
2. En `"pdf"` pon la ruta relativa, por ejemplo `"documentos/convocatoria.pdf"`.

Si `"pdf"` queda vacío (`""`), simplemente no aparece el botón "Ver PDF" en esa publicación.

## Cómo cambiar los 3 videos destacados

Edita `data/videos.json`. El `id` es la parte de la URL de YouTube después de `v=`.
Ejemplo: en `https://www.youtube.com/watch?v=ABC123XYZ`, el id es `ABC123XYZ`.
Solo se muestran los primeros 3 del archivo.

## Cómo poner tus redes sociales reales

En `index.html`, busca los textos `REEMPLAZAR_URL_INSTAGRAM`, `REEMPLAZAR_URL_LINKEDIN`, `REEMPLAZAR_URL_FACEBOOK` y `REEMPLAZAR_URL_YOUTUBE`, y cambia cada uno por el link real de la cuenta.

## Cómo publicarlo gratis en internet (GitHub Pages)

1. Crea un repositorio nuevo en GitHub (puede ser público), por ejemplo `ieee-pes-uni-web`.
2. Sube todos los archivos de esta carpeta a ese repositorio (arrastrando y soltando desde la web de GitHub, o con `git push`).
3. Ve a **Settings → Pages** del repositorio.
4. En "Source", selecciona la rama `main` y la carpeta `/ (root)`. Guarda.
5. En un par de minutos el sitio queda disponible en `https://<tu-usuario>.github.io/ieee-pes-uni-web/`.

Cualquier miembro con acceso de escritura al repositorio puede editar `data/posts.json` o `data/videos.json` directamente desde la web de GitHub — no hace falta instalar nada ni saber programar para publicar contenido nuevo.

## Nota sobre probarlo en tu computadora antes de subirlo

Si abres `index.html` haciendo doble clic, el navegador puede bloquear la carga de los archivos `.json` por seguridad (protocolo `file://`). Para probarlo localmente, corre un servidor simple desde la carpeta, por ejemplo:

```bash
python3 -m http.server 8000
```

y abre `http://localhost:8000` en el navegador. Esto no afecta a GitHub Pages, que sirve los archivos correctamente.
