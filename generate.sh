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
GENERATED_DIR="$THIS_DIR/generated"
CLIENT_DIR="$GENERATED_DIR/angular-client"
FRONT_DIR="$THIS_DIR/ddOnlineHelper-angularFront"
GIT_USER_ID=gturri
GIT_PROJECT=dd-online-helper

if [ ! -e "$OAG_JAR" ]; then
	echo "Downloading openapi-generator-cli jar"
	curl https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.3.0/openapi-generator-cli-6.3.0.jar > "$OAG_JAR"
fi

echo "Generating the client"
java -jar "$OAG_JAR" generate -i "$OAS_FILE" -g typescript-angular -o "$CLIENT_DIR" -p npmName=ddOnlineHelperClient

echo "Building the client"
pushd "$CLIENT_DIR"
npm install
npm run build
cd dist
npm link
popd

echo "building the front"
pushd "$FRONT_DIR"
npm link ddOnlineHelperClient
./"$FRONT_DIR/build.sh"
popd

echo "Generating the server module"
java -jar "$OAG_JAR" generate --git-user-id "$GIT_USER_ID" --git-repo-id "$GIT_PROJECT" -i "$OAS_FILE" -g php-symfony -o "$GENERATED_DIR/php-server-bundle"
