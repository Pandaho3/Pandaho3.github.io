---
title: 记录一次绿盟WAF误判SQL injection排查
author: Pandaho
date: 2021-11-05 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/nsfocus-sql-injection/cover.png
---



## 用知识的土壤来填埋这些坑洞

HTTP协议（Hyper Text Transfer Protocol，超文本传输协议）,是用于从万维网（WWW:World Wide Web ）服务器传输超文本到本地浏览器的传送协议。

HTTP基于TCP/IP通信协议来传递数据。

HTTP基于客户端/服务端（C/S）架构模型，通过一个可靠的链接来交换信息，是一个无状态的请求/响应协议。

HTTP是无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。

HTTP是媒体独立的：只要客户端和服务器知道如何处理的数据内容，任何类型的数据都可以通过HTTP发送。客户端以及服务器指定使用适合的MIME-type内容类型。

HTTP是无状态：无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

### HTTP请求报文由三部分组成（请求行+请求头+请求体）：
![图例](/assets/img/nsfocus-sql-injection/1.jpg)

### 请求行：

①是请求方法，GET和POST是最常见的HTTP方法，除此以外还包括DELETE、HEAD、OPTIONS、PUT、TRACE。

②为请求对应的URL地址，它和报文头的Host属性组成完整的请求URL。

③是协议名称及版本号。

### 请求头：

④是HTTP的报文头，报文头包含若干个属性，格式为“属性名:属性值”，服务端据此获取客户端的信息。

与缓存相关的规则信息，均包含在header中

### 请求体：

⑤是报文体，它将一个页面表单中的组件值通过param1=value1&param2=value2的键值对形式编码成一个格式化串，它承载多个请求参数的数据。不但报文体可以传递请求参数，请求URL也可以通过类似于“/chapter15/user.html? param1=value1&param2=value2”的方式传递请求参数。 

### HTTP请求报文头属性
#### Accept 
请求报文可通过一个“Accept”报文头属性告诉服务端 客户端接受什么类型的响应。 
如下报文头相当于告诉服务端，俺客户端能够接受的响应类型仅为纯文本数据啊，你丫别发其它什么图片啊，视频啊过来，那样我会歇菜的~~~

#### Accept:text/plain 
Accept属性的值可以为一个或多个MIME类型的值（描述消息内容类型的因特网标准， 消息能包含文本、图像、音频、视频以及其他应用程序专用的数据）

#### cookie
客户端的Cookie就是通过这个报文头属性传给服务端的哦！如下所示：
```
Cookie: $Version=1; Skin=new;jsessionid=5F4771183629C9834F8382E23 
```
服务端是怎么知道客户端的多个请求是隶属于一个Session呢？注意到后台的那个jsessionid = 5F4771183629C9834F8382E23木有？原来就是通过HTTP请求报文头的Cookie属性的jsessionid的值关联起来的！（当然也可以通过重写URL的方式将会话ID附带在每个URL的后面哦）。

#### Referer
表示这个请求是从哪个URL过来的，假如你通过google搜索出一个商家的广告页面，你对这个广告页面感兴趣，鼠标一点发送一个请求报文到商家的网站，这个请求报文的Referer报文头属性值就是https://www.baidu.com。

#### Cache-Control
对缓存进行控制，如一个请求希望响应返回的内容在客户端要被缓存一年，或不希望被缓存就可以通过这个报文头达到目的。

### REMOTE_ADDR
表示发出请求的远程主机的 IP 地址，remote_addr代表客户端的IP，但它的值不是由客户端提供的，而是服务端根据客户端的ip指定的，当你的浏览器访问某个网站时，假设中间没有任何代理，那么网站的web服务器（Nginx，Apache等）就会把remote_addr设为你的机器IP，如果你用了某个代理，那么你的浏览器会先访问这个代理，然后再由这个代理转发到网站，这样web服务器就会把remote_addr设为这台代理机器的IP。

### x_forwarded_for
简称XFF头，它代表客户端，也就是HTTP的请求端真实的IP，只有在通过了HTTP 代理或者负载均衡服务器时才会添加该项，正如上面所述,当你使用了代理时,web服务器就不知道你的真实IP了,为了避免这个情况,代理服务器通常会增加一个叫做x_forwarded_for的头信息,把连接它的客户端IP(即你的上网机器IP)加到这个头信息里,这样就能保证网站的web服务器能获取到真实IP。

### POST
协议规定 POST 提交的数据必须放在消息主体（entity-body）中，但协议并没有规定数据必须使用什么编码方式。实际上，开发者完全可以自己决定消息主体的格式，只要最后发送的 HTTP 请求满足上面的格式就可以。

但是，数据发送出去，还要服务端解析成功才有意义。一般服务端语言如 php、python 等，以及它们的 framework，都内置了自动解析常见数据格式的功能。服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。所以说到 POST 提交数据方案，包含了 Content-Type 和消息主体编码方式两部分

### application/x-www-form-urlencoded
这应该是最常见的 POST 提交数据的方式了。浏览器的原生`<form>`单，如果不设置 enctype (即编码)属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。

首先，Content-Type 被指定为 application/x-www-form-urlencoded；其次，提交的数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码(UrlEncoder.encode())。大部分服务端语言都对这种方式有很好的支持。例如 PHP 中，$_POST['title'] 可以获取到 title 的值，$_POST['sub'] 可以得到 sub 数组。

很多时候，我们用 Ajax 提交数据时，也是使用这种方式。例如 JQuery 和 QWrap 的 Ajax，Content-Type 默认值都是「application/x-www-form-urlencoded;charset=utf-8」

## 问题
客户访问业务网站，在进行文件操作处理时，处理失败。

## 排查解决
因为业务网站访问正常，直接定位到应用层问题，查询绿盟WAF，发现该会话被阻断，阻断原因为WAF设备误判该操作为SQL注入。
查看阻断日志，客户发起的POST报文体有包含Delete 字段，WAF可能是字段匹配将其匹配为SQL行为，进行阻断。


## 参考资料

[HTTP请求报文](https://www.cnblogs.com/lmh001/p/9928517.html)  
[代理IP](https://www.cnblogs.com/luxiaojun/p/10451860.html)  

