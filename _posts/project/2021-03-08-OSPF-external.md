---
title: 关于OSPF外部路由引入
author: Pandaho
date: 2021-03-08 20:00:00 
categories: [Project] 
tags: [ospf]
image: /assets/img/OSPF-external/cover.png
---



## 网络概述

公司A分3个区域运行OSPF，公司B有一台业务服务器，将公司A与公司B连通，使公司A的PC能够访问到公司B的服务器。

## 网络架构
![图例](https://www.pandaho3.cn/assets/img/OSPF-external/1.png)

## 设备配置

```
R1
interface GigabitEthernet0/0/0
 ip address 10.1.6.2 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 192.168.1.254 255.255.255.0 
 
ip route-static 0.0.0.0 0.0.0.0 10.1.6.1
```

```
R2
interface GigabitEthernet0/0/1
 ip address 10.1.3.1 255.255.255.0 
#
interface GigabitEthernet2/0/0
 ip address 10.1.1.2 255.255.255.0 
#
ospf 1 router-id 2.2.2.2 
 import-route static
 area 0.0.0.0 
  authentication-mode md5 1 cipher huawei
  network 10.1.1.2 0.0.0.0 
 area 0.0.0.2 
  authentication-mode md5 1 cipher huawei
  network 10.1.3.1 0.0.0.0 
#
ip route-static 192.168.1.0 255.255.255.0 10.1.6.2
```

```
R3
interface GigabitEthernet0/0/0
 ip address 10.1.4.1 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 10.1.3.2 255.255.255.0 
#
ospf 1 router-id 3.3.3.3 
 silent-interface GigabitEthernet0/0/0
 area 0.0.0.2 
  authentication-mode md5 1 cipher huawei
  network 10.1.3.2 0.0.0.0 
  network 10.1.4.1 0.0.0.0
```

```
R4
#
interface GigabitEthernet0/0/0
 ip address 10.1.2.2 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 10.1.1.1 255.255.255.0 
#
ospf 1 router-id 4.4.4.4 
 area 0.0.0.0 
  authentication-mode md5 1 cipher huawei
  network 10.1.1.1 0.0.0.0 
 area 0.0.0.1 
  authentication-mode md5 1 cipher huawei
  network 10.1.2.2 0.0.0.0 
```

```
R5
#
interface GigabitEthernet0/0/0
 ip address 10.1.2.1 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 10.1.5.254 255.255.255.0 
#
ospf 1 router-id 5.5.5.5 
 silent-interface GigabitEthernet0/0/1
 area 0.0.0.1 
  authentication-mode md5 1 cipher huawei
  network 10.1.2.1 0.0.0.0 
  network 10.1.5.254 0.0.0.0 
```

## 技术要点

执行命令**silent-interface** { **all** | *interface-type* *interface-number* }，禁止OSPF接口发送和接收协议报文。

可以在不同的OSPF进程中，禁止同一个接口发送和接收OSPF报文，但**silent-interface**命令只对本进程已经使能的OSPF接口起作用，对其它进程的接口不起作用。

-----------------------------------------------------------------------------------------------------------------------------------

DR和BDR是由同一网段中所有的路由器根据路由器优先级、Router ID通过HELLO报文选举出来的，只有优先级大于0的路由器才具有选取资格。

进行DR/BDR选举时每台路由器将自己选出的DR写入Hello报文中，发给网段上的每台运行OSPF协议的路由器。当处于同一网段的两台路由器同时宣布自己是DR时，路由器优先级高者胜出。如果优先级相等，则Router ID大者胜出。如果一台路由器的优先级为0，则它不会被选举为DR或BDR。

需要注意的是：

只有在广播或NBMA类型接口才会选举DR，在点到点或点到多点类型的接口上不需要选举DR。

**DR是某个网段中的概念**，是针对路由器的接口而言的。某台路由器在一个接口上可能是DR，在另一个接口上有可能是BDR，或者是DR Other。

路由器的优先级可以影响一个选取过程，但是当DR/BDR已经选取完毕，就算一台具有更高优先级的路由器变为有效，也不会替换该网段中已经选取的DR/BDR成为新的DR/BDR。

DR并不一定就是路由器优先级最高的路由器接口；同理，BDR也并不一定就是路由器优先级次高的路由器接口。

-----------------------------------------------------------------------------------------------------------------------------------

OSPF支持报文验证功能，只有通过验证的报文才能接收，否则将不能正常建立邻居关系。

OSPF协议支持两种认证方式：区域认证和链路认证。

使用区域认证时，一个区域中所有的路由器在该区域下的认证模式和口令必须一致；OSPF链路认证相比于区域认证更加灵活，可专门针对某个邻居设置独立的认证模式和密码。如果同时配置了接口认证和区域认证时，优先使用接口认证建立OSPF邻居。
每种认证方式又分为简单验证模式，MD5验证模式和Key chain验证模式。

简单验证模式在数据传递过程中，认证密钥和密钥ID都是明文传输，容易被截获；MD5验证下的密钥是经过MD5加密传输，相比简单模式更为安全；Key chain 验证模式可以同时配置多个密钥，不同密钥单独设置生效周期等。

-----------------------------------------------------------------------------------------------------------------------------------

```
OSPF Process 1 with Router ID 2.2.2.2
		 Link State Database 

		         Area: 0.0.0.0
 Type      LinkState ID    AdvRouter          Age  Len   Sequence   Metric
 Router    4.4.4.4         4.4.4.4           1388  36    80000007       1
 Router    2.2.2.2         2.2.2.2           1394  36    80000006       1
 Network   10.1.1.1        4.4.4.4           1388  32    80000004       0
 Sum-Net   10.1.3.0        2.2.2.2           1461  28    80000003       1
 Sum-Net   10.1.2.0        4.4.4.4           1465  28    80000003       1
 Sum-Net   10.1.5.0        4.4.4.4           1465  28    80000003       2
 Sum-Net   10.1.4.0        2.2.2.2           1419  28    80000003       2
 
		         Area: 0.0.0.2
 Type      LinkState ID    AdvRouter          Age  Len   Sequence   Metric
 Router    2.2.2.2         2.2.2.2           1419  36    80000005       1
 Router    3.3.3.3         3.3.3.3            929  48    80000009       1
 Network   10.1.3.2        3.3.3.3           1420  32    80000003       0
 Sum-Net   10.1.2.0        2.2.2.2           1394  28    80000003       2
 Sum-Net   10.1.1.0        2.2.2.2           1461  28    80000003       1
 Sum-Net   10.1.5.0        2.2.2.2           1394  28    80000003       3
 

		 AS External Database
 Type      LinkState ID    AdvRouter          Age  Len   Sequence   Metric
 External  192.168.1.0     2.2.2.2           1464  36    80000003       1
```

我们来看该LSDB中的链路信息，首先**Router LSA**

```
<R2>dis ospf lsdb router 4.4.4.4

	 OSPF Process 1 with Router ID 2.2.2.2
		         Area: 0.0.0.0
		 Link State Database 


  Type      : Router
  Ls id     : 4.4.4.4   产生此LSA的路由器的Router ID。
  Adv rtr   : 4.4.4.4   产生此LSA的路由器的Router ID。
  Ls age    : 1675 
  Len       : 36 
  Options   :  ABR  E  
  seq#      : 80000007 
  chksum    : 0x8a87
  Link count: 1
   * Link ID: 10.1.1.1     
     Data   : 10.1.1.1     
     Link Type: TransNet     
     Metric : 1

```

**Network**（2类LSA 是每个网络的DR产生，2类LSA 包含这个网络内一共有多少成员， 每个成员的router ID 是多少， 以及这个网络的掩码是多少位。）

```
<R2>dis ospf lsdb network 10.1.1.1

	 OSPF Process 1 with Router ID 2.2.2.2
		         Area: 0.0.0.0
		 Link State Database 


  Type      : Network
  Ls id     : 10.1.1.1   DR的IP地址。
  Adv rtr   : 4.4.4.4    DR的RouterID。
  Ls age    : 249 
  Len       : 32 
  Options   :  E  
  seq#      : 80000005 
  chksum    : 0x4ad6
  Net mask  : 255.255.255.0   广播网或NBMA网络地址的掩码。
  Priority  : Low
     Attached Router    4.4.4.4   连接在同一个网段上的所有与DR形成了完全邻接关系的路由器的Router ID，也包括							   DR自身的Router ID。
     Attached Router    2.2.2.2

```

**Summary LSA**  （3类LSA是 每个区域的ABR产生. 3类LSA 包含的是其他区域的路由信息）

```
<R2>dis ospf lsdb summary 10.1.3.0

	 OSPF Process 1 with Router ID 2.2.2.2
		         Area: 0.0.0.0
		 Link State Database 


  Type      : Sum-Net
  Ls id     : 10.1.3.0   Link State ID：对于Type3 LSA来说，它是所通告的区域外的网络地址；对于Type4来说，它						  是所通告区域外的ASBR的Router ID。
  Adv rtr   : 2.2.2.2    是ABR的router ID
  Ls age    : 524 
  Len       : 28 
  Options   :  E  
  seq#      : 80000004 
  chksum    : 0x83bf
  Net mask  : 255.255.255.0   Type3 LSA的网络地址掩码。对于Type4 LSA来说没有意义，设置为0.0.0.0。
  Tos 0  metric: 1
  Priority  : Low

```

**AS External LSA**（5类LSA是ASBR 产生的，５类LSA 包含的是OSPF区域外部的路由信息）

```
<R2>dis ospf lsdb ase 192.168.1.0

	 OSPF Process 1 with Router ID 2.2.2.2
		 Link State Database


  Type      : External
  Ls id     : 192.168.1.0  所要通告的其他外部AS的目的地址，如果通告的是一条缺省路由，那么链路状态ID（Link 							 State ID）和网络掩码（Network Mask）字段都将设置为0.0.0.0。
  Adv rtr   : 2.2.2.2     是ASBR的router ID
  Ls age    : 730 
  Len       : 36 
  Options   :  E  
  seq#      : 80000004 
  chksum    : 0xff5b
  Net mask  : 255.255.255.0    所通告的目的地址的掩码。
  TOS 0  Metric: 1 
  E type    : 2
  Forwarding Address : 0.0.0.0    到所通告的目的地址的报文将被转发到的地址。
  Tag       : 1 
  Priority  : Low

```

