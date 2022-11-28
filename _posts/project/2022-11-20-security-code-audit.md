---
title: 代码审计-codeQL
author: Pandaho
date: 2022-11-20 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-code-audit/cover.png
---




## **法律声明**

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



## **用知识的土壤来填埋这些坑洞**

###  **代码审计**
是对应用程序源代码进行系统性检查的工作，目的是为了找到并且修复应用程序在开发阶段存在的一些漏洞或者程序逻辑错误,避免程序漏洞被非法利用给企业带来不必要的风险。

###  **代码审计一般根据权限划分有以下几种情况:**

1、仅源码: 我们仅拥有目标的源代码，通常不包含完整的编译和测试环境，而且由于缺乏必须的关键依赖组件，往往无法构建出可运行的程序。这种情况一般只能使用静态分析的方式去进行审计；

2、仅二进制程序: 我们仅拥有目标应用的二进制文件，比如 APK、EXE、jar 包或者 IoT 的系统固件等。这种情况下通常通过动态分析以及逆向工程的方式进行审计；

3、有源码及二进制程序: 我们既能够访问目标应用的源代码，也拥有一个可运行的二进制程序，这给安全审计提供了最为有利的访问权限，通常目标是开源软件，包含了完整的构建环境和依赖。

4、完全黑盒: 我们既没有目标的源代码，也没有可运行的二进制程序，因此只能通过外部接口去进行盲测。这在 Web 应用中较为常见。

###  **CodeQL（全称Code Query Language）**

从其英文名称中可以看出这是一种基于代码的查询语言，其作用主要是通过编写好的语句查询代码中可能存在的安全隐患。目前CodeQL支持对多种语言，包括java、javascript、go、python、C、Csharp等。


###  **JavaScript审计**
1、Vue 实例上的箭头方法
Vue 框架以实例作为接收者调用 Vue 实例的方法。然而，箭头函数不可能执行这种实例和接收者的绑定，因此thisVue 实例上的箭头函数中的变量可能没有程序员期望的值。

参考代码：codeql/javascript/ql/src/Vue/ArrowMethodOnVueInstance.ql 


2、常量赋值
大多数流行的 JavaScript 平台都支持const声明，尽管此功能不是 ECMAScript 5 标准的一部分。为声明的变量分配一个新值const不会导致当前平台上的错误，并且根本没有效果。依赖此行为很容易出错，特别是因为 ECMAScript 2015 禁止此类分配。

参考代码：codeql/javascript/ql/src/Declarations/AssignmentToConst.ql 

3、错误的 HTML 过滤正则表达式
可以使用正则表达式匹配一些单个的 HTML 标签（使用正则表达式解析一般的 HTML 是不可能的）。但是，如果正则表达式写得不好，则有可能绕过它，这可能会导致跨站点脚本或其他安全问题。

其中一些错误是由具有非常宽容的 HTML 解析器的浏览器引起的，并且通常会呈现包含语法错误的无效 HTML。尝试匹配 HTML 的正则表达式也应该识别包含此类语法错误的标签。

参考代码：codeql/javascript/ql/src/Security/CWE-116/BadTagFilter.ql 

4、敏感信息的明文存储
获得存储访问权限的攻击者可以访问未加密存储的敏感信息。这对于存储在最终用户机器上的 cookie 尤为重要。

参考代码：codeql/javascript/ql/src/Security/CWE-312/CleartextStorage.ql

5、客户端 URL 重定向
重定向到由攻击者可能控制的 DOM 部分构建的 URL 可以促进网络钓鱼攻击。在这些攻击中，毫无戒心的用户可能会被重定向到一个恶意站点，该站点看起来与他们打算访问的真实站点非常相似，但由攻击者控制。

参考代码：codeql/javascript/ql/src/Security/CWE-601/ClientSideUrlRedirect.ql 

6、客户端跨站脚本
直接将用户输入（例如，URL 查询参数）写入网页而未先正确清理输入，会导致跨站点脚本漏洞。

参考代码：codeql/javascript/ql/src/Security/CWE-079/Xss.ql 

7、代码注入
直接将用户输入（例如，HTTP 请求参数）评估为代码而不首先正确清理输入允许攻击者任意代码执行。当用户输入被视为 JavaScript，或传递给将其解释为要评估的表达式的框架时，可能会发生这种情况。示例包括 AngularJS 表达式或 JQuery 选择器。

参考代码：codeql/javascript/ql/src/Security/CWE-094/CodeInjection.ql 

8、通过不安全连接下载敏感文件
通过未加密的连接下载可执行文件或其他敏感文件会使服务器容易受到中间人攻击 (MITM)。这种攻击可以让攻击者在下载的文件中插入任意内容，在最坏的情况下，还可以让攻击者在易受攻击的系统上执行任意代码。

参考代码：codeql/javascript/ql/src/Security/CWE-829/InsecureDownload.ql 




## **参考来源**

[Codeql安装详解](https://blog.csdn.net/god_zzZ/article/details/123475723)  
[代码审计详解](https://zhuanlan.zhihu.com/p/460688951)  
[codeql脚本](https://codeql.github.com/codeql-query-help/javascript/)