---
title: 记一次vps代理搭建
author: Pandaho
date: 2021-12-23 20:00:00 
categories: [Project] 
tags: [network]
image: /assets/img/network-v2ray/cover.png
---




## 用知识的土壤来填埋这些坑洞

​	最近临近圣诞，国外的VPS又迎来一波折扣，正好之前Vultr买的过期了，这次选了Racknerd，正好有个折扣套餐一年10美元差不多，性能够我代理用了（虽然ip资源少了些，单独购买ip资源，1个ip差不多2美元了），购买方式就不写，官网直接买，有手就行，下面主要讲搭建和原理。

​	[附图几种代理项目](/assets/img/network-v2ray/1.png)

我选中的是v2ray，因为这个项目比较成熟，相关的工具也比较齐全，稳定性比较好。

​	V2Ray 是在Shadowsocks 被封杀之后，为了表示抗议而开发的，属于后起之秀，功能更加强大，为抗GFW封锁而生。V2Ray 现在已经是 Project V 项目的核心工具，而 Project V 是一个平台，其中也包括支持 Shadowsocks 协议。由于 V2Ray 早于 Project V 项目，而且名声更大，所以我们习惯称 Project V 项目为 V2Ray，所以我们平时所说的 V2Ray 其实就是 Project V 这个平台，也就是一个工具集。其中，只有 VMess协议是V2Ray社区原创的专属加密通讯协议，被广泛应用于梯子软件。

​	现有搭建方式网上一堆一键脚本，但人家在里面加点后门你也不知道，所以最好从官网作者那里下载，目前手册上的服务器搭建脚本已经过期，可以从作者github上找到最新的。

```shell
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-dat-release.sh)
```

服务器的加固我是采用ufw，启用后默认是定义只出不进的，只需要允许几个开放的端口就行了。

v2ray是需要配置至少一个入站协议（Inbound）和一个出站协议（Outbound）才可以正常工作。

​	入站协议负责与客户端（如浏览器）通信：入站协议通常可以配置用户认证，如 ID 和密码等；入站协议收到数据之后，会交给分发器（Dispatcher）进行分发；出站协议负责将数据发给服务器，如另一台主机上的 V2Ray。

​	现在服务端安装好了，工作原理了也了解，就可以开始配置了

```shell
service v2ray status  #查看
     CGroup: /system.slice/v2ray.service
             └─xxxx /xxx/xxx/xxx/v2ray -config /xxx/xxx/v2ray/config.json
```

在CGroup里面我们看到config.json的路径，手册里有默认配置，如果需要混淆、伪装等可以在默认配置的基础上添加键值，协议我是采用VMess，这是一个加密传输协议，它分为入站和出站两部分，通常作为 V2Ray 客户端和服务器之间的桥梁。

​	客户端的配置可以在github上下载，但是是无GUI的，手册有个神一样的工具们，里面有个各平台GUI客户端，我使用的是V2RayN和BifrostV，配置方面也是一样导入config.json，也可以图形化配置最后会在目录生成config.json。

​	V2RayN的客户端在config.json有 "email": "t@t.tt" 这个键值，一开始以为是作者留了个监控，在看github项目也有人反馈这个，作者表示是因为开启统计流量，email键值不能留空，所以会生成一个空邮箱，我去测试这个邮箱，确实是空邮箱。

​	以上都配置好后，客户端启动后，Inbound我是配置成Socks，因为socks协议没有对传输加密，不适宜经公网中传输。设备（电脑、手机等）可以在全局或者浏览器做代理，浏览器我使用chrome SwitchyOmega进行代理，与客户端建立Socks连接。

​	**Socks** 属于一个代理协议，可以在一些应用层协议中间工作（比如HTTP(S)，FTP等）。这个协议最初由David Koblas开发，而后由NEC的Ying-Da Lee将其扩展到SOCKS4。最新协议是**SOCKS5**，与前一版本相比，增加支持UDP、验证，以及IPv6。

​	代理也配置完成后，开始有数据传输，整个连接就建立，客户端和服务端我们前面说是采用VMess，VMess 是一个基于 TCP 的协议，所有数据使用 TCP 传输，通过抓包我们能看到所有包都封装成TCP。

​	到了这里就已经成功搭建代理了，对于其他平台的配置，在windows客户端配置完后可以通过URL导出，其他设备引用就行了。



## 参考资料

[各种代理项目的区别](https://www.lbtlm.com/archives/167)

[PrijectV官网手册](https://www.atzlinux.com/doc/v/v2ray/)

[Github脚本](https://github.com/v2fly/fhs-install-v2ray)

[Github项目地址](https://github.com/v2fly/v2ray-core/releases)

[Socks详解](https://segmentfault.com/a/1190000038498680)
