#!/bin/bash
set -e

echo "PATH: " + $PATH

# Build app.js.
pushd ../app
npm install
grunt build
popd
