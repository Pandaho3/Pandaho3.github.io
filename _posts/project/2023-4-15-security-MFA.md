---
title: MFA密钥管理系统设计
author: Pandaho
date: 2023-4-15 20:00:00 
categories: [Project] 
tags: [security]
image: /assets/img/security-MFA/cover.png
---



## **法律声明**

**中华人民共和国刑法：** 第285、286、287条

**第二百八十五条** 违反国家规定，侵入国家事务、国防建设、尖端科学技术领域的计算机信息系统的，处三年以下有期徒刑或者拘役。

**第二百八十六条** 违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行，后果严重的，处五年以下有期徒刑或者拘役；后果特别严重的，处五年以上有期徒刑。违反国家规定，对计算机信息系统中存储、处理或者传输的数据和应用程序进行删除、修改、增加的操作，后果严重的，依照前款的规定处罚。故意制作、传播计算机病毒等破坏性程序，影响计算机系统正常运行，后果严重的，依照第一款的规定处罚。

**第二百八十七条** 利用计算机实施金融诈骗、盗窃、贪污、挪用公款、窃取国家秘密或者其他犯罪的，依照本法有关规定定罪处罚。



## **用知识的土壤来填埋这些坑洞**

### **系统需求:**

1、提高账户安全性：通过OTP密钥管理系统，用户可以方便地创建、存储和管理密钥，这样可以减少密码泄露的风险，提高账户的安全性。

2、方便快捷的验证方式：OTP密钥管理系统可以提供快捷、方便的身份验证方式，用户只需要输入OTP密码即可完成身份验证，无需记住复杂的密码。

3、支持多种应用场景：OTP密钥管理系统可以支持多种应用场景，包括网站登录、VPN登录、远程桌面登录等，可以为企业提供全面的身份验证解决方案。

4、管理方便：OTP密钥管理系统可以集中管理所有用户的密钥信息，管理员可以方便地对密钥进行监控、管理和维护，提高管理效率。

5、可扩展性强：OTP密钥管理系统可以根据实际业务需要进行定制化开发和部署，支持多种操作系统和编程语言，具有较强的可扩展性和适应性。

#### **细化管控:**

在OTP密钥管理系统中，用户管理功能可以实现对不同用户的细化管控，包括用户的添加、修改、删除等操作，以及用户权限的分配和控制。这样可以确保只有被授权的用户才能访问系统和密钥，避免了未经授权的访问和潜在的安全风险。同时，用户管理功能还可以记录用户操作日志，便于监控和审计系统的使用情况，提高系统的可靠性和安全性。

#### **权限管控:**

在OTP密钥管理系统中，增加权限管控功能可以对系统中的用户进行细化的管控，保证系统的安全性。通过权限管控，可以限制不同用户的操作权限，避免敏感信息被恶意篡改或泄露。例如，管理员可以有更高的权限，能够对系统中所有的密钥进行查看、修改和删除操作；而普通用户只能查看自己的密钥，无法对其他用户的密钥进行操作。这样能够有效地避免误操作或人为破坏对系统的影响。另外，可以通过日志记录对系统的操作，以便后期的审计和追责。

### **系统功能组件:**

用户管理：系统应允许管理员创建、管理和删除用户帐户。这包括用户注册、密码管理和角色分配等功能。

MFA 密钥生成：系统应为每个用户生成唯一的 MFA 密钥。这些密钥可以采用 OTP（一次性密码）令牌、硬件设备或基于软件的解决方案的形式。

MFA 密钥存储：系统应安全地存储和保护 MFA 密钥。这可以通过加密、访问控制和安全存储机制来实现。

MFA 密钥分发：系统应提供一种将 MFA 密钥分发给用户的机制。这可能涉及通过安全通道发送密钥或与第三方 MFA 解决方案集成。

MFA 密钥撤销：系统应允许管理员在泄露、丢失或员工解雇的情况下撤销 MFA 密钥。这确保可以迅速防止未经授权的访问。

