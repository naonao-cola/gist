
## docker基础
[filename](./Docker.html ':include width=100% height=800px')

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

---

## docker

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
# 参考链接 https://www.cnblogs.com/chester-cs/p/14444247.html
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

#进入容器，开启新的shell
docker exec -it container_name /bin/bash
#附加到容器，不开启新shell
docker attach container_name

#退出容器
exit

#退出容器shell回到宿主机，不退出容器，容器后台运行，
#快捷键
ctrl p + q

# 数据卷
docker volume create My_Volume
#查看所有的数据卷
docker volume ls

#查看某个数据卷信息，可以看到创建时间、设备类型、标签、挂载点、名字等信息
docker volume inspect My_Volume

#将数据卷怪再到容器
docker docker run -v foo:/data alpine ls /data## 部署深度学习docker
```

Docker Image及Image命令详解

参考链接: https://blog.51cto.com/u_15870611/5837740


docker启动时环境变量不生效（docker打包成镜像后环境变量失效）

参考链接： https://blog.csdn.net/XUchenmp/article/details/136064035

把环境变量写入~/.bashrc中，每次打开新的shell时都会执行，听着就比较符合我们的要求了，然后重启以及重新进入shell都验证一下，发现Java环境都生效。
解决方案：
解决方案

1、在shell脚本设置环境变量
2、在Dockerfile中使用ENV命令
一开始我是用的方案2，但是语法没写对导致我以为这种用法不行才换的写入~/.bashrc这个方案，然后就踩了这个坑

---

## 部署深度学习docker

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

先停止docker 服务，`systemctl stop docker`

进入目录，后面是容器ID。`cd /var/lib/docker/containers/93531fb93b4fe225251947ee4c9f1a4b72ab707a9bb45118dd464add0e9bc790`

修改hostconfig.json文件,前面是宿主机目录，后面是容器内目录，修改Bind 的键值对。 `vim hostconfig.json`

```json
{
    "Binds": [
        "/data/Ronnie:/home/user/download"
    ],
    "ContainerIDFile": "",
    "LogConfig": {
        "Type": "json-file",
        "Config": {}
    },
    "NetworkMode": "default",
    "PortBindings": {},
    "RestartPolicy": {
        "Name": "no",
        "MaximumRetryCount": 0
    },
    "AutoRemove": false,
    "VolumeDriver": "",
    "VolumesFrom": null,
    "ConsoleSize": [
        18,
        171
    ],
    "CapAdd": null,
    "CapDrop": null,
    "CgroupnsMode": "host",
    "Dns": [],
    "DnsOptions": [],
    "DnsSearch": [],
    "ExtraHosts": null,
    "GroupAdd": null,
    "IpcMode": "private",
    "Cgroup": "",
    "Links": null,
    "OomScoreAdj": 0,
    "PidMode": "",
    "Privileged": false,
    "PublishAllPorts": false,
    "ReadonlyRootfs": false,
    "SecurityOpt": null,
    "UTSMode": "",
    "UsernsMode": "",
    "ShmSize": 67108864,
    "Runtime": "runc",
    "Isolation": "",
    "CpuShares": 0,
    "Memory": 0,
    "NanoCpus": 0,
    "CgroupParent": "",
    "BlkioWeight": 0,
    "BlkioWeightDevice": [],
    "BlkioDeviceReadBps": [],
    "BlkioDeviceWriteBps": [],
    "BlkioDeviceReadIOps": [],
    "BlkioDeviceWriteIOps": [],
    "CpuPeriod": 0,
    "CpuQuota": 0,
    "CpuRealtimePeriod": 0,
    "CpuRealtimeRuntime": 0,
    "CpusetCpus": "",
    "CpusetMems": "",
    "Devices": [],
    "DeviceCgroupRules": null,
    "DeviceRequests": null,
    "MemoryReservation": 0,
    "MemorySwap": 0,
    "MemorySwappiness": null,
    "OomKillDisable": false,
    "PidsLimit": null,
    "Ulimits": null,
    "CpuCount": 0,
    "CpuPercent": 0,
    "IOMaximumIOps": 0,
    "IOMaximumBandwidth": 0,
    "MaskedPaths": [
        "/proc/asound",
        "/proc/acpi",
        "/proc/kcore",
        "/proc/keys",
        "/proc/latency_stats",
        "/proc/timer_list",
        "/proc/timer_stats",
        "/proc/sched_debug",
        "/proc/scsi",
        "/sys/firmware"
    ],
    "ReadonlyPaths": [
        "/proc/bus",
        "/proc/fs",
        "/proc/irq",
        "/proc/sys",
        "/proc/sysrq-trigger"
    ]
}
```

`sudo: cd: command not found`  解决办法，获取root权限，`sudo su`  或者`sudo -sH`

同样的方法，修改config.v2.json。修改MountPoints 的键值对

```json
{
    "StreamConfig": {},
    "State": {
        "Running": false,
        "Paused": false,
        "Restarting": false,
        "OOMKilled": false,
        "RemovalInProgress": false,
        "Dead": false,
        "Pid": 0,
        "ExitCode": 137,
        "Error": "",
        "StartedAt": "2024-01-12T03:26:28.242858396Z",
        "FinishedAt": "2024-01-12T03:59:17.473049263Z",
        "Health": null
    },
    "ID": "e5397e58c2b2a741d7ca0ed15492066093e011bba0a3f90e2bb875bb20ff488d",
    "Created": "2024-01-09T10:43:03.230337824Z",
    "Managed": false,
    "Path": "/opt/nvidia/nvidia_entrypoint.sh",
    "Args": [
        "sh"
    ],
    "Config": {
        "Hostname": "e5397e58c2b2",
        "Domainname": "",
        "User": "user",
        "AttachStdin": true,
        "AttachStdout": true,
        "AttachStderr": true,
        "Tty": true,
        "OpenStdin": true,
        "StdinOnce": true,
        "Env": [
            "PATH=/home/user/conda/bin:/usr/local/nvidia/bin:/usr/local/cuda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "NVARCH=x86_64",
            "NVIDIA_REQUIRE_CUDA=cuda>=11.4 brand=tesla,driver>=418,driver<419 brand=tesla,driver>=450,driver<451",
            "NV_CUDA_CUDART_VERSION=11.4.43-1",
            "NV_CUDA_COMPAT_PACKAGE=cuda-compat-11-4",
            "CUDA_VERSION=11.4.0",
            "LD_LIBRARY_PATH=/usr/local/nvidia/lib:/usr/local/nvidia/lib64",
            "NVIDIA_VISIBLE_DEVICES=all",
            "NVIDIA_DRIVER_CAPABILITIES=compute,utility",
            "NV_CUDA_LIB_VERSION=11.4.0-1",
            "NV_NVTX_VERSION=11.4.43-1",
            "NV_LIBNPP_VERSION=11.4.0.33-1",
            "NV_LIBNPP_PACKAGE=libnpp-11-4=11.4.0.33-1",
            "NV_LIBCUSPARSE_VERSION=11.6.0.43-1",
            "NV_LIBCUBLAS_PACKAGE_NAME=libcublas-11-4",
            "NV_LIBCUBLAS_VERSION=11.5.2.43-1",
            "NV_LIBCUBLAS_PACKAGE=libcublas-11-4=11.5.2.43-1",
            "NV_LIBNCCL_PACKAGE_NAME=libnccl2",
            "NV_LIBNCCL_PACKAGE_VERSION=2.11.4-1",
            "NCCL_VERSION=2.11.4-1",
            "NV_LIBNCCL_PACKAGE=libnccl2=2.11.4-1+cuda11.4",
            "NVIDIA_PRODUCT_NAME=CUDA",
            "NVIDIA_CUDA_END_OF_LIFE=1",
            "NV_CUDA_CUDART_DEV_VERSION=11.4.43-1",
            "NV_NVML_DEV_VERSION=11.4.43-1",
            "NV_LIBCUSPARSE_DEV_VERSION=11.6.0.43-1",
            "NV_LIBNPP_DEV_VERSION=11.4.0.33-1",
            "NV_LIBNPP_DEV_PACKAGE=libnpp-dev-11-4=11.4.0.33-1",
            "NV_LIBCUBLAS_DEV_VERSION=11.5.2.43-1",
            "NV_LIBCUBLAS_DEV_PACKAGE_NAME=libcublas-dev-11-4",
            "NV_LIBCUBLAS_DEV_PACKAGE=libcublas-dev-11-4=11.5.2.43-1",
            "NV_NVPROF_VERSION=11.4.43-1",
            "NV_NVPROF_DEV_PACKAGE=cuda-nvprof-11-4=11.4.43-1",
            "NV_LIBNCCL_DEV_PACKAGE_NAME=libnccl-dev",
            "NV_LIBNCCL_DEV_PACKAGE_VERSION=2.11.4-1",
            "NV_LIBNCCL_DEV_PACKAGE=libnccl-dev=2.11.4-1+cuda11.4",
            "LIBRARY_PATH=/usr/local/cuda/lib64/stubs",
            "http_proxy=",
            "https_proxy=",
            "no_proxy=",
            "DEBIAN_FRONTEND=noninteractive"
        ],
        "Cmd": [
            "sh"
        ],
        "Image": "anomalib",
        "Volumes": null,
        "WorkingDir": "/home/user",
        "Entrypoint": [
            "/opt/nvidia/nvidia_entrypoint.sh"
        ],
        "OnBuild": null,
        "Labels": {
            "maintainer": "Anomalib Development Team"
        }
    },
    "Image": "sha256:573cf9128271f8b642498461444f6835fb3d7a097c0d008d1364b2e575fc1efc",
    "ImageManifest": null,
    "NetworkSettings": {
        "Bridge": "",
        "SandboxID": "f352f0c59cbdf0460c57f7cfa1585788cab1ad9f05c73338c55c6bd548748e0f",
        "HairpinMode": false,
        "LinkLocalIPv6Address": "",
        "LinkLocalIPv6PrefixLen": 0,
        "Networks": {
            "bridge": {
                "IPAMConfig": null,
                "Links": null,
                "Aliases": null,
                "NetworkID": "ce6cc831b4d1ec237f0ca94e558aa6cdd9e8ed3aaa48de8f8acba683d686d80f",
                "EndpointID": "",
                "Gateway": "",
                "IPAddress": "",
                "IPPrefixLen": 0,
                "IPv6Gateway": "",
                "GlobalIPv6Address": "",
                "GlobalIPv6PrefixLen": 0,
                "MacAddress": "",
                "DriverOpts": null,
                "IPAMOperational": false
            }
        },
        "Service": null,
        "Ports": null,
        "SandboxKey": "/var/run/docker/netns/f352f0c59cbd",
        "SecondaryIPAddresses": null,
        "SecondaryIPv6Addresses": null,
        "IsAnonymousEndpoint": true,
        "HasSwarmEndpoint": false
    },
    "LogPath": "/var/lib/docker/containers/e5397e58c2b2a741d7ca0ed15492066093e011bba0a3f90e2bb875bb20ff488d/e5397e58c2b2a741d7ca0ed15492066093e011bba0a3f90e2bb875bb20ff488d-json.log",
    "Name": "/sleepy_shaw",
    "Driver": "overlay2",
    "OS": "linux",
    "RestartCount": 0,
    "HasBeenStartedBefore": true,
    "HasBeenManuallyStopped": false,
    "MountPoints": {
        "/home/user/download": {
            "Source": "/data/Ronnie",
            "Destination": "/home/user/download",
            "RW": true,
            "Name": "",
            "Driver": "",
            "Type": "bind",
            "Propagation": "rprivate",
            "Spec": {
                "Type": "bind",
                "Source": "/data/Ronnie",
                "Target": "/home/user/load"
            },
            "SkipMountpointCreation": false
        }
    },
    "SecretReferences": null,
    "ConfigReferences": null,
    "MountLabel": "",
    "ProcessLabel": "",
    "AppArmorProfile": "docker-default",
    "SeccompProfile": "",
    "NoNewPrivileges": false,
    "HostnamePath": "/var/lib/docker/containers/e5397e58c2b2a741d7ca0ed15492066093e011bba0a3f90e2bb875bb20ff488d/hostname",
    "HostsPath": "/var/lib/docker/containers/e5397e58c2b2a741d7ca0ed15492066093e011bba0a3f90e2bb875bb20ff488d/hosts",
    "ShmPath": "",
    "ResolvConfPath": "/var/lib/docker/containers/e5397e58c2b2a741d7ca0ed15492066093e011bba0a3f90e2bb875bb20ff488d/resolv.conf",
    "LocalLogCacheMeta": {
        "HaveNotifyEnabled": false
    }
}
```

重新启动docker服务即可，`systemctl restart docker`

---

## dockerfile

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
```bash
version: "2.1"
services:
  inference:
    build: ./
    restart: always
    container_name: inference
    environment:
      - TZ=Asia/Shanghai
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
      - NVIDIA_VISIBLE_DEVICES=all
    #command: nvidia-smi
    #deploy:
    #  resources:
    #    reservations:
    #      devices:
    #      - driver: nvidia
    #        count: 1
    #        capabilities: [gpu]
    volumes:
      - "/home/snd/sbg_volume:/home/sbg_folder"
      - "/home/snd/sbg_volume/inspection/nginx.conf:/etc/nginx/nginx.conf"
      - "/home/snd/sbg_volume/inspection/app/runtimes/ubuntu.20.04-x64/native/libtv_algorithm.so:/usr/share/dotnet/shared/Microsoft.NETCore.App/7.0.18/libtv_algorithm.so"
      - "/home/snd/sbg_volume/inspection/app/runtimes/ubuntu.20.04-x64/native/libAIFramework.so:/usr/share/dotnet/shared/Microsoft.NETCore.App/7.0.18/libAIFramework.so"
    ports:
      - "9001:80"
      - "9002:443"
    entrypoint: ["sh","/home/sbg_folder/inspection/start.sh"]
```

```bash
#基于AI镜像
FROM sbg_inference:v1.0

EXPOSE 80
EXPOSE 443



#安装.NET依赖
RUN wget https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN apt-get update && apt-get install -y dotnet-sdk-7.0

#安装nginx
RUN apt-get install -y nginx

#RUN apt-get install -y nvidia-driver-525

#WORKDIR /home/sbg_folder/inspection/app/

#执行dotnet程序
#ENTRYPOINT ["dotnet","/home/sbg_folder/inspection/app/TvLightWeb.Inference.dll"]

```