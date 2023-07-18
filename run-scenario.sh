set -e
WORKING_DIR=$(pwd)

trap trapint SIGINT SIGTERM
function trapint {
  exit 0
}

mkdir -p $WORKING_DIR/results

SCENARIO=$1
yarn restore-scenario $SCENARIO
for TEST_PATH in build/scenarios/$SCENARIO/*.js; do
  TEST=$(basename $TEST_PATH)
  K6_BROWSER_ENABLED=true k6 run $TEST_PATH --out csv=$WORKING_DIR/results/$SCENARIO-$TEST.csv
done
