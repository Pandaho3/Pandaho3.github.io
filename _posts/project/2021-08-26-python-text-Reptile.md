---
title: Python之文本爬虫
author: Pandaho
date: 2021-08-26 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-text-Reptile/cover.png
---



**满电脑都是虫子在爬，密集恐惧症患者请勿浏览………………** 



## 用知识的土壤来填埋这些坑洞

网络爬虫（又称为网页蜘蛛，网络机器人，在FOAF社区中间，更经常的称为网页追逐者），是一种按照一定的规则，自动地抓取万维网信息的程序或者脚本。另外一些不常使用的名字还有蚂蚁、自动索引、模拟程序或者蠕虫。

### 使用到的库  

requests库是用python编写的，基于urllib，采用Apache2 License开源协议封装的HTTP库。
Beautiful Soup 是一个HTML/XML的解析器，主要的功能是如何解析和提取 HTML/XML 数据。

HTTP的请求方法GET(查），POST(增），PUT(改），DELETE(删），HEAD，OPTIONS等

```python
requests.request() 构造一个请求，支撑以下各方法的基础方法
requests.get()   获取HTML网页的主要方法，对应于HTTP的GET
requests.head()  获取HTML网页头信息的方法，对应于HTTP的HEAD
requests.post()  向HTML网页提交POST请求的方法，对应HTTP的POST
requests.put()  向HTML网页提交PUT请求的方法，对应HTTP的PUT
requests.patch()  向HTML网页提交局部修改请求，对应HTTP的PATCH
requests.delete() 向HTML网页提交删除请求，对应HTTP的DELETE
```

encoding是从http中的header中的charset字段中提取的编码方式，若header中没有charset字段则默认为ISO-8859-1编码模式，则无法解析中文，这是乱码的原因。
apparent_encoding会从网页的内容中分析网页编码的方式，所以apparent_encoding比encoding更加准确。当网页出现乱码时可以把apparent_encoding的编码格式赋值给encoding。

### 问题：UnicodeEncodeError: ‘gbk‘ codec can‘t encode character ‘\xa0‘

原因：

网络数据流的编码也就是网页的编码，需要使用decode解码成unicode编码。

在windows下面，新文件的默认编码是gbk，这样的话，python解释器会用gbk编码去解析我们的网络数据流txt，然而txt此时已经是decode过的unicode编码，这样的话就会导致解析不了。

解决：改变目标文件的编码：encoding='utf-8'




## 源码

```python
import requests 
import time
from bs4 import BeautifulSoup  

def getHTML(url):
    try:
        r = requests.get(url,timeout=30)
        r.raise_for_status()  #它能够判断返回的Response类型状态是不是200。如果是200，他将表示返回的内容是正确的，如果不是200，他就会产生一个HttpError的异常。
        r.encoding = r.apparent_encoding  
        return r.text   
    except:
        print ('URL异常，请检查链接是否可访问')
        return ""

def getContent(url):
    html = getHTML(url)
    soup = BeautifulSoup(html,'html.parser')  #html.parser表明是解析html的。
    paras = soup.select('p')  #筛选元素p标签
    return paras
 
def saveFile(text):
    f=open('novel.txt','w',encoding='utf-8')
    for t in text:
        if len(t) > 0:                           #返回列表，以p分隔
            f.writelines(t.get_text() + "\n\n")  #提取文本
                
    f.close()
    
def main():
    url = ''
    text = getContent(url)
    saveFile(text)
    
    
if __name__ == '__main__':
    startTimes = time.time()
    main()
    endTimes = time.time()
    times = endTimes - startTimes
    print('共耗时：' + repr(times) + '秒')  

```



## 参考源码

百度
[Beautiful Soup官方详解](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
[爬虫项目案例](https://blog.csdn.net/viafcccy/article/details/85217934)

