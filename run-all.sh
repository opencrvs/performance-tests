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
  K6_BROWSER_ENABLED=true k6 run $SCENARIO_PATH/index.js --out csv=$WORKING_DIR/results/$SCENARIO.csv
done
