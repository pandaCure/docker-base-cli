# docker-base-cli

用于构建专属项目的docker base镜像

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