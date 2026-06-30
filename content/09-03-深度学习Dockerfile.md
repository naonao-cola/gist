---
title: 09-03-深度学习Dockerfile
tags: ["Docker", "容器", "部署"]
---

# 09-03-深度学习Dockerfile

> 父节点: [[09-00-Docker容器]]
> 源文件: `docker/docker.md`
> 相关: [[09-01-nvidia-docker]] | [[11-00-大模型与深度学习]]


## 相关笔记

[[05-01-SSE-AVX指令集]] [[09-04-数据卷]] [[11-01-PyTorch教程]]

---


参考链接: https://blog.csdn.net/guoqingru0311/article/details/119532502

深度学习的dockerfile文件仓库，这个仓库里面有各种写好的dockerfile文件，可以自己改改适配自己的环境

参考链接: https://github.com/ufoym/deepo

dockerhub链接,参考链接: https://hub.docker.com/r/ufoym/deepo

示例
nvidia的docker的官方镜像，里面不同的tag对应不同的版本。

参考链接: https://hub.docker.com/r/nvidia/cuda

NVIDIA官方提供的docker镜像nvidia/cuda，里面已经编译安装了cuda,但需完善并安装cudnn.注意:这里的cuda版本要跟宿主机显卡驱动匹配.

```bash
apt install cuda-toolkit-10-0
#将cudnn解压，执行以下命令：
sudo cp cuda/include/cudnn.h /usr/local/cuda/include/
sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64/
sudo chmod a+r /usr/local/cuda/include/cudnn.h
sudo chmod a+r /usr/local/cuda/lib64/libcudnn*
```

可以参考下面的这个链接：https://blog.csdn.net/guoqingru0311/article/details/119532502
https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html


```bash
拉取镜像
docker pull nvidia/cuda:11.7.1-base-ubuntu20.04

创建容器
docker run -itd -v /home/snd/sbg_volume:/home/sbg_folder --gpus all --name sbg_container -e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all c6ceebac4227

修复创建容器的bug
参考： https://huaweicloud.csdn.net/633118ead3efff3090b51eba.html

vscode docker插件权限问题
参考： docker报错:Got permission denied while trying to connect to the Docker daemon socket at unix:///var/ru

完善 cuda-toolkit  11.7
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-ubuntu2004.pin
sudo mv cuda-ubuntu2004.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/11.7.1/local_installers/cuda-repo-ubuntu2004-11-7-local_11.7.1-515.65.01-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2004-11-7-local_11.7.1-515.65.01-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu2004-11-7-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
-- sudo apt-get -y install cuda-11-7 容器自带驱动不需要这个步骤
--或者，需要进行前面的步骤添加cuda-repo, 注意后面的版本号
apt install cuda-toolkit-11-7

完善 cudnn
下载解压cudnn,并复制
sudo cp cuda/include/cudnn.h /usr/local/cuda/include/
sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64/
sudo chmod a+r /usr/local/cuda/include/cudnn.h
sudo chmod a+r /usr/local/cuda/lib64/libcudnn*


#把这三行复制到文件底部，设置环境变量到/root/.bashrc， 后面可以追加
export CUDA_HOME=/usr/local/cuda
export PATH=$PATH:$CUDA_HOME/bin
export LD_LIBRARY_PATH=/usr/local/cuda-11.0/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}


安装xmake,并设置环境变量
export XMAKE_ROOT=y
source /root/.bashrc


通过xrepo安装opencv 4.5.3
修改 opencv的包描述文件，第137行 增加cmake编译选项，"-DOPENCV_DOWNLOAD_MIRROR_ID=gitcode"
xrepo install "opencv 4.5.3"

opencv 自己源码编译，

下载解压 tensort包，并设置对应的环境变量
```

---

## 添加数据卷


```dockerfile
# 1.使用一个基础镜像，例如Ubuntu
FROM ubuntu:latest

# 2.更新包管理器
RUN apt-get update

# 3.安装软件包
# 这些为c++编译调式需要的基本的依赖包，可根据需要自行添加其他依赖性
RUN apt-get install -y --fix-missing gcc g++ gdb  cmake rsync

# 4.清理临时文件
RUN apt-get clean
WORKDIR /
RUN rm -rf /tmp/CMake
```

---

## docker compose