FROM node:20-alpine as build-stage

WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

RUN npm config set registry https://registry.npmmirror.com

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:test

FROM nginx:stable-alpine as production-stage

# 删除默认的 Nginx 配置
RUN rm -rf /etc/nginx/conf.d/*

# 复制构建产物
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 3000

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]