# 09-02-Compose-GPU

> 父节点: [[09-00-Docker容器]]
> 源文件: `docker/docker.md`
> 相关: [[09-01-nvidia-docker]] | [[09-04-数据卷]]

---


docker run -itd  --gpus all --name ubuntu_x86 -v /home/y/proj/:/home/proj/ -v /usr/bin/qemu-aarch64-static:/usr/bin/qemu-aarch64-static -p 31222:22 -p 31230-31299:31230-31299 -e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all ubuntu

docker run -itd  --gpus all --name pytorch25 -v /home/y/proj/:/home/proj/  -v /opt/:/data/ -v /home/y/ALG/lf/:/home/y/ALG/lf/ -p 10000:10000  -e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all pytorch/pytorch:2.5.0-cuda12.4-cudnn9-devel

docker run -itd  --gpus all --privileged --name rknn_test -v /home/y/proj/:/home/proj/  -v /opt/:/data/ -v /home/y/ALG/lf/:/home/y/ALG/lf/ -p 10001:10001  -e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all rknn_toolkit2_cp38:v1

docker run -itd   --name net_test --net=host -v /home/y/proj/:/home/proj/   -p 10003:10003   ubuntu

docker run -itd  --gpus all --name pytorch25 --network=host -v /home/y/proj/:/home/proj/  -v /opt/:/data/ -v /home/y/ALG/lf/:/home/y/ALG/lf/  -e NVIDIA_DRIVER_CAPABILITIES=compute,utility -e NVIDIA_VISIBLE_DEVICES=all pytorch/pytorch:2.5.0-cuda12.4-cudnn9-devel

#pull 镜像
docker pull pytorch/pytorch:2.6.0-cuda12.6-cudnn9-devel

# 导入导出的 镜像
docker export -o my_pytorch24.tar  f7e4ac9eac95
docker import busybox2.tar busybox2:test
# 增加完全权限 选项
--privileged
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
start.sh
```
#!/bin/bash
#Write Environment
export CUDA_HOME=/usr/local/cuda
export PATH=$PATH:$CUDA_HOME/bin
export LD_LIBRARY_PATH=/usr/local/cuda-11.7/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
export TENSORRT_ROOT=/usr/local/TensorRT-8.4.2.4
export LD_LIBRARY_PATH=/usr/local/TensorRT-8.4.2.4/lib:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/usr/local/TensorRT-8.4.2.4/targets/x86_64-linux-gnu/lib:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/home/sbg_folder/sbg_algo/3rdparty/ai_inference/lib:$LD_LIBRARY_PATH
#Write Environment
# Start the Nginx service
service nginx start
#nginx
# Start the ASP.NET Core app;
#dotnet TvLightWeb.Inference.dll
dotnet /home/sbg_folder/inspection/app/TvLightWeb.Inference.dll
sleep 36500d
```

---

## 部署深度学习docker


启用gpu 容器
参考链接：  https://runebook.dev/zh/docs/docker/compose/gpu-support/index

https://www.cnblogs.com/dan-baishucaizi/p/15503578.html

docker-compose 需要升级
避免自动退出，需要加 tty: true
```bash
version: "2.1"
services:

  test:
    image: nvidia/cuda:11.7.1-base-ubuntu20.04
    command: /bin/bash
    restart: always
    # restart: unless-stopped
    container_name: test
    environment:
      - TZ=Asia/Shanghai
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
      - NVIDIA_VISIBLE_DEVICES=all

    #runtime: nvidia
    deploy:
      resources:
        reservations:
          devices:
          - driver: 'nvidia'
            count: 'all'
            capabilities: ['gpu']
    tty: true
    stdin_open: true
    volumes:
      - "/home/snd/sbg_volume:/home/sbg_folder"
      - "/home/snd/sbg_volume/inspection/start.sh:/start.sh"
      - "/home/snd/sbg_volume/inspection/nginx.conf:/etc/nginx/nginx.conf"
    ports:
      - "3097:80"
      - "3098:443"
    entrypoint: ["sh","/start.sh"]

```

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
