---
title: 自动化运维之Python&Excel数据分析
author: Pandaho
date: 2021-06-10 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/python-data-analysis/cover.png
---



## 背景

​       减轻运维工程师的负担最好的方式就是自动化运维，可以将需求进行脚本转换，输出结果，再人为进行判断，能够实现更高效的工作和降低人为风险带来的故障几率，本次项目主要实现采用Python将用户需求编辑的excel转换为网络设备脚本命令。

## 环境
1、Python

2、Windows

3、Office

## 源码

```python
import time
import xlrd

def demand():
    book = xlrd.open_workbook("data.xlsx")  
    
    print("The number of worksheets is", book.nsheets)   
         
    txtFileName = '脚本.txt'  
    
    print(txtFileName) 
    file_object = open(txtFileName, 'w+')  

    file_object.write('<!-- =====  脚本  ==== -->\n')   

    mSheet = book.sheet_by_name('策略参数填写表')  
    data_policy = book.sheet_by_name('策略表')     
    
    for rx in range(mSheet.nrows):       

        if rx == 0:    
            continue
        flag = True

        task_number = int(mSheet.row_values(rx)[0])   
        
        source_ip = mSheet.row_values(rx)[1]
        
        local_ip = mSheet.row_values(rx)[2]
        
        port = int(mSheet.row_values(rx)[3])    
        
        tcp_any_udp_any = mSheet.row_values(rx)[4]
        
        comment = mSheet.row_values(rx)[5]
            
        destination_ip = mSheet.row_values(rx)[6]
        
        out_ip = mSheet.row_values(rx)[7]
        
        for inspect in range(data_policy.nrows):   
            if destination_ip == data_policy.row_values(inspect)[3]:
                print('该服务器IP已存在策略，无法创建')
                flag = False
                break          
        if not flag:                        
            break
        
        Outside_source=('/usr/local/bin/address add name "'+ str(source_ip)+'" ip ' + str(source_ip)+'/32 comment " ' + str(comment) + ' "\n\n')
        
        file_object.write('/usr/local/bin/address add name "'+ str(local_ip)+'" ip '+ str(local_ip)+'/32 comment "' + str(comment) + ' "\n\n')
        
        file_object.write(Outside_source.encode("gbk", 'ignore').decode("gbk", "ignore"))  
        
        file_object.write('/usr/local/bin/address add name "'+ str(out_ip)+'" ip '+ str(out_ip)+'/32 comment "' + str(comment) + ' "\n\n')

        Outside_client=('fpctl add task type client id ' + str(task_number) + ' samenet yes sa ' + str(source_ip) + ' sport 1:65535 random off da ' + str(local_ip) + ' dport ' + str(port) + ' service ' + str(tcp_any_udp_any) + ' time none active on log on syn off udp off icmp off ping off l7proto "novalue" comment " ' + str(comment) + ' "\n\n')
    
        file_object.write(Outside_client.encode("gbk", 'ignore').decode("gbk", "ignore"))
        
        file_object.write('fpctl add task type server id ' + str(task_number) + ' sip ' + str(destination_ip) + ' sport ' + str(port) + ' inport 1:65535 eip ' + str(out_ip) + ' service ' + str(tcp_any_udp_any) + ' active on log off comment " ' + str(comment) + ' "\n\n')

    file_object.close() 

if __name__ == '__main__':

    startTimes = time.time()
    demand()
    endTimes = time.time()
    times = endTimes - startTimes
    
    print('共耗时：' + repr(times) + '秒')
```



## 原理及挖坑过程


```
python调用excel主要用到xlrd和xlwt这两个库，即xlrd是读excel，xlwt是写excel的库。

if __name__ == '__main__':的作用
一个python文件通常有两种使用方法：
第一是作为脚本直接执行；
第二是 import 到其他的 python 脚本中被调用（模块重用）执行。
因此 if __name__ == 'main': 的作用就是控制这两种情况执行代码的过程，在 if __name__ == 'main': 下的代码只有在第一种情况下（即文件作为脚本直接执行）才会被执行，而 import 到其他脚本中是不会被执行的。

str() 函数将对象转化为适于人阅读的形式。

坑示例：TypeError: can only concatenate str (not “float”) to str
原因：print()内的“+”前后数据类型保持一致
解决方法：print(str(1)+ str(2))

坑示例：Excel xlsx file; not supported
原因：xlrd2.0.1版本，只支持.xls文件。所以pandas.read_excel(‘xxx.xlsx’)会报错。
解决方法：
pip list #查看已经安装的第三方库
安装旧版xlrd，在cmd中运行：
pip uninstall xlrd
pip install xlrd==1.2.0

坑示例：'gbk' codec can't encode character '\xa0' in position 57: illegal multibyte
原因：windows打开文件默认是以“gbk“编码，识别unicode字符出现一些问题
解决方法：写入txt时增加“(content.encode("gbk", 'ignore').decode("gbk", "igno

```
