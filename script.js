// --- CONFIGURACIÓN DE PAGO DE LA PYME ---
const USA_STRIPE = false;
const STRIPE_PUBLIC_KEY = ""; 
const DATOS_BANCARIOS = {
    banco: "",
    clabe: "",
    titular: "Nombre del Titular"
};
// ----------------------------------------

const CONFIG = {
    whatsapp: "5214491472336",
    whatsappAdicional: "5214491472336",
    sitioWeb: "https://catmaniamx.com/",
    facebook: "https://www.facebook.com/?locale=es_LA",
    instagram: "https://www.instagram.com/my_sing_studio/",
    maps: "https://maps.app.goo.gl/L3Pq1dMVDgY9U5Qv9", 
    youtubeUrl: "https://www.youtube.com/watch?v=lLeuGksLteU",
    textos: {
        cat1: { t: "QUIÉNES SOMOS", c: "Somos una clínica de rehabilitación física especializada en la recuperación integral, movilidad y bienestar de nuestros pacientes. Nuestro objetivo es brindar atención terapéutica de excelencia, basada en diagnósticos precisos, técnicas avanzadas y un trato humano para devolverte la calidad de vida y el movimiento sin dolor." },
        cat2: { t: "ESTO NOS HACE DIFERENTES", c: "Nos distinguimos por contar con fisioterapeutas especialistas certificados, tecnología de vanguardia para electroterapia y rehabilitación, protocolos de atención basados en evidencia clínica y un seguimiento completamente personalizado para garantizar una recuperación segura y efectiva." },
        cat3: { t: "ASISTENTE RAPIDO", c: "Consulta aquí las preguntas frecuentes y resuelve tus dudas al instante sobre nuestros programas de rehabilitación, terapias especializadas, sucursales, métodos de pago y agendamiento de citas." }
    },
    };

let currentGallery = [];
let currentIndex = 0;
let isMuted = false;
let currentGatewayState = { citas: false, ventas: false, cotizar: false };
let globalCompiledTicketText = "";

function openYouTubeVideo() { 
    playClick(); 
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    let videoId = "4LLMlYBo54I"; 
    if(CONFIG.youtubeUrl.includes("shorts/")) { videoId = CONFIG.youtubeUrl.split("shorts/")[1].split("?")[0]; } 
    else if(CONFIG.youtubeUrl.includes("v=")) { videoId = CONFIG.youtubeUrl.split("v=")[1].split("&")[0]; }
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    overlay.style.display = 'flex';
}

function closeVideoLightbox() {
    playClick();
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    iframe.src = ""; 
    overlay.style.display = 'none';
}

function openProfileZoom() {
    playClick();
    const imgElement = document.getElementById('profile-pic-img');
    if(imgElement) { const src = imgElement.src; openLightbox(src, [src], true); }
}

function showAppContent(cat) {
    playClick();
    document.getElementById('dynamic-content-layer').style.display = 'flex';
    document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
    const pane = document.getElementById(`${cat}-pane`);
    if(pane) pane.style.display = 'flex';
    if(cat !== 'cat4') renderGallery(cat);
}

function renderGallery(cat) {
    const grid = document.getElementById(`grid-${cat}`);
    if(!grid) return; 
    grid.innerHTML = '';
    
    const titleHeader = document.createElement('h2');
    titleHeader.className = 'gallery-title-white';
    titleHeader.innerText = CONFIG.textos[cat].t;
    grid.appendChild(titleHeader);
    
    if (cat === 'cat3') {
        const faqContainer = document.createElement('div');
        faqContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 10px; text-align: left;";
        faqContainer.innerHTML = `
            <details style="background: #f9f9f9; border-radius: 8px; padding: 12px 15px; border: 1px solid #eee; color: #333;">
    <summary style="font-weight: 600; cursor: pointer;">¿Qué servicios de rehabilitación y terapias ofrecen?</summary>
    <p style="color: #555; font-size: 0.83rem; margin-top: 8px; line-height: 1.4; border-top: 1px solid #eaeaea; padding-top: 8px;">Ofrecemos valoración fisioterapéutica integral, rehabilitación ortopédica y neurológica, terapia manual, electroterapia, ultrasonido terapéutico, ejercicios de fortalecimiento y programas de recuperación postquirúrgica.</p>
</details>

<details style="background: #f9f9f9; border-radius: 8px; padding: 12px 15px; border: 1px solid #eee; color: #333;">
    <summary style="font-weight: 600; cursor: pointer;">¿Cuándo debo acudir a rehabilitación física?</summary>
    <p style="color: #555; font-size: 0.83rem; margin-top: 8px; line-height: 1.4; border-top: 1px solid #eaeaea; padding-top: 8px;">Se recomienda acudir si presentas dolor muscular o articular crónico, tras una intervención quirúrgica, después de una lesión deportiva, por problemas de postura o por limitaciones de movilidad indicadas por tu médico.</p>
</details>

<details style="background: #f9f9f9; border-radius: 8px; padding: 12px 15px; border: 1px solid #eee; color: #333;">
    <summary style="font-weight: 600; cursor: pointer;">¿Las sesiones de terapia física duelen?</summary>
    <p style="color: #555; font-size: 0.83rem; margin-top: 8px; line-height: 1.4; border-top: 1px solid #eaeaea; padding-top: 8px;">Las terapias están diseñadas para aliviar el dolor, por lo que las técnicas son controladas. Podrías sentir un ligero esfuerzo o molestia tolerable durante ciertos ejercicios de recuperación, siempre adaptados a tu tolerancia.</p>
</details>

<details style="background: #f9f9f9; border-radius: 8px; padding: 12px 15px; border: 1px solid #eee; color: #333;">
    <summary style="font-weight: 600; cursor: pointer;">¿Qué tecnología y métodos de precisión utilizan?</summary>
    <p style="color: #555; font-size: 0.83rem; margin-top: 8px; line-height: 1.4; border-top: 1px solid #eaeaea; padding-top: 8px;">Utilizamos equipo electroterapéutico avanzado, herramientas de evaluación biomecánica y protocolos clínicos personalizados para acelerar la recuperación de forma segura y efectiva.</p>
</details>

<details style="background: #f9f9f9; border-radius: 8px; padding: 12px 15px; border: 1px solid #eee; color: #333;">
    <summary style="font-weight: 600; cursor: pointer;">¿Qué métodos de pago aceptan en clínica?</summary>
    <p style="color: #555; font-size: 0.83rem; margin-top: 8px; line-height: 1.4; border-top: 1px solid #eaeaea; padding-top: 8px;">Aceptamos pagos en efectivo, tarjetas de crédito o débito, transferencias electrónicas y contamos con paquetes o facilidades para programas de rehabilitación prolongados.</p>
</details>
        `;
        grid.appendChild(faqContainer);
    } else {
        const imgCount = (cat === 'cat1' || cat === 'cat2') ? 6 : 4;
        const imgs = [];
        for(let i = 1; i <= imgCount; i++) { imgs.push(`assets/gallery/${cat}/${i}.jpg`); }
        
        const rowGrid = document.createElement('div');
        rowGrid.className = 'quad-row-grid';
        imgs.forEach((src, index) => {
            const posClass = (index % 2 === 0) ? 'pos-left' : 'pos-right';
            rowGrid.appendChild(createPol(src, posClass, imgs));
        });
        grid.appendChild(rowGrid);
        
        if (cat === 'cat2') {
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = "display: flex; gap: 10px; margin-top: 15px; justify-content: center; width: 100%; flex-wrap: wrap;";
            videoContainer.innerHTML = `
                <a href="https://www.youtube.com/shorts/tIS7agEQP-A" target="_blank" style="background: #b00; color: #fff; padding: 12px 25px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 0.9rem;">
                    VER VIDEO: ESTO NOS HACE DIFERENTES
                </a>
            `;
            grid.appendChild(videoContainer);
        }
    }
    
    const btn = document.createElement('button');
    btn.className = 'btn-details-gold'; 
    btn.innerHTML = `<i class="fas fa-plus-circle"></i> VER DETALLES`;
    btn.onclick = (e) => { e.stopPropagation(); openTextZoom(cat); };
    grid.appendChild(btn);
}

