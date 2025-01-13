const fs = require("fs");
const path = require("path");
const glob = require("glob");

const SVG_DIR = "public/assets/svg";

// Class to represent a rectangle
class Rectangle {
    constructor(x, y, width, height, fill) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill = fill;
    }

    // Check if this rectangle can be merged horizontally with another
    canMergeHorizontal(other) {
        return (
            this.fill === other.fill &&
            this.y === other.y &&
            this.height === other.height &&
            this.x + this.width === other.x
        );
    }

    // Check if this rectangle can be merged vertically with another
    canMergeVertical(other) {
        return (
            this.fill === other.fill &&
            this.x === other.x &&
            this.width === other.width &&
            this.y + this.height === other.y
        );
    }

    // Merge with another rectangle horizontally
    mergeHorizontal(other) {
        this.width += other.width;
        return this;
    }

    // Merge with another rectangle vertically
    mergeVertical(other) {
        this.height += other.height;
        return this;
    }

    // Convert to SVG rect element string
    toSVG() {
        return `  <rect x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" fill="${this.fill}" shape-rendering="crispEdges"/>`;
    }
}

function parseRectangles(svgContent) {
    const rectangles = [];
    const rectRegex = /<rect[^>]+>/g;
    const attrRegex = /(\w+)="([^"]+)"/g;

    let match;
    while ((match = rectRegex.exec(svgContent)) !== null) {
        const rect = match[0];
        const attrs = {};
        let attrMatch;
        while ((attrMatch = attrRegex.exec(rect)) !== null) {
            attrs[attrMatch[1]] = attrMatch[2];
        }
        rectangles.push(
            new Rectangle(
                parseInt(attrs.x),
                parseInt(attrs.y),
                parseInt(attrs.width),
                parseInt(attrs.height),
                attrs.fill
            )
        );
    }

    return rectangles;
}

function optimizeRectangles(rectangles) {
    let optimized = [...rectangles];
    let madeChanges;

    // First pass: merge horizontally
    do {
        madeChanges = false;
        const newOptimized = [];
        let i = 0;
        while (i < optimized.length) {
            let current = optimized[i];
            let j = i + 1;
            while (
                j < optimized.length &&
                current.canMergeHorizontal(optimized[j])
            ) {
                current = current.mergeHorizontal(optimized[j]);
                j++;
                madeChanges = true;
            }
            newOptimized.push(current);
            i = j;
        }
        optimized = newOptimized;
    } while (madeChanges);

    // Second pass: merge vertically
    do {
        madeChanges = false;
        const newOptimized = [];
        let i = 0;
        while (i < optimized.length) {
            let current = optimized[i];
            let j = i + 1;
            while (
                j < optimized.length &&
                current.canMergeVertical(optimized[j])
            ) {
                current = current.mergeVertical(optimized[j]);
                j++;
                madeChanges = true;
            }
            newOptimized.push(current);
            i = j;
        }
        optimized = newOptimized;
    } while (madeChanges);

    return optimized;
}

function optimizeSVG(inputFile) {
    console.log(`Optimizing ${inputFile}...`);

    // Read SVG file
    const svgContent = fs.readFileSync(inputFile, "utf8");

    // Extract width, height, and viewBox
    const dimensionMatch = svgContent.match(
        /width="(\d+)" height="(\d+)" viewBox="([^"]+)"/
    );
    if (!dimensionMatch) return;

    const [, width, height, viewBox] = dimensionMatch;

    // Parse rectangles
    const rectangles = parseRectangles(svgContent);
    const originalCount = rectangles.length;

    // Optimize rectangles
    const optimized = optimizeRectangles(rectangles);

    // Create new SVG content
    const newSvgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
${optimized.map((rect) => rect.toSVG()).join("\n")}
</svg>`;

    // Write optimized SVG
    fs.writeFileSync(inputFile, newSvgContent);

    const reduction = (
        ((originalCount - optimized.length) / originalCount) *
        100
    ).toFixed(1);
    console.log(
        `  Reduced rectangles from ${originalCount} to ${optimized.length} (${reduction}% reduction)`
    );
}

function processAllFiles() {
    // Find all SVG files
    const files = glob.sync("**/*.svg", { cwd: SVG_DIR });

    for (const file of files) {
        const inputFile = path.join(SVG_DIR, file);
        optimizeSVG(inputFile);
    }

    console.log("Optimization complete!");
}

processAllFiles();

