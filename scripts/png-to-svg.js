const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const glob = require("glob");

const SPUM_DIR = "public/assets/spum";
const OUTPUT_DIR = "public/assets/svg";

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Convert RGBA to hex color with alpha
function rgbaToHex(r, g, b, a) {
    const alpha = Math.round((a / 255) * 100) / 100;
    return `rgba(${r},${g},${b},${alpha})`;
}

async function convertPngToSvg(inputFile, outputFile) {
    // Load the image
    const image = await loadImage(inputFile);
    const width = image.width;
    const height = image.height;

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Start SVG content
    let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
`;

    // Process each pixel
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const a = pixels[idx + 3];

            // Skip fully transparent pixels
            if (a === 0) continue;

            // Create rectangle for this pixel
            const color = rgbaToHex(r, g, b, a);
            svgContent += `  <rect x="${x}" y="${y}" width="1" height="1" fill="${color}" shape-rendering="crispEdges"/>\n`;
        }
    }

    // Close SVG
    svgContent += "</svg>";

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write SVG file
    fs.writeFileSync(outputFile, svgContent);
    console.log(`Converted ${inputFile} to ${outputFile}`);
}

async function processAllFiles() {
    // Find all PNG files
    const files = glob.sync("**/*.png", { cwd: SPUM_DIR });

    for (const file of files) {
        const inputFile = path.join(SPUM_DIR, file);
        const outputFile = path.join(OUTPUT_DIR, file.replace(".png", ".svg"));
        await convertPngToSvg(inputFile, outputFile);
    }

    console.log("Conversion complete!");
}

processAllFiles().catch(console.error);

