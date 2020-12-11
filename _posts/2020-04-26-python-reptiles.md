---
title: 使用Python爬取公众号图片并识别图片文字自动重命名
author: Pandaho
date: 2020-04-26 20:00:00 
categories: [project] 
tags: [python]
image: /assets/img/python reptiles/cover.png
---

表情包是一门“语言”！ 我也是站在表情包巅峰的狼人了！


##  前言

自从半佛老师发布的第一条以表情包为视频底图的视频后，b站开启了表情包视频的时代！
近期在github上看到一个python爬虫项目，目的是为了爬取半佛老师公众号大量表情包，并通过百度文字识别api重命名图片名称，方便后期使用表情包，我便download下来试下，下面分享期间遇到的一些问题和解决方法！
### 背景说明
	• Python3
	• Windows



##  流程

爬虫项目 [github Repositorie 地址](https://github.com/Brucepk/banfo_pics)

其中banfo_pics.py是python爬虫，pic_text.py是文字识别。

banfo_pics.py

使用charles抓包，安装后需要 Help -- SSL Proxying -- Install Charles Root Certificate 安装证书，刷出来的 [https://mp.weixin.qq.com](https://mp.weixin.qq.com/) 需要右键Enabled ssl proxying，这样刷出来的https就不会“unknown”了。

其中cookies，headers，params的值，一段时间后会更新，所以需要重新更新下，主要更新的wap_sid2，Referer，key，appmsg_token这几个值，不然不更新会失败。

在下载时一直切换不进创建的目录，我单独尝试os.chdir(）的功能也正常，后面发现filename 的值将（r'./banfo/' +）删掉就正常了。

[代理ip可以使用作者提供的这个网站](https://www.xicidaili.com/)

pic_text.py

在安装aip时（百度AI的文字识别接口），你安装的aip包是无法使用的，需要pip install baidu-aip，这可能是百度AI的文字识别接口的一个坑吧！

APP_ID，API_KEY，SECRECT_KEY在 [百度智能云里人工智能产品创建个文字识别应用可以免费使用](https://console.bce.baidu.com/)。

pic_path路径最后的 / 千万不要忘了。

现在你就是和半佛老师一样拥有无数表情包的狼人了！

 