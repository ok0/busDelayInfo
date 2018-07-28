#!/bin/bash

for cnt in {0..6}
do
	curl -XGET localhost:3000/call/station
	sleep 10
done
