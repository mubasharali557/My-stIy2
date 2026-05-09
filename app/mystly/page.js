"use client";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { useState, useRef, useEffect, useCallback } from "react";
/* ─── Google Fonts ─── */
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

/* ─── jsPDF CDN ─── */
const jspdfScript = document.createElement("script");
jspdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
document.head.appendChild(jspdfScript);
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}
function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function colorDistance(a, b) {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
}

const COLOR_NAMES = {
  '#000000':'Black','#1c1c1c':'Eerie Black','#2f3035':'Jet','#333':'Dark Gray',
  '#555555':'Davy Grey','#696969':'Dim Gray','#808080':'Gray','#a9a9a9':'Dark Gray',
  '#c0c0c0':'Silver','#d3d3d3':'Light Gray','#dcdcdc':'Gainsboro','#f5f5f5':'White Smoke',
  '#ffffff':'White','#ff0000':'Red','#dc143c':'Crimson','#b22222':'Firebrick',
  '#8b0000':'Dark Red','#ff4500':'Orange Red','#ff6347':'Tomato','#ff7f50':'Coral',
  '#fa8072':'Salmon','#e9967a':'Dark Salmon','#f08080':'Light Coral','#cd5c5c':'Indian Red',
  '#bc8f8f':'Rosy Brown','#c19a6b':'Camel','#deb887':'Burlywood','#d2b48c':'Tan',
  '#f0e68c':'Khaki','#bdb76b':'Dark Khaki','#808000':'Olive','#6b8e23':'Olive Drab',
  '#556b2f':'Dark Olive Green','#9acd32':'Yellow Green','#32cd32':'Lime Green',
  '#00ff00':'Lime','#228b22':'Forest Green','#008000':'Green','#006400':'Dark Green',
  '#90ee90':'Light Green','#98fb98':'Pale Green','#00fa9a':'Medium Spring Green',
  '#00ff7f':'Spring Green','#2e8b57':'Sea Green','#3cb371':'Medium Sea Green',
  '#66cdaa':'Medium Aquamarine','#20b2aa':'Light Sea Green','#008b8b':'Dark Cyan',
  '#008080':'Teal','#40e0d0':'Turquoise','#00ced1':'Dark Turquoise',
  '#48d1cc':'Medium Turquoise','#afeeee':'Pale Turquoise','#00ffff':'Cyan',
  '#e0ffff':'Light Cyan','#b0e0e6':'Powder Blue','#add8e6':'Light Blue',
  '#87ceeb':'Sky Blue','#87cefa':'Light Sky Blue','#00bfff':'Deep Sky Blue',
  '#1e90ff':'Dodger Blue','#6495ed':'Cornflower Blue','#4169e1':'Royal Blue',
  '#0000ff':'Blue','#0000cd':'Medium Blue','#00008b':'Dark Blue','#000080':'Navy',
  '#191970':'Midnight Blue','#483d8b':'Dark Slate Blue','#6a5acd':'Slate Blue',
  '#7b68ee':'Medium Slate Blue','#8a2be2':'Blue Violet','#9400d3':'Dark Violet',
  '#4b0082':'Indigo','#8b008b':'Dark Magenta','#800080':'Purple','#9932cc':'Dark Orchid',
  '#ba55d3':'Medium Orchid','#da70d6':'Orchid','#ee82ee':'Violet','#dda0dd':'Plum',
  '#d8bfd8':'Thistle','#e6e6fa':'Lavender','#ff00ff':'Magenta','#ff69b4':'Hot Pink',
  '#ff1493':'Deep Pink','#c71585':'Medium Violet Red','#db7093':'Pale Violet Red',
  '#ffb6c1':'Light Pink','#ffc0cb':'Pink','#ffa07a':'Light Salmon','#ff8c00':'Dark Orange',
  '#ffa500':'Orange','#ffd700':'Gold','#ffff00':'Yellow','#fffacd':'Lemon Chiffon',
  '#fafad2':'Light Goldenrod','#ffffe0':'Light Yellow','#f5deb3':'Wheat',
  '#ffe4b5':'Moccasin','#ffdead':'Navajo White','#ffe4c4':'Bisque','#ffdab9':'Peach Puff',
  '#8b4513':'Saddle Brown','#a0522d':'Sienna','#cd853f':'Peru',
};

function nearestColorName(hex) {
  const rgb = hexToRgb(hex);
  let best = '', bestDist = Infinity;
  Object.entries(COLOR_NAMES).forEach(([h, n]) => {
    const d = colorDistance(rgb, hexToRgb(h));
    if (d < bestDist) { bestDist = d; best = n; }
  });
  return best || hex;
}

function numToSymbol(n) {
  if (n <= 9) return String(n);
  return String.fromCharCode(64 + n - 9);
}

/* ══════════════════════════════════════
   K-MEANS QUANTIZE
══════════════════════════════════════ */
function kMeansQuantize(pixels, k, iterations) {
  if (!pixels.length) return { centers: [], assignments: [] };
  const centers = [];
  const used = new Set();
  while (centers.length < k) {
    const idx = Math.floor(Math.random() * pixels.length);
    if (!used.has(idx)) { used.add(idx); centers.push([...pixels[idx]]); }
  }
  const assignments = new Array(pixels.length).fill(0);
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < pixels.length; i++) {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < centers.length; c++) {
        const d = colorDistance(pixels[i], centers[c]);
        if (d < bestD) { bestD = d; best = c; }
      }
      assignments[i] = best;
    }
    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Array(k).fill(0);
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0]; sums[c][1] += pixels[i][1]; sums[c][2] += pixels[i][2];
      counts[c]++;
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) centers[c] = [sums[c][0]/counts[c], sums[c][1]/counts[c], sums[c][2]/counts[c]];
    }
  }
  return { centers: centers.map(c => c.map(Math.round)), assignments };
}

function buildGridData(src, cols, rows, k, cb) {
  const off = document.createElement('canvas');
  off.width = cols; off.height = rows;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  const img = new Image();
  img.onload = function () {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, cols, rows);
    const raw = ctx.getImageData(0, 0, cols, rows).data;
    const rgbPixels = [];
    for (let i = 0; i < raw.length; i += 4) {
      if (raw[i+3] < 128) rgbPixels.push([255, 255, 255]);
      else rgbPixels.push([raw[i], raw[i+1], raw[i+2]]);
    }
    const result = kMeansQuantize(rgbPixels, Math.min(k, rgbPixels.length), 8);
    const { centers, assignments } = result;
    const indexed = centers.map((c, i) => ({ c, i, lum: 0.299*c[0]+0.587*c[1]+0.114*c[2] }));
    indexed.sort((a, b) => a.lum - b.lum);
    const remapIdx = new Array(centers.length);
    indexed.forEach((item, ni) => remapIdx[item.i] = ni);
    const sortedCenters = indexed.map(item => item.c);
    const pal = sortedCenters.map((c, i) => {
      const hex = rgbToHex(c[0], c[1], c[2]);
      return { hex, name: nearestColorName(hex), num: i+1, rgb: c };
    });
    const pixels = assignments.map(a => ({
      hex: pal[remapIdx[a]].hex,
      num: pal[remapIdx[a]].num,
    }));
    cb({ pixels, cols, rows, pal });
  };
  img.src = src;
}

/* ══════════════════════════════════════
   EDGE DETECTION for Dark Outlines
   Returns Set of cell indices that are on an edge (neighbor has different color)
══════════════════════════════════════ */
function computeEdgeCells(pixels, cols, rows) {
  const edges = new Set();
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const num = pixels[idx].num;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
          edges.add(idx); break;
        }
        const nidx = nr * cols + nc;
        if (pixels[nidx].num !== num) {
          edges.add(idx); break;
        }
      }
    }
  }
  return edges;
}

