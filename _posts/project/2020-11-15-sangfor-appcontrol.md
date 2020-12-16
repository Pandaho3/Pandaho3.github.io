---
title: 深信服AC DROPFLAG appcontrol错误排查
author: Pandaho
date: 2020-10-10 20:00:00 +0000
categories: [Project] 
tags: [Sangfor]
image: /assets/img/sangfor-appcontrol/cover.png
---

##  简介

深信服AC（上网行为管理）实现对互联网访问行为的全面管理，可用于网页过滤、行为控制、流量管理、防止内网泄密、防范法规风险、互联网访问行为记录、上网安全等多个方面。

##  事件

核心交换机发现无法ping通路由器，通过自下向上排查法，发现其数据流到达深信服AC（上网行为管理）被拒绝  
通过AC-系统诊断-上网故障排查，ip因策略拒绝而被丢包

```
ICMP	ICMP[1]		AppControl		DROPFLAG_appcontrol		应用服务控制丢包 
```

进入日志中心查看-所有日志-选择当天拒绝行为

![图例](https://www.pandaho3.cn/assets/img/sangfor-appcontrol/1.png)  
发现该ip被默认策略录入拒绝组。  
进入该组删除核心交换机ip记录，添加至高权限组
