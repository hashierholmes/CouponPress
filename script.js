let imgDataURL = null;
let cellBg = '#ffffff';

const $ = id => document.getElementById(id);
const dropZone    = $('dropZone');
const fileInput   = $('fileInput');
const thumbWrap   = $('thumbWrap');
const thumb       = $('thumb');
const rmBtn       = $('rmBtn');
const couponGrid  = $('couponGrid');
const printGrid   = $('printGrid');
const pdfBtn      = $('pdfBtn');
const printBtn    = $('printBtn');
const colsEl      = $('cols');
const rowsEl      = $('rows');
const borderSel   = $('borderSel');
const fitSel      = $('fitSel');
const scaleSl     = $('scaleSl');
const scaleVal    = $('scaleVal');
const infoBar     = $('infoBar');
const swatchRow   = $('swatchRow');
const customColor = $('customColor');
const progressWrap= $('progressWrap');
const progressFill= $('progressFill');
const progressMsg = $('progressMsg');

// ── LOAD IMAGE ──
function loadFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const fr = new FileReader();
  fr.onload = e => {
    imgDataURL = e.target.result;
    thumb.src = imgDataURL;
    thumbWrap.style.display = 'block';
    dropZone.style.display = 'none';
    pdfBtn.disabled = false;
    printBtn.disabled = false;
    buildGrid();
  };
  fr.readAsDataURL(file);
}

fileInput.addEventListener('change', e => loadFile(e.target.files[0]));
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('over'); loadFile(e.dataTransfer.files[0]); });
document.addEventListener('paste', e => {
  const item = [...(e.clipboardData?.items||[])].find(i => i.type.startsWith('image/'));
  if (item) loadFile(item.getAsFile());
});

rmBtn.addEventListener('click', () => {
  imgDataURL = null;
  thumbWrap.style.display = 'none';
  dropZone.style.display = '';
  pdfBtn.disabled = true;
  printBtn.disabled = true;
  fileInput.value = '';
  couponGrid.innerHTML = `<div class="empty-state"><span class="ei">🎟️</span><p>Upload your coupon image to begin</p></div>`;
  couponGrid.style.gridTemplateColumns = '';
  couponGrid.style.gridTemplateRows = '';
});

// ── BUILD PREVIEW ──
function buildGrid() {
  if (!imgDataURL) return;
  const cols  = clamp(parseInt(colsEl.value)||5, 1, 15);
  const rows  = clamp(parseInt(rowsEl.value)||20, 1, 60);
  const count = cols * rows;
  const fit   = fitSel.value;
  const scale = parseInt(scaleSl.value)/100;
  const bc    = borderSel.value;

  infoBar.textContent = `${cols} × ${rows} = ${count} coupons · Long Bond 8.5″ × 14″`;
  couponGrid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  couponGrid.style.gridTemplateRows    = `repeat(${rows},1fr)`;
  couponGrid.className = bc;
  couponGrid.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const cell = document.createElement('div');
    cell.className = 'coupon-cell';
    cell.style.background = cellBg;
    const img = document.createElement('img');
    img.src = imgDataURL;
    img.style.cssText = `object-fit:${fit};width:${scale*100}%;height:${scale*100}%;display:block`;
    img.draggable = false;
    cell.appendChild(img);
    couponGrid.appendChild(cell);
  }
}

function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

[colsEl,rowsEl,borderSel,fitSel].forEach(el=>el.addEventListener('change',buildGrid));
[colsEl,rowsEl].forEach(el=>el.addEventListener('input',buildGrid));
scaleSl.addEventListener('input',()=>{scaleVal.textContent=scaleSl.value+'%';buildGrid();});

swatchRow.querySelectorAll('.swatch').forEach(sw=>{
  sw.addEventListener('click',()=>{
    swatchRow.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
    sw.classList.add('active');
    cellBg = sw.dataset.c;
    buildGrid();
  });
});
customColor.addEventListener('input',()=>{
  swatchRow.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
  cellBg = customColor.value;
  buildGrid();
});

// ── PROGRESS ──
function setProgress(pct, msg) {
  progressFill.style.width = pct+'%';
  progressMsg.textContent = msg;
}

