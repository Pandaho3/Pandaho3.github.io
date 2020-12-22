---
title: 使用流策略进行流量重定向
author: Pandaho
date: 2020-06-22 20:00:00 +0000
categories: [Project] 
tags: [network]
image: /assets/img/ospf-ip-prefix/cover.png
---



## 前言

当我们使用策略路由和路由策略进行本地路由重定向时会发现，那转发流量怎么重定向，所有我们就有了流策略。


##  知识要领

**流策略**：将流分类和流行为关联，就是流策略，形成了“模板化”的配置方式，最大优点是可以节省配置，支持批量修改。

1、Traffic classifier：用if-match语句设定流分类的匹配规则。

2、Traffic Behavior：执行动作，例如重标记、重定向、负载分担、报文分片、流量限速、流量统计等等。

3、Traffic Policy：将流分类和流行为关联，应用到流量的入接口。

##  项目背景
![图例](https://www.pandaho3.cn/assets/img/traffic-policy/1.png)  
我们通过client设备访问server设备http服务，在AR1将http流量重定向至GE0/0/0口

##  配置命令
```
AR1
acl number 3000  
 rule 10 permit tcp destination-port eq www 
#
traffic classifier http operator or
 if-match acl 3000
#
traffic behavior http
 redirect ip-nexthop 10.0.1.2
#
traffic policy http
 classifier http behavior http
#
interface GigabitEthernet0/0/0
 ip address 10.0.1.1 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 10.0.0.1 255.255.255.0 
#
interface GigabitEthernet0/0/2
 ip address 192.168.0.254 255.255.255.0 
 traffic-policy http inbound
#
ospf 1 router-id 1.1.1.1 
 area 0.0.0.0 
  network 10.0.0.1 0.0.0.0 
  network 10.0.1.1 0.0.0.0 
  network 192.168.0.0 0.0.0.255

```

```
AR2
interface GigabitEthernet0/0/0
 ip address 10.0.1.2 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 10.0.0.2 255.255.255.0 
#
interface GigabitEthernet0/0/2
 ip address 192.168.1.254 255.255.255.0 
#
ospf 1 router-id 2.2.2.2 
 area 0.0.0.0 
  network 10.0.0.2 0.0.0.0 
  network 10.0.1.2 0.0.0.0 
  network 192.168.1.0 0.0.0.255
```

##  项目效果

```
192.168.0.1	192.168.1.1	HTTP	211	GET / HTTP/1.1 
192.168.1.1	192.168.0.1	HTTP	361	HTTP/1.1 200 OK  (text/html)
```

我们通过抓取GE0/0/0端口的包，再用client访问server的http服务，能够查看到有http的包。

```
<R1>dis traffic-policy applied-record http
-------------------------------------------------
  Policy Name:   http 
  Policy Index:  0
     Classifier:http     Behavior:http 
-------------------------------------------------
 *interface GigabitEthernet0/0/2
    traffic-policy http inbound  
      slot 0    :  success
   Classifier: http
    Operator: OR
    Rule(s) : 
     if-match acl 3000
     Behavior: http 
      Redirect: 
        Redirect ip-nexthop 10.0.1.2
-------------------------------------------------
  Policy total applied times: 1.
	
```


