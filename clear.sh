set -eu


cd chess-client
rm .next node_modules -rf
cd ..

cd chess-engine
rm dist node_modules -rf
cd ..

cd chess-server
rm dist node_modules -rf
cd ..

cd chess-utils
rm dist node_modules -rf
cd ..

cd eslint-config-chess
rm node_modules -rf
cd ..

cd eslint-config-chess-legacy
rm node_modules -rf
cd ..
