#!/bin/bash

if ["$POCKETBASE_PORT" -eq ""]
then
    POCKETBASE_PORT=8080
fi

echo hi!
echo $POCKETBASE_PORT


./pocketbase serve --http 0.0.0.0:8080