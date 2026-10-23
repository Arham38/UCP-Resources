import JSZip from "jszip";
import type { ParsedSlide } from "./types";

function getSlideNumber(path: string) {
  const match = path.match(/ppt\/slides\/slide(\d+)\.xml$/);
  return match ? Number(match[1]) : 0;
}

export async function parsePPTX(file: File): Promise<ParsedSlide[]> {
  if (!file.name.toLowerCase().endsWith(".pptx")) {
    throw new Error("Only .pptx files are supported.");
  }

  if (file.size > 20 * 1024 * 1024) {
    throw new Error("File size must be 20MB or less.");
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
    .sort((a, b) => getSlideNumber(a) - getSlideNumber(b));

  const slides = await Promise.all(
    slideFiles.map(async (path) => {
      const xml = await zip.files[path].async("string");
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const text = Array.from(doc.getElementsByTagName("a:t"))
        .map((node) => node.textContent ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        slideNumber: getSlideNumber(path),
        rawText: text
      };
    })
  );

  return slides.filter((slide) => slide.rawText.length >= 10);
}
