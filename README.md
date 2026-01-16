# CarYouPe (汽车用品之家)

## 项目结构 (Project Structure)

| 目录 | 说明 | 技术栈 |
| :--- | :--- | :--- |
| **`frontend_uniapp/`** | 小程序端 (微信/抖音/小红书) | Uni-App + Vue3 |
| **`frontend_admin/`** | 管理后台 | Next.js + Shadcn UI |
| **`backend/`** | 核心后端 API 服务 | Python FastAPI + SQLAlchemy |
| **`docs/`** | 项目文档 | Markdown |

## 快速开始 (Quick Start)

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (Uni-App)
请使用 HBuilderX 打开 `frontend_uniapp` 目录进行开发和运行。

### Admin (Next.js)
```bash
cd frontend_admin
npm install
npm run dev
```
