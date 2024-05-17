## 常用命令

```bash
#查看内核版本
uname -r
#查看处理器架构
uname -m
# 快速定位文件
locate filename
#查看so文件的以来
ldd
#将文件打包为二进制文件，譬如将图片转为c++ 头文件
xdd

# 查找文件，查找范围 类型 名字
find ./ -type f -name "*.c"
#文件复制拷贝
rsync -a source destination
#排除文件
rsync -av --exclude='*.txt' source/ destination
#多个排除模式
rsync -av --exclude 'file1.txt' --exclude 'dir1/*' source/ destination
rsync -av --exclude={'file1.txt','dir1/*'} source/ destination
#远程同步
rsync -av username@remote_host:source/ destination
#断点续传
rsync -avP -e 'ssh -p 4321'  /dataA username@B:/dataB/

# 切换用户
su backend
# grep 使用
ps -ef | grep sshd | grep -v grep
cat /etc/init.d/sshd | grep -v '^#' | grep -v '^$'

```

### awk
```bash
# awk 是对文本一行一行进行处理，每一行的多个字段分别是$1 $2 $3 $4 ... $0表示改行的整条数据
# -F 表示分隔符，默认为空格，NF表示每行字符有多少个字段，NR表示当前处理的是第几行， ~ 表示启用正则匹配， 正则表达式用一对 / 包含起来
cat /etc/passwd | awk -F ':' '{if ($NF ~ /bash/) print $1}'

cat /etc/passwd | awk -F ':' 'BEGIN{print "user\tshell\n-------"} {print $1"\t"$NF} END{print "--------"}'

```
## fzf安装

```bash
sudo  apt install fzf
source /usr/share/doc/fzf/examples/completion.zsh
source /usr/share/doc/fzf/examples/key-bindings.zsh
# 快捷键 ctrl + T  art + c   ctrl + r  fzf
# 配置
export FZF_DEFAULT_OPTS="--height 40% --layout=reverse --preview '(highlight -O ansi {} || cat {}) 2> /dev/null | head -500'"
export FZF_CTRL_T_OPTS="--preview '(highlight -O ansi -l {} 2> /dev/null || cat {} || tree -C {}) 2> /dev/null | head -200'"
```
如果omz的话，需要加到 插件里面启用。

## oh my zsh

```bash

```

## the fuck

```bash

```
## vim
![](../images/vim.png)

![](../images/vim_2.png)
### 命令模式
1、移动光标
1）上下左右移动光标

    上、下、左、右方向键 移动光标
    h（左） j（下） k（上） l（右） 移动光标

2）光标移动到文件头或文件尾

    gg 移动到文件头
    G 移动到文件尾（shift + g）

3）光标移动到行首或行尾

    ^ 移动到行首
    $ 移动到行尾

4）移动到指定行

    :n 移动到第几行（这里的 n 是数字）

2、删除或剪切

1）删除字母

    x 删除单个字母
    nx 删除 n 个字母（n 是数字，如果打算从光标位置连续删除 10 个字母，可以使用 10x 即可）

2）删除整行或剪切

    dd 删除单行
    ndd 删除多行
    :n1,n2d 删除指定范围的行

删除行或多行，是比较常用的删除方法。这里的 dd 快捷键既是删除也是剪切。删除内容放入了剪切板，如果不粘贴就是删除，粘贴就是剪切。粘贴方法：

    p 粘贴到光标下面一行
    P 粘贴到光标上面一行

3）从光标所在行删除到文件尾

    dG 从光标所在行删除到文件尾（d 是删除行，G 是文件尾，连起来就是从光标行删除到文件尾）

3复制

    yy 复制单行
    nyy 复制多行

复制之后的粘贴依然可以使用 p 键或 P 键

4 撤销

    u 撤销
    ctrl + r 反撤销

u 键能一直撤销到文件打开时的状态，ctrl + r 能一直反撤销到最后一次操作状态

5替换

    r 替换光标所在处的字符
    R 从光标所在处开始替换字符，按 esc 键结束

6其他

    gg ：跳转到文件开头
    Shift + g ：跳转到文件结尾
    :vsplit ：垂直分割
    :split ：水平分割窗口
    /pattern : 从上往下查找关键词 pattern 并高亮显示
    ?pattern : 从下往上查找关键词 pattern 并高亮显示
    : 100 : 跳转到文件的第100行
    /pattern1 [ ]+ pattern2: 查找关键词 pattern1 之后为任意个空格之后是关键词 pattern2
    /^C.*\spattern : 查找行头第一个字符为C之后任意多个字符后是空格且空格后是pattern关键词的内容
    :g/^$/d : 删除不包含任何空格的空行
    :g/^\s*$/d : 删除包含空格的空行
    :%g!/pattern/d : 删除不包含关键词pattern的所有行
    ：%s/\s+/ /g 删除行中间的空格

