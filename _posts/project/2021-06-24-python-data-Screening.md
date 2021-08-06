---
title: 自动化运维之XLRD+XLWT+PANDAS数据筛查
author: Pandaho
date: 2021-06-24 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-data-Screening/cover.png
---



***记录一次自动化运维脚本，在统计DHCP地址池时，从设备导出的cvs文件包含大量地址池信息，于是决定采用python将其筛出相关信息。***



## 原理

​    **DHCP冗余实现方法：**

一般来说，DHCP中继是向所有DHCP服务器转发DHCP请求报文（即polling方式），且DHCP客户端会选择最快收到DHCP应答报文。如果用户想指定一台DHCP服务器作为主用DHCP服务器，其他DHCP服务器只在主用DHCP服务器不可用或没有空闲地址时才起作用，就需要DHCP中继支持优先选择用户期望的DHCP服务器作为主用DHCP服务器的功能。

  当DHCP中继使用主备方式选择DHCP服务器后，会优先向配置的第一个DHCP服务器地址转发DHCP请求报文。当该DHCP服务器确定无法分配IP地址时，DHCP中继将之后的DHCP请求报文向下一个DHCP服务器地址转发。如果DHCP中继已切换到配置的最后一个DHCP服务器地址且发现该DHCP服务器仍不可用，则重新选择第一个配置的DHCP服务器地址进入下一个循环。

​    **主备方式有两种配置方法：**

对于普通组网，用户可以在DHCP中继接口上指定多个DHCP服务器地址。这样当配置DHCP中继主备方式选择DHCP服务器时，配置的第一个地址对应的DHCP服务器为主用DHCP服务器，之后配置的地址对应的DHCP服务器为备用DHCP服务器。

对于某些用户接入方式，用户需配置中继地址池，并指定多个DHCP服务器地址。这样当配置DHCP中继主备方式选择DHCP服务器时，配置的第一个地址对应的DHCP服务器为主用DHCP服务器，之后配置的地址对应的DHCP服务器为备用DHCP服务器。

此外，配置DHCP中继选择DHCP服务器还支持配置以下功能：

配置DHCP服务器应答超时切换时间，缺省应答超时切换时间为30秒。当DHCP中继向DHCP服务器转发DHCP请求报文，如果超过配置的应答超时切换时间后还未收到该DHCP服务器的应答报文，则DHCP中继认为该DHCP服务器已不可用，并切换到下一个DHCP服务器。

配置回切主用DHCP服务器并指定回切延迟时间，缺省DHCP中继是不回切的。当用户在DHCP中继配置了回切主用DHCP服务器延迟时间且当前生效的不是主用DHCP服务器时，经过该回切延迟时间后，DHCP服务器会将DHCP请求报文转发到主用DHCP服务器。如果主用DHCP服务器不可用或没有空闲地址时则重新使用当前生效的DHCP服务器；如果主用DHCP服务器可用则继续使用主用DHCP服务器。

xlrd+xlwt库是python中一个很常用的读写excel文件的库，其对excel文件的读写可以实现比较精细的控制。

pandas是一个强大的分析结构化数据的工具集;它的使用基础是Numpy(提供高性能的矩阵运算);用于数据挖掘和数据分析,同时也提供数据清洗功能。



## **环境**

1、Python

2、Windows

3、Office



## **源码**

```python
import time
import xlrd
import xlwt
import pandas as pd


def get_font():
    font = xlwt.Font()
    font.name = 'Arial'
    font.colour_index = 0
    font.height = 20 * 15
    font.bold = True
    font.underline = False
    font.italic = False
    return font



def get_borders():
    borders = xlwt.Borders()
    borders.left = 2
    borders.right = 2
    borders.top = 2
    borders.bottom = 2
    borders.left_colour = 0
    borders.right_colour = 0
    borders.top_colour = 0
    borders.bottom_colour = 0
    return borders

def csv_change_xlsx():
    csv = pd.read_csv(r'CSV\dl-dc00_Config.csv', encoding='utf-8')
    
def demand():
    _dl0 = xlrd.open_workbook(r'EXCEL\dl-dc00_Config.xlsx')
    workbook = xlwt.Workbook(encoding = 'utf-8')   
    worksheet = workbook.add_sheet('work_sheet')  
    dl0 = _dl0.sheet_by_index(0)  
    style_font = xlwt.XFStyle()
    style_font.font = get_font()
    style_font.borders = get_borders()
    worksheet.write(0,1,'ScopeId',style_font)  
    worksheet.col(1).width = 256 * 20
    total_row=1  
    
    for dl0_row in range(dl0.nrows):      

        if dl0_row == 0:   
            continue
        
        dl0_StartRange = dl0.row_values(dl0_row)[3]  
        dl0_ndRange = dl0.row_values(dl0_row)[4]
        
        StartRange_dl0 = int(dl0_StartRange.split('.')[3])
        ndRange_dl0 = int(dl0_ndRange.split('.')[3])
        
        if (StartRange_dl0 != 141 or ndRange_dl0 != 240) and (StartRange_dl0 != 31 or ndRange_dl0 != 140):
            dl0_list=(dl0.row_values(dl0_row))
            for dl0_rank in range(dl0.ncols):      
                worksheet.write(total_row,dl0_rank,dl0_list[dl0_rank])
            total_row=total_row+1      
            
     workbook.save('Excel_Summary.xls') 

if __name__ == '__main__':

    startTimes = time.time()
    csv_change_xlsx()
    demand()
    endTimes = time.time()
    times = endTimes - startTimes
    
    print('共耗时：' + repr(times) + '秒')     
```



## 参考来源

[H3C-DHCP配置手册](http://www.h3c.com/cn/d_201711/1043768_30005_0.htm#_Toc494387077)  
[xlrd模块详解](https://www.cnblogs.com/lnd-blog/p/12535423.html)  
[python之xlwt模块列宽width、行高Heights详解](https://www.cnblogs.com/landhu/p/4978705.html)  
[Python xlwt颜色代码](https://www.jianshu.com/p/0dd8cc68a3c3)  
[Xlwt-样式详解](https://www.cnblogs.com/zq-zq/p/13974794.html)
