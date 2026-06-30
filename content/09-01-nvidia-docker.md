---
title: 09-01-nvidia-docker
tags: ["Docker", "容器", "部署"]
---

# 09-01-nvidia-docker

> 父节点: [[09-00-Docker容器]]
> 源文件: `docker/docker.md`
> 相关: [[09-03-深度学习Dockerfile]] | [[05-00-Nvidia-CUDA与SIMD]]


## 相关笔记

[[05-03-CUDA内存层次]]

---

[filename](resource/html/Docker.html ':include width=100% height=1000px')

## docker安装

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

## 配置nvidia-docker指南

```bash
##### https://blog.csdn.net/yiqiedouhao11/article/details/141392752
##### https://www.cnblogs.com/li508q/p/18444582

# 1 运行 nvidia-smi 命令来检查 NVIDIA 驱动程序是否正确安装。

# 2 对于 Docker 版本 19.03 及以上，使用 nvidia-container-toolkit 替代旧的 nvidia-docker2。
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker

# 3 编辑 Docker 的配置文件 daemon.json，通常位于 /etc/docker/ 目录。
# docker 镜像
# https://docker.xuanyuan.me/
# https://www.cnproxy.top/docker
# https://www.cnblogs.com/dechinphy/p/18350332/docker-pull-continue
{
    "default-runtime": "nvidia",
    "experimental": true,
    "registry-mirrors": [
        "https://docker.rainbond.cc",
        "https://docker.1panel.live",
        "https://docker.m.daocloud.io",
        "https://docker.xuanyuan.me",
        "https://docker.1ms.run",
        "https://xdark.top"
    ],
    "runtimes": {
        "nvidia": {
            "args": [],
            "path": "nvidia-container-runtime"
        }
    },
    "features": {
        "buildkit": true,
        "containerd-snapshotter": true
    }
}


# 4 每次修改 daemon.json 后，都需要重启 Docker 服务。

sudo systemctl daemon-reload
sudo systemctl restart docker

# 5 运行 docker info 命令，检查输出中是否有 NVIDIA GPU 支持的信息
docker info | grep -i nvidia


```
```bash
## 小笔记