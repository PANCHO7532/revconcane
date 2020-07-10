#!/bin/bash
git add .
git commit -m "P7RND_$(($RANDOM * 50))"
git push origin master
echo "[INFO] - Upload script done!"