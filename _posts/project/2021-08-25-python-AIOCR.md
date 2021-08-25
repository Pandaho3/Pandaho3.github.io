---
title: 人工智能之文字识别
author: Pandaho
date: 2021-08-25 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-AIOCR/cover.png
---



**我们现在已经生活在未来了………………** 



## 用知识的土壤来填埋这些坑洞

人工智能（Artificial Intelligence）是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器，该领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。

OCR （Optical Character Recognition，光学字符识别）是指电子设备（例如扫描仪或数码相机）检查纸上打印的字符，通过检测暗、亮的模式确定其形状，然后用字符识别方法将形状翻译成计算机文字的过程；即，针对印刷体字符，采用光学的方式将纸质文档中的文字转换成为黑白点阵的图像文件，并通过识别软件将图像中的文字转换成文本格式，供文字处理软件进一步编辑加工的技术。如何除错或利用辅助信息提高识别正确率，是OCR最重要的课题，ICR（Intelligent Character Recognition）的名词也因此而产生。衡量一个OCR系统性能好坏的主要指标有：拒识率、误识率、识别速度、用户界面的友好性，产品的稳定性，易用性及可行性等。

此次使用的API是[百度智能云](https://cloud.baidu.com/?from=console)的OCR产品，他提供挺多种识别方式，可以根据需要调用对应的AIP函数（重点是免费）

```python
#下载安装库
pip install baidu-api
'''
python是一种边解释代码边运行功能的语言，所以代码存在错误也是可以运行的，而排查错误，python也提供异常处理的方法。
系统一开始已经内置了一些特定的应用场景；当我们写代码的过程当中，一旦触发了这个场景，系统内部就会自动的向外界抛出这个问题，也就是我们所谓的异常，程序将被终止执行，软件发生奔溃现象。
预防方式：捕获并处理异常
'''

#第一种
 try:         #可能产生异常的代码块
    f=open("xxx")
    f.write()    #文件操作
except(BaseException):       # 处理异常的代码块
    do something
finally:      #无论 try 块是否发生异常，最终都要进入 finally 语句，并执行其中的代码块。
    f.close()
'''
常见的异常处理：
除零异常：ZeroDivisionError
名称异常：NameError
类型异常：TypeError
索引异常：IndexError
键异常：KeyError
值异常：ValueError
属性异常：AttribureError
迭代器异常：Stoplteration
系统异常类继承树:BaseException 所有内建的异常的基类
'''
#第二种
with open("xxx") as f:    #上下文管理器，适用于执行某一段代码之前，进行预处理，执行完代码结束后，进行结束操作
    f.write() #所执行的代码

```


## 源码

```python
from aip import AipOcr     
import os
 
"""你的百度AppID, API Key, Secret Key"""
APP_ID = ''
API_KEY = ''
SECRET_KEY = ' '
 
client = AipOcr(APP_ID, API_KEY, SECRET_KEY)
 
"""打开文件，读取图片"""
def get_file_content(filepath):
    with open(filepath, 'rb') as fp:   
        return fp.read()
 
#r指的是当前所在的文件夹路径，ds是当前文件夹路径下的文件夹列表，fs是当前文件夹路径下的文件列表。
#遍历路径下的图片，但只能图片类型，遇到不支持的文件会报错，请求格式支持：PNG、JPG、JPEG、BMP、TIFF、PNM、WebP
for r, ds, fs in os.walk(r'C:\'):  
     for fn in fs:
         fname = os.path.join(r, fn)      #将r和fn进行路径拼接
         image = get_file_content(fname)     #打开图片
         ret = client.basicAccurate(image)    #图片转换类型选择
         for item in ret.get('words_result'):   
             print(item.get('words')) 

```


