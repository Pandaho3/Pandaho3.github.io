---
title: Web自动化运维之selenium自动化下载
author: Pandaho
date: 2021-07-20 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-selenium/cover.png
---




## **背景**

首先明确一个观点，一切重复性的工作，都应该通过程序自动执行。
那再看一下自己日常的工作哪些是可以实现的？
所以今天就有了这篇文章，这是我在收集一个系统文件时，将其自动化下载的脚本。




## **环境**

1、Python

2、Windows

3、chrome



## **源码**

```shell
from selenium import webdriver
import selenium.webdriver.support.ui as ui
import time
from selenium.webdriver.common.keys import Keys 

wd = webdriver.Chrome('E:\chromedriver.exe')

wd.implicitly_wait(10)

wd.get('XXX')

wd.maximize_window()
wd.switch_to.frame('fmTopMenu')

time.sleep(1)

wd.find_element_by_id('divMenu2').click() 
wd.switch_to.default_content()

time.sleep(1)
wd.switch_to.frame('fmRight')

lookup=wd.find_element_by_id('tbKeyword')

lookup.send_keys(Keys.CONTROL,'v''\n')

time.sleep(1)

wd.find_element_by_xpath('/html/body/form/div[5]/div/div[2]/span/div/table/tbody/tr[2]/td[3]/a/span').click()
wd.switch_to.default_content()

time.sleep(1)
print(wd.title)
handles = wd.window_handles
wd.switch_to.window(handles[-1])
print(wd.title)

wd.switch_to.frame('tabFrame_DocInfo')

wd.switch_to.frame('iframeAttachment')

wd.find_element_by_id('gvAttachment_ctl02_btnDownloadSingle').click()
url = wd.current_url  
print(url)
print('该页面将停留20S，请在该时间内复制链接。')
time.sleep(20)
wd.switch_to.default_content()
wd.quit()
```



## **原理及挖坑过程**

**原理（官方说明）：**

Selenium 是一套用于自动化 Web 浏览器的工具。

Selenium是一个包含一系列工具和库的开源项目，这些工具和库支持Web 浏览器的自动化。

它提供了模拟用户与浏览器交互的扩展，一个用于扩展浏览器分配的分发服务器，以及用于实现 W3C WebDriver 规范 这让您可以为所有主要的 Web 浏览器编写可互换的代码。

Selenium的核心是网络驱动程序，一个编写指令集的界面，可以在许多浏览器中互换运行。

**挖坑：**

浏览器页面进行切换，可以用以下方式实现。

```python
handles = driver.window_handles          #获取当前浏览器的所有窗口句柄
driver.switch_to.window(handles[-1])     #切换到最新打开的窗口
driver.switch_to.window(handles[-2])     #切换到倒数第二个打开的窗口
driver.switch_to.window(handles[0])      #切换到最开始打开的窗口
```

确认是否成功，可以 **print(wd.title)**

切换window需要注意：如果前一个页面操作还没完成便切换window，会导致前一页面未完成的操作操作失败，进而程序抛错。

iframe框切换，如果多层，直接套娃就行。

```python
#进入一级iframe
wd.switch_to.frame('XX')
#进入二级iframe
wd.switch_to.frame('XX')
```

**实现selenium判断方法：**

```python
from selenium.webdriver.support import expected_conditions as EC  #可以对网页上元素是否存在，可点击等等进行判断
from selenium.webdriver.common.by import By  #By是selenium中内置的一个class,在这个class中有各种方法来定位元素

判断前需要消除隐式延迟，因为这个是全局的
web.implicitly_wait(0)   #消除全局隐式延迟
    locator = (By.CLASS_NAME, 'xxxxx') #在DOM树搜索一个元素
    element = EC.invisibility_of_element_located(locator)   #判断元素是否隐藏DOM树(隐藏、不存在、可见) 
    if (element(web)):
        print(element(web))# 可见的元素返回False,不存在的元素见返回True;隐藏的元素返回WebElement
    else:
        web.find_element_by_class_name('xxxxx').click() #点击正常导出

#invisibility_of_element_located  这个函数可以实现元素判断

```

**实现selenium黑名单变量方法：**

```python
blacklist_if = (url['url']['within'].split(':')[1])  #以字符串：分隔url进行赋值
blacklist ='//x.x.x.x' #设置黑名单
    for blacklist_for in blacklist:
        if blacklist_if == blacklist_for:
            Counter=30  #设置计数器
            while Counter > 0:   
                print('x（',Counter,'）x')
                time.sleep(1)
                Counter -= 1
            sys.exit()  # 程序直接退出，不捕捉异常

```




## 参考来源

[XPATH](https://www.cnblogs.com/hanmk/p/8997786.html)
[selenium基础使用](https://www.daimajiaoliu.com/daima/47939f9ef900406)
[官方说明](https://www.selenium.dev/documentation/en/)
[等待机制详解](https://www.cnblogs.com/x00479/p/14244170.html)
[ini配置详解](https://www.cnblogs.com/superhin/p/13883802.html)
[expected_conditions模块详解](https://blog.csdn.net/kelanmomo/article/details/82886718)
[延迟方式结合判断详解](https://www.jb51.net/article/92672.htm)