## tldr

```bash
sudo apt-get install tldr
sudo tldr --update
#没有目录则自己创建 /home/ubuntu/.local/share/tldr
```

## frp 部署

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

## marktext

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

## SHELL

```bash
chmod u+x **.sh
# 添加到path
export PATH=$PATH:/home/ay2021/scripts
# 修改文件归属， 冒号前面是用户，冒号后面是所属组
chown  backend:backend  ./test.sh
```

## 进程 内存

```bash
ps -aux | grep **
ps -ef | grep **
free -h
#查看内存用量 交换区用量
free -m
```

## 压缩

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

## 磁盘用量

```bash
fdisk -l # 查看磁盘所有分区
df -hl # 查看磁盘剩余空间
df -h  #查看每个根路径的分区大小
du -sh [目录名] #返回该目录的大小
du -sm [文件夹] #返回该文件夹总M数
```

## screen

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

## wsl2 安装cuda

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

## tmux

```bash
# 查看有所有tmux会话
tmux ls
# 新建tmux窗口
tmux new -s <session-name>
# 分离会话,快捷键：Ctrl+b d
tmux detach
# 重新连接会话
tmux attach -t <session-name>
tmux at -t <session-name>
#关闭会话
exit
# 划分上下两个窗格,Ctrl+b “
tmux split
# 划分左右两个窗格 Ctrl+b %
tmux split -h


# 光标切换到上方窗格,Ctrl+b 方向键上
tmux select-pane -U
”            # 将当前面板平分为上下两块
%            # 将当前面板平分为左右两块
x            # 关闭当前面板
!            # 将当前面板置于新窗口；即新建一个窗口，其中仅包含当前面板
Ctrl+方向键    # 以1个单元格为单位移动边缘以调整当前面板大小
Alt+方向键    # 以5个单元格为单位移动边缘以调整当前面板大小
Space        # 在预置的面板布局中循环切换；依次包括even-horizontal、even-vertical、main-horizontal、main-vertical、tiled
q            # 显示面板编号
o            # 在当前窗口中选择下一面板
方向键        # 移动光标以选择面板
{            # 向前置换当前面板
}            # 向后置换当前面板
Alt+o        # 逆时针旋转当前窗口的面板
Ctrl+o        # 顺时针旋转当前窗口的面板
```

## vscode插件

### koroFileHeader注释插件

```bash
# Ctrl + win + i
# 直接按住快捷键，即可在当前文件头部生成

# Ctrl + win + t
# 鼠标光标移到到目标函数的上一行，再按快捷键.函数注释
```

## trt工具

```bash
# ppocr v4
paddle2onnx --model_dir ./  --model_filename inference.pdmodel --params_filename inference.pdiparams --save_file ./reshape/det.onnx  --opset_version 10 --input_shape_dict="{'x':[-1,3,-1,-1]}"  --enable_onnx_checker True
3*640*640

paddle2onnx --model_dir ./  --model_filename inference.pdmodel --params_filename inference.pdiparams --save_file ./reshape/rec.onnx --opset_version 10 --input_shape_dict="{'x':[-1,3,-1,-1]}" --enable_onnx_checker True
3*48*320

paddle2onnx --model_dir ./ --model_filename inference.pdmodel  --params_filename inference.pdiparams --save_file ./reshape/cls.onnx  --opset_version 10 --input_shape_dict="{'x':[-1,3,-1,-1]}"  --enable_onnx_checker True
3*32*320

# 升级之后改尺寸换为
python -m paddle2onnx.optimize --input_model model.onnx \
                               --output_model new_model.onnx \
                               --input_shape_dict "{'x':[1,3,224,224]}"


E:\demo\3rdparty\TensorRT-8.4.1.5\bin\trtexec.exe --minShapes=x:1x3x640x640 --optShapes=x:1x3x640x640 --maxShapes=x:1x3x640x640 --onnx=E:\demo\rep\AIFramework\models\ort_models\ch_PP-OCRv4_det_infer\reshape\det.onnx --saveEngine=E:\demo\rep\AIFramework\models\ort_models\ch_PP-OCRv4_det_infer\reshape\det.trt.engine


E:\demo\3rdparty\TensorRT-8.4.1.5\bin\trtexec.exe --minShapes=x:1x3x32x320 --optShapes=x:1x3x32x320 --maxShapes=x:1x3x32x320 --onnx=E:\demo\rep\AIFramework\models\ort_models\ch_PP-OCRv4_rec_infer\reshape\rec.onnx --saveEngine=E:\demo\rep\AIFramework\models\ort_models\ch_PP-OCRv4_rec_infer\reshape\rec.trt.engine
1*3*48*320
```
