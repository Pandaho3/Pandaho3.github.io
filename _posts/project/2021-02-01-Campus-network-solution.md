---
title: 园区网络解决方案
author: Pandaho
date: 2021-02-01 20:00:00 
categories: [Project] 
tags: [network]
image: /assets/img/Campus-network-solution/cover.png
---




##  前言

```
	我曾经手过一个园区网大规模突发丢包事故，进行排查后发现，该园区近期添加了一套视频系统，该系统直接接入现有园区网络，但现有网络因架构和设备性能问题无法承受这另外的视频流量，后续我建议对原网络架构进行升级，替换高性能设备，并对架构重新整改。
```

## 解决方案
		为了不对现有网络造成太大影响，因为毕竟园区还在经营的，以尽快解决问题为目的，我对原网络进行三层化，三层采用高端多业务路由交换机（H3C S7500系列），将视频服务器接入三层，由核心交换机进行数据转发，二层采用汇聚交换机进行区域划分，再按区域接入。

## 知识要领

```
网络中常用的数据传输速率单位有：kbps、Mbps和Gbps。其中：
1kbps＝1000bps 1Mbps＝1000000bps 1Gbps＝1000000000bps  
所以，文件大小与网络速率的换算单位是这样的：
512K＝512000bps，2M=2000000bps
同理mpps（million packet per second），百万包/秒，指包转发率（也就是端口吞吐量），是路由器/防火墙/交换机等设备的重要性能指标。
所谓的线速是指可以达到最大的包转发能力。由于以太网的包长是不定长的，因此，不同的包长在线速情况下的转发能力是不一样的。
rfc2544也建议以下包长做为测试的标准， 64、128、256、512、1024、1280、1518字节。
百兆的物理端口工作在双工状态下，所以计算出来的双向速率可以达到200Mbps，单位时间内发送64Byte的数据包(最小包)的个数作为计算基准，包的最高转发能力达到297618 PPS。
单向转发得到的线速是148809 PPS。我们来算一下有效的理论bps，双向的话乘以2。
148809（包数量） X 64（包长） X 8（一个字节等于8位） = 76190208bps
84459 X 128 X8 = 86486016bps
45290 X 256 X 8 = 92753920bps
23496 X 512 X8 = 96239616bps
11973 X 1024 X 8 = 98082816bps
9615 X 1280 X 8 = 98457600bps
8127 X 1518 X 8 = 98694288bps
所以以单向100Mbps为例，当包长为1518字节时，最大包转发送<8127

那我们该如何选择交换机呢？
衡量标准一:交换容量(L2交换)
交换容量≥2*(端口数量*端口容量),才可以实现全双工无堵塞交换
衡量标准二:包转发率(L3包转发)
包转发率≥满配置吞吐量(Mbps)=满配置千兆端口数*1.488Mpps
说明:当以太网帧为64byte时,需考虑8byte的帧头和12byte的帧间隙的固定开销
计算公式:
  千兆以太网1000Mpps/(64+8+12)/8=1.488Mpps
  对于万兆以太网,一个线速端口的包转发率为14.88Mpps
以华为S5700-52C-EI型号计算:
官网介绍规格:交换容量256Gbps   包转发率  138Mpps ,
端口数: 48个千兆     4个万兆
计算公式:
256Gbps> 2*(48*1GE+4*10GE) =176Gbps,实现全双工无堵塞交换
138Mpps> 1.488Mpps*48+14.88Mpps*4 =130.944Mpps,实现满配置吞吐量

注：测试工具可采用工业标准测试工具smartbits。

	IRF（Intelligent Resilient Framework，智能弹性架构）是 H3C 自主研发的软件虚拟化技术，它的 核心思想是将多台设备通过物理 IRF 端口连接在一起，进行必要的配置后，虚拟化成一台“虚拟 设备”，通过该“虚拟设备”来实现多台设备的协同工作、统一管理和不间断维护。
 	IRF分裂带来的问题
	IRF是指由多台设备通过IRF链路互相连接形成的一台虚拟设备，这台虚拟设备在网络中以一台独立设备的形态和其他设备进行通信。组建IRF的各台设备称为成员设备。
在IRF正常运行时，所有成员设备均使用相同的配置（包括IP地址、路由协议等所有功能配置）；当IRF链路出现故障时，会使IRF发生分裂，产生两个或多个新的IRF。此时，这些IRF各自的成员设备仍然运行着分裂前的配置，造成网络中存在多台IP地址以及其他三层配置相同的设备，会对网络中其他设备的协议运算和数据转发产生干扰，影响网络正常运行甚至导致数据丢失。

MAD（Multi-Active Detection，多Active检测）能够检测IRF的拓扑状态，并在IRF分裂后采取一定的安全措施保障网络正常运行，是IRF环境中推荐使用的维护类功能。目前MAD的实现方式有三种：
1、   LACP MAD
2、   BFD MAD
3、   ARP MAD
MAD的主要功能是及时检测出IRF发生分裂，并在分裂后的多个IRF之间发起竞选。MAD的竞选条件是Master设备的成员编号（也称为IRF的ActiveID），ActiveID较小的IRF获胜，保持正常工作状态（置于Active状态），其余IRF则通过关闭所有接口（除IRF物理端口和Console口）的方式与网络进行隔离（置于Recovery状态），以避免其它设备感知到网络中存在多个IRF。

对于分布式设备开启irf模式的，还需要用xbar命令用来配置主用主控板和备用主控板的负载模式。

ip unreachables enable命令  用来开启设备的ICMP目的不可达报文的发送功能，开启该功能可在网络故障情况，根据返回报文对故障进行判断。
ip ttl-expires enable命令  用来开启设备的ICMP超时报文的发送功能，开启该功能可在网络故障情况，对本机发送的报文进行判断。
（使用Tracert 功能需要在中间设备上开启ICMP 超时报文发送功能，在目的端开启ICMP 目的不可达报文发送功能）

lldp global enable命令用来全局使能LLDP功能，开启该功能，后续网络故障排查可使用lldp。
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/1.jpg)

```
一、MSTP 出现的背景:
RSTP 在 STP 基础上进行了改进，实现了网络拓扑快速收敛。但 RSTP 和 STP 还存在同一个缺陷：由于局域网内所有的 VLAN 共享一棵生成树，因此无法在 VLAN 间实现数据流量的负载均衡，链路被阻塞后将不承载任何流量，造成带宽浪费，还有可能造成部分 VLAN 的报文无法转发。

