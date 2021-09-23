---
title: 记录web自动化窗口滑动与截图
author: Pandaho
date: 2021-09-23 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/selenium-js/cover.png
---



## 需求：

加载页面后自动滑动窗口截取页面视图信息。

## 实现：

使用**selenium.execute_script**调用JavaScript操作，并使用**selenium.get_screenshot_as_file**截取页面视图。

## 用知识的土壤来填埋这些坑洞

### get_screenshot_as_file(filename/full_path)：

获取截屏png图片，参数是文件的绝对路径，截屏必须是.png图片。如果只给文件名，截屏会存在项目的根目录下。

### execute_script()

selenium里面也没有直接的方法去控制滚动条，需要调用js来实现，该模块函数可以直接执行js的脚本。

```python
target = driver.find_element_by_id("id")
driver.execute_script("arguments[0].scrollIntoView();", target) #拖动到可见的元素去
```

### JavaScript

是一种运行在客户端的脚本语言，不需要编译，运行过程中由JS解释器（JS引擎）逐行来进行解释并执行，实现前端业务逻辑和页面控制等功能。

### arguments

是javascript的一个**内置对象**，是一个类数组（就是长的比较像数组，但是欠缺一些数组的方法，可以用slice.call转换），其存储的是**函数的参数**。

### scrollIntoView

是一个与页面(容器)滚动相关的API

```python
element.scrollIntoView() 参数默认为true
参数为true：调用该函数，页面发送滚动，使element的顶部与视图(容器)顶部对齐
参数为false：使element的底部与视图(容器)底部对齐
```




## 参考资料

[Selenium截屏和录屏](https://www.cnblogs.com/-wenli/p/14183203.html)  
[selenium滚动方法](https://www.jb51.net/article/165315.htm)  
[arguments详解](https://www.zhihu.com/question/21466212/answer/18441962)  
[execute_script详解](https://www.cnblogs.com/wenm1128/p/11534887.html)
[execute_script案例](https://www.cnblogs.com/my_captain/p/9233314.html)

