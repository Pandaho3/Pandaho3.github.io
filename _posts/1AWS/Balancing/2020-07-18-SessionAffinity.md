---
title: AWS - Session Affinity and Sticky Sessions
date: 2020-07-18 11:11:11 -0400-
categories: [2AWS, Balancing]
tags: [AWS, Balancing]
toc: true
image:
---

[toc]

---

# Session Affinity 类同 and Sticky Sessions

---


## The application can’t remember who the client is
- On a technical level:
- **Each HTTP request-response pair between the client and app happens (most often) on a different TCP connection**.
  - This is especially true when a load balancer sits between the client and the app
  - So the application can’t use the TCP connection as a way to remember the conversational context.
- **HTTP itself is stateless**:
  - any request can be sent at any time, in any sequence, regardless of the preceding requests.
  - app may demand a particular pattern of interaction – like logging in before accessing certain resources – but that application-level state is enforced by the application, not by HTTP.
  - So HTTP cannot be relied on to maintain conversational context between the client and the application.


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

## solution
There are two ways to solve this problem of forgetting the context.
1. the client remind the application of the context every time he requests something
2. the application remember the context by creating an associated memento
   1. This memento is given to the client and returned to the application on subsequent requests.
   2. via URL: http://www.example.com/products/awesomeDoohickey.html?sessionID=0123456789ABCDEFGH
   3. via cookies, placed within the HTTP request so they can be discovered by the application even if a load balancer intervenes.

**Manage user session**
- storing those sessions locally to the node responding to the HTTP request
- design a layer in architecture which can store those sessions in a scalable and robust manner.


> Large websites may be "load balanced" across multiple machines.
> - a user may hit any of the backend machines during a session.
> - several methods exist to allow many machines to share user sessions.
> - The method chosen will depend on the style of load balancing employed, as well as the availability/capacity of backend storage:


### Session information stored in cookies only:
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


### Load balancer always directs the user to the same machine:
- Many load balancers may set `session cookie`, indicating which backend machine a user is making requests from, and direct them to that machine in the future.
- Because the user is always directed to the same machine, session sharing between multiple machines is not required.

> This may be good in some situations:
> - An `existing application's session handling may not need to be changed` to become multiple machines aware
> - `No shared database system (or similar) is required` for storing sessions, possibly increasing reliability, but at the cost of complexity
> - A backend machine going down will take down any user sessions started on it, with it.
> - Taking machines out of service is more difficult. Users with sessions on a machine to be taken down for maintenance should be allowed to complete their tasks before the machine is turned off. To support this, web load balancers may have a feature to "drain" requests to a certain backend machine.


### Shared backend database or memcached or key/value store:
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

A cloud design pattern that uses multiple load balancers
- 2 separate ELB going to a set of servers.
  - a load balancer that is separated by a certificate
  - another load balancer that is keeping the `session sticky`.
- When a website is served by **only one web server**
  - for each client-server pair, a session object is created and remains in the memory of the web server.
  - All requests from the client go to this web server and update this session object.
- When a website is served by **multiple web servers behind a load balancer**
  - the load balancer decides which web server the request goes to.
  - If the load balancer use `sticky sessions`
    - all interactions happen with the same physical server.
  - Stickiness
    - important because mobile applications need to keep those `sticky sessions`.
    - For desktop users, common not require `sticky sessions`.

Cache

