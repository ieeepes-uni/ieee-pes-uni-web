// --- Navegación desde el diagrama unifilar ---
// Cada feeder puede: hacer scroll interno (data-target), abrir una página
// del propio sitio (data-href), o abrir un link externo en pestaña nueva
// (data-href + data-external="true").
document.querySelectorAll('.feeder').forEach((feeder) => {
  const target = feeder.getAttribute('data-target');
  const href = feeder.getAttribute('data-href');
  const external = feeder.getAttribute('data-external') === 'true';

  feeder.setAttribute('tabindex', '0');
  feeder.setAttribute('role', 'link');

  const go = () => {
    if (target) {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    } else if (href && external) {
      window.open(href, '_blank', 'noopener');
    } else if (href) {
      window.location.href = href;
    }
  };

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
      preview: 'https://drive.google.com/file/d/' + id + '/preview',
      download: 'https://drive.google.com/uc?export=download&id=' + id,
    };
  }
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
  pdfFrame.src = '';
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
    if (!grid) return;
    if (!posts.length) {
      grid.innerHTML = '<p class="empty-msg">Aún no hay publicaciones.</p>';
      return;
    }
    const ordenadas = [...posts].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    grid.innerHTML = ordenadas.map((p, i) => `
      <article class="post-card">
        <span class="post-date">${formatearFecha(p.fecha)}</span>
        <h3>${p.titulo}</h3>
        <p>${p.resumen}</p>
        <div class="post-actions">
          ${p.enlace ? '<a class="post-link" href="' + p.enlace + '" target="_blank" rel="noopener">Ver más →</a>' : ''}
          ${p.pdf ? '<button type="button" class="pdf-open-btn" data-pdf-index="' + i + '">Ver PDF</button>' : ''}
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
      '<p class="empty-msg">No se pudo cargar data/posts.json.</p>';
  });

// --- Eventos destacados ---
fetch('data/events.json')
  .then((r) => r.json())
  .then((events) => {
    const grid = document.getElementById('events-grid');
    if (!grid) return;
    if (!events.length) {
      grid.innerHTML = '<p class="empty-msg">Aún no hay eventos. Edita data/events.json.</p>';
      return;
    }
    const ordenados = [...events].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    grid.innerHTML = ordenados.map((e) => {
      const imgSrc = e.imagen || '';
      const tag = e.enlace ? 'a' : 'div';
      const href = e.enlace ? ' href="' + e.enlace + '" target="_blank" rel="noopener"' : '';
      return '<' + tag + ' class="event-card"' + href + '>'
        + (imgSrc ? '<img class="event-thumb" src="' + imgSrc + '" alt="' + e.titulo + '" loading="lazy">' : '<div class="event-thumb"></div>')
        + '<div class="event-body">'
        + '<span class="event-date">' + formatearFecha(e.fecha) + '</span>'
        + '<h3>' + e.titulo + '</h3>'
        + (e.descripcion ? '<p class="event-desc">' + e.descripcion + '</p>' : '')
        + (e.enlace ? '<span class="event-cta">Ver grabación →</span>' : '')
        + '</div>'
        + '</' + tag + '>';
    }).join('');
  })
  .catch(() => {
    document.getElementById('events-grid').innerHTML =
      '<p class="empty-msg">No se pudo cargar data/events.json.</p>';
  });

// --- Cursos ---
fetch('data/courses.json')
  .then((r) => r.json())
  .then((courses) => {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;
    if (!courses.length) {
      grid.innerHTML = '<p class="empty-msg">Aún no hay cursos. Edita data/courses.json.</p>';
      return;
    }
    grid.innerHTML = courses.map((c, ci) => {
      const poster = c.poster ? '<img class="course-poster" src="' + c.poster + '" alt="' + c.titulo + '" loading="lazy">' : '';
      let materials = '';
      if (c.sesiones && c.sesiones.length) {
        materials = c.sesiones.map((s) => {
          let btns = '';
          if (s.video) btns += '<a class="course-btn-video" href="' + s.video + '" target="_blank" rel="noopener">▶ ' + (s.nombre || 'Video') + '</a>';
          return btns;
        }).join('');
      }
      if (c.documentos && c.documentos.length) {
        materials += c.documentos.map((d, di) => {
          if (!d.pdf) return '';
          return '<button type="button" class="course-btn-slides" data-course-idx="' + ci + '" data-doc-idx="' + di + '">' + (d.nombre || 'Documento') + '</button>';
        }).join('');
      }
      return '<article class="course-card">'
        + poster
        + '<div class="course-body">'
        + '<h3>' + c.titulo + '</h3>'
        + (c.instructor ? '<span class="course-instructor">' + c.instructor + '</span>' : '')
        + (c.descripcion ? '<p class="course-desc">' + c.descripcion + '</p>' : '')
        + (materials ? '<div class="course-materials">' + materials + '</div>' : '')
        + '</div>'
        + '</article>';
    }).join('');

    grid.querySelectorAll('[data-course-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const course = courses[Number(btn.dataset.courseIdx)];
        const doc = course.documentos[Number(btn.dataset.docIdx)];
        abrirPdf(doc.pdf, course.titulo + ' — ' + (doc.nombre || 'Documento'));
      });
    });
  })
  .catch(() => {
    document.getElementById('courses-grid').innerHTML =
      '<p class="empty-msg">No se pudo cargar data/courses.json.</p>';
  });

// --- Videos destacados ---
fetch('data/videos.json')
  .then((r) => r.json())
  .then((videos) => {
    const grid = document.getElementById('videos-grid');
    if (!grid) return;
    if (!videos.length) {
      grid.innerHTML = '<p class="empty-msg">Aún no hay videos.</p>';
      return;
    }
    grid.innerHTML = videos.map((v) => `
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
      '<p class="empty-msg">No se pudo cargar data/videos.json.</p>';
  });
