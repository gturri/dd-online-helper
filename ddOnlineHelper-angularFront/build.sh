#!/bin/bash -ex
if [ -L "$0" ] && [ -x "$(which readlink)" ]; then
	THIS_FILE="$(readlink -mn "$0")"
else
	THIS_FILE="$0"
fi
THIS_DIR="$(dirname "$THIS_FILE")"
PHP_PUBLIC_PATH="$THIS_DIR/../php-server/public"

cd "$THIS_DIR"
ng build --configuration=fr
rm -rf "$PHP_PUBLIC_PATH"/{index.html,main.*.js,polyfills.*.js,runtime.*.js,styles.*.css,*map,fr}
cp -r dist/dd-online-helper-angular-front/* "$PHP_PUBLIC_PATH"
