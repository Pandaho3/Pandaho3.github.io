---
title: 记一次web自动化运维脚本排错-selenium
author: Pandaho
date: 2021-11-24 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-frame/cover.png
---



## 用知识的土壤来填埋这些坑洞

### iframe 

iframe 是HTML里面的一个用于网页嵌套网页的框架，一个网页可以嵌套到另一个网页中，可以嵌套多层，当然也可以嵌套一层。

frame标签有frameset、frame、iframe三种，frameset跟其他普通标签没有区别，不会影响到正常的定位，而frame与iframe对selenium定位而言是一样的，selenium有一组方法对frame进行操作。




### Message: no such frame: element is not a frame

在定位元素时，总是失败，使用try_except定位出该问题，因为这个元素在第二层frame，需要进行切换，在找到frame后，第二层frame没有id和name，使用xpath定位，解决问题。

网上还要一种tag定位frame，但使用后并未成功，可能是多层因素。

```python
to_iframe = wd.find_element_by_xpath('//*[@id="xxxx"]/div/div[2]/div[2]/iframe') 
xxxxx.switch_to.frame(to_iframe) 
```



### Message: element not interactable

该故障是在click后出现的，但只在某个元素click时，其他并无该现象，网上解释都是和兼容性相关，没有具体的解决方式，我灵机一动，你点击不兼容和我按击没啥关系吧，所以使用ActionChains模块解决。

```python
from selenium.webdriver.common.action_chains import ActionChains   
xxxxx = wd.find_element_by_xpath('//*[@id="xxxxx"]/span')  #定位到需要点击的地方
ActionChains(xxxx).click_and_hold(xxxxx).perform() #鼠标左键按下的操作
time.sleep(1)
ActionChains(xxxx).release(xxxxx).perform()  #鼠标释放
```



### 获取元素文本

```python
txt = driver.find_element_by_xpath('//*[@href="http://news.baidu.com"]').text
print(txt)
```



## 参考资料

[iframe定位方式](https://blog.csdn.net/weixin_44342166/article/details/99635635)  
[frame详解](https://blog.csdn.net/huilan_same/article/details/52200586)  
[文本获取方式](https://www.cnblogs.com/qican/p/14211730.html)  