为了弥补 STP 和 RSTP 的缺陷， IEEE 于 2002 年发布的 802.1S 标准定义了 MSTP。 MSTP 兼容 STP和 RSTP，既可以快速收敛，又提供了数据转发的多个冗余路径，在数据转发过程中实现 VLAN 数据的负载均衡。

通过 MSTP 把一个交换网络划分成多个域，每个域内形成多棵生成树，生成树之间彼此独立。每棵生成树叫做一个多生成树实例 MSTI（Multiple Spanning Tree Instance），每个域叫做一个 MST域（MST Region： Multiple Spanning Tree Region）。

说明：
所谓实例就是多个 VLAN 的一个集合。通过将多个 VLAN 捆绑到一个实例，可以节省通信开销和资源占用率。 MSTP 各个实例拓扑的计算相互独立，在这些实例上可以实现负载均衡。可以把多个相同拓扑结构的 VLAN 映射到一个实例里，这些 VLAN 在端口上的转发状态取决于端口在对应MSTP 实例的状态。

MSTP 通过设置 VLAN 映射表（即 VLAN 和 MSTI 的对应关系表），把 VLAN 和MSTI 联系起来。每个 VLAN 只能对应一个 MSTI，即同一 VLAN 的数据只能在一个 MSTI 中传输，而一个 MSTI 可能对应多个 VLAN。

二、MSTP 基本概念
1、MSTP 的网络层次
如图所示， MSTP 网络中包含 1 个或多个 MST 域（MST Region），每个 MST Region 中包含一个或多个 MSTI。组成 MSTI 的是运行 STP/RSTP/MSTP 的交换设备， MSTI 是所有运行STP/RSTP/MSTP 的交换设备经 MSTP 协议计算后形成的树状网络。
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/2.jpg)

```
2、MST 域（MST Region）
MST 域是多生成树域（Multiple Spanning Tree Region），由交换网络中的多台交换设备以及它们之间的网段所构成。同一个 MST 域的设备具有下列特点：
都启动了 MSTP。
具有相同的域名。
具有相同的 VLAN 到生成树实例映射配置。
具有相同的 MSTP 修订级别配置。
一个局域网可以存在多个 MST 域，各 MST 域之间在物理上直接或间接相连。用户可以通过 MSTP配置命令把多台交换设备划分在同一个 MST 域内。

如图所示的 MST Region D0 中由交换设备 S1、 S2、 S3 和 S4 构成，域中有 3 个 MSTI。
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/3.jpg)

```
3、VLAN 映射表
VLAN 映射表是 MST 域的属性，它描述了 VLAN 和 MSTI 之间的映射关系。
如上图所示， MST 域 D0 的 VLAN 映射表是：
VLAN1 映射到 MSTI1
VLAN2 和 VLAN3 映射到 MSTI2
其余 VLAN 映射到 MSTI0

