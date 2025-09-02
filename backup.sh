#!/bin/bash

# 🚀 Chatbot Beta - Backup Script
# This script creates backups of configurations and data

echo "🚀 Creating Chatbot Beta Backup..."
echo "=================================================="

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="chatbot_beta_backup_$TIMESTAMP"
FULL_BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "🔧 Creating backup: $BACKUP_NAME"
echo "📁 Backup location: $FULL_BACKUP_PATH"

# Create backup directory
mkdir -p $FULL_BACKUP_PATH

# Backup configuration files
echo "🔧 Backing up configuration files..."
cp -r configs/ $FULL_BACKUP_PATH/
cp -r backend/templates/ $FULL_BACKUP_PATH/
cp .env $FULL_BACKUP_PATH/
cp .env.template $FULL_BACKUP_PATH/

# Backup YAML files
echo "🔧 Backing up YAML files..."
find . -name "*.yaml" -o -name "*.yml" | while read file; do
    if [ -f "$file" ]; then
        mkdir -p "$FULL_BACKUP_PATH/$(dirname "$file")"
        cp "$file" "$FULL_BACKUP_PATH/$file"
    fi
done

# Backup Python files
echo "🔧 Backing up Python files..."
cp tester_dashboard.py $FULL_BACKUP_PATH/
cp -r utils/ $FULL_BACKUP_PATH/ 2>/dev/null || true
cp -r core/ $FULL_BACKUP_PATH/ 2>/dev/null || true

# Backup documentation
echo "🔧 Backing up documentation..."
cp *.md $FULL_BACKUP_PATH/ 2>/dev/null || true
cp -r docs/ $FULL_BACKUP_PATH/ 2>/dev/null || true

# Backup assets
echo "🔧 Backing up assets..."
cp -r assets/ $FULL_BACKUP_PATH/ 2>/dev/null || true
cp *.gif $FULL_BACKUP_PATH/ 2>/dev/null || true
cp *.png $FULL_BACKUP_PATH/ 2>/dev/null || true
cp *.jpg $FULL_BACKUP_PATH/ 2>/dev/null || true

# Create backup manifest
echo "🔧 Creating backup manifest..."
cat > $FULL_BACKUP_PATH/BACKUP_MANIFEST.txt << EOF
Chatbot Beta Backup Manifest
============================
Backup Date: $(date)
Backup Name: $BACKUP_NAME
Backup Location: $FULL_BACKUP_PATH

Files Included:
$(find $FULL_BACKUP_PATH -type f | sort)

Directories Included:
$(find $FULL_BACKUP_PATH -type d | sort)

Backup Size: $(du -sh $FULL_BACKUP_PATH | cut -f1)

Restore Instructions:
1. Stop the chatbot service
2. Copy files from backup to original locations
3. Restart the chatbot service
4. Verify functionality

Created by: backup.sh
EOF

# Create compressed backup
echo "🔧 Creating compressed backup..."
cd $BACKUP_DIR
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
cd ..

# Calculate backup size
BACKUP_SIZE=$(du -sh $FULL_BACKUP_PATH | cut -f1)
COMPRESSED_SIZE=$(du -sh "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)

# Clean up uncompressed backup
echo "🔧 Cleaning up uncompressed backup..."
rm -rf $FULL_BACKUP_PATH

# List recent backups
echo ""
echo "📊 Recent Backups:"
echo "=================================================="
ls -la $BACKUP_DIR/*.tar.gz | tail -5

echo ""
echo "🎉 Backup Complete!"
echo "=================================================="
echo "📁 Backup Name: $BACKUP_NAME"
echo "📦 Compressed File: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
echo "📏 Original Size: $BACKUP_SIZE"
echo "🗜️  Compressed Size: $COMPRESSED_SIZE"
echo "📅 Created: $(date)"
echo ""
echo "🔧 Restore Commands:"
echo "   Extract: tar -xzf $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
echo "   View Contents: tar -tzf $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
echo "   List Backups: ls -la $BACKUP_DIR/"
echo ""
echo "⚠️  Remember to test restore functionality regularly!"
echo "=================================================="

