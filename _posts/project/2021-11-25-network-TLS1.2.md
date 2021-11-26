---
title: 记一次TLS1.2协议排查记录
author: Pandaho
date: 2021-11-25 20:00:00 
categories: [Project] 
tags: [network]
image: /assets/img/network-TLS1.2/cover.png
---



## 故障起因

​	今天和闹钟进行了两回合争斗才下起了床，广东的风还是这么刺骨，昨晚忘记把窗合上，起来到阳台边迅速关上了这看起来非常可靠的玻璃窗，抬头挺胸，舒展了下因为寒冷而弯曲的腰，就这样开启了新的一天。

​	不知道这种第一人称方式的描述怎么样，我是看了鲁迅先生的一些作品后，很喜欢这种讲述的感觉，但文采还是太差了，总是词穷。

​	回归正点，这次是一次服务无法访问的故障，原因是TLS协商过程一个报文被丢弃，导致会话建立失败，这次学到了很多密码学的知识，就打算记录下来，分享给大家。


## 用知识的土壤来填埋这些坑洞

404页面是客户端在浏览网页时，服务器无法正常提供信息，或是服务器无法回应，且不知道原因所返回的页面。

采用单钥密码系统的加密方法，同一个密钥可以同时用作信息的加密和解密，这种加密方法称为对称加密，也称为单密钥加密。

非对称加密算法需要两个密钥来进行加密和解密，这两个密钥是公开密钥（public key，简称公钥）和私有密钥（private key，简称私钥）。

TLS概述：TLS和他的前身SSL，都是提供在计算机网络上安全通信的密码学协议，最常见就是用于HTTPS中，用来保护Web通信的。

首先明确TLS的作用三个作用：
（1）身份认证
通过证书认证来确认对方的身份，防止中间人攻击
（2）数据私密性
使用对称性密钥加密传输的数据，由于密钥只有客户端/服务端有，其他人无法窥探。
（3）数据完整性
使用摘要算法对报文进行计算，收到消息后校验该值防止数据被篡改或丢失。

报文格式：
Client Hello：客户端向服务端打招呼；携带支持的协议、支持的安全套件供服务端选择；

Server Hello：服务端回应客户客户端的招呼信息；结合客户端的信息，选择合适的加密套件；

Certificate：服务端向客户端发送自己的数字证书（此证书包含服务端的公钥），以实现验证身份；

Server Key Exchange：服务端向客户端发送基于选择的加密套件生成的公钥（此公钥为椭圆曲线的公钥，用于协商出对称加密的密钥）；

Server Hello Done：服务端向客户端表示响应结束；

Client Key Exchange：客户端向服务端发送自己生成的公钥（此公钥为椭圆曲线的公钥，用于协商出对称加密的密钥）；

Change Cipher Spec：变更密码规范；告知服务端/客户端，以后的通信都是基于AES加密的；

Encrypted Handshake Message：基于协商生成的密钥，用AES加密验证信息让服务端/客户端进行认证；如果对方可以解密，则双方认证无误开始通信；

New Session Ticket：是优化SSL连接的一种方法。


## 排查过程

服务访问失败回复的是404，IP和端口都是能通信的，排查4层问题，那直接抓包分析吧。

根据抓到的报文，已经和服务器进行TLS协商了，过滤下收到了3个TLS报文

```
Client Hello
Server Hello, Change Cipher Spec, Encrypted Handshake Message
Alert (Level: Fatal, Description: Certificate Unknown)
```

### 第一个报文client hello

**客户端Client Hello阶段：**

作用：客户端向服务端发送建立连接请求；

此时，客户端会携带支持的版本号、支持的加密套件、客户端随机数(用于协商对称加密的密钥)、支持的HTTP协议

```python
Handshake Protocol: Client Hello
    Handshake Type: Client Hello (1)
    Length: 508
    Version: TLS 1.2 (0x0303) #版本号
    Random: 7841a25e560791b4bb05ee70a689481e3687970a39ed99ba9bbe4bbbc3e521d1
    #随机数
    Session ID Length: 32
    Session ID: d4cb2f89b29f776f39b9424512493ad607ad1d8337b87acb355bef22bfafd5be
    Cipher Suites Length: 32
    Cipher Suites (16 suites)  #支持的加密套件
        Cipher Suite: Reserved (GREASE) (0xfafa)
        Cipher Suite: TLS_AES_128_GCM_SHA256 (0x1301)
        Cipher Suite: TLS_AES_256_GCM_SHA384 (0x1302)
        Cipher Suite: TLS_CHACHA20_POLY1305_SHA256 (0x1303)
        Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 (0xc02b)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (0xc02f)
        Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 (0xc02c)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
        Cipher Suite: TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 (0xcca9)
        Cipher Suite: TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 (0xcca8)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (0xc013)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (0xc014)
        Cipher Suite: TLS_RSA_WITH_AES_128_GCM_SHA256 (0x009c)
        Cipher Suite: TLS_RSA_WITH_AES_256_GCM_SHA384 (0x009d)
        Cipher Suite: TLS_RSA_WITH_AES_128_CBC_SHA (0x002f)
        Cipher Suite: TLS_RSA_WITH_AES_256_CBC_SHA (0x0035)
  
```