访问控制：系统应基于 MFA 身份验证实施访问控制策略。应要求用户提供其凭据（用户名/密码）和 MFA 令牌以访问受保护的资源。

记录和审计：系统应记录所有与 MFA 相关的事件，包括密钥生成、分发、撤销和身份验证尝试。这允许监视和审计系统活动。

集成：系统应与现有的身份验证系统和身份提供者集成。这确保了与其他应用程序的无缝集成并启用单点登录功能。

报告和分析：系统应提供报告和分析功能，以监控 MFA 密钥的使用、识别潜在的安全风险并生成合规性报告。

合规性：系统应遵守相关的安全标准和法规，例如 GDPR 和 PCI-DSS，以确保数据保护和隐私。

### **技术方案:**

前端框架：Bootstrap

Web框架：Django 

服务端：Python 

Web框架：Django 

数据库：MySQL 

该方案提供一种高效、安全、可扩展的 Web 应用程序开发架构，它结合了 Django 的高效性、Python 的简洁性和 MySQL 的可靠性，可以满足各种规模和类型的应用程序功能需求。

### **双因素认证:**

双因素认证（Two-Factor Authentication，2FA）是指在用户进行身份认证时需要提供两个或多个身份验证要素的一种身份认证方法。身份验证要素包括以下三种类型：

1、用户知道的信息，如密码、个人标识号码、生日等。

2、用户拥有的物品，如手机、U盾、智能卡、USB密钥等。

3、用户的生理特征或行为特征，如指纹、虹膜、声纹、面部识别、手写签名等。

相比于单因素认证（如密码），MFA 能够加强以下几个方面的安全性：

1、增强用户身份验证的可靠性：MFA 需要提供多个因素进行验证，一般包括密码、手机验证码、指纹等，这些因素的结合提高了用户身份验证的可靠性，降低了被攻击的风险。

2、防范密码盗窃和撞库攻击：密码是单因素认证的典型，但容易被窃取或者破解。MFA 的另一个因素可以使攻击者更难以盗取或破解密码，从而更难以实施恶意行为。

3、防范社会工程学攻击：社会工程学攻击是指攻击者通过诱骗、欺骗等手段获取用户的敏感信息，如密码。MFA 通过增加认证因素，可以使社会工程学攻击更加困难。

双因素认证需要用户提供两个或多个不同类型的身份验证要素，从而提高了身份验证的安全性。因为即使一个身份验证要素被攻击者获取，攻击者也无法获得完整的身份认证要素，从而降低了身份被盗用的风险。

#### **code模块:**
```html
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MFA管理系统</title>
    <link rel="stylesheet" href="{% static 'bootstrap/css/bootstrap.min.css' %}">
    <style>
        table {
            border-collapse: collapse;
            margin: 20px auto;
        }
        th, td {
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #ddd;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        a {
            text-decoration: none;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .bottom-left {
            position: fixed;
            bottom: 0;
            left: 0;
            font-size: 24px;
            font-weight: bold;
        }

    </style>
</head>
<body>
<h1>MFA仓库</h1>
<div class="bottom-left">使用CTRL+F可快速查找</div>
<a href="/info/add/"><button>添加</button></a>
<table class="table">
    <thead class="thead-dark">
        <tr>
            <th scope="col">knoxID</th>
            <th scope="col">MFA_name（唯一值）</th>
            <th scope="col">获取验证口令</th>
            <th scope="col">删除</th>
        </tr>
    </thead>
    <tbody>
        {% for obj in data_list %}
        <tr>
            <td>{{ obj.knoxID_M }}</td>
            <td>{{ obj.MFA_name_M }}</td>
            <td>
                <a href="/info/password/?MFA_key={{obj.MFA_name_M}}">获取</a>
            </td>
            <td>
                <a href="/info/delete/?MFA_name={{obj.MFA_name_M}}">删除</a>
            </td>
        </tr>
        {% endfor %}
    </tbody>
</table>
</body>
</html>

```

### **OTP:**

