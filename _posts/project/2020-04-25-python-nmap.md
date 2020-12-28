---
title: Python自动化之nmap端口扫描
author: Pandaho
date: 2020-04-25 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python nmap/cover.png
---

扫描ip网段主机详细信息，如操作系统、端口等


##  简介

Nmap，也就是Network Mapper，最早是Linux下的网络扫描和嗅探工具包。

Nmap是一个网络连接端扫描软件，用来扫描网上电脑开放的网络连接端。确定哪些服务运行在哪些连接端，并且推断计算机运行哪个操作系统（这是亦称 fingerprinting）。它是网络管理员必用的软件之一，以及用以评估网络系统安全。

正如大多数被用于网络安全的工具，Nmap 也是不少黑客及骇客（又称脚本小子）爱用的工具 。系统管理员可以利用Nmap来探测工作环境中未经批准使用的服务器，但是黑客会利用Nmap来搜集目标电脑的网络设定，从而计划攻击的方法。

Nmap 在黑客帝国(The Matrix)中，连同SSH1的32位元循环冗余校验漏洞，被崔妮蒂用以入侵发电站的能源管理系统。

基本功能有三个：

- 一是探测一组主机是否在线；
- 其次是扫描主机端口，嗅探所提供的网络服务；
- 还可以推断主机所用的操作系统     。

Nmap可用于扫描仅有两个节点的LAN，直至500个节点以上的网络。Nmap 还允许用户定制扫描技巧。通常，一个简单的使用ICMP协议的ping操作可以满足一般需求；也可以深入探测UDP或者TCP端口，直至主机所使用的操作系统；还可以将所有探测结果记录到各种格式的日志中， 供进一步分析操作。

### 背景说明

- Python3
- Windows
- Nmap

##  流程

