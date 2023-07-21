# Registrar login

This test measures the time it takes a registrar to

1. Load the login page
2. Go through the credentials + 2fa flows
3. Have OpenCRVS in fully functional state

It's important to note, that this test should be ran against either a production build of OpenCRVS running locally or a deployed environment. This is because in the development environment the files are not compressed or bundled like they would be in production.

You can use this command to run this test against any OpenCRVS deployment

```
HOSTNAME=farajaland-qa.opencrvs.org yarn run-scenario registrar-login
```

## Useful metrics to look at

### Sum of `data_received`

This will give you a rough understanding of how much data the browser needs to download to have the application ready. Currently, in Farajaland QA that number is 18 057 349 B, so 18MB. Using that figure, we can calculate the following total download times for different connections speeds.

| Network type | Network speed | Total time downloading (seconds) |
| ------------ | ------------- | -------------------------------- |
| Modem        | 28,8 kbit/s   | 5015                             |
| Modem        | 56,6 kbit/s   | 2552                             |
| ADSL         | 256 kbit/s    | 564                              |
| ADSL         | 512 kbit/s    | 282                              |
| ADSL         | 1 Mbit/s      | 141                              |
| ADSL         | 2 Mbit/s      | 70                               |
| ADSL         | 8 Mbit/s      | 17                               |
| ADSL         | 24 Mbit/s     | 5                                |
| LAN          | 10 Mbit/s     | 14                               |
| LAN          | 100 Mbit/s    | 1                                |
| Turbo 3G     | 7,2 Mbit/s    | 19                               |
| 4G           | 80 Mbit/s     | 1                                |
| 5G           | 1 Gbit/s      | 0                                |
