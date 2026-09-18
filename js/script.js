// --- Navegación desde el diagrama unifilar ---
document.querySelectorAll('.feeder').forEach((feeder) => {
  const target = feeder.getAttribute('data-target');
  feeder.setAttribute('tabindex', '0');
  feeder.setAttribute('role', 'link');
  const go = () => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  feeder.addEventListener('click', go);
  feeder.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
  });
});

// --- Vista previa de PDF (Google Drive o archivo directo) ---
function resolverPdf(urlOriginal) {
  const driveMatch = urlOriginal.match(/\/file\/d\/([^/]+)/) || urlOriginal.match(/[?&]id=([^&]+)/);
  if (driveMatch) {
    const id = driveMatch[1];
    return {
      preview: `https://drive.google.com/file/d/${id}/preview`,
      download: `https://drive.google.com/uc?export=download&id=${id}`,
    };
  }
  // Archivo servido directamente por el propio sitio (ruta local o URL a un .pdf)
  return { preview: urlOriginal, download: urlOriginal };
}

const pdfModal = document.getElementById('pdf-modal');
const pdfFrame = document.getElementById('pdf-modal-frame');
const pdfDownload = document.getElementById('pdf-modal-download');
const pdfTitle = document.getElementById('pdf-modal-title');

function abrirPdf(url, titulo) {
  const { preview, download } = resolverPdf(url);
  pdfFrame.src = preview;
  pdfDownload.href = download;
  pdfTitle.textContent = titulo || 'Documento';
  pdfModal.hidden = false;
}

function cerrarPdf() {
  pdfModal.hidden = true;
  pdfFrame.src = ''; // detiene la carga al cerrar
}

pdfModal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close-modal')) cerrarPdf();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !pdfModal.hidden) cerrarPdf();
});

// --- Publicaciones ---
function formatearFecha(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

fetch('data/posts.json')
  .then((r) => r.json())
  .then((posts) => {
    const grid = document.getElementById('posts-grid');
    if (!posts.length) {
      grid.innerHTML = '<p class="empty-msg">Aún no hay publicaciones. Edita data/posts.json para agregar la primera.</p>';
      return;
    }
    const ordenadas = [...posts].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    grid.innerHTML = ordenadas.map((p, i) => `
      <article class="post-card">
        <span class="post-date">${formatearFecha(p.fecha)}</span>
        <h3>${p.titulo}</h3>
        <p>${p.resumen}</p>
        <div class="post-actions">
          ${p.enlace ? `<a class="post-link" href="${p.enlace}" target="_blank" rel="noopener">Ver más →</a>` : ''}
          ${p.pdf ? `<button type="button" class="pdf-open-btn" data-pdf-index="${i}">Ver PDF</button>` : ''}
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-pdf-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const post = ordenadas[Number(btn.dataset.pdfIndex)];
        abrirPdf(post.pdf, post.titulo);
      });
    });
  })
  .catch(() => {
    document.getElementById('posts-grid').innerHTML =
      '<p class="empty-msg">No se pudo cargar data/posts.json (si abriste el archivo directamente en el navegador, prueba con GitHub Pages o un servidor local).</p>';
  });

// --- Videos destacados ---
fetch('data/videos.json')
  .then((r) => r.json())
  .then((videos) => {
    const grid = document.getElementById('videos-grid');
    if (!videos.length) {
      grid.innerHTML = '<p class="empty-msg">Aún no hay videos. Edita data/videos.json para agregar el primero.</p>';
      return;
    }
    grid.innerHTML = videos.slice(0, 3).map((v) => `
      <a class="video-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
        <div class="video-thumb-wrap">
          <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="Miniatura: ${v.titulo}" loading="lazy">
          <span class="play-badge" aria-hidden="true">▶</span>
        </div>
        <div class="video-title">${v.titulo}</div>
      </a>
    `).join('');
  })
  .catch(() => {
    document.getElementById('videos-grid').innerHTML =
      '<p class="empty-msg">No se pudo cargar data/videos.json (si abriste el archivo directamente en el navegador, prueba con GitHub Pages o un servidor local).</p>';
  });
