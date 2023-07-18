set -e

SCENARIO_NAME=$1
OPENCRVS_CORE_PATH=$2
COUNTRY_CONFIG_PATH=$3

# this function takes in a directory name and traverses from current
# directory all to way to file system root while always checking if the directory exists
# if it does, it returns the absolute path to the directory
# if it doesn't, it returns an empty string

find_directory () {
  local directory=$1
  local current_directory=$(pwd)
  local absolute_path=""

  while [ "$current_directory" != "/" ]; do
    if [ -d "$current_directory/$directory" ]; then
      absolute_path="$current_directory/$directory"
      break
    fi

    current_directory=$(dirname "$current_directory")
  done

  echo "$absolute_path"
}

print_usage_and_exit () {
  echo "Usage: $0 <scenario-name> <core path> <country config path>"
  exit 1
}

if [ -z "$SCENARIO_NAME" ]; then
  print_usage_and_exit
fi

if [ -z "$OPENCRVS_CORE_PATH" ]; then
  EXISTING_OPENCRVS_CORE_PATH=$(find_directory opencrvs-core)
  if [ -d "$EXISTING_OPENCRVS_CORE_PATH" ]; then
    OPENCRVS_CORE_PATH=$EXISTING_OPENCRVS_CORE_PATH
    echo "Automatically detected opencrvs-core at $EXISTING_OPENCRVS_CORE_PATH"
  else
    print_usage_and_exit
  fi
fi

if [ -z "$COUNTRY_CONFIG_PATH" ]; then
  EXISTING_OPENCRVS_FARAJALAND_PATH=$(find_directory opencrvs-farajaland)
  if [ -d "$EXISTING_OPENCRVS_FARAJALAND_PATH" ]; then
    COUNTRY_CONFIG_PATH=$EXISTING_OPENCRVS_FARAJALAND_PATH
    echo "Automatically detected opencrvs-farajaland at $EXISTING_OPENCRVS_FARAJALAND_PATH"
  else
    print_usage_and_exit
  fi
fi

if [ ! -d "scenarios/$SCENARIO_NAME" ]; then
  echo "Scenario '$SCENARIO_NAME' does not exist"
  exit 1
fi

echo "Restoring scenario '$SCENARIO_NAME'"

rm -rf $OPENCRVS_CORE_PATH/data/backups/*

cat scenarios/$SCENARIO_NAME/dataset/*.tar.gz.part.* | tar -xzf - -C $OPENCRVS_CORE_PATH/data/backups
cat $OPENCRVS_CORE_PATH/data/backups/*.tar.gz | tar -xzf - -C $OPENCRVS_CORE_PATH/data/backups

rm -rf $OPENCRVS_CORE_PATH/data/backups/*.tar.gz

# Automatically detect the label
LABEL=$(ls $OPENCRVS_CORE_PATH/data/backups/influxdb | head -n 1)

yes | bash $COUNTRY_CONFIG_PATH/infrastructure/emergency-restore-metadata.sh --label=$LABEL
