---
title: 自动化运维之黑夜永不眠（防息屏） 
author: Pandaho
date: 2021-06-25 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-Anti-breath-screen/cover.png
---



***记录一次自动化运维脚本，公司电脑策略设定为定时息屏电脑，每次稍微不注意就息屏了，故决定写个脚本让鼠标自己happy起来。***



## **环境**

1、Python

2、Windows



## **框架**

**1、pyautogui**

  pyautogui是一个用Python自动化控制键盘、鼠标的库。但凡是你不想手动重复操作的工作都可以用这个库来解决。

**2、keyboard**

keyboard是一个用Python自动化获取键盘事件的库。

**3、pyinstaller**

pyinstaller是一个用于转换py文件为windows下可运行的exe文件的工具，转换后该脚本便可以在无python环境下的windows执行。

**4、file**
    file是python自带的一个控制文件的库。



## **源码**

1、鼠标法

```python
import pyautogui 
import keyboard

currentMouseX, currentMouseY = pyautogui.position() # 鼠标当前位置
print(currentMouseX, currentMouseY)

while True:
    pyautogui.moveTo(100, 100, duration=0.25) # 移动到 (100,100)
    pyautogui.moveTo(200, 100, duration=0.25)
    if keyboard.is_pressed('enter'):
        print('close')
        break 
```

2、文件法

```python
while True:
    file = open('D:/b.txt','w')
    file.write('1')
    file.close()
```





## 参考来源

[pyautogui](https://www.jb51.net/article/183926.htm)

[keyboard](https://www.cnblogs.com/xia-weiwen/p/13512463.html)

[pyinstaller](https://blog.csdn.net/one312/article/details/105736261)

[file](https://www.jb51.net/article/194450.htm)
