---
title: 记一次工单数据爬取自动化excel输出脚本制造
author: Pandaho
date: 2021-12-03 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-xlutils/cover.png
---




## 用知识的土壤来填埋这些坑洞

enumerate() 函数用于将一个可遍历的数据对象(如列表、元组或字符串)组合为一个索引序列，同时列出数据和数据下标，一般用在 for 循环当中。

python通过len()函数返回字符串的长度。

### 写脚本时遇到几个比较坑的点：

1、在for里面执行模块后进行close关闭标签页时会产生错误，排查后，发现在跳出循环模块后使用标签页切换，就可以执行close，说明在模块内的标签页切换对于for循环是无效，需要再进行标签页切换。

```python
wd.switch_to.window(handles[-1])  
```

2、切换iframe有些是没有id或那么的，需要用定位赋值后，再进行切换。

```python
to_iframe = wd.find_element_by_xpath('//*[@id="xxxx"]/div/div[2]/div[2]/iframe') 
wd.switch_to.frame(to_iframe) #切换右侧的iframe
```

3、在执行点击操作时Click时，调用click() 后无效，但全局使用的时候没问题，模块内使用就无效，查了好久，没查出来原因，后来想了想，我直接不用不就行了，我的动作想要点击，那我不一定要点击，我可以按放啊，所以我用了：

```python
inquire = wd.find_element_by_xpath('//*[@id="xxxxx"]/span')
ActionChains(wd).click_and_hold(inquire).perform() #鼠标左键按下的操作
ActionChains(wd).release(inquire).perform()  #鼠标释放
```

4、有些执行失败和网页的加载有关，虽然已经使用了implicitly_wait（），但还是难保有其他问题，所以在每个动作后加time能规避很多bug。



## 部分源码：

```python
from selenium import webdriver
import time
from selenium.webdriver.common.action_chains import ActionChains   #操作鼠标
import xlrd  
from xlutils.copy import copy   #写入库

def obtain(obtain_sv):
    handles = wd.window_handles
    wd.switch_to.window(handles[-1])  #切换到最新标签页
    print(wd.title)
    time.sleep(1)
    wd.switch_to.frame('xxxxx')  #切换到左侧的iframe
    wd.find_element_by_id('xxxxx').click()  #点击服务单查询
    time.sleep(2)
    to_iframe = wd.find_element_by_xpath('//*[@id="xxxxx"]/div/div[2]/div[2]/iframe') 
    wd.switch_to.frame(to_iframe) #切换右侧的iframe
    time.sleep(1)
    enter = wd.find_element_by_id('xxxxx')  
    enter.clear()
    enter.send_keys(obtain_sv) #输入
    time.sleep(1)
    inquire = wd.find_element_by_xpath('//*[@id="xxxxx"]/span')
    ActionChains(wd).click_and_hold(inquire).perform() #鼠标左键按下的操作
    ActionChains(wd).release(inquire).perform()  #鼠标释放
    time.sleep(6)
    Click = wd.find_element_by_xpath('//*[@id="xxxxx"]/div/a') 
    ActionChains(wd).click_and_hold(Click).perform() #鼠标左键按下的操作
    time.sleep(1)
    ActionChains(wd).release(Click).perform()  #鼠标释放
    wd.switch_to.default_content() #跳出frame
    time.sleep(1)
    handles = wd.window_handles
    wd.switch_to.window(handles[-1])
    print(wd.title)
    time.sleep(1)
    applicant = wd.find_element_by_xpath('/html/body/div[1]/div[1]/div/div[2]/div[2]/table/tbody/tr[2]/td[2]').text #申请人
    time.sleep(1)
    Department = wd.find_element_by_xpath('/html/body/div[1]/div[1]/div/div[2]/div[2]/table/tbody/tr[3]/td[2]').text  #部门
    time.sleep(1)
    principal = wd.find_element_by_xpath('/html/body/div[1]/div[4]/div/div[2]/div[2]/div/div/div[2]/div[4]/div[2]/div/table/tbody/tr[4]/td[4]/div').text   #负责人
    time.sleep(1)
    #  写入数据
    try:
        ws.write(applicant_Row, applicant_List, applicant)
        ws.write(Department_Row, Department_List, Department)
        ws.write(principal_Row, principal_List, principal) 
    except(BaseException) as error: 
        print (error)
    time.sleep(1)

# 创建 WebDriver 对象，指明使用chrome浏览器驱动
wd = webdriver.Chrome('xxxxx\chromedriver.exe')
time.sleep(4)
# 设置最大等待时长为 10秒，定位参数时每半秒查一次
wd.implicitly_wait(10)
# 调用WebDriver 对象的get方法 可以让浏览器打开指定网址
wd.get('https://xxxxxx/')
#窗口最大化
time.sleep(1)
wd.maximize_window()
wd.find_element_by_class_name('xxxxx').click()  #点击后台
time.sleep(1)

#读
input_file_name = 'xxxxx.xls'
excel = xlrd.open_workbook(input_file_name)
table = excel.sheets()[0]  # 获得第一个sheet的对象
biaotou= table.col_values(22)[1:]   #从23列第二行开始

#写
# 将操作文件对象拷贝，变成可写的workbook对象
new_excel = copy(excel)
# 获得第一个sheet的对象
ws = new_excel.get_sheet(0)

applicant_Row = 0 #初始化忽略第一行
Department_Row = 0
principal_Row = 0
applicant_List = 21 
Department_List = 19
principal_List = 20

for value in biaotou:
    applicant_Row+=1 
    Department_Row+=1
    principal_Row+=1
    if value != u'' and len(value) == 12:
        obtain(value)
        handles = wd.window_handles
        wd.switch_to.window(handles[-1])
        print(wd.title)
        wd.close()
        handles = wd.window_handles
        wd.switch_to.window(handles[-1])
        print(wd.title)
        
new_excel.save('new_mcw_test.xlsx')
time.sleep(2)
wd.quit()
```



## 参考资料

[python中使用xlrd、xlwt操作excel表格详解](https://www.cnblogs.com/fengshuihuan/p/7646124.html)  
[如何写入数据到已经存在的Excel文件](https://www.cnblogs.com/lnn123/p/10578322.html)  
[xlutils模块使用](https://www.cnblogs.com/machangwei-8/p/10739115.html)  

