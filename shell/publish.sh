#/usr/bin/env sh

rm -rf ../galaxy-warwolf.github.io/*

cp -r dist/* ../galaxy-warwolf.github.io

cd ../galaxy-warwolf.github.io

git commit -am "New Demo Version."

git push origin master
