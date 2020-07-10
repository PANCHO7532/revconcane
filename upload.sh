#!/bin/bash
git add .
git commit -m "P7RND_$(($RANDOM*2))"
git push origin master
echo "[INFO] - Upload script done!"