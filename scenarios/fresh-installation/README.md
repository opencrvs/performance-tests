# Fresh installation

The purpose of these tests is to

- verify all functionality is performant when the software is first installed
- act as a benchmark to compare other tests against
- reveal accumulating performance issues when a certain action is taken many times by the user

## Increasing audit history size

This test measures the received body size of a record after it has been downloaded n times.
`data_received` metric (bytes) is used to determine this across the iterations.

| Iteration | metric        | timestamp  | value (bytes)  |
| --------: | ------------- | ---------- | -------------- |
|         1 | data_received | 1689756995 | 1641.000000    |
|         2 | data_received | 1689757000 | 346850.000000  |
|         3 | data_received | 1689756995 | 1641.000000    |
|         4 | data_received | 1689757000 | 346850.000000  |
|         5 | data_received | 1689757003 | 688453.000000  |
|         6 | data_received | 1689757007 | 1030057.000000 |
|         7 | data_received | 1689757010 | 1371660.000000 |
|         8 | data_received | 1689757013 | 1713263.000000 |
|         9 | data_received | 1689757017 | 2054866.000000 |
|        10 | data_received | 1689757017 | 2054866.000000 |

In this example for instance, we see that on the 10th iteration, the received payload is already 2.054 MB in size. Not great!
on a 430 Kbps connection it would take `2054866 * 8 / 430 000 = 38.23` seconds to download.

Another finding is, the size delta between iterations is roughly `2054866 - 1713263 = 341 603` so each time the record is downloaded, 341 KB is added to the payload size.

# Creating a declaration

This test measures the time it takes for a declaration to be created in an empty database when there are 4 attachments embedded in the record.

`data_sent` consistently hovers around 2167099 bytes, so ~2MB which is as per our expectations.

| metric           | value (ms)   |
| ---------------- | ------------ |
| http_req_waiting | 2935.323000  |
| http_req_waiting | 2209.135000  |
| http_req_waiting | 6206.317000  |
| http_req_waiting | 4168.275000  |
| http_req_waiting | 2155.381000  |
| http_req_waiting | 6424.023000  |
| http_req_waiting | 3928.571000  |
| http_req_waiting | 2439.937000  |
| http_req_waiting | 4123.999000  |
| http_req_waiting | 2221.781000  |
| http_req_waiting | 3807.812000  |
| http_req_waiting | 2255.681000  |
| http_req_waiting | 4722.422000  |
| http_req_waiting | 3500.297000  |
| http_req_waiting | 2464.948000  |
| http_req_waiting | 3562.797000  |
| http_req_waiting | 1707.428000  |
| http_req_waiting | 17178.376000 |
| http_req_waiting | 3739.258000  |
| http_req_waiting | 1503.641000  |
| http_req_waiting | 2820.228000  |
| http_req_waiting | 4258.070000  |
| http_req_waiting | 2483.803000  |
| http_req_waiting | 4266.955000  |
| http_req_waiting | 3923.996000  |
| http_req_waiting | 2307.155000  |
| http_req_waiting | 4253.798000  |
| http_req_waiting | 2111.162000  |
| http_req_waiting | 3717.463000  |
| http_req_waiting | 2752.309000  |

In this example result set, we see that