/* ══════════════════════════════════════
   HD EXPORT UTILITIES
══════════════════════════════════════ */
function drawExportCanvas(gridData, S, mode, scale = 3) {
  if (!gridData) return null;
  const canvas = document.createElement('canvas');
  const cs = S.cellSize * scale;
  const mg = S.margin * scale;
  canvas.width = gridData.cols * cs + mg * 2;
  canvas.height = gridData.rows * cs + mg * 2;
  const ctx = canvas.getContext('2d');
  const isC = mode === 'color';

  ctx.fillStyle = S.dark ? '#1a202c' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const edgeCells = S.darklines ? computeEdgeCells(gridData.pixels, gridData.cols, gridData.rows) : null;

  gridData.pixels.forEach((px, i) => {
    const col = i % gridData.cols;
    const row = Math.floor(i / gridData.cols);
    const x = mg + col * cs;
    const y = mg + row * cs;

    ctx.fillStyle = isC ? px.hex : (S.dark ? '#1a202c' : '#fff');
    if (S.shapeType === 'Circle' || S.shapeType === 'Circles (Packed)') {
      ctx.beginPath();
      ctx.arc(x + cs/2, y + cs/2, cs/2 - 1, 0, Math.PI * 2);
      ctx.fill();
      if (S.showGrid) {
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = S.lineWidth * scale;
        ctx.stroke();
      }
    } else {
      ctx.fillRect(x, y, cs, cs);
      if (S.showGrid) {
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = S.lineWidth * scale;
        ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
      }
    }

    // Dark outlines: draw outline only on edge cells
    if (S.darklines && edgeCells && edgeCells.has(i)) {
      ctx.strokeStyle = '#1a202c';
      ctx.lineWidth = (S.lineWidth * scale * 1.5);
      if (S.shapeType === 'Circle' || S.shapeType === 'Circles (Packed)') {
        ctx.beginPath();
        ctx.arc(x + cs/2, y + cs/2, cs/2 - 1, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
      }
    }

    if (mode === 'numbers' && S.showNums) {
      ctx.globalAlpha = S.numOpacity / 100;
      ctx.fillStyle = S.dark ? '#a0aec0' : '#374151';
      ctx.font = (S.bold ? 'bold ' : '') + (S.numSize * scale) + 'px ' + S.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(numToSymbol(px.num), x + cs/2, y + cs/2);
      ctx.globalAlpha = 1;
    }
  });
  return canvas;
}

function drawLegendCanvas(palette, scale = 3) {
  const canvas = document.createElement('canvas');
  const rowH = 40 * scale, pad = 24 * scale, swatchSize = 28 * scale;
  const w = 420 * scale, h = pad * 2 + rowH * palette.length + 50 * scale;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#111827';
  ctx.font = `bold ${18 * scale}px Courier New`;
  ctx.textAlign = 'center';
  ctx.fillText('Color Legend', w / 2, pad + 14 * scale);
  palette.forEach((p, i) => {
    const y = pad + 40 * scale + i * rowH;
    ctx.fillStyle = p.hex; ctx.fillRect(pad, y, swatchSize, swatchSize);
    ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = scale; ctx.strokeRect(pad, y, swatchSize, swatchSize);
    ctx.fillStyle = '#111827';
    ctx.font = `bold ${15 * scale}px Courier New`; ctx.textAlign = 'left';
    ctx.fillText(numToSymbol(p.num) + ':', pad + swatchSize + 12 * scale, y + swatchSize / 2 + 5 * scale);
    ctx.font = `${14 * scale}px Courier New`;
    ctx.fillText(p.name + ' (' + p.hex.toUpperCase() + ')', pad + swatchSize + 44 * scale, y + swatchSize / 2 + 5 * scale);
  });
  return canvas;
}

function canvasToBlob(canvas, type = 'image/png') {
  return new Promise(resolve => canvas.toBlob(resolve, type, 1.0));
}

async function canvasToSVG(canvas) {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
  <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/>
</svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}

async function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadAsPDF(canvas, filename) {
  const w = window;
  if (!w.jspdf) { alert('PDF library not loaded yet, please try again.'); return; }
  const { jsPDF } = w.jspdf;
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm', format: 'a4'
  });
  const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pw / canvas.width, ph / canvas.height) * 0.95;
  const dw = canvas.width * ratio, dh = canvas.height * ratio;
  pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', (pw - dw) / 2, (ph - dh) / 2, dw, dh);
  pdf.save(filename);
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function MysteryMosaicAI() {
  const [settings, setSettings] = useState({
    shapeType: 'Circles (Packed)', cellSize: 19, margin: 35, lineWidth: 0.9,
    numSize: 14, numOpacity: 80, cols: 0, rows: 0, font: 'Quicksand',
    bold: false, showGrid: true, showNums: true,
    overlay: true, overlayOpacity: 80, dark: false, darklines: true,
    autoDetect: true, palSize: 17,
  });
  const S = settings;
  const setS = (patch) => setSettings(prev => ({ ...prev, ...patch }));

  const [isColorMode, setIsColorMode] = useState(false);
  const [zoom, setZoom] = useState(120);
  const [gridData, setGridData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [palette, setPalette] = useState([]);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [spinning, setSpinning] = useState(false);
  const [credits, setCredits] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [paletteRedo, setPaletteRedo] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'color' | 'numbers' | 'legend' | null

  const reprocessTimer = useRef(null);
  const fileInputRef = useRef(null);
  const canvasInnerRef = useRef(null);

  const zoomLevels = [25, 50, 75, 100, 120, 150, 175, 200, 250, 300];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setDropdownOpen(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  /* ─── Reprocess ─── */
  const scheduleReprocess = useCallback(() => {
    clearTimeout(reprocessTimer.current);
    reprocessTimer.current = setTimeout(() => reprocess(), 300);
  }, [imageSrc, S.cellSize, S.cols, S.rows, S.palSize]);

  function reprocess() {
    if (!imageSrc) return;
    setSpinning(true);
    const cs = S.cellSize;
    const useCols = S.cols > 0 ? S.cols : Math.max(5, Math.floor(600 / cs));
    const useRows = S.rows > 0 ? S.rows : Math.max(5, Math.floor(600 / cs));
    buildGridData(imageSrc, useCols, useRows, S.palSize, (data) => {
      setGridData(data);
      setPalette(data.pal);
      setSpinning(false);
    });
  }

  useEffect(() => {
    if (imageSrc) scheduleReprocess();
  }, [imageSrc, S.cellSize, S.cols, S.rows, S.palSize]);

  /* ─── Grid Cells (memoized) ─── */
  const edgeCells = gridData && S.darklines
    ? computeEdgeCells(gridData.pixels, gridData.cols, gridData.rows)
    : null;

  /* ─── Download handlers ─── */
  async function handleDownload(type, format) {
    setDropdownOpen(null);
    let canvas;
    if (type === 'color') {
      if (!gridData) { alert('Upload an image first.'); return; }
      canvas = drawExportCanvas(gridData, { ...S, darklines: S.darklines }, 'color', 3);
    } else if (type === 'numbers') {
      if (!gridData) { alert('Upload an image first.'); return; }
      canvas = drawExportCanvas(gridData, S, 'numbers', 3);
    } else if (type === 'legend') {
      if (!palette.length) { alert('Upload an image first.'); return; }
      canvas = drawLegendCanvas(palette, 3);
    }

    if (!canvas) return;
    if (format === 'PNG') {
      const blob = await canvasToBlob(canvas, 'image/png');
      downloadBlob(blob, `mosaic-${type}.png`);
    } else if (format === 'SVG') {
      const blob = await canvasToSVG(canvas);
      downloadBlob(blob, `mosaic-${type}.svg`);
    } else if (format === 'PDF') {
      await downloadAsPDF(canvas, `mosaic-${type}.pdf`);
    }
  }

  /* ─── File Upload ─── */
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => { setImageSrc(e.target.result); };
    reader.readAsDataURL(file);
  }

  function removeImg(e) {
    e.stopPropagation();
    setImageSrc(null); setGridData(null); setPalette([]);
  }

  /* ─── Palette ─── */
  function deleteColor(i) {
    setPaletteHistory(h => [...h, JSON.parse(JSON.stringify(palette))]);
    const newPal = palette.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, num: idx+1 }));
    setPalette(newPal);
    if (gridData) {
      const newPixels = gridData.pixels.map(px => {
        const found = newPal.find(p => p.hex === px.hex);
        return found ? { ...px, num: found.num } : px;
      });
      setGridData({ ...gridData, pixels: newPixels });
    }
  }

  function addColor() {
    const hex = prompt('Enter hex color (e.g. #ff0000):', '#888888');
    if (!hex || !hex.match(/^#[0-9a-fA-F]{6}$/)) return;
    setPaletteHistory(h => [...h, JSON.parse(JSON.stringify(palette))]);
    setPalette(p => [...p, { hex: hex.toLowerCase(), name: nearestColorName(hex.toLowerCase()), num: p.length+1, rgb: hexToRgb(hex) }]);
  }

  function undoPalette() {
    if (!paletteHistory.length) return;
    setPaletteRedo(r => [...r, JSON.parse(JSON.stringify(palette))]);
    const prev = [...paletteHistory]; const last = prev.pop();
    setPaletteHistory(prev); setPalette(last);
  }
  function redoPalette() {
    if (!paletteRedo.length) return;
    setPaletteHistory(h => [...h, JSON.parse(JSON.stringify(palette))]);
    const next = [...paletteRedo]; const last = next.pop();
    setPaletteRedo(next); setPalette(last);
  }

  function savePalette() { localStorage.setItem('mosaic-palette', JSON.stringify(palette)); alert('Palette saved!'); }
  function loadPalette() {
    const s = localStorage.getItem('mosaic-palette');
    if (s) { setPalette(JSON.parse(s)); alert('Palette loaded!'); }
    else alert('No saved palette.');
  }

  /* ─── Zoom ─── */
  function zoomIn() { const i = zoomLevels.indexOf(zoom); if (i < zoomLevels.length-1) setZoom(zoomLevels[i+1]); }
  function zoomOut() { const i = zoomLevels.indexOf(zoom); if (i > 0) setZoom(zoomLevels[i-1]); }

  /* ─── Sample text font update ─── */
  const sampleStyle = { fontFamily: S.font + ',sans-serif', fontWeight: S.bold ? 700 : 400 };

  /* ─── Styles ─── */
  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --blue:#4f46e5;--blue2:#6366f1;--green:#16a34a;--green2:#22c55e;
      --border:#e5e7eb;--bg:#f9fafb;--card:#fff;
      --txt:#111827;--muted:#6b7280;--muted2:#9ca3af;
      --accent:#4f46e5;--red:#ef4444;
    }
    body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--txt);font-size:13px}
    nav{background:#fff;border-bottom:1px solid var(--border);padding:0 20px;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
    .nav-logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:16px;color:var(--blue);font-family:'Quicksand',sans-serif}
    .nav-logo-icon{width:32px;height:32px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:8px;display:flex;align-items:center;justify-content:center}
    .credits-badge{display:flex;align-items:center;gap:5px;border:1px solid var(--border);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;color:var(--txt)}
    .plus-btn{width:20px;height:20px;background:var(--blue);border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;cursor:pointer;border:none}
    .user-avatar{width:34px;height:34px;background:linear-gradient(135deg,#f59e0b,#ef4444);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;cursor:pointer}
    .page-title-bar{padding:14px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);background:#fff}
    .page-title-bar h1{font-size:18px;font-weight:700;font-family:'Quicksand',sans-serif}
    #app{display:grid;grid-template-columns:430px 1fr;min-height:calc(100vh - 104px)}
    #left{border-right:1px solid var(--border);background:#fff;overflow-y:auto;padding-bottom:40px}
    .section-box{padding:16px 20px;border-bottom:1px solid var(--border)}
    .section-header{font-size:13px;font-weight:700;color:var(--txt);margin-bottom:14px}
    .tab-row{display:flex;border-bottom:2px solid var(--border);margin-bottom:16px}
    .tab{flex:1;padding:10px;text-align:center;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px}
    .tab.active{color:var(--blue);border-bottom-color:var(--blue)}
    .upload-zone{border:2px dashed var(--border);border-radius:10px;padding:28px;text-align:center;cursor:pointer;background:#fafafa;transition:all .2s;position:relative;overflow:hidden}
    .upload-zone:hover,.upload-zone.drag{border-color:var(--blue);background:#eff6ff}
    .uz-icon{width:48px;height:48px;background:#eff0fe;border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
    .remove-img-btn{position:absolute;top:8px;right:8px;background:#fff;border:1px solid var(--border);border-radius:6px;padding:3px 8px;font-size:11px;color:var(--red);cursor:pointer;font-weight:600}
    .mode-toggle{display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden}
    .mode-btn{padding:7px 18px;font-size:13px;font-weight:600;border:none;background:#fff;color:var(--muted);cursor:pointer;transition:all .15s;font-family:inherit}
    .mode-btn.active{background:var(--green);color:#fff}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
    .form-group{display:flex;flex-direction:column;gap:4px}
    .form-group label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
    select,input[type=number]{width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:#fff;color:var(--txt);font-size:13px;font-family:inherit;cursor:pointer;outline:none}
    select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center}
    select:focus,input[type=number]:focus{border-color:var(--blue)}
    .slider-row{margin-bottom:12px}
    .sl-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
    .sl-label{font-size:12px;font-weight:600;color:var(--txt)}
    .sl-val{font-size:12px;font-weight:600;color:var(--blue)}
    input[type=range]{width:100%;accent-color:var(--blue);height:4px;cursor:pointer}
    .check-simple{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:var(--txt);cursor:pointer;margin-bottom:8px}
    .check-simple input{width:15px;height:15px;accent-color:var(--blue);cursor:pointer}
    .feature-row{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--border);border-radius:8px;padding:9px 12px;margin-bottom:7px;cursor:pointer;transition:all .15s}
    .feature-row:hover{border-color:#c7d2fe}
    .feature-row.active-blue{background:#eff0fe;border-color:#a5b4fc}
    .feature-row.active-dark{background:#1f2937;border-color:#374151}
    .feature-row-left{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}
    .feature-row.active-dark .feature-row-left{color:#f9fafb}
    .check-box-styled{width:16px;height:16px;border:2px solid var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;font-weight:700;color:#fff}
    .check-box-styled.checked{background:var(--blue);border-color:var(--blue)}
    .action-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px}
    .btn{padding:10px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;border:1px solid var(--border);background:#fff;color:var(--txt);text-align:center}
    .btn:hover{border-color:var(--blue);color:var(--blue)}
    .btn-primary{background:var(--blue);color:#fff;border-color:var(--blue)}
    .btn-primary:hover{background:#4338ca;border-color:#4338ca}
    .palette-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
    .pal-icon-btn{width:28px;height:28px;border:1px solid var(--border);border-radius:6px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px}
    .auto-detect-row{display:flex;align-items:center;gap:8px;margin-bottom:10px}
    .auto-badge{background:#dbeafe;color:#1d4ed8;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px}
    .color-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px;max-height:260px;overflow-y:auto;padding-right:4px}
    .color-card{border:1px solid var(--border);border-radius:8px;overflow:hidden;cursor:pointer;transition:all .15s}
    .color-card:hover{border-color:var(--blue)}
    .color-swatch{height:52px;position:relative}
    .color-hex{position:absolute;top:4px;left:4px;font-size:9px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5);background:rgba(0,0,0,.25);padding:1px 4px;border-radius:3px}
    .color-info{padding:4px 6px}
    .color-num{font-size:11px;font-weight:700;color:var(--muted);text-align:center}
    .color-name{font-size:10px;color:var(--muted2);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .color-delete{font-size:10px;color:var(--red);text-align:center;cursor:pointer;display:none}
    .color-card:hover .color-delete{display:block}
    .palette-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
    .palette-actions .btn{font-size:12px;padding:8px}
    #right{background:var(--bg);padding:20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto}
    .preview-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
    .preview-title{font-size:16px;font-weight:700;color:var(--txt);font-family:'Quicksand',sans-serif}
    .interactive-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit}
    .zoom-bar{display:flex;align-items:center;gap:5px}
    .zoom-btn{width:30px;height:30px;border:1px solid var(--border);border-radius:7px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--muted);transition:all .15s}
    .zoom-btn:hover{border-color:var(--blue);color:var(--blue)}
    .zoom-sel{border:1px solid var(--border);border-radius:7px;padding:5px 8px;font-size:12px;font-weight:700;color:var(--txt);background:#fff;font-family:inherit;outline:none;width:70px}
    .dl-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .dl-label{font-size:12px;font-weight:700;color:var(--muted);letter-spacing:.05em;text-transform:uppercase}
    .dl-btn-wrap{position:relative}
    .dl-btn{display:flex;align-items:center;gap:5px;padding:7px 12px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;color:#fff;font-family:inherit;transition:all .15s}
    .dl-btn.color-dl{background:#4f46e5}
    .dl-btn.color-dl:hover{background:#4338ca}
    .dl-btn.numbers-dl{background:#16a34a}
    .dl-btn.numbers-dl:hover{background:#15803d}
    .dl-btn.legend-dl{background:#0f766e;border:2px solid #134e4a}
    .dl-btn.legend-dl:hover{background:#0d6660}
    .dl-dropdown{position:absolute;top:calc(100% + 4px);left:0;background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:200;min-width:140px;overflow:hidden}
    .dl-dropdown-item{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;transition:background .1s;color:var(--txt)}
    .dl-dropdown-item:hover{background:#f3f4f6}
    .dl-dropdown-item .lock{font-size:12px;color:var(--muted2)}
    .export-settings-btn{display:flex;align-items:center;gap:5px;padding:6px 12px;border:1px solid var(--border);border-radius:8px;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:var(--muted);font-family:inherit}
    .canvas-outer{border:1px solid var(--border);border-radius:12px;background:#fff;overflow:hidden;min-height:500px;position:relative}
    #canvas-wrap{overflow:auto;display:flex;align-items:flex-start;justify-content:flex-start;min-height:496px;padding:16px}
    #canvas-inner{transform-origin:top left;display:inline-block}
    #mosaic-grid{display:grid}
    .mosaic-cell{display:flex;align-items:center;justify-content:center;box-sizing:border-box;line-height:1;user-select:none;position:relative}
    .spinner-wrap{position:absolute;inset:0;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;border-radius:12px;z-index:10;flex-direction:column;gap:10px}
    .spin-dots{display:flex;gap:6px}
    .sdot{width:10px;height:10px;border-radius:50%;background:var(--blue);animation:sdot .7s ease-in-out infinite alternate}
    .sdot:nth-child(2){animation-delay:.15s}.sdot:nth-child(3){animation-delay:.3s}
    @keyframes sdot{from{opacity:.3;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
    #empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:12px;width:100%}
    .es-icon{width:72px;height:72px;background:#eff0fe;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px}
    .legend-label{font-size:12px;font-weight:600;color:var(--muted);text-align:center;margin-top:4px;margin-bottom:10px;letter-spacing:.03em}
    #legend-box{background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px}
    #legend-list{display:flex;flex-direction:column;gap:4px}
    .legend-row{display:flex;align-items:center;gap:14px;padding:6px 8px;border-radius:6px}
    .legend-row:hover{background:#f9fafb}
    .legend-swatch{width:32px;height:32px;border-radius:6px;border:1px solid rgba(0,0,0,.12);flex-shrink:0}
    .legend-num{font-size:15px;font-weight:700;min-width:28px;font-family:'Courier New',monospace}
    .legend-name{font-size:14px;color:var(--txt);font-family:'Courier New',monospace}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}
    .mini{width:80px;height:3px}
  `;

  /* ─── Render grid cells ─── */
  function renderGridCells() {
    if (!gridData) return null;
    const cs = S.cellSize;
    const borderColor = S.darklines ? '#1a202c' : (S.dark ? '#4a5568' : '#d1d5db');
    const bgCell = S.dark ? '#1a202c' : '#ffffff';

    return gridData.pixels.map((px, i) => {
      const bg = isColorMode ? px.hex : bgCell;
      const textColor = isColorMode ? 'rgba(0,0,0,0.65)' : (S.dark ? '#a0aec0' : '#374151');
      const isEdge = edgeCells ? edgeCells.has(i) : false;

      // For dark outlines: only edge cells get dark border, others get light/no border
      let borderStyle = 'none';
      if (S.darklines) {
        if (isEdge) {
          borderStyle = `${S.lineWidth * 1.5}px solid #1a202c`;
        } else if (S.showGrid) {
          borderStyle = `${S.lineWidth}px solid #e5e7eb`;
        }
      } else if (S.showGrid) {
        borderStyle = `${S.lineWidth}px solid ${borderColor}`;
      }

      const overlayStyle = S.overlay && isColorMode
        ? { boxShadow: `inset 0 0 0 1px rgba(0,0,0,${S.overlayOpacity/100})` }
        : {};

      const isCircle = S.shapeType === 'Circle' || S.shapeType === 'Circles (Packed)';

      return (
        <div
          key={i}
          className="mosaic-cell"
          style={{
            width: cs, height: cs,
            background: bg,
            border: borderStyle,
            borderRadius: isCircle ? '50%' : 0,
            fontSize: S.numSize,
            fontFamily: S.font + ',sans-serif',
            fontWeight: S.bold ? 700 : 400,
            color: textColor,
            flexShrink: 0,
            ...overlayStyle,
          }}
        >
          {S.showNums && (
            <span style={{ opacity: S.numOpacity / 100 }}>{numToSymbol(px.num)}</span>
          )}
        </div>
      );
    });
  }

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          Mystery Mosaic AI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="credits-badge">
            CREDITS &nbsp;<strong>{credits}</strong>
            <button className="plus-btn" onClick={() => setCredits(c => c+1)}>+</button>
          </div>
          <div className="user-avatar">A</div>
        </div>
      </nav>

      {/* PAGE TITLE */}
      <div className="page-title-bar">
        <h1>Mystery Mosaic / Color-By-Number Generator</h1>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
          {gridData ? `${gridData.cols}×${gridData.rows} grid` : ''}
        </span>
      </div>

      {/* MAIN */}
      <div id="app">

        {/* ═══ LEFT PANEL ═══ */}
        <div id="left">
          <div className="section-box">
            <div className="section-header">1) Image &amp; Mosaic Settings</div>

            {/* Tabs */}
            <div className="tab-row">
              <div className={`tab ${activeTab==='upload'?'active':''}`} onClick={() => setActiveTab('upload')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                Upload Image
              </div>
              <div className={`tab ${activeTab==='ai'?'active':''}`} onClick={() => setActiveTab('ai')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
                Generate with AI
              </div>
            </div>

            {/* Upload zone */}
            <div
              className={`upload-zone${isDragging?' drag':''}`}
              onClick={() => fileInputRef.current.click()}
              onDragEnter={e=>{e.preventDefault();setIsDragging(true)}}
              onDragLeave={e=>{e.preventDefault();setIsDragging(false)}}
              onDragOver={e=>{e.preventDefault();setIsDragging(true)}}
              onDrop={e=>{e.preventDefault();setIsDragging(false);handleFile(e.dataTransfer.files[0])}}
            >
              {imageSrc ? (
                <>
                  <img src={imageSrc} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8,display:'block'}} alt=""/>
                  <button className="remove-img-btn" onClick={removeImg}>✕ Remove</button>
                </>
              ) : (
                <>
                  <div className="uz-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4f46e5" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <h4 style={{fontSize:14,fontWeight:600,marginBottom:4}}>Change Image</h4>
                  <p style={{fontSize:12,color:'var(--muted)'}}>Drag &amp; drop or click (1 Credit)</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>

            <div style={{height:14}}/>

            {/* Preview Mode */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:13,fontWeight:600}}>Preview Mode:</span>
              <div className="mode-toggle">
                <button className={`mode-btn${isColorMode?' active':''}`} onClick={() => setIsColorMode(true)}>Color</button>
                <button className={`mode-btn${!isColorMode?' active':''}`} onClick={() => setIsColorMode(false)}>Numbers</button>
              </div>
            </div>

            {/* Shape + Cell Size */}
            <div className="form-row">
              <div className="form-group">
                <label>Shape Type</label>
                <select value={S.shapeType} onChange={e=>setS({shapeType:e.target.value})}>
                  <option>Circles (Packed)</option><option>Rectangle</option>
                  <option>Circle</option><option>Hexagon</option><option>Triangle</option>
                </select>
              </div>
              <div className="form-group">
                <div className="slider-row">
                  <div className="sl-header">
                    <span className="sl-label">Cell Size</span>
                    <span className="sl-val">{S.cellSize}px</span>
                  </div>
                  <input type="range" min="5" max="80" step="1" value={S.cellSize}
                    onChange={e=>setS({cellSize:+e.target.value})} style={{marginTop:4}}/>
                </div>
              </div>
            </div>

            {/* Margin + Line Width */}
            <div className="form-row">
              <div className="slider-row" style={{width:'100%'}}>
                <div className="sl-header"><span className="sl-label">Margin</span><span className="sl-val">{S.margin}px</span></div>
                <input type="range" min="0" max="100" step="1" value={S.margin} onChange={e=>setS({margin:+e.target.value})}/>
              </div>
              <div className="slider-row" style={{width:'100%'}}>
                <div className="sl-header"><span className="sl-label">Line Width</span><span className="sl-val">{S.lineWidth.toFixed(1)}px</span></div>
                <input type="range" min="0.1" max="5" step="0.1" value={S.lineWidth} onChange={e=>setS({lineWidth:+e.target.value})}/>
              </div>
            </div>

            {/* Number Size + Opacity */}
            <div className="form-row">
              <div className="slider-row" style={{width:'100%'}}>
                <div className="sl-header"><span className="sl-label">Number Size</span><span className="sl-val">{S.numSize}px</span></div>
                <input type="range" min="4" max="40" step="1" value={S.numSize} onChange={e=>setS({numSize:+e.target.value})}/>
              </div>
              <div className="slider-row" style={{width:'100%'}}>
                <div className="sl-header"><span className="sl-label">Number Opacity</span><span className="sl-val">{S.numOpacity}%</span></div>
                <input type="range" min="0" max="100" step="1" value={S.numOpacity} onChange={e=>setS({numOpacity:+e.target.value})}/>
              </div>
            </div>

            {/* Cols + Rows */}
            <div className="form-row" style={{marginBottom:12}}>
              <div className="form-group">
                <label>Cols (0=Auto)</label>
                <input type="number" min="0" value={S.cols} onChange={e=>setS({cols:+e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Rows (0=Auto)</label>
                <input type="number" min="0" value={S.rows} onChange={e=>setS({rows:+e.target.value})}/>
              </div>
            </div>

            {/* Label Font */}
            <div className="form-group" style={{marginBottom:12}}>
              <label>Label Font</label>
              <select value={S.font} onChange={e=>setS({font:e.target.value})}>
                <option>Quicksand</option><option>Georgia</option><option>Arial</option>
                <option>Verdana</option><option>Courier New</option><option>Times New Roman</option>
              </select>
            </div>

            {/* Bold + Grid + Numbers */}
            <label className="check-simple">
              <input type="checkbox" checked={S.bold} onChange={e=>setS({bold:e.target.checked})}/>
              Bold Text <span style={{fontSize:12,color:'var(--muted)',marginLeft:4,...sampleStyle}}>Sample: 123 ABC</span>
            </label>
            <div className="form-row" style={{marginBottom:12}}>
              <label className="check-simple">
                <input type="checkbox" checked={S.showGrid} onChange={e=>setS({showGrid:e.target.checked})}/>
                Show Grid
              </label>
              <label className="check-simple">
                <input type="checkbox" checked={S.showNums} onChange={e=>setS({showNums:e.target.checked})}/>
                Show Numbers
              </label>
            </div>

            {/* Show Overlay Outlines */}
            <div className={`feature-row${S.overlay?' active-blue':''}`} onClick={() => setS({overlay:!S.overlay})} style={{marginBottom:7}}>
              <div className="feature-row-left">
                <div className={`check-box-styled${S.overlay?' checked':''}`}>{S.overlay?'✓':''}</div>
                <span>≋</span> Show Overlay Outlines
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:11,color:'var(--muted)'}}>Opacity: {S.overlayOpacity}%</span>
                <input type="range" className="mini" min="0" max="100" value={S.overlayOpacity}
                  onChange={e=>setS({overlayOpacity:+e.target.value})}
                  onClick={e=>e.stopPropagation()}/>
              </div>
            </div>

            {/* Dark Background Mode */}
            <div className={`feature-row${S.dark?' active-dark':''}`} onClick={() => setS({dark:!S.dark})} style={{marginBottom:7}}>
              <div className="feature-row-left">
                <div className={`check-box-styled${S.dark?' checked':''}`}>{S.dark?'✓':''}</div>
                <span>🌙</span> Dark Background Mode
              </div>
            </div>

            {/* Dark Design Outlines — edge detection */}
            <div className={`feature-row${S.darklines?' active-blue':''}`} onClick={() => setS({darklines:!S.darklines})} style={{marginBottom:12}}>
              <div className="feature-row-left">
                <div className={`check-box-styled${S.darklines?' checked':''}`}>{S.darklines?'✓':''}</div>
                <span>▦</span> Dark Design Outlines
              </div>
            </div>

            {/* Action buttons */}
            <div className="action-row">
              <button className="btn" onClick={reprocess}>Re-Generate Preview</button>
              <button className="btn" onClick={() => {
                setS({cellSize:19,margin:35,lineWidth:0.9,numSize:14,numOpacity:80,palSize:17,overlay:true,dark:false,darklines:true});
              }}>Load Demo</button>
            </div>
          </div>

          {/* SECTION 2: COLOR PALETTE */}
          <div className="section-box">
            <div className="palette-header">
              <div className="section-header" style={{marginBottom:0}}>2) Color Palette</div>
              <div style={{display:'flex',gap:6}}>
                <button className="pal-icon-btn" title="Undo" onClick={undoPalette}>↩</button>
                <button className="pal-icon-btn" title="Redo" onClick={redoPalette}>↪</button>
              </div>
            </div>

            <div className="auto-detect-row">
              <label className="check-simple" style={{marginBottom:0}}>
                <input type="checkbox" checked={S.autoDetect} onChange={e=>{setS({autoDetect:e.target.checked});if(e.target.checked) scheduleReprocess();}}/>
                Auto-Detect Colors
              </label>
              <span className="auto-badge">AUTO</span>
            </div>

            <div className="slider-row" style={{margin:'10px 0'}}>
              <div className="sl-header">
                <span className="sl-label">Palette Size (K):</span>
                <span className="sl-val">{S.palSize}</span>
              </div>
              <input type="range" min="2" max="32" step="1" value={S.palSize} onChange={e=>setS({palSize:+e.target.value})}/>
            </div>

            <div className="color-grid">
              {palette.map((p, i) => (
                <div key={i} className="color-card">
                  <div className="color-swatch" style={{background:p.hex}}>
                    <span className="color-hex">{p.hex}</span>
                  </div>
                  <div className="color-info">
                    <div className="color-num">{numToSymbol(p.num)}</div>
                    <div className="color-name" title={p.name}>{p.name}</div>
                    <div className="color-delete" onClick={() => deleteColor(i)}>Delete</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="palette-actions">
              <button className="btn" onClick={addColor}>+ Add Color</button>
              <button className="btn" onClick={reprocess}>↺ Re-Quantize</button>
              <button className="btn" onClick={savePalette}>💾 Save Palette</button>
              <button className="btn" onClick={loadPalette}>📂 Load Palette</button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div id="right">

          {/* Preview header */}
          <div className="preview-header">
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span className="preview-title">Mosaic Preview</span>
              <button
                className="interactive-btn"
                style={{background: interactiveMode ? '#16a34a' : 'linear-gradient(135deg,#4f46e5,#7c3aed)'}}
                onClick={() => setInteractiveMode(m => !m)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
                Interactive Color
              </button>
            </div>
            <div className="zoom-bar">
              <button className="zoom-btn" onClick={zoomOut}>−</button>
              <select className="zoom-sel" value={zoom} onChange={e=>setZoom(+e.target.value)}>
                {zoomLevels.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <span style={{fontSize:12,color:'var(--muted)'}}>%</span>
              <button className="zoom-btn" onClick={zoomIn}>+</button>
              <button className="zoom-btn" onClick={() => setZoom(120)} title="Reset">↺</button>
            </div>
          </div>

          {/* Download row with dropdowns */}
          <div className="dl-row">
            <span className="dl-label">DOWNLOAD:</span>

            {/* Color Mode */}
            <div className="dl-btn-wrap">
              <button className="dl-btn color-dl" onClick={e=>{e.stopPropagation();setDropdownOpen(d=>d==='color'?null:'color')}}>
                Color Mode <span style={{fontSize:10,marginLeft:2}}>▾</span>
              </button>
              {dropdownOpen === 'color' && (
                <div className="dl-dropdown" onClick={e=>e.stopPropagation()}>
                  {['PNG','SVG','PDF'].map(fmt => (
                    <div key={fmt} className="dl-dropdown-item" onClick={() => handleDownload('color', fmt)}>
                      {fmt} <span className="lock">⬇</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Numbers Mode */}
            <div className="dl-btn-wrap">
              <button className="dl-btn numbers-dl" onClick={e=>{e.stopPropagation();setDropdownOpen(d=>d==='numbers'?null:'numbers')}}>
                Numbers Mode <span style={{fontSize:10,marginLeft:2}}>▾</span>
              </button>
              {dropdownOpen === 'numbers' && (
                <div className="dl-dropdown" onClick={e=>e.stopPropagation()}>
                  {['PNG','SVG','PDF'].map(fmt => (
                    <div key={fmt} className="dl-dropdown-item" onClick={() => handleDownload('numbers', fmt)}>
                      {fmt} <span className="lock">⬇</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend Only */}
            <div className="dl-btn-wrap">
              <button className="dl-btn legend-dl" onClick={e=>{e.stopPropagation();setDropdownOpen(d=>d==='legend'?null:'legend')}}>
                Legend Only <span style={{fontSize:10,marginLeft:2}}>▾</span>
              </button>
              {dropdownOpen === 'legend' && (
                <div className="dl-dropdown" onClick={e=>e.stopPropagation()}>
                  {['PNG','SVG','PDF'].map(fmt => (
                    <div key={fmt} className="dl-dropdown-item" onClick={() => handleDownload('legend', fmt)}>
                      {fmt} <span className="lock">⬇</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export settings */}
          <div>
            <button className="export-settings-btn" onClick={() => {
              localStorage.setItem('mosaic-settings', JSON.stringify(S));
              alert('Settings exported to localStorage!');
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
              Export Settings
            </button>
          </div>

          {/* Canvas area */}
          <div className="canvas-outer">
            {spinning && (
              <div className="spinner-wrap">
                <div className="spin-dots">
                  <div className="sdot"/><div className="sdot"/><div className="sdot"/>
                </div>
                <p style={{fontSize:13,color:'var(--muted)',fontWeight:500}}>Generating mosaic...</p>
              </div>
            )}
            <div id="canvas-wrap">
              <div id="canvas-inner" ref={canvasInnerRef} style={{transform:`scale(${zoom/100})`}}>
                {!gridData ? (
                  <div id="empty-state">
                    <div className="es-icon">🖼️</div>
                    <p style={{fontSize:14,fontWeight:600,color:'var(--muted)'}}>Upload an image to generate your mosaic</p>
                    <span style={{fontSize:12,color:'var(--muted2)'}}>Supports PNG, JPG, WEBP, GIF</span>
                  </div>
                ) : (
                  <div
                    id="mosaic-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${gridData.cols}, ${S.cellSize}px)`,
                      gridTemplateRows: `repeat(${gridData.rows}, ${S.cellSize}px)`,
                      padding: S.margin,
                    }}
                  >
                    {renderGridCells()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          {palette.length > 0 && (
            <>
              <div className="legend-label">Legend Preview</div>
              <div id="legend-box">
                <h3 style={{fontSize:16,fontWeight:700,textAlign:'center',marginBottom:16,fontFamily:'Courier New,monospace',letterSpacing:'.05em'}}>Color Legend</h3>
                <div id="legend-list">
                  {palette.map((p, i) => (
                    <div key={i} className="legend-row">
                      <div className="legend-swatch" style={{background:p.hex}}/>
                      <div className="legend-num">{numToSymbol(p.num)}:</div>
                      <div className="legend-name">{p.name} ({p.hex.toUpperCase()})</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <div style={{borderTop:'1px solid var(--border)',background:'#fff',padding:16,textAlign:'center',fontSize:12,color:'var(--muted)'}}>
        © Gen Color by Number &nbsp;|&nbsp; Created by Amazon KDP community BD
      </div>
    </>
  );
}







// "use client";
// import { useState, useRef, useEffect, useCallback } from "react";
// /* ─── Google Fonts ─── */
// const fontLink = document.createElement("link");
// fontLink.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";
// fontLink.rel = "stylesheet";
// document.head.appendChild(fontLink);

// /* ─── jsPDF CDN ─── */
// const jspdfScript = document.createElement("script");
// jspdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
// document.head.appendChild(jspdfScript);

// /* ══════════════════════════════════════
//    COLOR UTILS
// ══════════════════════════════════════ */
// function rgbToHex(r, g, b) {
//   return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
// }
// function hexToRgb(h) {
//   return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
// }
// function colorDistance(a, b) {
//   return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
// }

// const COLOR_NAMES = {
//   '#000000':'Black','#1c1c1c':'Eerie Black','#2f3035':'Jet','#333':'Dark Gray',
//   '#555555':'Davy Grey','#696969':'Dim Gray','#808080':'Gray','#a9a9a9':'Dark Gray',
//   '#c0c0c0':'Silver','#d3d3d3':'Light Gray','#dcdcdc':'Gainsboro','#f5f5f5':'White Smoke',
//   '#ffffff':'White','#ff0000':'Red','#dc143c':'Crimson','#b22222':'Firebrick',
//   '#8b0000':'Dark Red','#ff4500':'Orange Red','#ff6347':'Tomato','#ff7f50':'Coral',
//   '#fa8072':'Salmon','#e9967a':'Dark Salmon','#f08080':'Light Coral','#cd5c5c':'Indian Red',
//   '#bc8f8f':'Rosy Brown','#c19a6b':'Camel','#deb887':'Burlywood','#d2b48c':'Tan',
//   '#f0e68c':'Khaki','#bdb76b':'Dark Khaki','#808000':'Olive','#6b8e23':'Olive Drab',
//   '#556b2f':'Dark Olive Green','#9acd32':'Yellow Green','#32cd32':'Lime Green',
//   '#00ff00':'Lime','#228b22':'Forest Green','#008000':'Green','#006400':'Dark Green',
//   '#90ee90':'Light Green','#98fb98':'Pale Green','#00fa9a':'Medium Spring Green',
//   '#00ff7f':'Spring Green','#2e8b57':'Sea Green','#3cb371':'Medium Sea Green',
//   '#66cdaa':'Medium Aquamarine','#20b2aa':'Light Sea Green','#008b8b':'Dark Cyan',
//   '#008080':'Teal','#40e0d0':'Turquoise','#00ced1':'Dark Turquoise',
//   '#48d1cc':'Medium Turquoise','#afeeee':'Pale Turquoise','#00ffff':'Cyan',
//   '#e0ffff':'Light Cyan','#b0e0e6':'Powder Blue','#add8e6':'Light Blue',
//   '#87ceeb':'Sky Blue','#87cefa':'Light Sky Blue','#00bfff':'Deep Sky Blue',
//   '#1e90ff':'Dodger Blue','#6495ed':'Cornflower Blue','#4169e1':'Royal Blue',
//   '#0000ff':'Blue','#0000cd':'Medium Blue','#00008b':'Dark Blue','#000080':'Navy',
//   '#191970':'Midnight Blue','#483d8b':'Dark Slate Blue','#6a5acd':'Slate Blue',
//   '#7b68ee':'Medium Slate Blue','#8a2be2':'Blue Violet','#9400d3':'Dark Violet',
//   '#4b0082':'Indigo','#8b008b':'Dark Magenta','#800080':'Purple','#9932cc':'Dark Orchid',
//   '#ba55d3':'Medium Orchid','#da70d6':'Orchid','#ee82ee':'Violet','#dda0dd':'Plum',
//   '#d8bfd8':'Thistle','#e6e6fa':'Lavender','#ff00ff':'Magenta','#ff69b4':'Hot Pink',
//   '#ff1493':'Deep Pink','#c71585':'Medium Violet Red','#db7093':'Pale Violet Red',
//   '#ffb6c1':'Light Pink','#ffc0cb':'Pink','#ffa07a':'Light Salmon','#ff8c00':'Dark Orange',
//   '#ffa500':'Orange','#ffd700':'Gold','#ffff00':'Yellow','#fffacd':'Lemon Chiffon',
//   '#fafad2':'Light Goldenrod','#ffffe0':'Light Yellow','#f5deb3':'Wheat',
//   '#ffe4b5':'Moccasin','#ffdead':'Navajo White','#ffe4c4':'Bisque','#ffdab9':'Peach Puff',
//   '#8b4513':'Saddle Brown','#a0522d':'Sienna','#cd853f':'Peru',
// };

// function nearestColorName(hex) {
//   const rgb = hexToRgb(hex);
//   let best = '', bestDist = Infinity;
//   Object.entries(COLOR_NAMES).forEach(([h, n]) => {
//     const d = colorDistance(rgb, hexToRgb(h));
//     if (d < bestDist) { bestDist = d; best = n; }
//   });
//   return best || hex;
// }

// function numToSymbol(n) {
//   if (n <= 9) return String(n);
//   return String.fromCharCode(64 + n - 9);
// }

// /* ══════════════════════════════════════
//    K-MEANS QUANTIZE
// ══════════════════════════════════════ */
// function kMeansQuantize(pixels, k, iterations) {
//   if (!pixels.length) return { centers: [], assignments: [] };
//   const centers = [];
//   const used = new Set();
//   while (centers.length < k) {
//     const idx = Math.floor(Math.random() * pixels.length);
//     if (!used.has(idx)) { used.add(idx); centers.push([...pixels[idx]]); }
//   }
//   const assignments = new Array(pixels.length).fill(0);
//   for (let iter = 0; iter < iterations; iter++) {
//     for (let i = 0; i < pixels.length; i++) {
//       let best = 0, bestD = Infinity;
//       for (let c = 0; c < centers.length; c++) {
//         const d = colorDistance(pixels[i], centers[c]);
//         if (d < bestD) { bestD = d; best = c; }
//       }
//       assignments[i] = best;
//     }
//     const sums = Array.from({ length: k }, () => [0, 0, 0]);
//     const counts = new Array(k).fill(0);
//     for (let i = 0; i < pixels.length; i++) {
//       const c = assignments[i];
//       sums[c][0] += pixels[i][0]; sums[c][1] += pixels[i][1]; sums[c][2] += pixels[i][2];
//       counts[c]++;
//     }
//     for (let c = 0; c < k; c++) {
//       if (counts[c] > 0) centers[c] = [sums[c][0]/counts[c], sums[c][1]/counts[c], sums[c][2]/counts[c]];
//     }
//   }
//   return { centers: centers.map(c => c.map(Math.round)), assignments };
// }

// function buildGridData(src, cols, rows, k, cb) {
//   const off = document.createElement('canvas');
//   off.width = cols; off.height = rows;
//   const ctx = off.getContext('2d', { willReadFrequently: true });
//   const img = new Image();
//   img.onload = function () {
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = 'high';
//     ctx.drawImage(img, 0, 0, cols, rows);
//     const raw = ctx.getImageData(0, 0, cols, rows).data;
//     const rgbPixels = [];
//     for (let i = 0; i < raw.length; i += 4) {
//       if (raw[i+3] < 128) rgbPixels.push([255, 255, 255]);
//       else rgbPixels.push([raw[i], raw[i+1], raw[i+2]]);
//     }
//     const result = kMeansQuantize(rgbPixels, Math.min(k, rgbPixels.length), 8);
//     const { centers, assignments } = result;
//     const indexed = centers.map((c, i) => ({ c, i, lum: 0.299*c[0]+0.587*c[1]+0.114*c[2] }));
//     indexed.sort((a, b) => a.lum - b.lum);
//     const remapIdx = new Array(centers.length);
//     indexed.forEach((item, ni) => remapIdx[item.i] = ni);
//     const sortedCenters = indexed.map(item => item.c);
//     const pal = sortedCenters.map((c, i) => {
//       const hex = rgbToHex(c[0], c[1], c[2]);
//       return { hex, name: nearestColorName(hex), num: i+1, rgb: c };
//     });
//     const pixels = assignments.map(a => ({
//       hex: pal[remapIdx[a]].hex,
//       num: pal[remapIdx[a]].num,
//     }));
//     cb({ pixels, cols, rows, pal });
//   };
//   img.src = src;
// }

// /* ══════════════════════════════════════
//    EDGE DETECTION for Dark Outlines
//    Returns Set of cell indices that are on an edge (neighbor has different color)
// ══════════════════════════════════════ */
// function computeEdgeCells(pixels, cols, rows) {
//   const edges = new Set();
//   const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < cols; c++) {
//       const idx = r * cols + c;
//       const num = pixels[idx].num;
//       for (const [dr, dc] of dirs) {
//         const nr = r + dr, nc = c + dc;
//         if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
//           edges.add(idx); break;
//         }
//         const nidx = nr * cols + nc;
//         if (pixels[nidx].num !== num) {
//           edges.add(idx); break;
//         }
//       }
//     }
//   }
//   return edges;
// }

// /* ══════════════════════════════════════
//    HD EXPORT UTILITIES
// ══════════════════════════════════════ */
// function drawExportCanvas(gridData, S, mode, scale = 3) {
//   if (!gridData) return null;
//   const canvas = document.createElement('canvas');
//   const cs = S.cellSize * scale;
//   const mg = S.margin * scale;
//   canvas.width = gridData.cols * cs + mg * 2;
//   canvas.height = gridData.rows * cs + mg * 2;
//   const ctx = canvas.getContext('2d');
//   const isC = mode === 'color';

//   ctx.fillStyle = S.dark ? '#1a202c' : '#ffffff';
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   const edgeCells = S.darklines ? computeEdgeCells(gridData.pixels, gridData.cols, gridData.rows) : null;

//   gridData.pixels.forEach((px, i) => {
//     const col = i % gridData.cols;
//     const row = Math.floor(i / gridData.cols);
//     const x = mg + col * cs;
//     const y = mg + row * cs;

//     ctx.fillStyle = isC ? px.hex : (S.dark ? '#1a202c' : '#fff');
//     if (S.shapeType === 'Circle' || S.shapeType === 'Circles (Packed)') {
//       ctx.beginPath();
//       ctx.arc(x + cs/2, y + cs/2, cs/2 - 1, 0, Math.PI * 2);
//       ctx.fill();
//       if (S.showGrid) {
//         ctx.strokeStyle = '#d1d5db';
//         ctx.lineWidth = S.lineWidth * scale;
//         ctx.stroke();
//       }
//     } else {
//       ctx.fillRect(x, y, cs, cs);
//       if (S.showGrid) {
//         ctx.strokeStyle = '#d1d5db';
//         ctx.lineWidth = S.lineWidth * scale;
//         ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
//       }
//     }

//     // Dark outlines: draw outline only on edge cells
//     if (S.darklines && edgeCells && edgeCells.has(i)) {
//       ctx.strokeStyle = '#1a202c';
//       ctx.lineWidth = (S.lineWidth * scale * 1.5);
//       if (S.shapeType === 'Circle' || S.shapeType === 'Circles (Packed)') {
//         ctx.beginPath();
//         ctx.arc(x + cs/2, y + cs/2, cs/2 - 1, 0, Math.PI * 2);
//         ctx.stroke();
//       } else {
//         ctx.strokeRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
//       }
//     }

//     if (mode === 'numbers' && S.showNums) {
//       ctx.globalAlpha = S.numOpacity / 100;
//       ctx.fillStyle = S.dark ? '#a0aec0' : '#374151';
//       ctx.font = (S.bold ? 'bold ' : '') + (S.numSize * scale) + 'px ' + S.font;
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillText(numToSymbol(px.num), x + cs/2, y + cs/2);
//       ctx.globalAlpha = 1;
//     }
//   });
//   return canvas;
// }

// function drawLegendCanvas(palette, scale = 3) {
//   const canvas = document.createElement('canvas');
//   const rowH = 40 * scale, pad = 24 * scale, swatchSize = 28 * scale;
//   const w = 420 * scale, h = pad * 2 + rowH * palette.length + 50 * scale;
//   canvas.width = w; canvas.height = h;
//   const ctx = canvas.getContext('2d');
//   ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
//   ctx.fillStyle = '#111827';
//   ctx.font = `bold ${18 * scale}px Courier New`;
//   ctx.textAlign = 'center';
//   ctx.fillText('Color Legend', w / 2, pad + 14 * scale);
//   palette.forEach((p, i) => {
//     const y = pad + 40 * scale + i * rowH;
//     ctx.fillStyle = p.hex; ctx.fillRect(pad, y, swatchSize, swatchSize);
//     ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = scale; ctx.strokeRect(pad, y, swatchSize, swatchSize);
//     ctx.fillStyle = '#111827';
//     ctx.font = `bold ${15 * scale}px Courier New`; ctx.textAlign = 'left';
//     ctx.fillText(numToSymbol(p.num) + ':', pad + swatchSize + 12 * scale, y + swatchSize / 2 + 5 * scale);
//     ctx.font = `${14 * scale}px Courier New`;
//     ctx.fillText(p.name + ' (' + p.hex.toUpperCase() + ')', pad + swatchSize + 44 * scale, y + swatchSize / 2 + 5 * scale);
//   });
//   return canvas;
// }

// function canvasToBlob(canvas, type = 'image/png') {
//   return new Promise(resolve => canvas.toBlob(resolve, type, 1.0));
// }

// async function canvasToSVG(canvas) {
//   const dataUrl = canvas.toDataURL('image/png', 1.0);
//   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
//   <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/>
// </svg>`;
//   return new Blob([svg], { type: 'image/svg+xml' });
// }

// async function downloadBlob(blob, filename) {
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url; a.download = filename; a.click();
//   setTimeout(() => URL.revokeObjectURL(url), 1000);
// }

// async function downloadAsPDF(canvas, filename) {
//   const w = window;
//   if (!w.jspdf) { alert('PDF library not loaded yet, please try again.'); return; }
//   const { jsPDF } = w.jspdf;
//   const pdf = new jsPDF({
//     orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
//     unit: 'mm', format: 'a4'
//   });
//   const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
//   const ratio = Math.min(pw / canvas.width, ph / canvas.height) * 0.95;
//   const dw = canvas.width * ratio, dh = canvas.height * ratio;
//   pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', (pw - dw) / 2, (ph - dh) / 2, dw, dh);
//   pdf.save(filename);
// }

// /* ══════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════ */
// export default function MysteryMosaicAI() {
//   const [settings, setSettings] = useState({
//     shapeType: 'Circles (Packed)', cellSize: 19, margin: 35, lineWidth: 0.9,
//     numSize: 14, numOpacity: 80, cols: 0, rows: 0, font: 'Quicksand',
//     bold: false, showGrid: true, showNums: true,
//     overlay: true, overlayOpacity: 80, dark: false, darklines: true,
//     autoDetect: true, palSize: 17,
//   });
//   const S = settings;
//   const setS = (patch) => setSettings(prev => ({ ...prev, ...patch }));

//   const [isColorMode, setIsColorMode] = useState(false);
//   const [zoom, setZoom] = useState(120);
//   const [gridData, setGridData] = useState(null);
//   const [imageSrc, setImageSrc] = useState(null);
//   const [palette, setPalette] = useState([]);
//   const [interactiveMode, setInteractiveMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('upload');
//   const [spinning, setSpinning] = useState(false);
//   const [credits, setCredits] = useState(4);
//   const [isDragging, setIsDragging] = useState(false);
//   const [paletteHistory, setPaletteHistory] = useState([]);
//   const [paletteRedo, setPaletteRedo] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(null); // 'color' | 'numbers' | 'legend' | null

//   const reprocessTimer = useRef(null);
//   const fileInputRef = useRef(null);
//   const canvasInnerRef = useRef(null);

//   const zoomLevels = [25, 50, 75, 100, 120, 150, 175, 200, 250, 300];

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = () => setDropdownOpen(null);
//     window.addEventListener('click', handler);
//     return () => window.removeEventListener('click', handler);
//   }, []);

//   /* ─── Reprocess ─── */
//   const scheduleReprocess = useCallback(() => {
//     clearTimeout(reprocessTimer.current);
//     reprocessTimer.current = setTimeout(() => reprocess(), 300);
//   }, [imageSrc, S.cellSize, S.cols, S.rows, S.palSize]);

//   function reprocess() {
//     if (!imageSrc) return;
//     setSpinning(true);
//     const cs = S.cellSize;
//     const useCols = S.cols > 0 ? S.cols : Math.max(5, Math.floor(600 / cs));
//     const useRows = S.rows > 0 ? S.rows : Math.max(5, Math.floor(600 / cs));
//     buildGridData(imageSrc, useCols, useRows, S.palSize, (data) => {
//       setGridData(data);
//       setPalette(data.pal);
//       setSpinning(false);
//     });
//   }

//   useEffect(() => {
//     if (imageSrc) scheduleReprocess();
//   }, [imageSrc, S.cellSize, S.cols, S.rows, S.palSize]);

//   /* ─── Grid Cells (memoized) ─── */
//   const edgeCells = gridData && S.darklines
//     ? computeEdgeCells(gridData.pixels, gridData.cols, gridData.rows)
//     : null;

//   /* ─── Download handlers ─── */
//   async function handleDownload(type, format) {
//     setDropdownOpen(null);
//     let canvas;
//     if (type === 'color') {
//       if (!gridData) { alert('Upload an image first.'); return; }
//       canvas = drawExportCanvas(gridData, { ...S, darklines: S.darklines }, 'color', 3);
//     } else if (type === 'numbers') {
//       if (!gridData) { alert('Upload an image first.'); return; }
//       canvas = drawExportCanvas(gridData, S, 'numbers', 3);
//     } else if (type === 'legend') {
//       if (!palette.length) { alert('Upload an image first.'); return; }
//       canvas = drawLegendCanvas(palette, 3);
//     }

//     if (!canvas) return;
//     if (format === 'PNG') {
//       const blob = await canvasToBlob(canvas, 'image/png');
//       downloadBlob(blob, `mosaic-${type}.png`);
//     } else if (format === 'SVG') {
//       const blob = await canvasToSVG(canvas);
//       downloadBlob(blob, `mosaic-${type}.svg`);
//     } else if (format === 'PDF') {
//       await downloadAsPDF(canvas, `mosaic-${type}.pdf`);
//     }
//   }

//   /* ─── File Upload ─── */
//   function handleFile(file) {
//     if (!file || !file.type.startsWith('image/')) return;
//     const reader = new FileReader();
//     reader.onload = (e) => { setImageSrc(e.target.result); };
//     reader.readAsDataURL(file);
//   }

//   function removeImg(e) {
//     e.stopPropagation();
//     setImageSrc(null); setGridData(null); setPalette([]);
//   }

//   /* ─── Palette ─── */
//   function deleteColor(i) {
//     setPaletteHistory(h => [...h, JSON.parse(JSON.stringify(palette))]);
//     const newPal = palette.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, num: idx+1 }));
//     setPalette(newPal);
//     if (gridData) {
//       const newPixels = gridData.pixels.map(px => {
//         const found = newPal.find(p => p.hex === px.hex);
//         return found ? { ...px, num: found.num } : px;
//       });
//       setGridData({ ...gridData, pixels: newPixels });
//     }
//   }

//   function addColor() {
//     const hex = prompt('Enter hex color (e.g. #ff0000):', '#ffc0cb');
//     if (!hex || !hex.match(/^#[0-9a-fA-F]{6}$/)) return;
//     setPaletteHistory(h => [...h, JSON.parse(JSON.stringify(palette))]);
//     setPalette(p => [...p, { hex: hex.toLowerCase(), name: nearestColorName(hex.toLowerCase()), num: p.length+1, rgb: hexToRgb(hex) }]);
//   }

//   function undoPalette() {
//     if (!paletteHistory.length) return;
//     setPaletteRedo(r => [...r, JSON.parse(JSON.stringify(palette))]);
//     const prev = [...paletteHistory]; const last = prev.pop();
//     setPaletteHistory(prev); setPalette(last);
//   }
//   function redoPalette() {
//     if (!paletteRedo.length) return;
//     setPaletteHistory(h => [...h, JSON.parse(JSON.stringify(palette))]);
//     const next = [...paletteRedo]; const last = next.pop();
//     setPaletteRedo(next); setPalette(last);
//   }

//   function savePalette() { localStorage.setItem('mosaic-palette', JSON.stringify(palette)); alert('Palette saved!'); }
//   function loadPalette() {
//     const s = localStorage.getItem('mosaic-palette');
//     if (s) { setPalette(JSON.parse(s)); alert('Palette loaded!'); }
//     else alert('No saved palette.');
//   }

//   /* ─── Zoom ─── */
//   function zoomIn() { const i = zoomLevels.indexOf(zoom); if (i < zoomLevels.length-1) setZoom(zoomLevels[i+1]); }
//   function zoomOut() { const i = zoomLevels.indexOf(zoom); if (i > 0) setZoom(zoomLevels[i-1]); }

//   /* ─── Sample text font update ─── */
//   const sampleStyle = { fontFamily: S.font + ',sans-serif', fontWeight: S.bold ? 700 : 400 };

//   /* ─── Styles with PINK theme ─── */
//   const css = `
//     *{box-sizing:border-box;margin:0;padding:0}
//     :root{
//       --pink:#ec4899;--pink2:#db2777;--pink3:#be185d;--pink-light:#fce7f3;--pink-hover:#f472b6;
//       --green:#16a34a;--green2:#22c55e;
//       --border:#f3e8ff;--bg:#fdf2f8;--card:#fff;--bg-alt:#fce7f3;
//       --txt:#1f2937;--muted:#6b7280;--muted2:#9ca3af;
//       --accent:var(--pink);--red:#ef4444;
//     }
//     body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--txt);font-size:13px}
//     nav{background:#fff;border-bottom:1px solid var(--border);padding:0 20px;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(236,72,153,.1)}
//     .nav-logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:16px;color:var(--pink);font-family:'Quicksand',sans-serif}
//     .nav-logo-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--pink),var(--pink2));border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(236,72,153,.3)}
//     .credits-badge{display:flex;align-items:center;gap:5px;border:1px solid var(--border);border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;color:var(--txt);background:var(--pink-light)}
//     .plus-btn{width:20px;height:20px;background:var(--pink);border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;cursor:pointer;border:none;box-shadow:0 2px 8px rgba(236,72,153,.4)}
//     .user-avatar{width:34px;height:34px;background:linear-gradient(135deg,var(--pink),#f472b6);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 12px rgba(236,72,153,.3)}
//     .page-title-bar{padding:14px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);background:#fff;box-shadow:0 1px 3px rgba(236,72,153,.08)}
//     .page-title-bar h1{font-size:18px;font-weight:700;font-family:'Quicksand',sans-serif;color:var(--pink)}
//     #app{display:grid;grid-template-columns:430px 1fr;min-height:calc(100vh - 104px)}
//     #left{border-right:1px solid var(--border);background:#fff;overflow-y:auto;padding-bottom:40px}
//     .section-box{padding:16px 20px;border-bottom:1px solid var(--border);background:var(--bg-alt)}
//     .section-header{font-size:13px;font-weight:700;color:var(--pink);margin-bottom:14px}
//     .tab-row{display:flex;border-bottom:2px solid var(--border);margin-bottom:16px}
//     .tab{flex:1;padding:10px;text-align:center;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px}
//     .tab.active{color:var(--pink);border-bottom-color:var(--pink)}
//     .upload-zone{border:2px dashed var(--border);border-radius:10px;padding:28px;text-align:center;cursor:pointer;background:var(--bg-alt);transition:all .2s;position:relative;overflow:hidden}
//     .upload-zone:hover,.upload-zone.drag{border-color:var(--pink);background:var(--pink-light);box-shadow:0 4px 20px rgba(236,72,153,.15)}
//     .uz-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--pink-light),#fce7f3);border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;border:2px solid var(--pink)}
//     .remove-img-btn{position:absolute;top:8px;right:8px;background:#fff;border:1px solid var(--border);border-radius:6px;padding:3px 8px;font-size:11px;color:var(--red);cursor:pointer;font-weight:600;box-shadow:0 2px 4px rgba(0,0,0,.1)}
//     .mode-toggle{display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden}
//     .mode-btn{padding:7px 18px;font-size:13px;font-weight:600;border:none;background:#fff;color:var(--muted);cursor:pointer;transition:all .15s;font-family:inherit}
//     .mode-btn.active{background:var(--pink);color:#fff;box-shadow:0 2px 8px rgba(236,72,153,.3)}
//     .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
//     .form-group{display:flex;flex-direction:column;gap:4px}
//     .form-group label{font-size:11px;font-weight:600;color:var(--pink);text-transform:uppercase;letter-spacing:.04em}
//     select,input[type=number]{width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:#fff;color:var(--txt);font-size:13px;font-family:inherit;cursor:pointer;outline:none;transition:border-color .15s}
//     select:focus,input[type=number]:focus{border-color:var(--pink);box-shadow:0 0 0 3px rgba(236,72,153,.1)}
//     select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center}
//     .slider-row{margin-bottom:12px}
//     .sl-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
//     .sl-label{font-size:12px;font-weight:600;color:var(--txt)}
//     .sl-val{font-size:12px;font-weight:600;color:var(--pink)}
//     input[type=range]{width:100%;accent-color:var(--pink);height:4px;cursor:pointer}
//     .check-simple{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:var(--txt);cursor:pointer;margin-bottom:8px}
//     .check-simple input{width:15px;height:15px;accent-color:var(--pink);cursor:pointer}
//     .feature-row{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--border);border-radius:8px;padding:9px 12px;margin-bottom:7px;cursor:pointer;transition:all .15s;background:#fff}
//     .feature-row:hover{border-color:var(--pink);box-shadow:0 2px 8px rgba(236,72,153,.15)}
//     .feature-row.active-blue{background:linear-gradient(135deg,var(--pink-light),#fce7f3);border-color:var(--pink)}
//     .feature-row.active-dark{background:#1f2937;border-color:#374151}
//     .feature-row-left{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}
//     .feature-row.active-dark .feature-row-left{color:#f9fafb}
//     .check-box-styled{width:16px;height:16px;border:2px solid var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;font-weight:700;color:#fff;transition:all .15s}
//     .check-box-styled.checked{background:var(--pink);border-color:var(--pink);box-shadow:0 2px 6px rgba(236,72,153,.4)}
//     .action-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px}
//     .btn{padding:10px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;border:1px solid var(--border);background:#fff;color:var(--txt);text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.05)}
//     .btn:hover{border-color:var(--pink);color:var(--pink);box-shadow:0 4px 12px rgba(236,72,153,.2)}
//     .btn-primary{background:linear-gradient(135deg,var(--pink),var(--pink2));color:#fff;border-color:var(--pink);box-shadow:0 4px 12px rgba(236,72,153,.4)}
//     .btn-primary:hover{background:linear-gradient(135deg,var(--pink2),var(--pink3));border-color:var(--pink2);transform:translateY(-1px)}
//     .palette-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
//     .pal-icon-btn{width:28px;height:28px;border:1px solid var(--border);border-radius:6px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .15s}
//     .pal-icon-btn:hover{background:var(--pink-light);border-color:var(--pink);color:var(--pink)}
//     .auto-detect-row{display:flex;align-items:center;gap:8px;margin-bottom:10px}
//     .auto-badge{background:var(--pink);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;box-shadow:0 2px 4px rgba(236,72,153,.3)}
//     .color-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px;max-height:260px;overflow-y:auto;padding-right:4px}
//     .color-card{border:1px solid var(--border);border-radius:8px;overflow:hidden;cursor:pointer;transition:all .15s;box-shadow:0 2px 4px rgba(0,0,0,.05)}
//     .color-card:hover{border-color:var(--pink);box-shadow:0 8px 20px rgba(236,72,153,.2);transform:translateY(-2px)}
//     .color-swatch{height:52px;position:relative}
//     .color-hex{position:absolute;top:4px;left:4px;font-size:9px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5);background:rgba(0,0,0,.25);padding:1px 4px;border-radius:3px}
//     .color-info{padding:4px 6px}
//     .color-num{font-size:11px;font-weight:700;color:var(--muted);text-align:center}
//     .color-name{font-size:10px;color:var(--muted2);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
//     .color-delete{font-size:10px;color:var(--pink);text-align:center;cursor:pointer;display:none;font-weight:600}
//     .color-card:hover .color-delete{display:block}
//     .palette-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
//     .palette-actions .btn{font-size:12px;padding:8px}
//     #right{background:var(--bg);padding:20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto}
//     .preview-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;background:var(--bg-alt);padding:12px 16px;border-radius:12px;border:1px solid var(--border)}
//     .preview-title{font-size:16px;font-weight:700;color:var(--pink);font-family:'Quicksand',sans-serif}
//     .interactive-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 12px rgba(236,72,153,.3);transition:all .2s}
//     .interactive-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(236,72,153,.4)}
//     .zoom-bar{display:flex;align-items:center;gap:5px}
//     .zoom-btn{width:30px;height:30px;border:1px solid var(--border);border-radius:7px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--muted);transition:all .15s}
//     .zoom-btn:hover{border-color:var(--pink);color:var(--pink);box-shadow:0 2px 8px rgba(236,72,153,.2)}
//     .zoom-sel{border:1px solid var(--border);border-radius:7px;padding:5px 8px;font-size:12px;font-weight:700;color:var(--txt);background:#fff;font-family:inherit;outline:none;width:70px;transition:border-color .15s}
//     .zoom-sel:focus{border-color:var(--pink);box-shadow:0 0 0 3px rgba(236,72,153,.1)}
//     .dl-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:var(--bg-alt);padding:12px 16px;border-radius:12px;border:1px solid var(--border)}
//     .dl-label{font-size:12px;font-weight:700;color:var(--pink);letter-spacing:.05em;text-transform:uppercase}
//     .dl-btn-wrap{position:relative}
//     .dl-btn{display:flex;align-items:center;gap:5px;padding:7px 12px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;color:#fff;font-family:inherit;transition:all .15s;box-shadow:0 4px 12px rgba(0,0,0,.15)}
//     .dl-btn.color-dl{background:linear-gradient(135deg,var(--pink),var(--pink2))}
//     .dl-btn.color-dl:hover{background:linear-gradient(135deg,var(--pink2),var(--pink3));transform:translateY(-1px);box-shadow:0 6px 20px rgba(236,72,153,.4)}
//     .dl-btn.numbers-dl{background:linear-gradient(135deg,var(--green),var(--green2))}
//     .dl-btn.numbers-dl:hover{background:linear-gradient(135deg,var(--green2),#15803d);transform:translateY(-1px)}
//     .dl-btn.legend-dl{background:linear-gradient(135deg,#0f766e,#115e59);border:2px solid #134e4a}
//     .dl-btn.legend-dl:hover{background:linear-gradient(135deg,#0d6660,#0b4d48);transform:translateY(-1px)}
//     .dl-dropdown{position:absolute;top:calc(100% + 4px);left:0;background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:0 8px 24px rgba(236,72,153,.15);z-index:200;min-width:140px;overflow:hidden}
//     .dl-dropdown-item{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;transition:background .1s,color .1s;color:var(--txt)}
//     .dl-dropdown-item:hover{background:var(--pink-light);color:var(--pink)}
//     .dl-dropdown-item .lock{font-size:12px;color:var(--muted2)}
//     .export-settings-btn{display:flex;align-items:center;gap:5px;padding:6px 12px;border:1px solid var(--border);border-radius:8px;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:var(--muted);font-family:inherit;transition:all .15s}
//     .export-settings-btn:hover{border-color:var(--pink);color:var(--pink)}
//     .canvas-outer{border:1px solid var(--border);border-radius:12px;background:#fff;overflow:hidden;min-height:500px;position:relative;box-shadow:0 4px 20px rgba(236,72,153,.1)}
//     #canvas-wrap{overflow:auto;display:flex;align-items:flex-start;justify-content:flex-start;min-height:496px;padding:16px}
//     #canvas-inner{transform-origin:top left;display:inline-block}
//     #mosaic-grid{display:grid}
//     .mosaic-cell{display:flex;align-items:center;justify-content:center;box-sizing:border-box;line-height:1;user-select:none;position:relative}
//     .spinner-wrap{position:absolute;inset:0;background:rgba(252,231,243,.95);display:flex;align-items:center;justify-content:center;border-radius:12px;z-index:10;flex-direction:column;gap:10px}
//     .spin-dots{display:flex;gap:6px}
//     .sdot{width:10px;height:10px;border-radius:50%;background:var(--pink);animation:sdot .7s ease-in-out infinite alternate}
//     .sdot:nth-child(2){animation-delay:.15s}.sdot:nth-child(3){animation-delay:.3s}
//     @keyframes sdot{from{opacity:.3;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
//     #empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:12px;width:100%}
//     .es-icon{width:72px;height:72px;background:linear-gradient(135deg,var(--pink-light),#fce7f3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;border:3px solid var(--pink);color:var(--pink)}
//     .legend-label{font-size:12px;font-weight:600;color:var(--pink);text-align:center;margin-top:4px;margin-bottom:10px;letter-spacing:.03em}
//     #legend-box{background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px;box-shadow:0 4px 12px rgba(236,72,153,.1)}
//     #legend-list{display:flex;flex-direction:column;gap:4px}
//     .legend-row{display:flex;align-items:center;gap:14px;padding:6px 8px;border-radius:6px;transition:background .15s}
//     .legend-row:hover{background:var(--pink-light)}
//     .legend-swatch{width:32px;height:32px;border-radius:6px;border:1px solid rgba(0,0,0,.12);flex-shrink:0;box-shadow:0 2px 4px rgba(0,0,0,.1)}
//     .legend-num{font-size:15px;font-weight:700;min-width:28px;font-family:'Courier New',monospace;color:var(--pink)}
//     .legend-name{font-size:14px;color:var(--txt);font-family:'Courier New',monospace}
//     ::-webkit-scrollbar{width:5px;height:5px}
//     ::-webkit-scrollbar-track{background:transparent}
//     ::-webkit-scrollbar-thumb{background:var(--pink-light);border-radius:3px}
//     ::-webkit-scrollbar-thumb:hover{background:var(--pink)}
//     .mini{width:80px;height:3px}
//   `;

//   /* ─── Render grid cells ─── */
//   function renderGridCells() {
//     if (!gridData) return null;
//     const cs = S.cellSize;
//     const borderColor = S.darklines ? '#1a202c' : (S.dark ? '#4a5568' : '#d1d5db');
//     const bgCell = S.dark ? '#1a202c' : '#ffffff';

//     return gridData.pixels.map((px, i) => {
//       const bg = isColorMode ? px.hex : bgCell;
//       const textColor = isColorMode ? 'rgba(0,0,0,0.65)' : (S.dark ? '#a0aec0' : '#374151');
//       const isEdge = edgeCells ? edgeCells.has(i) : false;

//       // For dark outlines: only edge cells get dark border, others get light/no border
//       let borderStyle = 'none';
//       if (S.darklines) {
//         if (isEdge) {
//           borderStyle = `${S.lineWidth * 1.5}px solid #1a202c`;
//         } else if (S.showGrid) {
//           borderStyle = `${S.lineWidth}px solid #e5e7eb`;
//         }
//       } else if (S.showGrid) {
//         borderStyle = `${S.lineWidth}px solid ${borderColor}`;
//       }

//       const overlayStyle = S.overlay && isColorMode
//         ? { boxShadow: `inset 0 0 0 1px rgba(0,0,0,${S.overlayOpacity/100})` }
//         : {};

//       const isCircle = S.shapeType === 'Circle' || S.shapeType === 'Circles (Packed)';

//       return (
//         <div
//           key={i}
//           className="mosaic-cell"
//           style={{
//             width: cs, height: cs,
//             background: bg,
//             border: borderStyle,
//             borderRadius: isCircle ? '50%' : 0,
//             fontSize: S.numSize,
//             fontFamily: S.font + ',sans-serif',
//             fontWeight: S.bold ? 700 : 400,
//             color: textColor,
//             flexShrink: 0,
//             ...overlayStyle,
//           }}
//         >
//           {S.showNums && (
//             <span style={{ opacity: S.numOpacity / 100 }}>{numToSymbol(px.num)}</span>
//           )}
//         </div>
//       );
//     });
//   }

//   return (
//     <>
//       <style>{css}</style>

//       {/* NAV */}
//       <nav>
//         <div className="nav-logo">
//           <div className="nav-logo-icon">
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
//               <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
//               <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
//             </svg>
//           </div>
//           Mystery Mosaic AI
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <div className="credits-badge">
//             CREDITS &nbsp;<strong>{credits}</strong>
//             <button className="plus-btn" onClick={() => setCredits(c => c+1)}>+</button>
//           </div>
//           <div className="user-avatar">A</div>
//         </div>
//       </nav>

//       {/* PAGE TITLE */}
//       <div className="page-title-bar">
//         <h1>Mystery Mosaic / Color-By-Number Generator</h1>
//         <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
//           {gridData ? `${gridData.cols}×${gridData.rows} grid` : ''}
//         </span>
//       </div>

//       {/* MAIN */}
//       <div id="app">

//         {/* ═══ LEFT PANEL ═══ */}
//         <div id="left">
//           <div className="section-box">
//             <div className="section-header">1) Image &amp; Mosaic Settings</div>

//             {/* Tabs */}
//             <div className="tab-row">
//               <div className={`tab ${activeTab==='upload'?'active':''}`} onClick={() => setActiveTab('upload')}>
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
//                   <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
//                 </svg>
//                 Upload Image
//               </div>
//               <div className={`tab ${activeTab==='ai'?'active':''}`} onClick={() => setActiveTab('ai')}>
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="3"/>
//                   <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
//                 </svg>
//                 Generate with AI
//               </div>
//             </div>

//             {/* Upload zone */}
//             <div
//               className={`upload-zone${isDragging?' drag':''}`}
//               onClick={() => fileInputRef.current.click()}
//               onDragEnter={e=>{e.preventDefault();setIsDragging(true)}}
//               onDragLeave={e=>{e.preventDefault();setIsDragging(false)}}
//               onDragOver={e=>{e.preventDefault();setIsDragging(true)}}
//               onDrop={e=>{e.preventDefault();setIsDragging(false);handleFile(e.dataTransfer.files[0])}}
//             >
//               {imageSrc ? (
//                 <>
//                   <img src={imageSrc} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8,display:'block'}} alt=""/>
//                   <button className="remove-img-btn" onClick={removeImg}>✕ Remove</button>
//                 </>
//               ) : (
//                 <>
//                   <div className="uz-icon">
//                     <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--pink)" strokeWidth="1.5">
//                       <rect x="3" y="3" width="18" height="18" rx="2"/>
//                       <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
//                     </svg>
//                   </div>
//                   <h4 style={{fontSize:14,fontWeight:600,marginBottom:4}}>Change Image</h4>
//                   <p style={{fontSize:12,color:'var(--muted)'}}>Drag &amp; drop or click (1 Credit)</p>
//                 </>
//               )}
//             </div>
//             <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>

//             <div style={{height:14}}/>

//             {/* Preview Mode */}
//             <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
//               <span style={{fontSize:13,fontWeight:600}}>Preview Mode:</span>
//               <div className="mode-toggle">
//                 <button className={`mode-btn${isColorMode?' active':''}`} onClick={() => setIsColorMode(true)}>Color</button>
//                 <button className={`mode-btn${!isColorMode?' active':''}`} onClick={() => setIsColorMode(false)}>Numbers</button>
//               </div>
//             </div>

//             {/* Shape + Cell Size */}
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Shape Type</label>
//                 <select value={S.shapeType} onChange={e=>setS({shapeType:e.target.value})}>
//                   <option>Circles (Packed)</option><option>Rectangle</option>
//                   <option>Circle</option><option>Hexagon</option><option>Triangle</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <div className="slider-row">
//                   <div className="sl-header">
//                     <span className="sl-label">Cell Size</span>
//                     <span className="sl-val">{S.cellSize}px</span>
//                   </div>
//                   <input type="range" min="5" max="80" step="1" value={S.cellSize}
//                     onChange={e=>setS({cellSize:+e.target.value})} style={{marginTop:4}}/>
//                 </div>
//               </div>
//             </div>

//             {/* Margin + Line Width */}
//             <div className="form-row">
//               <div className="slider-row" style={{width:'100%'}}>
//                 <div className="sl-header"><span className="sl-label">Margin</span><span className="sl-val">{S.margin}px</span></div>
//                 <input type="range" min="0" max="100" step="1" value={S.margin} onChange={e=>setS({margin:+e.target.value})}/>
//               </div>
//               <div className="slider-row" style={{width:'100%'}}>
//                 <div className="sl-header"><span className="sl-label">Line Width</span><span className="sl-val">{S.lineWidth.toFixed(1)}px</span></div>
//                 <input type="range" min="0.1" max="5" step="0.1" value={S.lineWidth} onChange={e=>setS({lineWidth:+e.target.value})}/>
//               </div>
//             </div>

//             {/* Number Size + Opacity */}
//             <div className="form-row">
//               <div className="slider-row" style={{width:'100%'}}>
//                 <div className="sl-header"><span className="sl-label">Number Size</span><span className="sl-val">{S.numSize}px</span></div>
//                 <input type="range" min="4" max="40" step="1" value={S.numSize} onChange={e=>setS({numSize:+e.target.value})}/>
//               </div>
//               <div className="slider-row" style={{width:'100%'}}>
//                 <div className="sl-header"><span className="sl-label">Number Opacity</span><span className="sl-val">{S.numOpacity}%</span></div>
//                 <input type="range" min="0" max="100" step="1" value={S.numOpacity} onChange={e=>setS({numOpacity:+e.target.value})}/>
//               </div>
//             </div>

//             {/* Cols + Rows */}
//             <div className="form-row" style={{marginBottom:12}}>
//               <div className="form-group">
//                 <label>Cols (0=Auto)</label>
//                 <input type="number" min="0" value={S.cols} onChange={e=>setS({cols:+e.target.value})}/>
//               </div>
//               <div className="form-group">
//                 <label>Rows (0=Auto)</label>
//                 <input type="number" min="0" value={S.rows} onChange={e=>setS({rows:+e.target.value})}/>
//               </div>
//             </div>

//             {/* Label Font */}
//             <div className="form-group" style={{marginBottom:12}}>
//               <label>Label Font</label>
//               <select value={S.font} onChange={e=>setS({font:e.target.value})}>
//                 <option>Quicksand</option><option>Georgia</option><option>Arial</option>
//                 <option>Verdana</option><option>Courier New</option><option>Times New Roman</option>
//               </select>
//             </div>

//             {/* Bold + Grid + Numbers */}
//             <label className="check-simple">
//               <input type="checkbox" checked={S.bold} onChange={e=>setS({bold:e.target.checked})}/>
//               Bold Text <span style={{fontSize:12,color:'var(--muted)',marginLeft:4,...sampleStyle}}>Sample: 123 ABC</span>
//             </label>
//             <div className="form-row" style={{marginBottom:12}}>
//               <label className="check-simple">
//                 <input type="checkbox" checked={S.showGrid} onChange={e=>setS({showGrid:e.target.checked})}/>
//                 Show Grid
//               </label>
//               <label className="check-simple">
//                 <input type="checkbox" checked={S.showNums} onChange={e=>setS({showNums:e.target.checked})}/>
//                 Show Numbers
//               </label>
//             </div>

//             {/* Show Overlay Outlines */}
//             <div className={`feature-row${S.overlay?' active-blue':''}`} onClick={() => setS({overlay:!S.overlay})} style={{marginBottom:7}}>
//               <div className="feature-row-left">
//                 <div className={`check-box-styled${S.overlay?' checked':''}`}>{S.overlay?'✓':''}</div>
//                 <span>≋</span> Show Overlay Outlines
//               </div>
//               <div style={{display:'flex',alignItems:'center',gap:8}}>
//                 <span style={{fontSize:11,color:'var(--muted)'}}>Opacity: {S.overlayOpacity}%</span>
//                 <input type="range" className="mini" min="0" max="100" value={S.overlayOpacity}
//                   onChange={e=>setS({overlayOpacity:+e.target.value})}
//                   onClick={e=>e.stopPropagation()}/>
//               </div>
//             </div>

//             {/* Dark Background Mode */}
//             <div className={`feature-row${S.dark?' active-dark':''}`} onClick={() => setS({dark:!S.dark})} style={{marginBottom:7}}>
//               <div className="feature-row-left">
//                 <div className={`check-box-styled${S.dark?' checked':''}`}>{S.dark?'✓':''}</div>
//                 <span>🌙</span> Dark Background Mode
//               </div>
//             </div>

//             {/* Dark Design Outlines — edge detection */}
//             <div className={`feature-row${S.darklines?' active-blue':''}`} onClick={() => setS({darklines:!S.darklines})} style={{marginBottom:12}}>
//               <div className="feature-row-left">
//                 <div className={`check-box-styled${S.darklines?' checked':''}`}>{S.darklines?'✓':''}</div>
//                 <span>▦</span> Dark Design Outlines
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="action-row">
//               <button className="btn" onClick={reprocess}>Re-Generate Preview</button>
//               <button className="btn" onClick={() => {
//                 setS({cellSize:19,margin:35,lineWidth:0.9,numSize:14,numOpacity:80,palSize:17,overlay:true,dark:false,darklines:true});
//               }}>Load Demo</button>
//             </div>
//           </div>

//           {/* SECTION 2: COLOR PALETTE */}
//           <div className="section-box">
//             <div className="palette-header">
//               <div className="section-header" style={{marginBottom:0}}>2) Color Palette</div>
//               <div style={{display:'flex',gap:6}}>
//                 <button className="pal-icon-btn" title="Undo" onClick={undoPalette}>↩</button>
//                 <button className="pal-icon-btn" title="Redo" onClick={redoPalette}>↪</button>
//               </div>
//             </div>

//             <div className="auto-detect-row">
//               <label className="check-simple" style={{marginBottom:0}}>
//                 <input type="checkbox" checked={S.autoDetect} onChange={e=>{setS({autoDetect:e.target.checked});if(e.target.checked) scheduleReprocess();}}/>
//                 Auto-Detect Colors
//               </label>
//               <span className="auto-badge">AUTO</span>
//             </div>

//             <div className="slider-row" style={{margin:'10px 0'}}>
//               <div className="sl-header">
//                 <span className="sl-label">Palette Size (K):</span>
//                 <span className="sl-val">{S.palSize}</span>
//               </div>
//               <input type="range" min="2" max="32" step="1" value={S.palSize} onChange={e=>setS({palSize:+e.target.value})}/>
//             </div>

//             <div className="color-grid">
//               {palette.map((p, i) => (
//                 <div key={i} className="color-card">
//                   <div className="color-swatch" style={{background:p.hex}}>
//                     <span className="color-hex">{p.hex}</span>
//                   </div>
//                   <div className="color-info">
//                     <div className="color-num">{numToSymbol(p.num)}</div>
//                     <div className="color-name" title={p.name}>{p.name}</div>
//                     <div className="color-delete" onClick={() => deleteColor(i)}>Delete</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="palette-actions">
//               <button className="btn btn-primary" onClick={addColor}>+ Add Color</button>
//               <button className="btn" onClick={reprocess}>↺ Re-Quantize</button>
//               <button className="btn" onClick={savePalette}>💾 Save Palette</button>
//               <button className="btn" onClick={loadPalette}>📂 Load Palette</button>
//             </div>
//           </div>
//         </div>

//         {/* ═══ RIGHT PANEL ═══ */}
//         <div id="right">

//           {/* Preview header */}
//           <div className="preview-header">
//             <div style={{display:'flex',alignItems:'center',gap:12}}>
//               <span className="preview-title">Mosaic Preview</span>
//               <button
//                 className="interactive-btn"
//                 style={{background: interactiveMode ? 'linear-gradient(135deg,var(--green),var(--green2))' : 'linear-gradient(135deg,var(--pink),var(--pink2))'}}
//                 onClick={() => setInteractiveMode(m => !m)}
//               >
//                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="3"/>
//                   <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
//                 </svg>
//                 Interactive Color
//               </button>
//             </div>
//             <div className="zoom-bar">
//               <button className="zoom-btn" onClick={zoomOut}>−</button>
//               <select className="zoom-sel" value={zoom} onChange={e=>setZoom(+e.target.value)}>
//                 {zoomLevels.map(z => <option key={z} value={z}>{z}</option>)}
//               </select>
//               <span style={{fontSize:12,color:'var(--muted)'}}>%</span>
//               <button className="zoom-btn" onClick={zoomIn}>+</button>
//               <button className="zoom-btn" onClick={() => setZoom(120)} title="Reset">↺</button>
//             </div>
//           </div>

//           {/* Download row with dropdowns */}
//           <div className="dl-row">
//             <span className="dl-label">DOWNLOAD:</span>

//             {/* Color Mode */}
//             <div className="dl-btn-wrap">
//               <button className="dl-btn color-dl" onClick={e=>{e.stopPropagation();setDropdownOpen(d=>d==='color'?null:'color')}}>
//                 Color Mode <span style={{fontSize:10,marginLeft:2}}>▾</span>
//               </button>
//               {dropdownOpen === 'color' && (
//                 <div className="dl-dropdown" onClick={e=>e.stopPropagation()}>
//                   {['PNG','SVG','PDF'].map(fmt => (
//                     <div key={fmt} className="dl-dropdown-item" onClick={() => handleDownload('color', fmt)}>
//                       {fmt} <span className="lock">⬇</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Numbers Mode */}
//             <div className="dl-btn-wrap">
//               <button className="dl-btn numbers-dl" onClick={e=>{e.stopPropagation();setDropdownOpen(d=>d==='numbers'?null:'numbers')}}>
//                 Numbers Mode <span style={{fontSize:10,marginLeft:2}}>▾</span>
//               </button>
//               {dropdownOpen === 'numbers' && (
//                 <div className="dl-dropdown" onClick={e=>e.stopPropagation()}>
//                   {['PNG','SVG','PDF'].map(fmt => (
//                     <div key={fmt} className="dl-dropdown-item" onClick={() => handleDownload('numbers', fmt)}>
//                       {fmt} <span className="lock">⬇</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Legend Only */}
//             <div className="dl-btn-wrap">
//               <button className="dl-btn legend-dl" onClick={e=>{e.stopPropagation();setDropdownOpen(d=>d==='legend'?null:'legend')}}>
//                 Legend Only <span style={{fontSize:10,marginLeft:2}}>▾</span>
//               </button>
//               {dropdownOpen === 'legend' && (
//                 <div className="dl-dropdown" onClick={e=>e.stopPropagation()}>
//                   {['PNG','SVG','PDF'].map(fmt => (
//                     <div key={fmt} className="dl-dropdown-item" onClick={() => handleDownload('legend', fmt)}>
//                       {fmt} <span className="lock">⬇</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Export settings */}
//           <div>
//             <button className="export-settings-btn" onClick={() => {
//               localStorage.setItem('mosaic-settings', JSON.stringify(S));
//               alert('Settings exported to localStorage!');
//             }}>
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="3"/>
//                 <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
//               </svg>
//               Export Settings
//             </button>
//           </div>

//           {/* Canvas area */}
//           <div className="canvas-outer">
//             {spinning && (
//               <div className="spinner-wrap">
//                 <div className="spin-dots">
//                   <div className="sdot"/><div className="sdot"/><div className="sdot"/>
//                 </div>
//                 <p style={{fontSize:13,color:'var(--txt)',fontWeight:500}}>Generating mosaic...</p>
//               </div>
//             )}
//             <div id="canvas-wrap">
//               <div id="canvas-inner" ref={canvasInnerRef} style={{transform:`scale(${zoom/100})`}}>
//                 {!gridData ? (
//                   <div id="empty-state">
//                     <div className="es-icon">🖼️</div>
//                     <p style={{fontSize:14,fontWeight:600,color:'var(--txt)'}}>Upload an image to generate your mosaic</p>
//                     <span style={{fontSize:12,color:'var(--muted)'}}>Supports PNG, JPG, WEBP, GIF</span>
//                   </div>
//                 ) : (
//                   <div
//                     id="mosaic-grid"
//                     style={{
//                       display: 'grid',
//                       gridTemplateColumns: `repeat(${gridData.cols}, ${S.cellSize}px)`,
//                       gridTemplateRows: `repeat(${gridData.rows}, ${S.cellSize}px)`,
//                       padding: S.margin,
//                     }}
//                   >
//                     {renderGridCells()}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Legend */}
//           {palette.length > 0 && (
//             <>
//               <div className="legend-label">Legend Preview</div>
//               <div id="legend-box">
//                 <h3 style={{fontSize:16,fontWeight:700,textAlign:'center',marginBottom:16,fontFamily:'Courier New,monospace',letterSpacing:'.05em',color:var(--pink)}}>Color Legend</h3>
//                 <div id="legend-list">
//                   {palette.map((p, i) => (
//                     <div key={i} className="legend-row">
//                       <div className="legend-swatch" style={{background:p.hex}}/>
//                       <div className="legend-num">{numToSymbol(p.num)}:</div>
//                       <div className="legend-name">{p.name} ({p.hex.toUpperCase()})</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//         </div>
//       </div>

//       <div style={{borderTop:'1px solid var(--border)',background:'#fff',padding:16,textAlign:'center',fontSize:12,color:'var(--muted)'}}>
//         © Gen Color by Number &nbsp;|&nbsp; Created by Amazon KDP community BD
//       </div>
//     </>
//   );
// }