下载地址： [Nmap官网](https://nmap.org/)

安装python-nmap pip3 install python-nmap

Nmap_ping扫描：

```python
import nmap

import sys

*def* nmap_ping_scan(*network_prefix*):    # 创建一个扫描实例

nm = nmap.PortScanner()   # 配置nmap参数

ping_scan_raw_result = nm.scan(*hosts*=network_prefix, *arguments*='-v -n -sn')

host_list = []     # 分析扫描结果，并放入主机清单

for Result in ping_scan_raw_result['scan'].values():

  if Result['status']['state'] == 'up':

​       host_list.append(Result['addresses']['ipv4'])

return host_list

if __name__ == '__main__':

for host in nmap_ping_scan(sys.argv[1]):

  print('%-20s %5s' % (host, 'is UP'))
```



输出：

```
C:\Users> python .\nmap_ping扫描.py 192.168.0.0/24

192.168.0.102    is UP
 192.168.0.104    is UP
 192.168.0.105    is UP
 192.168.0.109    is UP
 192.168.0.103    is UP
```

Nmap_A综合扫描：

```python
import nmap
 import sys

*def* nmap_A_scan(*network_prefix*):

nm = nmap.PortScanner()    # 配置nmap扫描参数

scan_raw_result = nm.scan(*hosts*=network_prefix, *arguments*='-v -n -A')    # 分析扫描结果

for host, result in scan_raw_result['scan'].items():

  if result['status']['state'] == 'up':

   print('#' * 17 + 'Host:' + host + '#' * 17)

   print('-' * 20 + '操作系统猜测' + '-' * 20)

   for os in result['osmatch']:

​    print('操作系统为：' + os['name'] + ' ' *

​      3 + '准确度为：' + os['accuracy'])

   idno = 1

   try:

​    for port in result['tcp']:

​     try:

​      print('-' * 17 + 'TCP服务器详细信息' +

​        '[' + *str*(idno) + ']' + '-' * 17)

​      idno += 1

​      print('TCP端口号：' + *str*(port))

​      try:

​       print('状态：' + result['tcp'][port]['state'])

​      except:

​       pass

​      try:

​       print('原因：' + result['tcp'][port]['reason'])

​      except:

​       pass

​      try:

​       print('额外信息：' + result['tcp'][port]['extrainfo'])

​      except:

​       pass

​      try:

​       print('名字：' + result['tcp'][port]['name'])

​      except:

​       pass

​      try:

​       print('版本：' + result['tcp'][port]['version'])

​      except:

​       pass

​      try:

​       print('产品：' + result['tcp'][port]['product'])

​      except:

​       pass

​      try:

​       print('CPE：' + result['tcp'][port]['cpe'])

​      except:

​       pass

​      try:

​       print('脚本：' + result['tcp'][port]['script'])

​      except:

​       pass

​     except:

​      pass

   except:

​    pass

   idno = 1

   try:

​    for port in result['udp']:

​     try:

​      print('-' * 17 + 'UDP服务器详细信息' +

​        '[' + *str*(idno) + ']' + '-' * 17)

​      idno += 1

​      print('UDP端口号：' + *str*(port))

​      try:

​       print('状态：' + result['udp'][port]['state'])

​      except:

​       pass

​      try:

​       print('原因：' + result['udp'][port]['reason'])

​      except:

​       pass

​      try:

​       print('额外信息：' + result['udp'][port]['extrainfo'])

​      except:

​       pass

​      try:

​       print('名字：' + result['udp'][port]['name'])

​      except:

​       pass

​      try:

​       print('版本：' + result['udp'][port]['version'])

​      except:

​       pass

​      try:

​       print('产品：' + result['udp'][port]['product'])

​      except:

​       pass

​      try:

​       print('CPE：' + result['udp'][port]['cpe'])

​      except:

​       pass

​      try:

​       print('脚本：' + result['udp'][port]['script'])

​      except:

​       pass

​     except:

​      pass

   except:

​    pass

if __name__ == '__main__':

nmap_A_scan(sys.argv[1])
```

输出：

```
C:\Users> python .\nmap_A_scan.py 192.168.0.103  
 \#################Host:192.168.0.103#################  
 --------------------操作系统猜测--------------------  
 操作系统为：Microsoft Windows 7  准确度为：99  
 操作系统为：Microsoft Windows 8.1  准确度为：99  
 操作系统为：Microsoft Windows Vista, Windows 7 SP1, or Windows 8.1 Update 1  准确度为：97  
 操作系统为：Microsoft Windows 10 1607  准确度为：96  
 操作系统为：Microsoft Windows 7 or 8.1 R1 or Server 2008 R2 SP1  准确度为：96  
 操作系统为：Microsoft Windows 10  准确度为：94  
 操作系统为：Microsoft Windows Vista SP2 or Windows 7 Ultimate SP0 - SP1  准确度为：94  
 操作系统为：Microsoft Windows Vista  准确度为：94  
 操作系统为：Microsoft Windows 7 Professional SP1  准确度为：93  
 操作系统为：Microsoft Windows 7 SP1  准确度为：93  
 -----------------TCP服务器详细信息[1]-----------------  
 TCP端口号：135  
 状态：open  
 原因：syn-ack  
 额外信息：  
 名字：msrpc  
 版本：  
 产品：Microsoft Windows RPC  
 CPE：cpe:/o:microsoft:windows  
 -----------------TCP服务器详细信息[2]-----------------  
 TCP端口号：139  
 状态：open  
 原因：syn-ack  
 额外信息：  
 名字：netbios-ssn  
 版本：  
 产品：Microsoft Windows netbios-ssn  
 CPE：cpe:/o:microsoft:windows  
 -----------------TCP服务器详细信息[3]-----------------  
 TCP端口号：445  
 状态：open  
 原因：syn-ack  
 额外信息：workgroup: WORKGROUP  
 名字：microsoft-ds  
 版本：  
 产品：Windows 7 Home Premium 7601 Service Pack 1 microsoft-ds  
 CPE：cpe:/o:microsoft:windows  
 -----------------TCP服务器详细信息[4]-----------------  
 TCP端口号：1025  
 状态：open  
 原因：syn-ack  
 额外信息：  
 名字：msrpc  
 版本：  
 产品：Microsoft Windows RPC  
 CPE：cpe:/o:microsoft:windows  
 -----------------TCP服务器详细信息[5]-----------------  
 TCP端口号：1026  
 状态：open  
 原因：syn-ack  
 额外信息：  
 名字：msrpc  
 版本：  
 产品：Microsoft Windows RPC  
 CPE：cpe:/o:microsoft:windows  
 -----------------TCP服务器详细信息[6]-----------------  
 TCP端口号：1027  
 状态：open  
 原因：syn-ack  
 额外信息：  
 名字：msrpc  
 版本：  
 产品：Microsoft Windows RPC  
 CPE：cpe:/o:microsoft:windows  
 -----------------TCP服务器详细信息[7]-----------------  
 TCP端口号：1028  
 状态：open  
 原因：syn-ack  
 额外信息：  
 名字：msrpc  
 版本：  
 产品：Microsoft Windows RPC  
 CPE：cpe:/o:microsoft:windows  
 -----------------TCP服务器详细信息[8]-----------------  
 TCP端口号：2869  
 状态：open  
 原因：syn-ack  
 额外信息：SSDP/UPnP  
 名字：http  
 版本：2.0  
 产品：Microsoft HTTPAPI httpd  
 CPE：cpe:/o:microsoft:windows  
```



其中需要注意的问题：

1、功能更改*arguments*的值；

2、输入的值可选择外部输入sys.argv[1]，也可以直接添加域名之类的替换掉这个值；

3、安装好nmap后，需要在import nmap处按住Ctrl，点击进入nmap，添加安装路径

```
*def* __init__(*self*, *nmap_search_path*=('nmap', '/usr/bin/nmap', '/usr/local/bin/nmap', '/sw/bin/nmap', '/opt/local/bin/nmap', *r*'D:\Nmap\nmap.exe')):
```