OTP（One-Time Password）工具是一种用于生成一次性密码的工具，通常用于双因素认证中。OTP工具的作用是在用户登录时，生成一个动态的、仅在一段时间内有效的密码，以增强账户的安全性。常见的OTP工具有Google Authenticator、Authy、Microsoft Authenticator等，用户需要将其绑定到相应的账户上，以便在登录时生成一次性密码。

OTP工具的工作原理是基于时间同步技术和哈希算法。当用户绑定了OTP工具后，系统会向OTP工具发送一个种子密钥，根据该密钥以及当前的时间，使用哈希算法计算出一个一次性密码，并在一定时间后失效。在用户登录时，系统要求用户输入当前的一次性密码进行认证，只有当该密码有效时，用户才能成功登录。

OTP工具的使用可以有效地防止账户被盗用或被暴力破解。由于一次性密码的时效性和动态性，攻击者无法通过获取用户密码或简单地猜测密码来进行攻击。因此，使用OTP工具可以提高账户的安全性，减少被黑客攻击的风险。

OTP（一次性密码）密钥集中管理是一种对OTP密钥进行安全管理的方法，旨在确保安全使用OTP进行身份验证。

通过集中管理OTP密钥，可以确保所有密钥都被妥善保管，防止被恶意利用或遗失。此外，集中管理还可以确保密钥的备份和恢复，以便在发生灾难性事件时能够快速恢复系统的正常运行。

一些OTP管理工具，如Google Authenticator、Authy和Duo Mobile等，提供了方便的OTP密钥集中管理功能，可以帮助用户更轻松地管理他们的OTP密钥。同时，这些工具也提供了许多其他的安全功能，如密码生成器、多因素身份验证等，可以进一步提高用户的账户安全性。

#### **code模块:**
```python
import pyotp

# 获取用户的秘钥，这个秘钥应该在用户登录时被保存下来
user_secret = "xxxxxxxxx"

# 生成OTP口令
def generate_otp():
    totp = pyotp.TOTP(user_secret)
    return totp.now()

# 验证用户输入的口令是否正确
def verify_otp(user_input):
    totp = pyotp.TOTP(user_secret)
    return totp.verify(user_input)

# 在用户登录时，生成一个新的口令，将其发送给用户进行验证
new_otp = generate_otp()
print("请使用下面的口令进行身份验证：", new_otp)

# 用户输入口令进行验证
user_input = input("请输入口令：")
if verify_otp(user_input):
    print("身份验证成功！")
else:
    print("口令不正确，身份验证失败！")

```

### **OTP口令时长:**

OTP口令的持续时长取决于所使用的算法以及其时间戳的更新频率。在基于时间的一次性密码算法中，口令的持续时间由时间戳的更新频率决定，通常是每30秒更新一次。因此，如果你的算法使用的是基于时间的一次性密码（如TOTP算法），则每个口令的持续时间为30秒。而在基于计数器的一次性密码算法中，口令的持续时间取决于算法使用的计数器步长以及更新频率。

