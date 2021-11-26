---
title: 网络自动化运维之H3C交换机
author: Pandaho
date: 2021-11-22 20:00:00 
categories: [Project] 
tags: [python]
image: /assets/img/python-netmiko/cover.png
---



## 用知识的土壤来填埋这些坑洞

### Netmiko模块

主要用于与网络设备之间的ssh连接，并提供了世界主流网络设备厂商的适配，使对网络设备的配置工作能够自动化实现。

**send_command()：**只支持向设备发送一条命令，通常是show/display之类的查询、排错命令或者wr mem这样保存配置的命令。发出命令后，默认情况下这个函数会一直等待，直到接收到设备的完整回显内容为止（以收到设备提示符为准，比如说要一直等到读取到“#"为止），如果在一定时间内依然没读到完整的回显内容，netmiko则会返回一个**OSError: Search pattern never detected in send_command: xxxxx**的异常。

如果想要指定netmiko从回显内容中读到我们需要的内容，则需要用到expect_string参数（expect_string默认值为None），如果send_command()从回显内容中读到了expect_string参数指定的内容，则send_command()**依然返回完整的回显内容，**如果没读到expect_string参数指定的内容，则netmiko同样**会返回一个OSError: Search pattern never detected in send_command: xxxxx的异常**，关于expect_string参数的用法会在稍后的实验里演示。

### 正则表达式(regular expression)：

描述了一种字符串匹配的模式(pattern),可以用来检查一个串是否含有某种子串、将匹配的子串替换或者从某个串中取出符合某个条件的子串等。

\w{4} 指的是匹配任意一个包括下划线的任何单词字符，等价于'[A-Za-z0-9_]’或者一个字符，可以重复的集合。

compile()与search()搭配使用, 匹配不到会返回None，返回None的时候就没有span/group属性了, 可以不从位置0开始匹配。但是匹配一个单词之后，匹配就会结束。

### 以下是网络设备自动化脚本里的一部分功能：

```python
password = ConfigParser()   
password.read('xxxx.ini')
orderpass = (xxxx['xxxx']['xxxx'])
passLength = 8  # 密码乱序随机生成部分的长度设置

timeName = time.strftime('%Y-%m-%d-%H%M%S')  
#%Y 以世纪为十进制数的年份。
#%m 月份为十进制数 [01,12]。 
#%d 十进制数 [01,31] 月份中的第几天。 
#%H 小时（24 小时制），十进制数 [00,23]。 
#%M 十进制数的分钟 [00,59]。 
#%S 秒为十进制数 [00,61]。

outpath = f'{timeName}COM密码修改结果日志/日志/'  
outpath_exl = f'{timeName}COM密码修改结果日志/结果.xls'  
header = ['ip', 'COM新密码', '结果', '错误原因'] 

res = {}  
errlist = []  
pattern_mac = re.compile(r'(\w{4}-\w{4}-\w{4})')  #正则表达示匹配MAC
super_bit = 0  
threadList = []  


def randumPassGen():  
	new_pass = random.sample(string.ascii_letters + string.digits + '!@#$%^&*()', passLength)
	fi_pass = ''.join(new_pass)
	fi_pass = orderpass + fi_pass  
	return fi_pass


def runscript(row):
	ip = row['ip']
	h3c = {
		'device_type': 'hp_comware',
		'host': row['ip'],
		'username': row['用户名'],
		'password': str(row['密码'])
	}
	if cmds_bit == 0: 
		newPwd = randumPassGen()
	elif cmds_bit == 1:  
		newPwd = str(row['指定console密码'])
	try:
		conn = ConnectHandler(**h3c)  
        #ConnectHandler()函数需要在h3c字典里面找"两"个东西,key和对应的value，所以用两个*星号
	except ssh_exception.NetmikoAuthenticationException:
		s = {'ip': ip, 'COM新密码': '无变动', '结果': '失败', '错误原因': '登录密码错误'}
		print(f'{ip}登录密码错误！！！')
	except ssh_exception.NetmikoTimeoutException:
		s = {'ip': ip, 'COM新密码': '无变动', '结果': '失败', '错误原因': '设备不可达'}
		print(f'{ip}设备IP不可达！！！！！')
	else:
		print(f'{ip}已成功登陆，请等待下一步操作~')
		out = ''
		out += conn.send_command('\ndisp irf', strip_prompt=False, strip_command=False)  #向设备发送'\ndisp irf'
		with open(f'{outpath}{ip}.txt', 'w') as stream:
			for line in out:
				try:
					stream.write(line)
				except:
					pass
		com_ounter = -1    #因为irf会有一个irf的mac，所以需要减1
		if '^' in out:      #判断 irf命令是否有错误，h3c错误会有^图标
			com_ounter = 1
		else:
			log = out.splitlines()   #过滤out的('\r', '\r\n', \n')，默认false，不包含。
			for line in log:   #遍历每行
				mac = re.search(pattern_mac, line)    #匹配正则mac，没有会返回None
				if mac:    
         #在python中 None, False, 空字符串"", 0, 空列表[], 空字典{}, 空元组()都相当于False 
					com_ounter += 1  
		print(f'{ip}查询COM数量为{com_ounter}！')    
		if com_ounter==1:
			cmdlists=[
			'sys',
			'user-interface aux 0',
			f'set authentication password simple {newPwd}',
			f'set authentication password cipher {newPwd}',
			'return',]
		else:
			cmdlists=[
			'sys',
			f'user-interface aux 0 {com_ounter-1}',
			f'set authentication password simple {newPwd}',
			f'set authentication password cipher {newPwd}',
			'return',]
		try:
			if super_bit:
				out += conn.send_command('super', expect_string='password:', strip_prompt=False, strip_command=False)
				out += conn.send_command(str(row['super密码']), expect_string='>', strip_prompt=False, strip_command=False)
			for cmd in cmdlists:
				out += conn.send_command(cmd, expect_string='>|]', strip_prompt=False, strip_command=False)  #> 或运算 ]
			out += conn.send_command_timing('save f', delay_factor=0.1, max_loops=5,strip_prompt=False, strip_command=False) 
		except Exception as e:   #以上netmiko的函数出现错误都会反馈OSError
			s = {'ip': ip, 'COM新密码': '无变动', '结果': '失败', '错误原因': '命令执行过程出错：' + repr(e)} #repr() 函数将对象转化为供解释器读取的形式。
			print(f'命令执行过程出错：{ip}' + repr(e))
		else:
			s = {'ip': ip, 'COM新密码': newPwd, '结果': '成功', '错误原因': '无'}
			print(f'{ip}设备COM密码修改成功！！！！' )
		finally:
			with open(f'{outpath}{ip}.txt', 'w') as stream:
				for line in out:
					try:
						stream.write(line)
					except:
						pass
	finally:   
		res[ip] = s
		try:
			conn.disconnect()
		except:
			pass
```
## 

## 参考资料

[netmiko network devices](https://blog.51cto.com/jackor/2067951)  
[Netmiko详解](https://zhuanlan.zhihu.com/p/367962211)  
[正则表达式](https://blog.csdn.net/weixin_42793426/article/details/88545939)  
[Netmiko解析](https://www.isolves.com/it/wl/js/2020-09-09/30491.html)  