// ── PDF EXPORT ──
pdfBtn.addEventListener('click', async () => {
  if (!imgDataURL) return;
  pdfBtn.disabled = true;
  progressWrap.style.display = 'flex';
  setProgress(5,'Preparing layout…');

  const cols  = clamp(parseInt(colsEl.value)||5, 1, 15);
  const rows  = clamp(parseInt(rowsEl.value)||20, 1, 60);
  const count = cols * rows;
  const fit   = fitSel.value;
  const scale = parseInt(scaleSl.value)/100;
  const bc    = borderSel.value;

  // PDF page: 8.5in × 14in in points (72pt/in)
  const PW_PT = 8.5 * 72;   // 612
  const PH_PT = 14  * 72;   // 1008

  // Render at 2× 96dpi = 192dpi for quality
  const SCALE = 2;
  const PW_PX = Math.round(8.5 * 96 * SCALE);
  const PH_PX = Math.round(14  * 96 * SCALE);

  const borderMap = {
    'b-solid':  `${SCALE}px solid #bbb`,
    'b-dashed': `${SCALE}px dashed #aaa`,
    'b-dotted': `${SCALE}px dotted #aaa`,
    'b-none':   'none',
  };
  const borderVal = borderMap[bc]||'none';

  setProgress(15,'Building render canvas…');

  // Off-screen div
  const off = document.createElement('div');
  off.style.cssText = [
    `position:fixed`,`left:-${PW_PX+10}px`,`top:0`,
    `width:${PW_PX}px`,`height:${PH_PX}px`,
    `background:#fff`,`overflow:hidden`,
    `display:grid`,
    `grid-template-columns:repeat(${cols},1fr)`,
    `grid-template-rows:repeat(${rows},1fr)`,
    `gap:0`,
  ].join(';');

  for (let i = 0; i < count; i++) {
    const cell = document.createElement('div');
    cell.style.cssText = [
      `overflow:hidden`,`display:flex`,
      `align-items:center`,`justify-content:center`,
      `background:${cellBg}`,`border:${borderVal}`,
    ].join(';');
    const img = document.createElement('img');
    img.src = imgDataURL;
    img.style.cssText = `object-fit:${fit};width:${scale*100}%;height:${scale*100}%;display:block`;
    cell.appendChild(img);
    off.appendChild(cell);
  }
  document.body.appendChild(off);

  // Wait for images to load
  await Promise.all([...off.querySelectorAll('img')].map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  ));

  setProgress(35,'Rendering…');

  try {
    const canvas = await html2canvas(off, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: PW_PX,
      height: PH_PX,
    });

    setProgress(80,'Creating PDF…');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [PW_PT, PH_PT],
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.93);
    pdf.addImage(imgData, 'JPEG', 0, 0, PW_PT, PH_PT, '', 'FAST');

    setProgress(97,'Saving…');
    pdf.save('coupon-sheet-long-bond.pdf');

    setProgress(100,'✓ Download complete!');
    setTimeout(()=>{
      progressWrap.style.display='none';
      setProgress(0,'');
      pdfBtn.disabled = false;
    }, 2000);

  } catch(err) {
    console.error(err);
    alert('PDF export failed: '+err.message);
    progressWrap.style.display = 'none';
    pdfBtn.disabled = false;
  } finally {
    document.body.removeChild(off);
  }
});

// ── DIRECT PRINT ──
printBtn.addEventListener('click', () => {
  if (!imgDataURL) return;
  const cols  = clamp(parseInt(colsEl.value)||5, 1, 15);
  const rows  = clamp(parseInt(rowsEl.value)||20, 1, 60);
  const count = cols * rows;
  const fit   = fitSel.value;
  const scale = parseInt(scaleSl.value)/100;
  const bc    = borderSel.value;

  printGrid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  printGrid.style.gridTemplateRows    = `repeat(${rows},1fr)`;
  printGrid.className = bc;
  printGrid.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const cell = document.createElement('div');
    cell.className = 'coupon-cell';
    cell.style.background = cellBg;
    const img = document.createElement('img');
    img.src = imgDataURL;
    img.style.cssText = `object-fit:${fit};width:${scale*100}%;height:${scale*100}%;display:block`;
    cell.appendChild(img);
    printGrid.appendChild(cell);
  }

  const pa = $('printArea');
  pa.style.display = 'block';
  setTimeout(()=>{ window.print(); setTimeout(()=>{ pa.style.display='none'; },600); }, 200);
});