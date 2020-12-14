---
title: Load-Balanced vs Session Fail Over
date: 2020-07-18 11:11:11 -0400-
categories: [2AWS, Balancing]
tags: [AWS, Balancing]
toc: true
image:
---

[toc]

---

# Load-Balanced vs Session Fail Over

---

no transparent session fail-over:
- The OpenPages application can be configured for a multi-server (node) configuration.
- If one node (or server) goes down while a user is connected, the user will need to close the browser and re-login to connect to one of the other available nodes (or servers) in the environment.
- if one node goes down, users will NOT automatically be rerouted to one of the available nodes.

Use-Case 1:
> If Production Server A goes down, the admin service and the OP/IBPM server service will go down.
> For users using the server, will need to close the browser and manually re-login to utilize Production Server B.
> All in-flight transactions which are getting processed will be lost and users have to reiterate the task.
> From an end user perspective
> - was performing an action or task on Production Server A
> - may need to re-login to complete the task on Production Server B.
> - no loss in functionality, however have to repeat the task again that been interrupted.
> - All in-flight transactions getting processed will be lost and have to reiterate the task.


Use-Case 2:
> If both Production Server A and Production Server B are unavailable (due to various reasons),
> an administrator can startup the disaster recovery system(s). This assumes that 3rd party mechanisms (ie: database mirroring; data replication) are in place.
> The IT administrator would also have to update the load-balancer to indicate the disaster recovery servers can be used.
> If the load balancer has sticky-IP time out configured then users may have to wait until the time out threshold is reached and re-access the URL.

---

> Large websites may be "load balanced" across multiple machines.

---

# Load balanced
- a user may hit any of the backend machines during a session.
- several methods exist to allow many machines to share user sessions.
- The method chosen will depend on the style of load balancing employed, as well as the availability/capacity of backend storage:

## Session information stored in cookies only:
- not just a session identifier, Session information is stored in a user's `cookie`.
- For example
  - the user's cookie might contain the contents of their shopping basket.
- to prevent users from tampering with the session data, an `HMAC` may be provided along with the cookie.

> This method is probably least suitable for most applications:
> - No backend storage is required
> - The user does not need to hit the same machine each time, so DNS load balancing can be employed
> - no latency associated with retrieving the session information from a database machine (as it is provided with the HTTP request). Useful if your site is load-balanced by machines on different continents.
> - The amount of data that can be stored in the session is limited (by the 4K cookie size limit)
> - Encryption has to be employed if a user should not be able to see the contents of their session
> - HMAC (or similar) has to be employed to prevent user tampering of session data
> - Since the session data is not stored server-side, more difficult for developers to debug


## Load balancer always directs the user to the same machine:
- Many load balancers may set `session cookie`, indicating which backend machine a user is making requests from, and direct them to that machine in the future.
- Because the user is always directed to the same machine, session sharing between multiple machines is not required.

> This may be good in some situations:
> - An `existing application's session handling may not need to be changed` to become multiple machines aware
> - `No shared database system (or similar) is required` for storing sessions, possibly increasing reliability, but at the cost of complexity
> - A backend machine going down will take down any user sessions started on it, with it.
> - Taking machines out of service is more difficult. Users with sessions on a machine to be taken down for maintenance should be allowed to complete their tasks before the machine is turned off. To support this, web load balancers may have a feature to "drain" requests to a certain backend machine.


## Shared backend database or key/value store:
- `Session information is stored in a backend database`
- all web servers have access to query and update.
- `The user's browser stores a cookie containing an identifier (like session ID), pointing to the session information`.

> This is probably the cleanest method of the three:
> - The user never needs to be exposed to the stored session information.
> - The user does not need to hit the same machine each time, so DNS load balancing can be employed
> - One disadvantage is `the bottleneck that can be placed on whichever backend storage system is employed`.
> - Session information may be expired and backed up consistently.
> - Overall, most dynamic web applications perform several database queries or key/value store requests, so the database or key/value store is the logical storage location of session data.


---



---

ref
- [IBM - OpenPages Load-Balanced Configuration vs Session Fail Over](https://www.ibm.com/support/pages/openpages-load-balanced-configuration-vs-session-fail-over)




.
