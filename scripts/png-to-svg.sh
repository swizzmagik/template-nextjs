#!/bin/bash

# Directory containing PNG files
SPUM_DIR="public/assets/spum"
OUTPUT_DIR="public/assets/svg"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to convert PNG to SVG while preserving pixel-perfect edges and colors
convert_to_svg() {
    local input_file="$1"
    local output_file="$2"
    
    # Convert PNG directly to SVG using ImageMagick
    # -scale 100% ensures no anti-aliasing
    # -depth 8 maintains color depth
    magick convert "$input_file" \
        -scale 100% \
        -depth 8 \
        -background none \
        -define vector:approximate-vertices=false \
        "$output_file"
}

# Find all PNG files and convert them
find "$SPUM_DIR" -name "*.png" | while read -r file; do
    # Create corresponding output path
    relative_path="${file#$SPUM_DIR/}"
    output_file="$OUTPUT_DIR/${relative_path%.png}.svg"
    
    # Create output directory structure
    mkdir -p "$(dirname "$output_file")"
    
    echo "Converting $file to $output_file"
    convert_to_svg "$file" "$output_file"
done

echo "Conversion complete!" 