#### **code模块:**
```python
import time

# 定义倒计时的时长（以秒为单位）
countdown_time = 30

# 计时循环
while countdown_time:
    # 显示剩余时间
    print("剩余时间: ", countdown_time, "秒")
    # 倒计时减一
    countdown_time -= 1
    # 休眠一秒钟
    time.sleep(1)

# 倒计时结束
print("倒计时结束！")

```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <!-- 引入 Bootstrap 的 CSS -->
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css">
    <!-- 引入 jQuery 和 jQuery UI 的库文件 -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css">
    <style>
        /* 将进度条设置为圆形 */
        .ui-progressbar-value {
            border-radius: 50%;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="row justify-content-center mt-5">
        <div class="col-md-6 text-center">
            <h1>请使用下面的口令进行身份验证：</h1>
            <h2>{{ otp }}</h2>
            <p id="countdown">30 秒后自动关闭</p>
            <div class="progress mb-3">
                <div id="progressbar" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
    </div>
</div>
<script>
    // 定义倒计时秒数
    var count = 30;

    // 初始化进度条
    $(function () {
        $("#progressbar").progressbar({
            value: 100
        });
    });

    // 定义倒计时函数
    function countdown() {
        var countdownElem = document.getElementById("countdown");
        if (count > 0) {
            countdownElem.innerHTML = count + " 秒后自动关闭";
            count--;
            // 更新进度条的值
            $("#progressbar").progressbar("option", "value", count / 30 * 100);
            setTimeout(countdown, 1000);
        } else {
            countdownElem.innerHTML = "时间已过";
            // 倒计时结束后，跳转到其他页面
            // window.location.href = "/other-page/";
        }
    }

    // 在页面加载时启动倒计时函数
    countdown();
</script>
</body>
</html>

```


### **将key进行hash:**

使用哈希函数（如 SHA-256）来对 MFA_key 进行哈希处理，将哈希值传递给前端页面，在页面上展示的就是哈希值，而非原始 MFA_key。当用户点击获取验证口令时，后端可以根据哈希值匹配进行验证。

这种处理方式虽然可以隐藏原始值，但并不能保证其绝对安全。恶意用户仍然可以尝试对哈希后的值进行破解或重放攻击。如果需要更高的安全性，建议采用更加复杂的加密算法或者使用专门的双因素认证库来实现。

#### **code模块:**
```python
import hashlib

def info_password(request):
    MFA_key = request.GET.get('MFA_key')
    # 对 MFA_key 进行哈希处理
    hashed_key = hashlib.sha256(MFA_key.encode()).hexdigest()
    # 生成OTP口令
    totp = pyotp.TOTP(MFA_key)
    # 在用户登录时，生成一个新的口令，将其发送给用户进行验证
    new_otp = totp.now()
    print("请使用下面的口令进行身份验证：", new_otp)
    request.session['otp'] = new_otp
    request.session['hashed_key'] = hashed_key  # 将哈希值保存到 session 中
    return render(request, 'info_otp.html', {'otp': new_otp})

```

###  **操作数据库**

在Django中，可以使用查询集（QuerySet）对象来获取数据库中的数据，这些数据以Python对象的形式返回。在查询集对象中，你可以使用字段名称（或属性名称）来获取单个对象的特定属性，也可以使用关联属性来获取相关联的对象。

#### **code模块:**
```python
# 获取所有ID_M等于某个值的UserInfo对象
user_infos = UserInfo.objects.filter(ID_M='some_value')

# 遍历所有对象，并访问其MFA_name_M属性
for user_info in user_infos:
    mfa_name = user_info.MFA_name_M
    # do something with mfa_name
```
###  **错误：找不到：/favicon.ico**

错误消息“找不到：/favicon.ico”通常表示您的 Django 应用程序无法找到 favicon.ico 文件。

网站图标是一个小图像文件，当用户访问您的网站时，它会出现在浏览器选项卡或书签栏中。当用户请求您的站点时，他们的浏览器将在您站点的根目录中查找此文件。

要解决此错误，您可以创建一个 favicon.ico 文件并将其放在 Django 项目的根目录中，或者您可以告诉 Django 不要查找该 favicon 文件。

如果您没有 favicon.ico 文件，您可以使用在线 favicon 生成器或图像编辑器（如 Photoshop 或 GIMP）创建一个。获得文件后，将其保存在 Django 项目的根目录中。

如果您不想使用网站图标，您可以通过将以下行添加到您的 urls.py 文件来告诉 Django 不要查找它：

```python
from django.views.generic.base import RedirectView
favicon_view = RedirectView.as_view(url='/static/favicon.ico', permanent=True)

urlpatterns = [
    # other URL patterns here...
    path('favicon.ico', favicon_view),
]

```

**系统demo已设计完成，以上是小部分模块化的详解，后续抽空把功能逐渐完善了，会在github发布分享给大家**

## **参考来源**

[OpenAI](https://chat.openai.com/)  