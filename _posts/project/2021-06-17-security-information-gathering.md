---
title: 网络安全之DNS信息收集
author: Pandaho
date: 2021-06-17 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-information-gathering/cover.png
---



## 原理

​    **信息收集也称为网络踩点(Footprinting)**，指攻击者利用各种手段对攻击目标进行的有计划有步骤的信息收集，从而了解目标的网络环境和安全状况的过程。

​    **域名系统**（英文：**D**omain **N**ame **S**ystem，缩写：**DNS**）是互联网的一项服务，它作为将域名和IP地址相互映射的一个分布式数据库，能够使人更方便地访问互联网。DNS使用UDP端口53。当前，对于每一级域名长度的限制是63个字符，域名总长度则不能超过253个字符。

​    **域名记录又分为：**

**1、A记录（Address）正向解析**

A记录是将一个域名（全称域名FQDN）和一个IP地址关联起来，这也是大多数客户端程序默认的查询类型。

**2、PTR记录（Pointer）反向解析**

PTR记录将一个IP地址对应到主机名（全称域名FQDN），这些记录保存在in-addr.arpa域中。

**3、CNAME（Canonical Name）别名**

别名记录，也称为规范名字，这种记录允许您将多个域名映射到同一台服务器IP。

**4、MX记录（Mail Exchange）**

MX记录是邮件交换记录，它指向一个邮件服务器，用于电子邮件系统发邮件时根据收信人的地址后缀来定位邮件服务器。

**5、NS记录（Name Server）**

NS记录是域名服务器记录，也称为授权服务器，用来指定该域名由哪个DNS服务器来进行解析。

**一个DNS查询过程**，通过8个步骤的解析过程使得客户端可以顺利访问域名，如图所示：

![图例](/assets/img/security-information-gathering/1.png)

**常见的顶级域名主要有两类：**

**1、通用顶级类别域名：**

1】科研机构 .ac;

2】工商金融企业 .com;

3】教育机构 .edu;

4】政府部门 .gov;

5】互联网络信息中心和运行中心 .net;

6】非盈利组织 .org。

**2、国家及地区顶级域**，如中国 .cn；英国.uk等，地理顶级域名一般由各个国家或地区负责。

**子域名（Subdomain Name）**，凡顶级域名前面加前缀的都是该顶级域名的子域名，而子域名根据技术的多少分为二级子域名、三级子域名及多级子域名。

子域名是某个主域的二级域名或多级域名，在防御措施严密情况下无法直接拿下主域，那么就可以采用迂回战术拿下子域名，然后无限靠近主域。



## **方法**

**一、nslookup**

```shell
root@xxxx:~# nslookup www.baidu.com
Server:         192.168.1.2  
Address:        192.168.1.2#53

Non-authoritative answer:
www.baidu.com   canonical name = www.a.shifen.com.
Name:   www.a.shifen.com
Address: 183.232.231.174
Name:   www.a.shifen.com
Address: 183.232.231.172
```

**二、Whois**

```shell
Domain Name: BAIDU.COM
   Registry Domain ID: 11181110_DOMAIN_COM-VRSN
   Registrar WHOIS Server: whois.markmonitor.com
   Registrar URL: http://www.markmonitor.com
   Updated Date: 2020-12-09T04:04:41Z
   Creation Date: 1999-10-11T11:05:17Z
   Registry Expiry Date: 2026-10-11T11:05:17Z
   Registrar: MarkMonitor Inc.
   Registrar IANA ID: 292
   Registrar Abuse Contact Email: abusecomplaints@markmonitor.com
   Registrar Abuse Contact Phone: +1.2083895740
   Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited
   Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
   Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited
   Domain Status: serverDeleteProhibited https://icann.org/epp#serverDeleteProhibited
   Domain Status: serverTransferProhibited https://icann.org/epp#serverTransferProhibited
   Domain Status: serverUpdateProhibited https://icann.org/epp#serverUpdateProhibited
   Name Server: NS1.BAIDU.COM
   Name Server: NS2.BAIDU.COM
   Name Server: NS3.BAIDU.COM
   Name Server: NS4.BAIDU.COM
   Name Server: NS7.BAIDU.COM
   DNSSEC: unsigned
   URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/
>>> Last update of whois database: 2021-06-14T11:15:50Z <<<
```

**三、Web方式查询：**

```shell
域研究工具：https://dnsdumpster.com/
阿里云：https://whois.aliyun.com/
站长工具：http://icp.chinaz.com/
天眼查：https://www.tianyancha.com/
https://crt.sh/
https://search.censys.io/
在线子域查询：https://phpinfo.me/domain
爱站网（IP反查域名）：https://dns.aizhan.com/
搜索引擎挖掘 如：在Google中输入 site：baidu.com
Shodan：https://www.shodan.io/ （net：ip  、port：端口，可采用精确查询）
```

