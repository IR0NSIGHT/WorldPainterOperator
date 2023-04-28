#!/bin/bash

# Define the paths to the header and bundle files
header="src/header.js"
bundle="dist/AdvancedOperator/AdvancedOperator.js"

# Create a temporary file for the updated bundle
tmpfile=$(mktemp)

# Prepend the header to the bundle
cat "$header" "$bundle" > "$tmpfile"

# Replace the original bundle with the updated version
mv "$tmpfile" "$bundle"
