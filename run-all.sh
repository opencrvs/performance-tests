set -e
WORKING_DIR=$(pwd)

trap trapint SIGINT SIGTERM
function trapint {
  exit 0
}

mkdir -p $WORKING_DIR/results

for SCENARIO_PATH in build/scenarios/*; do
  SCENARIO=$(basename $SCENARIO_PATH)
  yarn restore-scenario $SCENARIO
  for TEST_PATH in build/scenarios/$SCENARIO/*.js; do
    TEST=$(basename $TEST_PATH)
    K6_BROWSER_ENABLED=true k6 run $SCENARIO_PATH/$TEST --out csv=$WORKING_DIR/results/$SCENARIO-$TEST.csv
  done
done