4、域根
域根（Regional Root）分为 IST（Internal Spanning Tree）域根和 MSTI 域根。
IST 生成树中距离总根（CIST Root）最近的交换设备是 IST 域根。
一个 MST 域内可以生成多棵生成树，每棵生成树都称为一个 MSTI。 MSTI 域根是每个多生成树实例的树根。如图所示，域中不同的 MSTI 有各自的域根
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/4.jpg)

```
MSTI 之间彼此独立， MSTI 可以与一个或者多个 VLAN 对应。 但一个 VLAN 只能与一个 MSTI 对应。

5、主桥
主桥（Master Bridge）也就是 IST Master，它是域内距离总根最近的交换设备。
如果总根在 MST 域中，则总根为该域的主桥。

6、总根
总根是 CIST（Common and Internal Spanning Tree）的根桥，如下图总根是区域 A0 中的某台设备。
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/5.jpg)

```
7、CST
公共生成树 CST（Common Spanning Tree）是连接交换网络内所有 MST 域的一棵生成树。
如果把每个 MST 域看作是一个节点， CST 就是这些节点通过 STP 或 RSTP 协议计算生成的一棵生成树。
如上图所示，较粗的线条连接各个域构成 CST。

8、IST
内部生成树 IST（Internal Spanning Tree）是各 MST 域内的一棵生成树。
IST 是一个特殊的 MSTI， MSTI 的 ID 为 0，通常称为 MSTI0。
IST 是 CIST 在 MST 域中的一个片段。
如上图所示，较细的线条在域中连接该域的所有交换设备构成 IST。

9、SST
构成单生成树 SST（Single Spanning Tree）有两种情况：
运行 STP 或 RSTP 的交换设备只能属于一个生成树。
MST 域中只有一个交换设备，这个交换设备构成单生成树。
如上图所示， B0 中的交换设备就是一棵单生成树。

10、端口角色
MSTP 在 RSTP 的基础上新增了 2 种端口， MSTP 的端口角色共有 7 种：根端口、指定端口、 Alternate端口、 Backup 端口、边缘端口、 Master 端口和域边缘端口。

根端口
在非根桥上，离根桥最近的端口是本交换设备的根端口。根交换设备没有根端口。根端口负责向树根方向转发数据。

指定端口
对一台交换设备而言，它的指定端口是向下游交换设备转发 BPDU 报文的端口

Alternate 端口
从配置 BPDU 报文发送角度来看， Alternate 端口就是由于学习到其它网桥发送的配置 BPDU 报文而阻塞的端口。
从用户流量角度来看， Alternate 端口提供了从指定桥到根的另一条可切换路径，作为根端口的备份端口。

Backup 端口
从配置 BPDU 报文发送角度来看， Backup 端口就是由于学习到自己发送的配置BPDU 报文而阻塞的端口。
从用户流量角度来看， Backup 端口作为指定端口的备份，提供了另外一条从根节点到叶节点的备份通路。

Master端口
是 MST 域和总根相连的所有路径中最短路径上的端口，它是交换设备上连接 MST 域到总根的端口，是域中的报文去往总根的必经之路，是特殊域边缘端口， Master 端口在 CIST 上的角色是 Root Port，在其它各实例上的角色都是 Master 端口。

域 边 缘 端口
域边缘端口是指位于 MST 域的边缘并连接其它 MST 域或 SST 的端口。进行 MSTP 计算时，域边缘端口在 MSTI 上的角色和 CIST 实例的角色保持一致。即如果边缘端口在 CIST 实例上的角色是 Master 端口（域和总根相连的所有路径中最短路径上的端口），则它在域内所有 MSTI 上的角色也是 Master 端口。

边缘端口
如果指定端口位于整个域的边缘，不再与任何交换设备连接，这种端口叫做边缘端口。
边缘端口一般与用户终端设备直接连接。

说明：
除边缘端口外，其他端口角色都参与 MSTP 的计算过程。
同一端口在不同的生成树实例中可以担任不同的角色。