### 第二个报文Server Hello

**服务端Server Hello阶段：**

作用：根据客户端所携带的内容，确定建立连接版本、加密套件，生成服务端随机数(用于协商对称加密的密钥)

```python
Handshake Protocol: Server Hello
    Handshake Type: Server Hello (2)
    Length: 96
    Version: TLS 1.2 (0x0303)
    Random: af5dcac5a3d0c4ada628df86af79bae69c2291803cdde9e87a18ff7177b15fca
    Session ID Length: 32
    Session ID: d4cb2f89b29f776f39b9424512493ad607ad1d8337b87acb355bef22bfafd5be
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)   #协商确定的加密套件
    Compression Method: null (0)
    Extensions Length: 24
    Extension: renegotiation_info (len=1)
    Extension: application_layer_protocol_negotiation (len=11)
    Extension: extended_master_secret (len=0)

```



### 第三个报文Alert

这只是个单纯的警告报文，正常应该是服务端Certificate, Server Key Exchange, Server Hello Done阶段：

Certificate：向客户端发送由权威ca签发的证书，以验证身份；

```python
Handshake Protocol: Certificate
    Handshake Type: Certificate (11)
    Length: 4095
    Certificates Length: 4092
    Certificates (4092 bytes)
        Certificate Length: 1667
        #CA签发的证书
        Certificate: 3082067f30820567a003020102021069defcc9d37b8d34dfd517c670767274300d06092a… (id-at-commonName=*.cgnpc.com.cn,id-at-organizationName=China General Nuclear Power Group,id-at-localityName=Shenzhen,id-at-stateOrProvinceName=Guangd
        Certificate Length: 1208
        Certificate: 308204b43082039ca003020102021005ed88d8088d11ebddd623963cbaed42300d06092a… (id-at-commonName=WoTrus OV SSL CA,id-at-organizationName=WoTrus CA Limited,id-at-countryName=CN)
        Certificate Length: 1208
        Certificate: 308204b43082039ca003020102021100939285400165715f947f288fefc99b28300d0609… (id-at-commonName=Certum Trusted Network CA,id-at-organizationalUnitName=Certum Certification Authority,id-at-organizationName=Unizeto Technologies S.

```

Server Key Exchange：基于Server Hello阶段选择的ECDHE交换密钥算法，发送椭圆曲线生成的公钥;

Server Hello Done：服务端结束打招呼阶段。

```python

Handshake Protocol: Server Key Exchange
    Handshake Type: Server Key Exchange (12)
    Length: 296
    EC Diffie-Hellman Server Params
        Curve Type: named_curve (0x03)
        Named Curve: x25519 (0x001d)
        Pubkey Length: 32
        #采用服务端非对称加密的公钥加密后的密钥
        Pubkey: 55b03a88658042b68123222122d77f272bcde6a696236a266214ffe95d0a8c61
        Signature Algorithm: rsa_pss_rsae_sha256 (0x0804)
        Signature Length: 256
        Signature: 2140a590dc9e3000b97bed781324b6ca4b6c8ac9fde91e91b36d17091a4a43d2dced0f1b…

```

关键在第三个报文，可以定位到故障问题了，客户端与服务器协商过程，在进行非对称加密时，未收到服务器的数字证书的报文，也就是 Certificate, Server Key Exchange 这个报文，现在剩下就是根据该业务的拓扑，逐步抓包，确定服务器发出的数字证书报文丢弃在哪段，那就能定位到最终原因。



## 参考资料

[浅析TLS 1.2协议](https://segmentfault.com/a/1190000014740303?utm_source=tag-newest)  
[TLSv1.2协议了解](https://blog.csdn.net/lblblblblzdx/article/details/88684788)  
[基于wireshark抓包解析TLS1.2的通讯过程](https://blog.51cto.com/liuzhengwei521/2430427)  

