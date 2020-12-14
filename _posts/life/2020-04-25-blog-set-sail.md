---
title: Blog Set Sail
author: Pandaho
date: 2020-04-25 19:00:00 
categories: [life] 
tags: [blog]
toc: true
image: /assets/img/Blog Set Sail/cover.png
---

[toc]

---

“Yeah It's on. ” —— Pandaho 的 Blog 正式开通了。


##  前言

一直都想开个博客，把自己微不足道的经验记录下来，不然按我这点脑容量，没几年就把自己踩过的坑给忘了，一个坑掉一次就够了，因为还得去掉其他坑啊。

2020.4.25 全国预防接种宣传日

疫情时代，今天也算是个好日子，就在今天开个头吧，以后多谢各位客官赏脸了，祝大家身体健康。

## 正文

接下来说下搭建这个博客的技术和原理吧！我喜欢做啥都先把原理理解一遍，才上手，古语道，君子不立危墙下。

这个项目我是在GitHub上了解的，[项目网址](https://github.com/cotes2020/jekyll-theme-chirpy) （因为墙的原因Github下载会慢些，可以去码云下载。)

我想象中的博客是以简易实用为主。博客的搭建就是利用GitHub Pages功能了，大家也可以去了解下GitHub Pages + Jekyll 搭起来还是很容易的，这方案算是对新手很友好了，用GitHub Pages还有一个原因就是域名和空间都是免费的，不用自己再去搞台主机，就是国内访问起来慢了些，可以自己买个国内域，解析下。
而关于代码，其实我对于前端也不是很懂，因为这个博客是基于jekyll搭建的，可以通过了解[jekyll](https://www.jekyll.com.cn/)  ，对于你搭建博客更顺手些。

### 我说下我个人总结的理解

jekyll 就是一个简单的博客形态的静态站点的转换工具，将特定格式，如markdown，testtile等文本文件转换成html，当作网页显示，不然你想想在html文件里编辑博客会不会吐血。

jeykll系统的运行依赖ruby的，所以我们在客户端使用是需要搭建ruby环境的。

Jekyll恰好是GitHub Pages的引擎，因此你可以在GitHub的服务器上免费托管项目的Jekyll页面/博客/网站。

##  流程

我的系统环境是windows10.
在Github上new新建repositories，新建一个pages，格式：XXXXXX.github.io，（记得一定要和你的github名一致）把博客模板在本地修改好后上传到仓库里，（说到上传，本地需要先安装[git](https://git-scm.com/downloads) 浏览 https://xxxxxx.github.io/  ,博客就算完成了，后面说下本地环境的搭建。

下载git的时候太慢的话，可以到[这里](https://npm.taobao.org/mirrors/git-for-windows/) 下载，然后对比SHA-256确认没修改过源码.

先是安装[ruby](https://rubyinstaller.org/downloads/) 然后更新国内源，开始安装jekyll，通过gem安装包管理器安装好jekyll以后，就能够在windows的命令行中执行jekyll。

### 期间我遇到的坑：

1、下载 Ruby+Devkit 绑定的，分开下载安装的话也多了一些麻烦，期间我就遇到安装完ruby后再安装devkit，但是  ruby dk.rb install总是报错，安装完后在bundler这里又遇到了大把坑。

2、错误描述：Bundler::GemNotFound                解决：bundle install

3、错误描述：Conversion error: Jekyll::Converters::Scss encountered an error while converting 'css/main.scss': Internal Error: Invalid UTF-8
解决：在 D:\ruby\Ruby26-x64\lib\ruby\gems\2.6.0\gems\sassc-2.3.0-x64-mingw32\lib\sassc\engine.rb文件中添加代码：Encoding.default_external = Encoding.find('utf-8')

4、错误描述：cannot load such file -- tzinfo
gem 'tzinfo-data'在Windows上进行开发时是必需的（通常Gemfile在Windows计算机上创建Rails应用程序时，它会自动包含在其中）。
解决：gem install tzinfo-data，然后将其添加到网站根目录中的Gemfile中：gem 'tzinfo-data'

5、上传github后，我发现无法访问，先ping解析后发现ip地址为127.0.0.1   
在C:\Windows\System32\drivers\etc 下修改hosts   
添加博客解析地址，推荐[站长工具](http://tool.chinaz.com/dns/?type=1&host=leopardpan.github.io&ip=)进行dns解析  查询博客地址就行。

全部安装完毕后就可以启动服务器：jekyl serve
（原理是jekyll在本地启动一个webrick的http服务器，然后浏览器访问：localhost:4000）

##  主题

下载该主题后在项目根目录，开始初始化:               $ bash tools/init.sh  
如果你不打算部署到 GitHub Pages, 在上述命令后附加参数选项 --no-gh。

上述脚本完成了以下工作，从你的仓库中删除了:  
.travis.yml  
_posts 下的文件  
docs 目录  
如果使用了参数 --no-gh，则会怒删 .github。否则，将会配置 GitHub Actions：把 .github/workflows/pages-deploy.yml.hook 的后缀 .hook 去除，然后删除 .github 里的其他目录和文件。自动提交一个 Commit 以保存上述文件的更改。

修改主题图标的话，打开网站[Favicon＆App Icon Generator](https://www.favicon-generator.org/)，并上传您的原始图片。

单击按钮Create Favicon，稍等片刻，网站将自动生成各种大小的图标。

下载生成的软件包，解压缩并从解压缩的文件中删除以下两个：
browserconfig.xml
manifest.json
现在，从提取的文件中复制剩余的图像文件（.PNG和.ICO），.zip以覆盖folder中的原始文件assets/img/favicons/。

文章分类，添加在 categories: [XXX, XXX]  子分类最多包含2个 

标识标签，添加在 tags: [XXX]  标签数量无限制

右上显示最近更新可在 _config.yml 修改toc，“true或false”，可在单个文章头添加。

```
---
toc: false
---
```

 _config.yml 修改 comments  启动或关闭评论功能，“true或false”，可在单个文章头添加。

```
---
comments: false
---
```

 文章头添加 pin 可固定在主页，“true或false”。

```
---
pin: true
---
```

##  GIT流程
1、首先在本地项目根目录，建立仓库 git init  
2、将项目文件添加到仓库 git add （全部添加的话 “.” 单个文件就写文件名）  
3、将add内的文件commit到仓库 git commit -m "注释语句"  
4、关联github上的github pages仓库 git remote add origin “项目网址”  
5、设置用户名	Git config --global user.name ' ? '   
6、设置邮箱	Git config --global user.email ' ? '  
7、上传代码到github远程仓库 git push -u origin master  

##  清空github仓库
rm -rf .git 删除git记录 ，重复git流程。


未完待续……………………