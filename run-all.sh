set -e
WORKING_DIR=$(pwd)

trap "exit" INT

rm -rf $WORKING_DIR/results/*
mkdir -p $WORKING_DIR/results

for SCENARIO_PATH in build/scenarios/*; do
  SCENARIO=$(basename $SCENARIO_PATH)
  yarn restore-scenario $SCENARIO
  for TEST_PATH in build/scenarios/$SCENARIO/*.js; do
    TEST=$(basename $TEST_PATH)
    TEST_NAME="${TEST%%.*}"
    K6_BROWSER_ENABLED=true k6 run $SCENARIO_PATH/$TEST --out csv=$WORKING_DIR/results/$SCENARIO-$TEST_NAME.csv
  done
done
