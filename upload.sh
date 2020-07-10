#!/bin/sh
echo "[INFO] - Actual dir " pwd;
git add .
git commit -m "$RANDOM"
git push origin master
echo "[INFO] - Upload script done!"