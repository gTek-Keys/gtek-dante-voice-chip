#!/bin/bash
set -e

BACKUP_DIR="$HOME/AppBackups"

echo "♻️  Restoring Mac App Store app data..."
echo "➡ From $BACKUP_DIR"

for APP_BACKUP in "$BACKUP_DIR"/*; do
  APP_NAME=$(basename "$APP_BACKUP")
  APP_PATH="/Applications/$APP_NAME.app"

  # Skip if app not reinstalled yet
  if [ ! -d "$APP_PATH" ]; then
    echo "⏩ Skipping $APP_NAME (not installed in /Applications/)"
    continue
  fi

  echo ""
  echo "🔹 Restoring: $APP_NAME"

  # Application Support
  if [ -d "$APP_BACKUP/$APP_NAME" ]; then
    cp -R "$APP_BACKUP/$APP_NAME" "$HOME/Library/Application Support/" || true
    echo "   ✔ Application Support"
  fi

  # Preferences
  for PLIST in "$APP_BACKUP"/*.plist; do
    [ -e "$PLIST" ] || continue
    cp "$PLIST" "$HOME/Library/Preferences/" || true
    echo "   ✔ Preferences"
  done

  # Containers
  for CONTAINER in "$APP_BACKUP"/*; do
    if [[ "$CONTAINER" == *".plist" ]] || [[ "$CONTAINER" == *"$APP_NAME" ]]; then
      continue
    fi
    if [ -d "$CONTAINER" ]; then
      BASENAME=$(basename "$CONTAINER")
      cp -R "$CONTAINER" "$HOME/Library/Containers/$BASENAME" || true
      echo "   ✔ Containers"
    fi
  done
done

echo ""
echo "✅ Restore complete! Relaunch apps to verify data."
