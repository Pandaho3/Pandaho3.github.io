---
title: 记录TCP window full和TCP zero window报文排查
author: Pandaho
date: 2021-09-14 20:00:00 
categories: [Project] 
tags: [network]
image: /assets/img/network-tcpwindow/cover.png
---



## 用知识的土壤来填埋这些坑洞

传输控制协议（TCP，Transmission Control Protocol）是一种面向连接的、可靠的、基于字节流的传输层通信协议，由IETF的RFC 793定义。

TCP协议里可靠方式就是建立窗口进行传输，其机制有2种：一种是固定的窗口；另一种是滑动的窗口。

而窗口大小就是我们一次传输几个数据。对所有数据帧按顺序赋予编号，发送方在发送过程中始终保持着一个发送窗口，只有落在发送窗口内的帧才允许被发送；同时接收方也维持着一个接收窗口，只有落在接收窗口内的帧才允许接收。这样通过调整发送方窗口和接收方窗口的大小可以实现流量控制。

### TCP固定窗口协议：

![图例](/assets/img/network-tcpwindow/1.png)

发送方发送一个包1，这时候接收方确认包1。

发送包2，确认包2。

就这样一直下去，直到把数据完全发送完毕，这样就结束了。那么就解决了丢包，出错，乱序等一些情况！

同时也存在一些问题，比如吞吐量非常的低，我们发完包1，一定要等确认包1，我们才能发送第二个包。

为解决固定窗口的吞吐量问题，就出现了滑动窗口。

### TCP滑动窗口协议：

![图例](/assets/img/network-tcpwindow/2.png)

![图例](/assets/img/network-tcpwindow/3.png)

前面的包确认后，窗口往后移继续将未发送的包读进缓存，把待发送的状态包变为已发送。

在TCP协议中，发送方和接受方通过各自维护自己的缓冲区。通过商定包的重传机制等一系列操作，来解决不可靠的问题。

缓冲区是 用来解决网络之间数据不可靠的问题，例如丢包，重复包，出错，乱序。

### 丢包的情况：

有可能我们包发过去，对方的Ack丢了，也有可能我们的包并没有发送过去，从发送方角度看就是我们没有收到Ack。

![图例](/assets/img/network-tcpwindow/4.png)

### 窗口的情况：

一直在等Ack，如果一直等不到的话，就采用超时重传，我们也会把读进缓存的待发送的包也一起发过去。但是，这个时候我们的窗口已经发满了。所以并不能把12号包读进来，而是始终在等待5号包的Ack。

![图例](/assets/img/network-tcpwindow/5.png)

客户端与服务端seq和ack序号：

客户端seq=该窗口上个报文seq+len，ack=1

服务端seq=1，ack=客户端的seq。

TCP ZeroWindow 表示窗口满了，也就是win=0，提示对方不能再发送数据。

TCP window Full 表示窗口满了，我不能再发送数据了。

## 故障问题：

客户端在上传文件至服务器，但上传到最后总是失败。

## 排查：

通过抓包发现该会话存在周期性TCP window full和TCP zero window报文，客户端发送一段报文后就提示TCP window full或者TCP zero window，然后等到服务端回复ack或tcp window update后继续发送，这种状态持续到最后服务端应该是Socket进程卡死，不再回复报文，客户端发送KEEP-ALIVE探测无响应就断开连接了。


## 参考资料

百度  
[TCP window full和TCP zero window](https://blog.51cto.com/u_15060507/3641387)  
[TCP滑动窗口机制与原理详解](https://www.fujieace.com/jingyan/tcp-window-protocol.html)  

