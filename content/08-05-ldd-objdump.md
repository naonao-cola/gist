---
title: 08-05-ldd-objdump
tags: ["Linux", "系统工具", "命令行"]
---

# 08-05-ldd-objdump

> 父节点: [[08-00-Linux系统工具]]
> 源文件: `linux/linux.md`
> 相关: [[03-00-编译工具链]]


## 相关笔记

[[03-01-xmake教程]]

---

## linux 动态库问题

```bash

#查看so文件的依赖
ldd
# --help 获取指令帮助信息；
# --version 打印指令版本号；
# -d,--data-relocs 执行重定位和报告任何丢失的对象；
# -r,--function-relocs 执行数据对象和函数的重定位，并且报告任何丢失的对象和函数；
# -u, --unused 打印未使用的直接依赖；
# -v, --verbose 详细信息模式，打印所有相关信息；


#将文件打包为二进制文件，譬如将图片转为c++ 头文件
xdd


# strings命令
# -a	扫描整个文件，而不只是扫描目标文件初始化和装载段
# -f	显示字符串前，先显示文件名
# -t	输出字符的位置，基于八进制，十进制或十六进制
# -d	只打印文件中初始化的、加载的数据节中的字符串。这可能会减少输出中的垃圾数量，但也会将字符串程序暴露给用于扫描和加载部分的BFD库中可能存在的任何安全缺陷。
strings hello.so | grep VERSION  # 版本
strings hello.so | grep GCC      # GCC版本

# file命令
# -b：仅显示文件类型，不显示文件名；
# -i：显示MIME类型；
# -z：对压缩文件也进行检测。
# -c：详细显示指令执行过程，便于排错或分析程序执行的情形；
# -f<名称文件>：指定名称文件，其内容有一个或多个文件名称时，让file依序辨识这些文件，格式为每列一个文件名称；
# -L：直接显示符号链接所指向的文件类别；
# -m<魔法数字文件>：指定魔法数字文件；
# -v：显示版本信息；
# -s: 查询（块/字符设备）文件信息
file libalgLib.so
libalgLib.so: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, with debug_info, not stripped


# objdump命令
# -f	显示文件头信息
# -d	反汇编文件中需要执行指令的那些section
# -D	与-d类似，但反汇编文件中中的所有section
# -h	显示文件中的Section Header信息
# -x	显示文件的全部Header信息
# -s	除了显示文件的全部Header信息，还显示他们对应的十六进制文件代码

objdump -f hello.so # 显示hello.so的文件头信息


# nm命令
# -A 在每个符号信息的前面打印所在对象文件名称；
# -C 输出demangle过了的符号名称；
# -D 打印动态符号；
# -l 使用对象文件中的调试信息打印出所在源文件及行号；
# -n 按照地址/符号值来排序；
# -u 打印出那些未定义的符号。
# 常见符号类型：
# A 该符号的值在今后的链接中将不再改变；
# B 该符号放在BSS段中，通常是那些未初始化的全局变量；
# D 该符号放在普通的数据段中，通常是那些已经初始化的全局变量；
# T 该符号放在代码段中，通常是那些全局非静态函数；
# U 该符号未定义过，需要自其他对象文件中链接进来；
# W 未明确指定的弱链接符号；同链接的其他对象文件中有它的定义就用上，否则就用一个系统特别指定的默认值。

# 通常用于加载第三方so等库文件时，报错函数未定义时，可通过该方式搜索so中是否定义某函数
nm –A hello.so | grep “T main”


# 查看文件名 依赖库
readelf -d libalgLib.so

# ldconfig命令
/etc/ld.so.conf  文件保存，这个文件列出了系统需要搜索的动态链接库目录
# -n :用此选项时,ldconfig仅扫描命令行指定的目录,不扫描默认目录(/lib,/usr/lib),也不扫描配置文件/etc/ld.so.conf所列的目录.
# -v或--verbose:用此选项时,ldconfig将显示正在扫描的目录及搜索到的动态链接库,还有它所创建的连接的名字.

```
### cmake 升级

打开cmake下载的官网：https://cmake.org/files/
这里我们选择最高的子版本，cmake-3.20.6-linux-x86_64.sh，点击进行下载。（最小的子版本号可以自行更改，我选的是当时最高的6，因为它大概率拥有最全的补丁）

```bash
cd Downloads
sudo bash cmake-3.20.6-inux-x86_64.sh --skip-licence --prefix=/usr

# 安装过程中遇到：
# 第一个选择时，输入y!!!
Do you accept the license? [yn]:
# 输入 y

# 第二个选择时，输入n!!!
By default the CMake will be installed in:
  "/usr/cmake-3.23.0-linux-x86_64"
Do you want to include the subdirectory cmake-3.23.0-linux-x86_64?
Saying no will install in: "/usr" [Yn]:
# 输入 n

```