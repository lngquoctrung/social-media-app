#!/bin/sh
set -e

# Check if public folder is empty or defaults missing
if [ ! -f "/app/public/defaults/avatar.jpg" ]; then
    echo "Initializing public folder..."
    cp -rn /app/public_template/* /app/public/
fi

exec "$@"
