# SlivenNoxLab 部署手册

> 主通道：GitHub Actions（push 到 main 即自动上线）。本文覆盖服务器初始化（一次性）与日常操作。

## 一、服务器初始化（一次性，约 20 分钟）

### 1. 安装 Nginx 与证书工具

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx rsync
```

### 2. 站点目录

```bash
sudo mkdir -p /var/www/slivennoxlab
sudo chown -R $USER:$USER /var/www/slivennoxlab
```

### 3. Nginx 配置

把仓库里的 `deploy/nginx.conf` 复制到服务器并调整：

```bash
scp deploy/nginx.conf root@umax.dpdns.org:/etc/nginx/conf.d/slivennoxlab.conf
```

先注释掉 443 server 块（证书还没生成），只保留 80 块，然后：

```bash
sudo mkdir -p /var/www/certbot
sudo nginx -t && sudo systemctl reload nginx
```

### 4. HTTPS 证书

```bash
sudo certbot --nginx -d umax.dpdns.org
```

certbot 会自动改写 nginx 配置并配置续期定时器。之后把 443 块恢复（`deploy/nginx.conf` 为准）。

### 5. Umax RAG 反代

`deploy/nginx.conf` 里的 `location /rag/` 已按路径反代写好：
- RAG 与本站**同机**：确认 `proxy_pass http://127.0.0.1:8000/;` 的端口是 RAG 实际监听端口；
- RAG 在**其他机器**：改成 `http://<RAG主机>:<端口>/`；
- 如果 RAG 不支持子路径（`/rag/` 前缀），需要给 RAG 配置 base path 或改用子域名方案（备选，见 PLAN.md 拷问 Q-A）。

### 6. GitHub Actions 密钥

仓库 Settings → Secrets and variables → Actions，添加：

| Secret | 值 |
| --- | --- |
| `SSH_HOST` | 服务器 IP 或域名 |
| `SSH_USER` | SSH 用户（如 root） |
| `SSH_PORT` | SSH 端口（默认 22 可不填） |
| `SSH_PRIVATE_KEY` | 登录私钥完整内容 |

服务器上确保对应公钥在 `~/.ssh/authorized_keys`。

## 二、日常发布

**改完内容/代码 → `git push`**。Actions 自动构建并 rsync 上线，约 1-2 分钟。
在仓库 Actions 页可看进度；本地备用通道：`SERVER_HOST=root SERVER_ADDR=umax.dpdns.org ./scripts/deploy.sh`。

## 三、内容操作

| 想做什么 | 怎么做 |
| --- | --- |
| 写笔记 | `/admin/` 后台写，或丢一个 md 进 `src/content/notes/` |
| 加作品 | `/admin/` 后台或 `src/content/projects/` 加 md |
| 发摄影 | 照片丢进 `src/assets/photos/<相册名>/`，`src/config/photos.ts` 登记中文名 |
| 加收藏 | 编辑 `src/lib/data/favorites.ts`，加一行 |
| 加工具 | 编辑 `src/lib/data/favorites.ts` 的 website 分类 |
| 改导航 | 编辑 `src/config/nav.ts` |

## 四、AI 热点解读

1. 仓库 Secrets 加 `DEEPSEEK_API_KEY`
2. 确认 `.github/workflows/hotreads.yml` 已启用（cron 每天北京时间 09:00）
3. 手动试跑：Actions → Hot Reads → Run workflow
4. 生成的摘要提交到 main 后自动触发部署，内容出现在 `/lab/hotreads/`

## 五、故障排查

- **线上还是旧内容**：查 Actions 是否跑完；服务器 `ls /var/www/slivennoxlab` 看文件时间
- **502 /rag/**：RAG 服务没起或端口不对，`curl 127.0.0.1:8000` 本机验证
- **证书过期**：`sudo certbot renew --dry-run` 检查续期定时器
- **搜索不可用**：确认部署包含 `dist/pagefind/` 目录
