#### fzf 安装

```bash
sudo  apt install fzf
source /usr/share/doc/fzf/examples/completion.zsh
source /usr/share/doc/fzf/examples/key-bindings.zsh
# 快捷键 ctrl + T  art + c   ctrl + r  fzf 
# 配置
export FZF_DEFAULT_OPTS="--height 40% --layout=reverse --preview '(highlight -O ansi {} || cat {}) 2> /dev/null | head -500'"
export FZF_CTRL_T_OPTS="--preview '(highlight -O ansi -l {} 2> /dev/null || cat {} || tree -C {}) 2> /dev/null | head -200'"
```

#### oh my zsh

```bash

```

#### the fuck

```bash

```

#### tldr

```bash
sudo apt-get install tldr
sudo tldr --update
#没有目录则自己创建 /home/ubuntu/.local/share/tldr
```

#### frp 部署

1、从github 下载，解压下载的压缩包。

2、将frpc 复制到内网服务所在的机器上。

3、将frps 复制到拥有公网 IP 地址的机器上，并将它们放在任意目录。

4、使用以下命令启动服务器：./frps -c ./frps.toml
5、使用以下命令启动客户端：./frpc -c ./frpc.toml

6、不挂断 **nohup ./frps -c ./frps.toml** **nohup ./frpc -c ./frpc.toml**

使用systemd来操作

```bash
# 创建服务文件
sudo vim /etc/systemd/system/frps.service
```

```tex
[Unit]
# 服务名称，可自定义
Description = frp server
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
# 启动frps的命令，需修改为您的frps的安装路径
ExecStart = /path/to/frps -c /path/to/frps.toml

[Install]
WantedBy = multi-user.target
```

```bash
# 启动frp
sudo systemctl start frps
# 停止frp
sudo systemctl stop frps
# 重启frp
sudo systemctl restart frps
# 查看frp状态
sudo systemctl status frps
# 设置 frps 开机自启动
sudo systemctl enable frps
```

服务器端配置

`bindPort =7000`

客户端配置

```tex
serverAddr = "x.x.x.x"
serverPort = 7000

[[proxies]]
name = "ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 6000
```

连接方式

```bash
# 需要在服务器端开启 7000  6000 的端口，在防火墙里设置
# x.x.x.x 表示服务器公网IP ， test 表示内网用户名
ssh -o Port=6000 test@x.x.x.x
```

#### marktext 常规使用

```bash
###
# 1、n级标题
# n个# 表示n级标题，打完 # 之后记得加个空格

# 2、字体变换
# 标粗：ctrl+B
# 标斜：ctrl+i
# 下划线：ctrl+U
# 高亮：ctrl+shift+H
# 删除线：ctrl+D

# 3、代码块
# 行内代码：ctrl+`
# 代码块：```

# 4、插入表格
# ctrl+shift+T

# 5、插入图像
# ctrl+shift+i

# 6、超链接
#ctrl+L

# 7.
# Ctrl+J来切换侧边栏

# 8
# 当您开始新行时，只需键入@以显示包含所有可用功能的弹出窗口

# 9 
# 在两个::之间输入表情英文，MarkText支持快捷选择小表情
```

#### SHELL

```bash
chmod u+x **.sh
# 添加到path
export PATH=$PATH:/home/ay2021/scripts
```

#### 进程 内存

```bash
ps -aux | grep **
ps -ef | grep **
free -h
```

#### 压缩

```bash
# 压缩 tar
tar -cvf studio.tar directory_to_compress
#解压tar 到指定目录
tar -xvf studio.tar -C /tmp/extract/
#压缩 tar.gz
tar -zcvf studio.tar.gz directory_to_compress
#解压 tar.gz 到 目录
tar -zxvf studio.tar.gz  -C /tmp/extract/

# 压缩文件
rar a -r test.rar file
# 解压文件
unrar x test.rar  

# 压缩文件
zip -r test.zip file
# 解压文件
unzip test.zip -d file
```

#### 磁盘用量

```bash
df -hl # 查看磁盘剩余空间
df -h  #查看每个根路径的分区大小
du -sh [目录名] #返回该目录的大小
du -sm [文件夹] #返回该文件夹总M数
```

#### docker安装

```bash
sudo apt update # 更新索引
#安装依赖
sudo apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common
#添加官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

#官方仓库安装
sudo add-apt-repository \
"deb [arch=amd64] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) \
stable"
#安装
sudo apt install docker-ce
#免sudo
sudo groupadd docker
sudo gpasswd -a ${USER} docker
sudo service docker restart
newgrp - docker
```

#### screen

```bash
# 创建窗口test
screen -S test

# 列出所有
screen -ls
#进入screen
screen -r <screen的pid>

# 断开当前窗口(继续运行)
ctrl + a + d
ctrl + d


# 退出当前窗口
exit
# 对于正在启动的后台进程修改名字
screen -S [原始任务名] -X sessionname [修改后的任务名]

#清除损坏的screen
screen --wipe
```

#### wsl2 安装cuda

```bash
# 参考文档 https://blog.csdn.net/iwanvan/article/details/122119595
# 安装的时候注意版本问题
apt-cache showpkg cuda
apt-get install <package_name>=<version_name>

# 卸载
#To remove CUDA Toolkit:
sudo apt-get --purge remove "*cuda*" "*cublas*" "*cufft*" "*cufile*" "*curand*" \
 "*cusolver*" "*cusparse*" "*gds-tools*" "*npp*" "*nvjpeg*" "nsight*" "*nvvm*"
#To remove NVIDIA Drivers:
sudo apt-get --purge remove "*nvidia*" "libxnvctrl*"
#To clean up the uninstall:
sudo apt-get autoremove


```
