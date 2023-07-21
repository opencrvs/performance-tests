# 1500 records in the database

Purpose of these tests is to verify OpenCRVS stays performant even when there are a number of records in the database. 1500 records is not much but it should give us a comparison point to an empty database.

## Search by tracking id

This test measures how long it takes for the server to process a request searching a record with by a tracking id.
`http_req_waiting` metric (ms) is used to determine this across the iterations. You can read an explanation of this metric [here](https://community.k6.io/t/clarification-for-http-req-sending-and-http-req-receiving-metrics/2162/2).

**Limits**

```
http_req_waiting < 5000ms
```

| metric           | metric_value (ms) |
| ---------------- | ----------------- |
| http_req_waiting | 78.472            |
| http_req_waiting | 16.195            |
| http_req_waiting | 38.303            |
| http_req_waiting | 20.181            |
| http_req_waiting | 16.112            |
| http_req_waiting | 16.94             |
| http_req_waiting | 16.715            |
| http_req_waiting | 18.52             |
| http_req_waiting | 15.66             |
| http_req_waiting | 14.577            |

In this example we see that measurements are well below our limits.

| metric        | metric_value (b) |
| ------------- | ---------------- |
| data_received | 1664             |
| data_received | 1675             |
| data_received | 1516             |
| data_received | 1670             |
| data_received | 1521             |
| data_received | 1669             |
| data_received | 1669             |
| data_received | 1670             |
| data_received | 1664             |

Data received also stays consistent and is below 2KB. So receiving it wouldn't cause any issue with any connection type.

## Retrieve ready for review record with an id

This test focuses on testing the endpoint fetchBirthRegistrationForReview. The endpoint is called 30 times sequentially with random record ids. `http_req_waiting` metric (ms) is used to determine how long it takes for the server to process the request.

**Limits**

```
http_req_waiting < 5000ms
```

| metric           | metric_value (ms) |
| ---------------- | ----------------- |
| http_req_waiting | 10253.456000      |
| http_req_waiting | 10613.633000      |
| http_req_waiting | 8163.989000       |
| http_req_waiting | 7036.980000       |
| http_req_waiting | 8023.521000       |
| http_req_waiting | 8193.662000       |
| http_req_waiting | 43590.610000      |
| http_req_waiting | 6541.544000       |
| http_req_waiting | 5997.119000       |

In this result set we see that it takes significantly long for the backend to process the search request even when the record is queried directly with an id. `data_received` consistently shows around 1668 bytes of downloaded content, which should be fast to download on any connection speed.

With the current 5s limit, we see most of the requests failing the check

```
✗ is status 200
↳  96% — ✓ 29 / ✗ 1
✗ processing < 5s
↳  60% — ✓ 18 / ✗ 12
```
