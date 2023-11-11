
# docker安装

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

# docker

```bash
# 注意后面的空格 跟 点
docker build -t gxx:v1 -f /home/ubuntu/download/docker_files/  Dockerfile .


#删除镜像
docker rmi gcc
#删除容器
docker rm -f cxx
#更新容器属性
docker update --restart=always cxx



#启动 gpu容器
docker run -itd --gpus all --name 容器名 -e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all 镜像名

nvidia-docker run -dit --name ort_new_v1 -p 31222:22 -p 31230-31299:31230-31299 \
-v /etc/localtime:/etc/localtime \
-v /var/tscvlm:/var/tscvlm \
-v /home/dusong/xb:/root/xb  \
-v /home/dusong/dataset/docker_env:/root/pkgs \
--shm-size 32G \
--privileged 6a2d36819c2c

#docker 查看容器数据卷映射
docker inspect container_name | grep Mounts -A 40

#docker 查看使用大小
docker system df
# docker 查看 信息
docker system info
# 删除废弃容器
docker system prune
```


# dockerfile

```dockefile
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