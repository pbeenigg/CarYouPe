---
description: 启动后端开发环境 (Start backend dev server)
---

## 启动后端开发环境

1. 确保 PostgreSQL 数据库已运行 (端口 15432)

2. 激活 Python 虚拟环境并安装依赖
```bash
cd /Users/pbeenig/Work/CarYouPe/backend
pip install -r requirements.txt
```

3. 运行数据库迁移
// turbo
```bash
cd /Users/pbeenig/Work/CarYouPe/backend
alembic upgrade head
```

4. 启动 FastAPI 开发服务器
```bash
cd /Users/pbeenig/Work/CarYouPe/backend
uvicorn app.main:app --reload --port 8000
```

5. 访问 API 文档: http://localhost:8000/api/v1/openapi.json
