---
title: InfoSec - Note
date: 2020-09-18 11:11:11 -0400
categories: [0LearningPath]
tags: [OnePage]
toc: true
pin: true
---

# InfoSec - Note

```
    __∧_∧__    ~~~~~
　／(*´O｀)／＼
／|￣∪∪￣|＼／
　|＿＿ ＿|／

can't reiterate this enough: Do not go looking for vulnerable servers and exploits on systems you don't own without the proper approval.

por favor, no lo usar para hacer algo malo
just learning note, please don't use it to do something wrong
kali用得好，监狱进得早，与君共勉

```

---

# Test
- Common Vulnerabilities and Exposures (CVE®)


---


GoodWeb | Note
---|---
**testing** | Note
[CSIS Significant Cyber Incidents](https://www.csis.org/programs/technology-policy-program/significant-cyber-incidents) | summary of incidents from over the last year.
[OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/IndexASVS.html) | .
[OWASP Cheat Sheet Series2](https://cheatsheetseries.owasp.org/IndexProactiveControls.html) | .
[tutorialspoint-infosec](https://www.tutorialspoint.com/security_testing/testing_cross_site_scripting.htm) | .
[Youtube-University of Nottingham](https://www.youtube.com/watch?v=1S0aBV-Waeo&ab_channel=Computerphile) | .
[securityintelligence 2020 data breach report](https://securityintelligence.com/) | .
[Web Application Vulnerabilities Index](https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/) | .
[Vulnerabilities search]  | [with expolit](https://securitytracker.com/search/search.html), [2](http://www.securityfocus.com/bid/17408), [IBM X-Force](https://exchange.xforce.ibmcloud.com/vulnerabilities/25698)
**web knowledge** | Note
[HTTP tutorial](https://www.tutorialspoint.com/http/http_caching.htm) | .

---

## Pentest tools

Attack | Tool
------------------------------|-----------------------------------------------------------
---------|------------------------------
🐰 **Code Security tools** |
Kluwan <br> `Code Security/Analysis` | ![Kiuwan](https://i.imgur.com/PqQm3mh.png)
spiderfoot | 
---------|------------------------------
🐰 **Pen test tools** |
Kali Linux | Linux
Metasploit <br> `Building anti-forensic and evasion tools` | ![Metasploit](https://i.imgur.com/wY3EGbF.png) <br> - knowing about security vulnerabilities. <br> - Helps in penetration testing, IDS signature development. <br> - You can create security testing tools.
---------|------------------------------
🐰 **Digital Forensic Tools** |
Sleuth Kit (+Autopsy) |
---------|------------------------------
🐰 **malware** |  Layer 7
`malware packaging` | PEiD <br>![PEiD](https://i.imgur.com/y1AFinu.png)
`malware` | IDA Freeware <br> ![IDA Freeware](https://i.imgur.com/CAsSCA1.png)
`malware` | Pe Explorer <br> ![Pe Explorer](https://i.imgur.com/kzfck2A.png)
---------|------------------------------
🐰 **Application Link** | Layer 7
sslstrip <br> `capturing HTTPS traffic` | ![sslstrip](https://i.imgur.com/aiocGts.png)
Nmap <br> `network mapper`| ![Nmap_Logo](https://i.imgur.com/7b3NKgE.png) ![Nmap](https://i.imgur.com/K2OvK5H.png) <br> - scan networks and IT systems to identify existing security vulnerabilities. <br> - **Nmap suite has**: <br> - Data transfer, redirection, and debugging tool(Ncat), <br> - Scan results comparing utility(Ndiff), <br> - Packet generation and response analysis tool (Nping), <br> - GUI and Results viewer (Nping) <br> - **Using raw IP packets it can determine**: <br> - The available hosts, services offered, OS, Packet filters using...
Nikto <br> `Scan web server vulnerabilities` | ![Nikto](https://i.imgur.com/Kq5bZOe.png) <br> - It can check web servers for over 6700 potentially dangerous files. <br> -It has full HTTP proxy support. <br> -Using Headers, favicons, and files, it can identify the installed software. <br> -It can scan the server for outdated server components. <br> - contains a database with more than 6400 different types of threats.
`web application vulnerabilities` | Acunetix <br>![dashboard-2](https://i.imgur.com/9oeYkzy.png)
Nexpose <br> `scanning and managing vulnerabilities` |
Paros Proxy <br> `web vulnerabilities` | - Some of the tools contained in the Paros Proxy utility include vulnerability scanners, a web spider, and traffic recorder for retaining network activities in real-time. <br> Paros Proxy is useful in identifying intrusion openings in a network, detects common cybersecurity threats such as XSS and SQLi.
Burp Suite <br> `MITM/XSS web vulnerabilities` | ![BurpSuite](https://i.imgur.com/IJkeA2y.png) <br> - web vulnerability scanner
Owasp ZAP <br> `XSS web vulnerabilities` | ![OwaspZAP](https://i.imgur.com/t6cqHVy.png)
DOMinator Tool, DOM Snitch <br> `DOM Based XSS` |
Nessus <br> `vulnerability scanner` |
OpenVAS <br> `vulnerability scanning & management` | ![openvas10](https://i.imgur.com/8sJLdIh.png)
Intruder <br> `Finding vulnerabilities` | ![Intruder](https://i.imgur.com/7BLUaKx.png)
Netsparker <br> `identified vulnerabilities` | ![Netsparker](https://i.imgur.com/cuShMOy.jpg)
---------|------------------------------
tools | **Encryption cybersecurity tools**
TrueCrypt |
KeyPass |
Tor |
---------|------------------------------
🐰 **Network Link** | Layer 7
PackETH <br> `capturing network packet` | ![PackETH](https://i.imgur.com/HDvf8Du.png)
Netstumbler <br> `identify open ports` | - designed for Win
Aircrack-Ng <br> `Wireless sniffer & injector` | ![aircrack-ng](https://i.imgur.com/wgVZxJJ.png) <br> - focus on Replay attacks, de-authentication, fake access points, and others. <br> - It supports exporting data to text files. <br> - It can check Wi-Fi cards and driver capabilities. <br> - It can crack WEP keys and for that, it makes use of FMS attack, PTW attack, and dictionary attacks. <br> - It can crack WPA2-PSK and for that, it makes use of dictionary attacks.
KisMAC <br> `wireless network security in the MAC` |
wireshark <br> `Sniffing` | ![Wireshark](https://i.imgur.com/L1ckSYt.png)
---------|------------------------------
tools | **monitoring network security**
Splunk |
PaloAlto |
POf |
Argus `analyzing network traffics OpenS`|
Nagios |
OSSEC `real-time analyz security events of a system OpenS`|
---------|------------------------------
tools | **detecting network intrusions**
Snort `analysis on network traffic` |
Acunetix |
Forcepoint |
GFI LanGuard `monitor networks, scan for vulnerabilities` |
---------|------------------------------
🐰 **Data Link** | Layer 2
arpspoof <br> `ARP poisoning` | ![arpspoof](https://i.imgur.com/ZKZug7g.png)
Ettercap <br> `ARP poisoning` | ![Ettercap](https://i.imgur.com/0ciXVzn.png) <br>![Ettercap](https://i.imgur.com/bVAdWxn.png) <br> - Sniffing of live connections. <br> - Content filtering. <br> - Active and passive dissection of many protocols. <br> - Network and host analysis.
`Sniffing` | Etherflood
`detect ARP poisoning` | AntiARP, ARPon, ArpStar,
`detect ARP poisoning` | XARP <br> ![XARP](https://i.imgur.com/vWTIp91.png)
`Sniffing` | dsniff
Countermeasure | detect: Antisniff, ArpWatch, Switch Network switch Port Security features
---------|------------------------------
tools | **Password auditing and packet sniffers cybersecurity tools**
John The Ripper <br> `PaswdCrack` | ![John-the-Ripper](https://i.imgur.com/zq4Ao7o.png)
Cain and Abel <br> `PaswdCrack / ARP poisoning` | ![CainandAbel](https://i.imgur.com/8gSuAdg.png)
Tcpdump <br> `sniffing data packets` | - monitor log TCP and IP traffic communicated through a network
---------|------------------------------
🐰 | **Reconnaissance** step 1 information gethering
`passive` | visualping <br> ![visualping](https://i.imgur.com/TV47wYz.png)
`website mirroring` | HTTrack <br> ![HTTrack](https://i.imgur.com/g0s74oj.png)
`email foot-printing` | TheHarvester <br> ![TheHarvester](https://i.imgur.com/Ey7HrEQ.png)
`link analysis and data mining` | Maltego <br> ![Maltego](https://i.imgur.com/oegrQtd.png) <br> - provide graphical picture about the weak points and abnormalities of the network.
Recon-ng <br>  `foot-printing` | ![Recon-ng](https://i.imgur.com/jgc9SSN.png)
`foot-printing` | OSRframwork <br> ![OSRframwork](https://i.imgur.com/vtJNROh.png)
`hacker search engine` | Shodan <br> ![OSRframwork](https://i.imgur.com/F4Hmvxn.jpg) <br> - collects all information about all devices that are directly connected to the internet with the specified keywords that you enter.
`web info gethering` | httprint <br> ![httprint](https://i.imgur.com/koDelg8.png)
`Fingerprint web Framework` | whatweb <br> ![whatweb](https://i.imgur.com/PKmBLXt.png)
`Fingerprint web Framework` | BlindElephant, Wappalyzer
`website record` | HUNCHLY <br> ![HUNCHLY](https://i.imgur.com/2coiGDl.png)
`phishing` | Gophish - opensource phishing platform |
`Scanning` | Angry IP Scanner <br>![AngryIPScanner](https://i.imgur.com/5Qyj91h.png) <br> - scanning the IP addresses and ports. It can scan both on local network and Internet.


---

Lab | Note
---|---
[Internet Security](http://site.iugaza.edu.ps/mammar/internet-security/) <br> - [Attacklab](http://site.iugaza.edu.ps/nour/fall-2012/security-disc/) |
[SEEDLab](https://seedsecuritylabs.org/lab_env.html) |
- [Cross-Site Scripting Attack Lab](http://www.cis.syr.edu/~wedu/seed/Labs_12.04/Web/Web_XSS_Elgg/Web_XSS_Elgg.pdf) | ✔️
[InfosecLab](https://67327.cmuis.net/labs) |
[pentest](https://www.pentesterlab.com/exercises) |

---

XiongHaizimen | Note
---|---
[Tanishq](https://tanishq.page/index.html) | cool website and lab!
[coolguy](https://jhalon.github.io/over-the-wire-natas1/) | great solution
[infosecblog](https://www.boiteaklou.fr/archive/) | cool
[secblog](https://www.aldeid.com/w/index.php?search=TryHackMe&title=Special%3ASearch&go=Go) | solution
[Kali渗透测试 大学霸](https://wizardforcel.gitbooks.io/daxueba-kali-linux-tutorial/content/27.html) | learn kali
[Gaurav Sen](https://www.youtube.com/watch?v=_YlYuNMTCc8&t=5s&ab_channel=GauravSen) | youtuber
[youtube](https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw) | not yet
[youtube](https://www.youtube.com/watch?v=fScttW55D_U) | Boston SDE girl
[youtube](https://www.youtube.com/channel/UCZLJf_R2sWyUtXSKiKlyvAw) | DS Pro, clear and step by step


---

vulnerability | Note
---|---
[CVE-2005-2453 - Web Server Generic XSS] | [1](https://nvd.nist.gov/vuln/detail/CVE-2005-2453#VulnChangeHistorySection), [2](https://securitytracker.com/id?1014624)













.