MSTP 的端口状态
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/6.jpg)

```
三、MSTP 报文
MSTP 使用多生成树桥协议数据单元 MST BPDU（Multiple Spanning Tree Bridge Protocol Data Unit）作为生成树计算的依据。 MST BPDU 报文用来计算生成树的拓扑、维护网络拓扑以及传达拓扑变化记录。
STP 中定义的配置 BPDU、 RSTP 中定义的 RST BPDU、 MSTP 中定义的 MST BPDU 及 TCN BPDU差异对比如表所示。
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/7.jpg)

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/8.jpg)

```
无论是域内的 MST BPDU 还是域间的，前 36 个字节和 RST BPDU 相同。
从第 37 个字节开始是 MSTP 专有字段。最后的 MSTI 配置信息字段由若干 MSTI 配置信息组连缀而成。
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/9.jpg)

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/10.jpg)

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/11.jpg)

```
MSTP 报文格式可配置：
目前 MSTP 的 BPDU 报文存在两种格式：
dot1s： IEEE802.1s 规定的报文格式。
legacy：私有协议报文格式。
如果端口收发报文格式为默认支持 dot1s 或者 legacy，这样就存在一个缺点：需要人工识别对端的BPDU 报文格式，然后手工配置命令来决定支持哪种格式。人工识别报文格式比较困难，且一旦配置错误，就有可能导致 MSTP 计算错误，出现环路。
华为采用的端口收发 MSTP 报文格式可配置（stp compliance）功能，能够实现对 BPDU报文格式的自适应：
auto
dot1s
legacy
这样报文收发不但支持 dot1s 和 legacy 格式，还能通过 auto 方式根据收到的 BPDU 报文格式自动切换端口支持的 BPDU 报文格式，使报文格式与对端匹配。在自适应的情况下，端口初始支持 dot1s格式，收到报文后，格式则和收到的报文格式保持一致。
每个 Hello Time 时间内端口最多能发送 BPDU 的报文数可配置。
Hello Time 用于生成树协议定时发送配置消息维护生成树的稳定。如果交换设备在一段时间内没有收到 BPDU 报文，则会由于消息超时而对生成树进行重新计算。
当交换设备成为根交换设备时，该交换设备会按照该设置值为时间间隔发送 BPDU 报文。非根交换设备采用根交换设备所设置的 Hello Time 时间值。
华为数据通信设备提供的每个 Hello Time 时间内端口最多能够发送的 BPDU 报文个数可配置（Max Transmitted BPDU Number in Hello Time is Configurable）功能，可以设定当前端口在 Hello Time 时间内配置 BPDU 的最大发送数目。用户配置的数值越大，表示每 Hello Time 时间内发送的报文数越多。适当的设置该值可以限制端口每 Hello Time 时间内能发送的 BPDU 数目，防止在网络拓扑动荡时， BPDU 占用过多的带宽资源

四、MSTP 拓扑计算

1、MSTP 的基本原理
MSTP 将整个二层网络划分为多个 MST 域，各个域之间通过计算生成 CST。域内则通过计算生成多棵生成树，每棵生成树都被称为是一个多生成树实例。其中实例 0 被称为 IST，其他的多生成树实例为 MSTI。 MSTP 同 STP 一样，使用配置消息进行生成树的计算，只是配置消息中携带的是设备上 MSTP 的配置信息。

2、优先级向量
MSTI 和 CIST 都是根据优先级向量来计算的，这些优先级向量信息都包含在 MST BPDU 中。各交换设备互相交换 MST BPDU 来生成 MSTI 和 CIST。
参与 CIST 计算的优先级向量为：
{ 根交换设备 ID，外部路径开销，域根 ID，内部路径开销，指定交换设备 ID，指定端口 ID，接收端口 ID }
参与 MSTI 计算的优先级向量为：
{ 域根 ID，内部路径开销，指定交换设备 ID，指定端口 ID，接收端口 ID }
括号中的向量的优先级从左到右依次递减。
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/12.jpg)

```
比较原则
同一向量比较，值最小的向量具有最高优先级。
优先级向量比较原则如下。
1. 首先，比较根交换设备 ID。
2. 如果根交换设备 ID 相同，再比较外部路径开销。
3. 如果外部路径开销相同，再比较域根 ID。
4. 如果域根 ID 仍然相同，再比较内部路径开销。
5. 如果内部路径仍然相同，再比较指定交换设备 ID。
6. 如果指定交换设备 ID 仍然相同，再比较指定端口 ID。
7. 如果指定端口 ID 还相同，再比较接收端口 ID。

