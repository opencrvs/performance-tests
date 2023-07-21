set -e
WORKING_DIR=$(pwd)

trap "exit" INT

mkdir -p $WORKING_DIR/results

SCENARIO=$1

if [[ "$SCENARIO" == *"/"* ]]; then
  for TEST_PATH in build/scenarios/$SCENARIO.js; do
    TEST=$(basename $TEST_PATH)
    SCENARIO=$(basename $(dirname $TEST_PATH))
    TEST_NAME="${TEST%%.*}"
    K6_BROWSER_ENABLED=true k6 run $TEST_PATH --out csv=$WORKING_DIR/results/$SCENARIO-$TEST_NAME.csv
  done
else
  for TEST_PATH in build/scenarios/$SCENARIO/*.js; do
    TEST=$(basename $TEST_PATH)
    TEST_NAME="${TEST%%.*}"
    K6_BROWSER_ENABLED=true k6 run $TEST_PATH --out csv=$WORKING_DIR/results/$SCENARIO-$TEST_NAME.csv
  done
fi

