# Fresh installation

The purpose of these tests is to

- verify all functionality is performant when the software is first installed
- act as a benchmark to compare other tests against
- reveal accumulating performance issues when a certain action is taken many times by the user

## Increasing audit history size

This test measures the received body size of a record after it has been downloaded n times.
`data_received` metric (bits) is used to determine this across the iterations.

| Iteration | metric        | timestamp  | value (bits)   |     |
| --------: | ------------- | ---------- | -------------- | --- |
|         1 | data_received | 1689756995 | 1641.000000    |     |
|         2 | data_received | 1689757000 | 346850.000000  |     |
|         3 | data_received | 1689756995 | 1641.000000    |     |
|         4 | data_received | 1689757000 | 346850.000000  |     |
|         5 | data_received | 1689757003 | 688453.000000  |     |
|         6 | data_received | 1689757007 | 1030057.000000 |     |
|         7 | data_received | 1689757010 | 1371660.000000 |     |
|         8 | data_received | 1689757013 | 1713263.000000 |     |
|         9 | data_received | 1689757017 | 2054866.000000 |     |
|        10 | data_received | 1689757017 | 2054866.000000 |     |

In this example for instance, we see that on the 10th iteration, the received payload is already 2.054 Mb in size. Not great!
on a 430 Kbps connection it would take `2054866 / 430 000 = 4.77875814` seconds to download.

Another finding is, the size delta between iterations is roughly `2054866 - 1713263 = 341 603` so each time the record is downloaded, 341 Kb is added to the payload size.
