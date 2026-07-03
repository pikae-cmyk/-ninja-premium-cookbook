const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 48;
const LINE_HEIGHT = 16;
const BODY_SIZE = 11;
const TITLE_SIZE = 24;
const SUBTITLE_SIZE = 10;
let activePdfUrl = "";

export function downloadShoppingPdf(items, options = {}) {
  if (!items.length) {
    window.alert("Bitte fuege zuerst Zutaten zur Einkaufsliste hinzu.");
    return null;
  }

  const bytes = createShoppingPdfBytes(items, options);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const fileName = pdfFileName(options.date ?? new Date());

  if (activePdfUrl) {
    URL.revokeObjectURL(activePdfUrl);
  }

  const url = URL.createObjectURL(blob);
  activePdfUrl = url;
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  return { fileName, url };
}

export function createShoppingPdfBytes(items, options = {}) {
  const date = options.date ?? new Date();
  const title = options.title ?? "Ninja Premium Cookbook";
  const subtitle = `${formatDate(date)} · ${items.length} Zutaten`;
  const pages = paginate(linesForItems(items));
  const objects = [];
  const pageRefs = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(null);
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  pages.forEach((lines, index) => {
    const content = pageContent(lines, {
      page: index + 1,
      pages: pages.length,
      subtitle,
      title,
    });
    const pageRef = objects.length + 1;
    const contentRef = objects.length + 2;
    pageRefs.push(`${pageRef} 0 R`);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4.width} ${A4.height}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentRef} 0 R >>`,
    );
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pageRefs.length} >>`;

  return pdfBytes(objects);
}

function linesForItems(items) {
  return items.flatMap((item) => wrapLine(`${item.amountLabel} ${item.name}`.trim(), 82));
}

function paginate(lines) {
  const maxLines = 42;
  const pages = [];
  for (let index = 0; index < lines.length; index += maxLines) {
    pages.push(lines.slice(index, index + maxLines));
  }
  return pages.length ? pages : [[]];
}

function pageContent(lines, meta) {
  const commands = [
    "0.067 0.094 0.153 rg",
    text(meta.title, MARGIN, A4.height - 64, TITLE_SIZE),
    "0.843 0.631 0.290 rg",
    text(meta.subtitle, MARGIN, A4.height - 84, SUBTITLE_SIZE),
    "0.90 0.87 0.82 RG 1 w",
    `48 ${A4.height - 104} m ${A4.width - 48} ${A4.height - 104} l S`,
    "0.067 0.094 0.153 rg",
  ];

  let y = A4.height - 132;
  lines.forEach((line) => {
    commands.push(text(`[ ] ${line}`, MARGIN, y, BODY_SIZE));
    y -= LINE_HEIGHT;
  });

  commands.push(
    "0.40 0.44 0.52 rg",
    text(`Seite ${meta.page} / ${meta.pages}`, MARGIN, 38, 9),
    text("Offline erzeugt · GitHub Pages kompatibel", A4.width - 214, 38, 9),
  );

  return `${commands.join("\n")}\n`;
}

function text(value, x, y, size) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${escapePdfText(value)}) Tj ET`;
}

function wrapLine(value, maxLength) {
  const words = asciiText(value).split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxLength) {
      line = candidate;
      return;
    }
    if (line) lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  return lines;
}

function escapePdfText(value) {
  return asciiText(value).replace(/[\\()]/g, "\\$&");
}

function asciiText(value) {
  return String(value)
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/·/g, "-")
    .replace(/°/g, " Grad")
    .replace(/[^\x20-\x7e]/g, "");
}

function pdfBytes(objects) {
  const encoder = new TextEncoder();
  const parts = ["%PDF-1.4\n"];
  const offsets = [0];
  let cursor = parts[0].length;

  objects.forEach((object, index) => {
    offsets.push(cursor);
    const serialized = `${index + 1} 0 obj\n${object}\nendobj\n`;
    parts.push(serialized);
    cursor += serialized.length;
  });

  const xrefOffset = cursor;
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    "0000000000 65535 f \n",
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`),
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  ].join("");
  parts.push(xref);

  return encoder.encode(parts.join(""));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function pdfFileName(date) {
  const stamp = date.toISOString().slice(0, 10);
  return `ninja-einkaufsliste-${stamp}.pdf`;
}