![Screen Shot 2020-06-20 at 23.23.50](https://i.imgur.com/bTDwJPr.png)
￼
![Screen Shot 2020-06-20 at 23.24.41](https://i.imgur.com/M9FQKnN.png)

---

## Sticky sessions / session affinity

> load balancer had the freedom to forward each incoming HTTP or TCP request to any of the EC2 instances under its purview.
> reasonably even load on each instance,
> but it also meant that each instance would have to retrieve, manipulate, and store session data for each request without any possible benefit from locality of reference.

![elb_not_sticky](https://i.imgur.com/b2u9xtx.png)


> the new sticky session feature, it is possible to instruct the load balancer to route repeated requests to the same EC2 instance whenever possible.
> the instances can cache user data locally for better performance.
> A series of requests from the user will be routed to the same EC2 instance if possible.
> If the instance has been terminated or has failed a recent health check, the load balancer will route the request to another instance.


![elb_sticky](https://i.imgur.com/0HkpZ99.png)


---


- By default, load balancer routes each request independently to the registered instance with the smallest load.
- Use `sticky session`:
  - enables the load balancer to bind user's session to a specific instance.
  - all requests from the user during the session are sent to the same server instance.
  - can use `sticky sessions` for only `HTTP/HTTPS load balancer listeners`


- `Sticky sessions`
  - **can limit application’s scalability**
    - the load balancer is unable to truly balance the load each time it receives request from a client.
    - send all the requests to their original server where the session state was created
      - even that server might be heavily loaded
      - and another less-loaded server is available to take on this request.
  - **allow to route a user to the particular web server** which is managing that individual user’s session.
  - better user experience.

- The `session’s validity` can be determined by:
  - a client-side cookies
  - via configurable duration parameters that set at the load balancer
    - which routes requests to the web servers.


- **Duration-based session stickiness**
  - The load balancer uses a special `load balancer–generated cookie` to `track the application instance for each request`.
  - When the load balancer receives a request, first checks whether this cookie is present in the request.
    - If there is a cookie
      - the request is sent to the application instance specified in the cookie.
    - If there is no cookie
      - the load balancer chooses an application instance based on the existing load balancing algorithm.
      - A cookie is inserted into the response
        - for binding subsequent requests from the same user to that application instance.
  - `The stickiness policy configuration` defines a cookie expiration
    - establishes the duration of validity for each cookie.
    - The cookie is `automatically updated` after its duration expires.


- **Application-controlled session stickiness**
  - The load balancer uses a special cookie to `associate the session with the original server` that handled the request
  - `The stickiness policy configuration`
    - follows the lifetime of the application-generated cookie corresponding to the cookie name specified in the policy configuration.
    - The load balancer only inserts a new `stickiness cookie` if the application response includes a new application cookie.
  - The load balancer stickiness cookie does not update with each request.
  - If the application cookie is explicitly removed or expiresthe session stops being sticky until a new application cookie is issued.
  - This means that can perform maintenance, such as deploying software upgrades or replacing backend instances, without affecting customers’ experience.
  - Applications often store session data in memory, but this approach doesn’t scale well. Options available to manage session data without `sticky sessions` include:
    - Using ElastiCache or DynamoDB to store session data.

---

Multiple load balancers, based on the types of devices that access the web site.

![Screen Shot 2020-06-22 at 15.07.33](https://i.imgur.com/gE2TVx5.png)

When a web application is multi-device compatible (access from PCs and smart phones)

1. perform a `setup for SSL/TLS` or to `assign sessions for individual access devices`, if the setup is performed by the EC2 instances themselves,
   - any change to the settings would become extremely laborious as the number of servers increases.


2. **solve this problem**: assign multiple virtual load balancers with different settings.
   - rather than modifying the `servers`
   - changing the `virtual load balancer` for routing the access.
   - change the behavior relative to access by the different devices 	
   - For example
     - apply this to settings such as for sessions, health checks, and HTTPS.
     - To implement, `assign multiple virtual load balancers to a single EC2 instance`.
     - use the SSL Termination function of the load balancer to perform the HTTPS (SSL) process.
     - Place EC2 instance under the control of the load balancers
     - And prepare load balancers with different settings for sessions, health checks, HTTPS, etc., and switch between them for the same EC2 instance.


- some benefits.
  - The behavior on the load balancer level for mobile sites and PC sites can be different, even use the same EC2 instance.
  - Even when multiple SSLs (HTTPS) are used by the same EC2 instance, can prepare load balancers for each SSL (HTTP).
  - when cut off an EC2 instance from a load balancer to perform maintenance, have to cut off the EC2 instance from all of the load balancers.
  - When use the SSL Termination function of a load balancer, the EC2 instance will be able to receive requests via HTTP, making it difficult to evaluate the HTTPS connection by the applications.


---


ref
- [New Elastic Load Balancing Feature: `Sticky Sessions`](https://aws.amazon.com/blogs/aws/new-elastic-load-balancing-feature-sticky-sessions/)
- [Elastic Load Balancing with Sticky Sessions](https://shlomoswidler.com/2010/04/08/elastic-load-balancing-with-sticky-sessions/)
- [IBM - OpenPages Load-Balanced Configuration vs Session Fail Over](https://www.ibm.com/support/pages/openpages-load-balanced-configuration-vs-session-fail-over)


.
