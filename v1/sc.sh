#!/bin/bash
echo "=====begin restart======"
cd /root/app/geektomato
npm run stop
sleep(8)
npm run stop
wait
npm run start
echo "=====begin restart end======"
exit 0