**四、DIG查询**

语法：dig （选项） 需要查询的域名

@<DNS服务器地址> 指定进行域名解析的域名服务器；

any  #显示所有类型的域名记录，默认只显示A记录

-X #反向解析

```shell
root@xxxx:~# dig @114.114.114.114 www.baidu.com any

; <<>> DiG 9.11.5-P4-5.1+b1-Debian <<>> @114.114.114.114 www.baidu.com any
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 44516
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;www.baidu.com.                 IN      ANY

;; ANSWER SECTION:
www.baidu.com.          34      IN      CNAME   www.a.shifen.com.

;; Query time: 649 msec
;; SERVER: 114.114.114.114#53(114.114.114.114)
;; WHEN: Mon Jun 14 07:33:06 EDT 2021
;; MSG SIZE  rcvd: 69
```

**五、Maltego**

​该工具的主要重点是分析通过互联网访问的数据之间的真实世界关系，其中包括互联网基础设施和收集有关拥有该网络的人员和组织的数据。通过使用OSINT（开源情报）技术，查询Whois记录，社交网络，DNS记录，不同的在线API，提取元数据和搜索引擎来搜索这些数据之间的连接。该工具将提供图形布局结果，允许对数据进行聚类，使关系准确和及时。使用Maltego可以使用社区免费版，但注册账户是需要翻墙。
```
官网：https://www.maltego.com/
```

进入之后创建新项目，输入账户密码后安装组件建立，在Search我们搜索domain将其添加进项目，编辑对应域名，右键可选择各种功能，如图所示，选择DNS Name生成所有子域信息。

![图例](/assets/img/security-information-gathering/2.png)

**六、Scapy**

​    **Scapy**是一个可以让用户发送、侦听和解析并伪装网络报文的Python 程序。这些功能可以用于制作侦测、扫描和攻击网络的工具。换言之，`Scapy` 是一个强大的操纵报文的交互程序。它可以伪造或者解析多种协议的报文，还具有发送、捕获、匹配请求和响应这些报文以及更多的功能。`Scapy`可以轻松地做到像扫描(scanning)、路由跟踪(tracerouting)、探测(probing)、单元测试(unit tests)、攻击(attacks)和发现网络(network discorvery)这样的传统任务。

1、查看ARP包格式

```
>>> ARP().display()
###[ ARP ]### 
  hwtype= 0x1
  ptype= IPv4
  hwlen= None
  plen= None
  op= who-has
  hwsrc= 00:0c:29:b9:37:b6
  psrc= 192.168.254.130
  hwdst= 00:00:00:00:00:00
  pdst= 0.0.0.0
```



​    在Scapy中使用sr1函数、sr1函数来发送和接收第三层的数据包（IP，ARP等），而srp函数用于发送和接受第二层的数据包（Ethernet，802.3等）例如，我们向 某个ip 发送一个 ARP 包：（从而得知对方的MAC）


```
>>> sr1(ARP(pdst="192.168.254.1"))
Begin emission:
*Finished sending 1 packets.

Received 1 packets, got 1 answers, remaining 0 packets
<ARP  hwtype=0x1 ptype=IPv4 hwlen=6 plen=4 op=is-at hwsrc=00:50:56:c0:00:08 psrc=192.168.254.1 hwdst=00:0c:29:b9:37:b6 pdst=192.168.254.130 |<Padding  load='\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' |>>

```

2、查看TCP包格式

```
>>> TCP().display()
###[ TCP ]### 
  sport= ftp_data
  dport= http
  seq= 0
  ack= 0
  dataofs= None
  reserved= 0
  flags= S
  window= 8192
  chksum= None
  urgptr= 0
  options= []
```

![图例](/assets/img/security-information-gathering/3.png)

了解机制原理后，我们便可以自己编写包内容发送：
```
>>> sr1(IP(dst="www.baidu.com")/TCP(flags="S",dport=443),timeout=1)
Begin emission:
.Finished sending 1 packets.
*
Received 2 packets, got 1 answers, remaining 0 packets
<IP  version=4 ihl=5 tos=0x0 len=44 id=65249 flags= frag=0 ttl=128 proto=tcp chksum=0xdd27 src=183.232.231.174 dst=192.168.254.130 |<TCP  sport=https dport=ftp_data seq=811422041 ack=1 dataofs=6 reserved=0 flags=SA window=64240 chksum=0xbadc urgptr=0 options=[('MSS', 1460)] |<Padding  load='\x00\x00' |>>>
```

待续…………………………………………………………

**参考来源**

1、百度百科  
2、学神IT教育