如果端口接收到的 BPDU 内包含的配置消息优于端口上保存的配置消息，则端口上原来保存的配置消息被新收到的配置消息替代。端口同时更新交换设备保存的全局配置消息。反之，新收到的 BPDU 被丢弃。

3、CIST 的计算
经过比较配置消息后，在整个网络中选择一个优先级最高的交换设备作为 CIST 的树根。在每个MST 域内 MSTP 通过计算生成 IST；同时 MSTP 将每个 MST 域作为单台交换设备对待，通过计算在 MST 域间生成 CST。 CST 和 IST 构成了整个交换设备网络的 CIST。

4、MSTI 的计算
在 MST 域内， MSTP 根据 VLAN 和生成树实例的映射关系，针对不同的 VLAN 生成不同的生成树实例。每棵生成树独立进行计算，计算过程与 STP 计算生成树的过程类似，请参见 STP 拓扑计算。

MSTI 的特点：
每个 MSTI 独立计算自己的生成树，互不干扰。
每个 MSTI 的生成树计算方法与 STP 基本相同。
每个 MSTI 的生成树可以有不同的根，不同的拓扑。
每个 MSTI 在自己的生成树内发送 BPDU。
每个 MSTI 的拓扑通过命令配置决定。
每个端口在不同 MSTI 上的生成树参数可以不同。
每个端口在不同 MSTI 上的角色、状态可以不同。
在运行 MSTP 协议的网络中，一个 VLAN 报文将沿着如下路径进行转发：
在 MST 域内，沿着其对应的 MSTI 转发。
在 MST 域间，沿着 CST 转发。
5、MSTP 对拓扑变化的处理
MSTP 拓扑变化处理与 RSTP 拓扑变化处理过程类似，请参见 RSTP 技术细节中的 RSTP 拓扑变化处理。

五、MSTP 快速收敛机制
MSTP 支持普通方式和增强方式两种 P/A（Proposal/Agreement）机制：
普通方式
MSTP 支持普通方式的 P/A 机制实现与 RSTP 支持的 P/A 机制实现相同
增强方式
```

![图例](https://www.pandaho3.cn/assets/img/python-keyboard-and-mouse/13.jpg)

```
如图所示，在 MSTP 中， P/A 机制工作过程如下：
1. 上游设备发送 Proposal 报文，请求进行快速迁移。下游设备接收到后，把与上游设备相连的端口设置为根端口，并阻塞所有非边缘端口。
2. 上游设备继续发送 Agreement 报文。下游设备接收到后，根端口转为 Forwarding 状态。
3. 下游设备回应 Agreement 报文。上游设备接收到后，把与下游设备相连的端口设置为指定端口，指定端口进入 Forwarding 状态。

缺省情况下，华为数据通信设备使用增强的快速迁移机制。如果华为数据通信设备和其他制造商的设备进行互通，而其他制造商的设备 P/A 机制使用普通的快速迁移机制，此时，可在华为数据通信设备上通过设置 P/A 机制为普通的快速迁移机制，从而实现华为数据通信设备和其他制造商的设备进行互通。
转载链接：https://zhuanlan.zhihu.com/p/118661705

SNMP是广泛应用于TCP/IP网络的一种网络管理协议。SNMP提供了一 种通过运行网络管理软件NMS（Network Management System）的网 络管理工作站来管理网络设备的方法。 SNMP支持以下几种操作： 1. NMS通过SNMP协议给网络设备发送配置信息。 2. NMS通过SNMP来查询和获取网络中的资源信息。 3. 网络设备主动向NMS上报告警消息，使得网络管理员能够及时处理 各种网络问题。

DHCP在核心设置的话，如果跨三层分配，需要OPTION 43的选项
option 43 hex 80 07 00 00 01 C0 A8 01 01 //配置option43字段，指定AC的IP地址192.168.1.1
注：在设备上配置option43属性仅支持十六进制模式，对于配置格式说明如下：80 07 00 00 01 C0 A8 01 01
07：表示后面有7位（两个数字为一位），如果携带两台AC地址，则该字段为0B；
01：表示携带的AC IP数量，如果是两台AC，则该字段为02；
C0 A8 01 01：AC地址的十六进制字符；

（续）

```

