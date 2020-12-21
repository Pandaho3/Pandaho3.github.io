---
title: 使用ip-prefix解决路由引入掩码匹配问题
author: Pandaho
date: 2020-06-21 20:00:00 +0000
categories: [Project] 
tags: [ospf]
image: /assets/img/ospf-ip-prefix/cover.png
---



## 前言

我们在使用acl进行路由引入或者匹配常因为acl无法匹配掩码/前缀长度导致无法精确匹配，所以我们可以使用另一个工具 ip-Prefix list（ip前缀列表）


##  知识要领

**ip-Prefix list**：能够同时精确匹配网络号和前缀长度

1、性能及可控性比acl更高

2、前缀列表不能用于数据包的过滤

语法规则

不配置greater-equal和less-equal  按掩码匹配

只配置greater-equal  按greater-equal~32匹配

只配置less-equal  按掩码~less-equal匹配

同时配置greater-equal和less-equal   按greater-equal~less-equal匹配

**5类LSA**

1. 域外路由，不属于某个区域；通过重分布其他路由协议进入OSPF产生。
2. 由ASBR产生并泛洪到整个AS，传播过程中不会改变Advertising Router。
3. 包含域外的路由信息。
4. forward address为0.0.0.0时，forward metric是本路由器去往此ASBR的开销。
5. 除了末梢区域、完全末梢区域和次节末梢区域外，LSA5在整个AS中发送，路由表中用E1或E2表示。其中，E1会累积OSPF域内传播的开销（forward metric），E2不会累加，而是保持重分布时的
6. Link ID：路由(网络号) ；Advertising Router：ASBR的RID(不改变)

注意：

metric-type：OSPF引入 外部路由时，其路由器需要计算到达外部路由的花费。metric-type分为type1和type2，默认为type2。type1，计算的花费值就是到达ASBR的花费+LSA所携带的metric值，即度量值=数据报文所经过的各内部链路成本+被分配的外部路径成本(type2的度量 值)；type2，计算的花费就是LSA所携带的“种子metric”（默认值为20），即度量值=被分配的外部路径成本。所以type1优于type2，推荐使用type1。

##  项目背景
![图例](https://www.pandaho3.cn/assets/img/ospf-ip-prefix/1.png)  
我们通过静态路由使用ip-Prefix引入ospf

静态路由我们在AR1设置路由黑洞，将两个路由引入null

##  配置命令
```
AR1
interface GigabitEthernet0/0/0
 ip address 12.0.0.1 255.255.255.0
 #
ospf 1 router-id 1.1.1.1 
 filter-policy ip-prefix null export  #在出接口通过filter-policy调用前缀列表
 import-route static
 area 0.0.0.0 
  network 12.0.0.1 0.0.0.0 
#
ip ip-prefix null index 10 permit 192.168.0.0 16
#
ip route-static 192.168.0.0 255.255.0.0 NULL0
ip route-static 192.168.0.0 255.255.255.0 NULL0

```

```
AR3
interface GigabitEthernet0/0/0
 ip address 12.0.0.2 255.255.255.0 
 
ospf 1 router-id 2.2.2.2 
 area 0.0.0.0 
  network 12.0.0.2 0.0.0.0 
```

##  项目效果

```
[R3]dis ip routing-table
	 192.168.0.0/16  O_ASE   150  1           D   12.0.0.1        GigabitEthernet   0/0/0

```

现在我们看到有掩码16的路由了，而24并没有被引入。

```
[R3]dis ospf routing 

	 OSPF Process 1 with Router ID 2.2.2.2
		  Routing Tables 

 Routing for Network 
 Destination        Cost  Type       NextHop         AdvRouter       Area
 12.0.0.0/24        1     Transit    12.0.0.2        2.2.2.2         0.0.0.0

 Routing for ASEs
 Destination        Cost      Type       Tag         NextHop         AdvRouter
 192.168.0.0/16     1         Type2      1           12.0.0.1        1.1.1.1

 Total Nets: 2  
 Intra Area: 1  Inter Area: 0  ASE: 1  NSSA: 0 

```

查看R3我们可以看到ospf路由已经引入192.168.0.0/16了。

```
[R1]dis ospf lsdb ase self-originate

	 OSPF Process 1 with Router ID 1.1.1.1
		 Link State Database


  Type      : External
  Ls id     : 192.168.0.0
  Adv rtr   : 1.1.1.1  
  Ls age    : 86 
  Len       : 36 
  Options   :  E  
  seq#      : 80000003 
  chksum    : 0x2b36
  Net mask  : 255.255.0.0 
  TOS 0  Metric: 1 
  E type    : 2
  Forwarding Address : 0.0.0.0 
  Tag       : 1 
  Priority  : Low

```

外部路由从R1引入所以R1为ASBR，我们可以在R1上查询到五类LSA的信息。