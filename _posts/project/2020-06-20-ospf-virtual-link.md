---
title: 使用虚链路来解决OSPF区域间路由不完整问题
author: Pandaho
date: 2020-06-20 20:00:00 +0000
categories: [Project] 
tags: [OSPF]
image: /assets/img/ospf-virtual-link/cover.png
---

注：当你选择使用虚链路，标明你的网络中某一部分设计不规范，最好的方法还是重新规划设计，虚链路仅是作为修复无法避免的网络拓扑问题的一种临时手段，因为虚链路会增加网络的复杂程度，不利于后续故障排查。


##  知识要领

为了避免区域间的环路，OSPF规定不允许直接在两个非骨干区域之间发布路由信息，只允许在一个区域内部或者在骨干区域和非骨干区域之间发布路由信息。因此，每个ABR都必须连接到骨干区域。即要求所有非骨干区域必须和骨干区域相连，同时骨干区域也必须连续。

虚链路（virtual link）是指一条通过一个非骨干区域连接到骨干区域的链路。

##  项目背景
![图例](https://www.pandaho3.cn/assets/img/ospf-virtual-link/1.png)  
在这个网络中，AR1是学不到34.0.0.0网段的ip的，因为area2并没有连接到area0上，所以我们可以在AR2-AR3之间建立一条虚链路，使area2连接到area0。

##  配置命令
```
AR1
interface GigabitEthernet0/0/0
 ip address 12.0.0.1 255.255.255.0 
ospf 1 router-id 1.1.1.1 
 area 0.0.0.0 
  network 12.0.0.1 0.0.0.0 
```

```
AR2
interface GigabitEthernet0/0/0
 ip address 12.0.0.2 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 23.0.0.2 255.255.255.0 
#
interface NULL0
#
ospf 1 router-id 2.2.2.2 
 area 0.0.0.0 
  network 12.0.0.2 0.0.0.0 
 area 0.0.0.1 
  network 23.0.0.2 0.0.0.0 
  vlink-peer 3.3.3.3   #在area1区域建立虚链路指向跨area2 ARB设备的ospf route-id
```

```
AR3
interface GigabitEthernet0/0/0
 ip address 34.0.0.3 255.255.255.0 
#
interface GigabitEthernet0/0/1
 ip address 23.0.0.3 255.255.255.0 
#
interface NULL0
#
ospf 1 router-id 3.3.3.3 
 area 0.0.0.1 
  network 23.0.0.3 0.0.0.0 
  vlink-peer 2.2.2.2   #在area1区域建立虚链路指向跨area0 ARB设备的ospf route-id
 area 0.0.0.2 
  network 34.0.0.3 0.0.0.0 
```

```
AR4
interface GigabitEthernet0/0/0
 ip address 34.0.0.4 255.255.255.0 
ospf 1 router-id 4.4.4.4 
 area 0.0.0.2 
  network 34.0.0.4 0.0.0.0 

```

##  项目效果

```
<R1>dis ospf routing 
	 OSPF Process 1 with Router ID 1.1.1.1
		  Routing Tables 

 Routing for Network 
 Destination        Cost  Type       NextHop         AdvRouter       Area
 12.0.0.0/24        1     Transit    12.0.0.1        1.1.1.1         0.0.0.0
 23.0.0.0/24        2     Inter-area 12.0.0.2        2.2.2.2         0.0.0.0
 34.0.0.0/24        3     Inter-area 12.0.0.2        3.3.3.3         0.0.0.0
```

现在我们看到有通往34段的路由了。

虚链路是封装在IP报文中，并且通过单播进行发送，我们通过wireshark抓取端口报文可以看到，有走虚链路的ospf单播报文和正常ospf组播报文，而且通过查看header里会发现虚链路的area id都是0.

```
1	0.000000000	23.0.0.2	23.0.0.3	OSPF	82	Hello Packet
OSPF Header
Area ID: 0.0.0.0 (0.0.0.0) (Backbone)
2	1.281000000	23.0.0.2	224.0.0.5	OSPF	82	Hello Packet
OSPF Header
Area ID: 0.0.0.1 (0.0.0.1)
```

```
<R2>dis ospf vlink 

	 OSPF Process 1 with Router ID 2.2.2.2
		 Virtual Links 

 Virtual-link Neighbor-id  -> 3.3.3.3, Neighbor-State: Full
```

查询 vlink 也能看到状态为FULL。