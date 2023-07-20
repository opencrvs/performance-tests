# OpenCRVS Performance tests

This package contains a test harness for testing the performance of various OpenCRVS features. The primary design principle is to keep the tests as simple, focused and small as possible. This allow us to easily interpret the results and compare between OpenCRVS versions. For the most reliable and reproducable results, it's better to focus on testing let say, the auth endpoint instead of testing the whole login flow. For example

If we know it **takes a 10Kb payload** to login and the endpoint **returns a 20Kb payload** after **processing the request for 1.5 seconds**, we can derive the following table

| Network type | Network speed | Time uploading and downloading (seconds) | Total time (seconds) |
| ------------ | ------------- | ---------------------------------------- | -------------------- |
| Modem        | 28,8 kbit/s   | 1.041666667                              | 2.541666667          |
| Modem        | 56,6 kbit/s   | 0.5300353357                             | 2.030035336          |
| ADSL         | 256 kbit/s    | 0.1171875                                | 1.6171875            |
| ADSL         | 512 kbit/s    | 0.05859375                               | 1.55859375           |
| ADSL         | 1 Mbit/s      | 0.029296875                              | 1.529296875          |
| ADSL         | 2 Mbit/s      | 0.0146484375                             | 1.514648438          |
| ADSL         | 8 Mbit/s      | 0.003662109375                           | 1.503662109          |
| ADSL         | 24 Mbit/s     | 0.001220703125                           | 1.501220703          |
| LAN          | 10 Mbit/s     | 0.0029296875                             | 1.502929688          |
| LAN          | 100 Mbit/s    | 0.00029296875                            | 1.500292969          |
| Turbo 3G     | 7,2 Mbit/s    | 0.004069010417                           | 1.50406901           |
| 4G           | 80 Mbit/s     | 0.0003662109375                          | 1.500366211          |
| 5G           | 1 Gbit/s      | 0.000029296875                           | 1.500029297          |

Read more about different test scenarios and how to interpret the results under the `scenarios` directory.

## Scenario datasets

Scenarios define OpenCRVS and its database in a specific state. Each scenario contains a dataset that is a backup taken from a locally running OpenCRVS instance that has been set up to have the number of records needed for the test.

New scenarios can be created from any database state by creating a backup

```
bash infrastructure/emergency-backup-metadata.sh
```

using the script in OpenCRVS Farajaland repository. Note that the output .tar.gz needs to split to chunks of <2GB. In most cases the package shouldn't be more than 100Mb of size. Please ensure your minio & backup directories are empty before starting to create a scenario.

## Installation

1. Install Git LFS. On MacOS the installation should be

`brew install git-lfs`

Once the command succeeds, run `git lfs install`.

You can read more about installation [here](https://git-lfs.com/).

2. Install k6

```
brew install k6
```

3. Install dependencies

```
yarn
```

4. Run tests locally

```
yarn start
```

### Why are datasets split into chunks of 2GB

Github Large File storage has an upper limit of 2GB for organisations using Github Free. You can read about it [here](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage).

Tars generated by emergency backup script are split with the `split` command. Read about how to use it [here](https://unix.stackexchange.com/questions/61774/create-a-tar-archive-split-into-blocks-of-a-maximum-size).

If you are adding a new dataset zip, split it first by doing

```
tar -zcvf - filename.tar.gz | split -b 1900m - filename.tar.gz.part.
```
