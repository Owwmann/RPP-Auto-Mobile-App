#!/bin/bash

# ============================================================
# RPP Auto - Owner Synchronization Script
# Target Owner: Lewis Gray (lewisgray)
# ============================================================

set -e

echo "🔄 Starting owner synchronization..."

# 1. Update package.json
if [ -f "package.json" ]; then
  # Update Author
  sed -i.bak 's/"author": ".*"/"author": "Lewis Gray"/g' package.json
  # Update Repository URLs (replacing Owwmann with LewisGray)
  sed -i.bak 's/Owwmann\/RPP-Auto-Mobile-App/LewisGray\/RPP-Auto-Mobile-App/g' package.json
  sed -i.bak 's/github.com\/Owwmann/github.com\/LewisGray/g' package.json
  rm package.json.bak 2>/dev/null || true
  echo "✅ Updated package.json"
fi

# 2. Update README.md and EXPO_SETUP.md
for file in "README.md" "EXPO_SETUP.md"; do
  if [ -f "$file" ]; then
    sed -i.bak 's/Owwmann/LewisGray/g' "$file"
    sed -i.bak 's/owwmann/lewisgray/g' "$file"
    sed -i.bak 's/@owwmann/@lewisgray/g' "$file"
    rm "$file".bak 2>/dev/null || true
    echo "✅ Updated $file"
  fi
done

# 3. Update GitHub Workflows
if [ -d ".github/workflows" ]; then
  find .github/workflows -type f \( -name "*.yml" -o -name "*.yaml" \) -exec sed -i.bak 's/Owwmann/LewisGray/g' {} \;
  find .github/workflows -type f \( -name "*.yml" -o -name "*.yaml" \) -exec sed -i.bak 's/owwmann/lewisgray/g' {} \;
  find .github/workflows -name "*.bak" -delete
  echo "✅ Updated GitHub workflows"
fi

echo "🔄 Synchronization of text references complete."