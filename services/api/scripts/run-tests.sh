#!/usr/bin/env bash
set -e

echo "=> Starting database"
docker-compose down # Make sure database is down
docker-compose --profile integration-test up --remove-orphans -d

echo "=> Waiting for database to start"
wait-on tcp:5432

echo "=> Migrating database"
env-cmd -f ./env/.env.test sls invoke local -f migrate --data "{ \"type\": \"latest\" }"

echo "=> Seed database"
env-cmd -f ./env/.env.test serverless invoke local -f seed

set +e
echo "=> Running tests"
NODE_NO_WARNINGS=1 NODE_OPTIONS=--experimental-vm-modules env-cmd -f ./env/.env.test jest --detectOpenHandles
set -e
RESULT=$?

echo "=> Stopping database"
docker-compose down

exit $RESULT
