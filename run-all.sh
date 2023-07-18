set -e
WORKING_DIR=$(pwd)

mkdir -p $WORKING_DIR/results

for SCENARIO_PATH in scenarios/*; do
  SCENARIO=$(basename $SCENARIO_PATH)
  yarn restore-scenario $SCENARIO /Users/riku/Code/OpenCRVS/opencrvs-core /Users/riku/Code/OpenCRVS/opencrvs-farajaland
  k6 run $SCENARIO_PATH/index.js --out csv=$WORKING_DIR/results/$SCENARIO.csv
done
