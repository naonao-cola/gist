# 08-04-xargs

> 父节点: [[08-00-Linux系统工具]]
> 源文件: `linux/linux.md`
> 相关: [[08-01-grep]] | [[08-02-sed]] | [[08-03-awk]]

---


用于将标准输入转换为命令行参数。

`command | xargs [选项] [命令]`

command：产生标准输出的命令。

[选项]：控制 xargs 的行为。

命令：要执行的命令及其参数。

3.1 常用选项

-I：指定一个替换字符串，用于在命令中替换输入的参数。

-n：指定每次传递给命令的参数数量。

-P：指定并行执行的进程数。

-r：如果输入为空，则不执行命令。

-t：在执行命令之前，先打印出命令

-p；执行命令前询问

-t: 显示即将执行的命令


3.2 常见用法demo

```bash
# 1 -p：在执行每个命令前提示用户确认
find . -name "*.txt" | xargs -p rm

# 2 -a file：从文件中读取输入，而不是标准输入
xargs -a filename.txt command

# 3 -t：显示即将执行的命令
find . -name "*.txt" | xargs -t rm

# 4 -I replace-str：将输入中的每一行替换为 replace-str 中的 {}
find . -name "*.txt" | xargs -I {} cp {} /backup/{}

# 5 -n max-args：每次传递的最大参数数量
find . -name "*.txt" | xargs -n 5 rm

# 6 使用 -r 选项避免在输入为空时执行命令
echo "" | xargs -r rm

# 7 使用 -t 选项在执行命令之前打印命令
echo "file1.txt file2.txt file3.txt" | xargs -t rm

# 8 -d delim：指定输入项之间的分隔符（默认为空白字符
echo "file1.txt|file2.txt" | xargs -d '|' rm

# 9 -0：输入项之间用 NUL 字符分隔（通常与 find -print0 结合使用
find . -name "*.txt" -print0 | xargs -0 rm

# 10 -P max-procs：同时运行的最大进程数
find . -name "*.txt" | xargs -P 4 gzip

# 11 -E eof-str：指定输入结束字符串
echo "file1.txt\nfile2.txt\nEOF" | xargs -E EOF rm

# 12 -r 或 --no-run-if-empty：如果没有输入，则不执行命令
find . -name "*.log" | xargs -r rm

示例1：基本搜索并删除文件
find . -name "*.tmp" | xargs rm
这将删除所有 .tmp 文件。

示例2：查找并复制文件到另一个目录
find . -name "*.jpg" | xargs -I {} cp {} /backup/pictures/
这将把所有 .jpg 文件复制到 /backup/pictures/ 目录中。

示例3：查找并压缩文件
find . -name "*.log" | xargs tar -czvf logs.tar.gz
这将把所有 .log 文件压缩成 logs.tar.gz。

示例4：限制每次传递的参数数量
find . -name "*.txt" | xargs -n 2 rm
这将每次传递两个 .txt 文件给 rm 命令。

示例5：使用 -I 替换占位符
find . -name "*.bak" | xargs -I {} mv {} {}.old
这将把所有 .bak 文件重命名为 .bak.old。

示例6：并发执行命令
find . -name "*.jpg" | xargs -P 4 gzip
这将并发地对所有 .jpg 文件进行压缩，最多同时运行 4 个 gzip 进程。

示例7：使用 -0 处理包含空格的文件名
find . -name "*.txt" -print0 | xargs -0 rm
这将正确处理包含空格或特殊字符的文件名。

示例8：使用 -p 提示用户确认
find . -name "*.log" | xargs -p rm
这将在删除每个 .log 文件前提示用户确认。

示例9：使用 -t 显示即将执行的命令
find . -name "*.txt" | xargs -t rm
这将显示即将执行的 rm 命令。

#综合示例

#!/bin/bash

# 查找并删除所有 .tmp 文件
echo "Deleting all .tmp files:"
find . -name "*.tmp" | xargs -p rm

# 查找并复制所有 .jpg 文件到 backup 目录
echo "Copying all .jpg files to /backup/pictures/"
find . -name "*.jpg" | xargs -I {} cp {} /backup/pictures/

# 查找并压缩所有 .log 文件
echo "Compressing all .log files into logs.tar.gz:"
find . -name "*.log" | xargs tar -czvf logs.tar.gz

# 查找并重命名所有 .bak 文件为 .bak.old
echo "Renaming all .bak files to .bak.old:"
find . -name "*.bak" | xargs -I {} mv {} {}.old

# 查找并限制每次传递 2 个参数给 rm 命令
echo "Removing .txt files in batches of 2:"
find . -name "*.txt" | xargs -n 2 rm

# 查找并处理包含空格的文件名
echo "Handling filenames with spaces:"
find . -name "* *" -print0 | xargs -0 rm

# 查找并显示即将执行的命令
echo "Displaying commands before execution:"
find . -name "*.log" | xargs -t rm

```
### 4 awk