function createPol(src, pos, arr) {
    const div = document.createElement('div');
    div.className = `polaroid-item ${pos}`;
    div.innerHTML = `<img src="${src}">`;
    div.onclick = (e) => { e.stopPropagation(); openLightbox(src, arr, false); };
    return div;
}

function openLightbox(src, arr, hideControls) {
    playClick();
    currentGallery = arr;
    currentIndex = arr.indexOf(src);
    const lightboxEl = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    if(hideControls) { lightboxEl.classList.add('hide-nav-arrows'); } else { lightboxEl.classList.remove('hide-nav-arrows'); }
    imgEl.src = src;
    lightboxEl.style.display = 'flex';
}

function changeLightboxImage(dir) {
    if(currentGallery.length <= 1) return;
    playClick();
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    document.getElementById('lightbox-image').src = currentGallery[currentIndex];
}

function openTextZoom(cat) {
    playClick();
    document.getElementById('text-zoom-title').innerText = CONFIG.textos[cat].t;
    document.getElementById('text-zoom-content').innerText = CONFIG.textos[cat].c;
    document.getElementById('text-zoom-modal').style.display = 'flex';
}

function closeLightbox() { document.getElementById('lightbox').style.display = 'none'; }
function closeAppContent() { document.getElementById('dynamic-content-layer').style.display = 'none'; }
function closeTextZoom() { document.getElementById('text-zoom-modal').style.display = 'none'; }
function openBrandModal(modalId) { playClick(); const modal = document.getElementById(modalId); if (modal) modal.style.display = 'flex'; }
function closeBrandModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; }
function playClickSound() { playClick(); }

function toggleAudioGlobal() {
    isMuted = !isMuted;
    const spot = document.getElementById('spot-intro');
    const icon = document.getElementById('audio-icon');
    if(spot) spot.muted = isMuted;
    if(icon) icon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

function playClick() { const snd = document.getElementById('sndFxClick'); if(snd && !isMuted) { snd.currentTime = 0; snd.play().catch(()=>{}); } }
function openNetworkCard(url) { playClick(); window.open(url, '_blank'); }

// LÓGICA DE ACORDEÓN PARA EL MENÚ DE CONTACTO DE SUCURSALES
function abrirMenu() {
    playClick();
    document.getElementById('miMenuContacto').style.display = 'flex';
}

function cerrarMenu() {
    document.getElementById('miMenuContacto').style.display = 'none';
    document.querySelectorAll('.sucursal-panel-content').forEach(panel => panel.style.display = 'none');
}

function toggleSucursalAcordeon(sucKey) {
    playClick();
    const panel = document.getElementById(`${sucKey}-panel`);
    const estaVisible = panel.style.display === 'flex';
    
    document.querySelectorAll('.sucursal-panel-content').forEach(p => p.style.display = 'none');
    
    if (!estaVisible) {
        panel.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('click', () => {
        const spot = document.getElementById('spot-intro');
        if(spot && !isMuted) spot.play().catch(()=>{});
    }, {once: true});
});

async function shareExperienceRobust() {
    try { await navigator.share({ title: 'Lonchería Magaña', url: window.location.href }); }
    catch { playClick(); navigator.clipboard.writeText(window.location.href).then(() => { alert("¡Enlace copiado al portapapeles!"); }); }
}