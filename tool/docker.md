## docker

```bash
# 注意后面的空格 跟 点
docker build -t gxx:v1 -f /home/ubuntu/download/docker_files/
Dockerfile .


#删除镜像
docker rmi gcc
#删除容器
docker rm -f cxx
#更新容器属性
docker update --restart=always cxx
```
