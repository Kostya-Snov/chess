set -eu


DEBUG_FILE_PATH=dist/debug.log
SERVER_HOST=
SERVER_PORT=

DEFAULT_SERVER_HOST=localhost
DEFAULT_SERVER_PORT=3001


cd eslint-config-chess-legacy
npm i
cd ..

cd eslint-config-chess
npm i
cd ..

cd chess-utils
npm i
npm run build
cd ..

cd chess-engine
npm i
npm run build
cd ..

cd chess-server
npm i
npm run build
if [[ -n $DEBUG_FILE_PATH ]]; then
    echo DEBUG_FILE_PATH=$DEBUG_FILE_PATH >> .env
fi
if [[ -n $SERVER_HOST ]]; then
    echo SERVER_HOST=$SERVER_HOST >> .env
fi
if [[ -n $SERVER_PORT ]]; then
    echo SERVER_PORT=$SERVER_PORT >> .env
fi
cd ..

cd chess-client
npm i
echo `
    `NEXT_PUBLIC_SERVER_URL=ws://`
    `${SERVER_HOST:-$DEFAULT_SERVER_HOST}`
    `:${SERVER_PORT:-$DEFAULT_SERVER_PORT} \
    >> .env
cd ..
