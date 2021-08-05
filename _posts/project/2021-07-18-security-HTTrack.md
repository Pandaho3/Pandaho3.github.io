---
title: 渗透预备-网站克隆HTTrack
author: Pandaho
date: 2021-07-18 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-HTTrack/cover.png
---




## **原理**

在开始渗透前，信息收集是必不可少的，信息收集又分主动、被动，首先对目标进行扫描，探测，最后制定攻击方案，而后进行渗透，成功渗透拿下目标再留后门维持访问权限。

**HTTrack**用于对目标网站进行克隆，可以对目标网站所有的页面都复制一份放到本地，HTTrack是专门针对WEB应用程序服务器进行探测，HTTrack可以对目标WEB的应用中所有可访问和可下载的页面都拷贝到本地，拷贝目标WEB服务器到本地的主要作用是在探测时尽量减少与目标主机产生交互。

通过在本地搭建IIS，来进行信息收集（内网地址，架构信息，版本信息等）

IIS（Internet Information  Server，互联网信息服务）是一种Web（网页）服务组件，其中包括Web服务器、FTP服务器、NNTP服务器和SMTP服务器，分别用于网页浏  览、文件传输、新闻服务和邮件发送等方面，它使得在网络（包括互联网和局域网）上发布信息成了一件很容易的事。



## **挖坑过程**

```shell
httrack #启动
输入 name
输入 path
输入 URL
选择 acthon
输入代理 proxy
wildcards  选择文件，可采用 url/* 下载该路径下全部
options 设置


在windows程序与功能启动IIS
（如果使用ASP.NET的安装需要将ASP.NET勾上）
添加网站后启动
```

![附图](/assets/img/security-HTTrack/1.png)



## 坑描述

HTTP 错误 500.19 - Internal Server Error 无法访问请求的页面，因为该页的相关配置数据无效。

在IIS内双击错误页功能，将对于错误输出改文详细，可查看错误详细内容，

HTTP Error 500.19 配置错误由于权限不足而无法读取配置文件

将配置文件安全属性添加  Everyone  用户并赋予修改权限。


