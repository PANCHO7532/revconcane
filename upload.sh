#!/bin/bash
rnd="$RANDOM"
echo $rnd
git add . && git commit -m $rnd
git push origin master
echo "[INFO] - Upload script done!"