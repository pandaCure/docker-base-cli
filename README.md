# docker-base-cli

用于构建专属项目的docker base镜像
## 操作环境

1、提前登入docker仓库
2、最好提前打开docker客户端，不打开也行，只支持MAC系统打开docker客户端
## 本地镜像模板
```Dockerfile
FROM <仓库地址>:<版本号> as xxxx

ARG buildENV
WORKDIR /app
COPY . .
RUN npm run ${buildENV}
...
```

## 待更新功能