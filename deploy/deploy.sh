#!/bin/bash
echo "Deploy script running."

directory=$(dirname "$0")
cd "$directory"/.. || exit