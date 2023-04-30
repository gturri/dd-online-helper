#!/bin/bash -e
if [ -L "$0" ] && [ -x "$(which readlink)" ]; then
	THIS_FILE="$(readlink -mn "$0")"
else
	THIS_FILE="$0"
fi
THIS_DIR="$(dirname "$THIS_FILE")"
BIN_DIR="$THIS_DIR/bin"
OAG_JAR="$BIN_DIR/openapi-generator-cli.jar"
OAS_FILE="$THIS_DIR/openapi.yaml"
FRONT_DIR="$THIS_DIR/ddOnlineHelper-angularFront"
CLIENT_DIR="$FRONT_DIR/src/app/generated"
GIT_USER_ID=gturri
GIT_PROJECT=dd-online-helper

if [ ! -e "$OAG_JAR" ]; then
	echo "Downloading openapi-generator-cli jar"
	curl https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.3.0/openapi-generator-cli-6.3.0.jar > "$OAG_JAR"
fi

echo "Generating the client"
java -jar "$OAG_JAR" generate -i "$OAS_FILE" -g typescript-angular -o "$CLIENT_DIR"

echo "building the front"
pushd "$FRONT_DIR"
./build.sh
popd

echo "Generating the server module"
java -jar "$OAG_JAR" generate --git-user-id "$GIT_USER_ID" --git-repo-id "$GIT_PROJECT" -i "$OAS_FILE" -g php-symfony -o "$THIS_DIR/generated/php-server-bundle"
