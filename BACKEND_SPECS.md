
# 薪画社 (Xinhuashe) 后端开发技术文档 v1.0

## 1. 系统架构概述

本项目采用 **前后端分离** 架构。后端主要负责业务逻辑处理、数据持久化、权限控制（RBAC）以及与第三方服务（如 AI 模型、对象存储、支付网关）的交互。

### 1.1 技术栈推荐

*   **Runtime**: Node.js (LTS)
*   **Framework**: **NestJS** (推荐，适合企业级架构，强类型约束) 或 Express
*   **Language**: TypeScript
*   **Database**:
    *   **Relational (Core)**: **PostgreSQL** (处理复杂关联查询与事务)
    *   **ORM**: **Prisma** 或 TypeORM
    *   **Cache**: Redis (Session 缓存、高频榜单数据、任务队列)
*   **Storage**: AWS S3 / Aliyun OSS (DAM 资产存储)
*   **AI Integration**: Google Gemini API / Stable Diffusion API

### 1.2 系统分层架构

```mermaid
graph TD
    Client[前端 React SPA] --> Nginx[API Gateway / Nginx]
    Nginx --> AuthGuard[鉴权守卫 (JWT)]
    AuthGuard --> Controller[控制器层]
    Controller --> Service[业务逻辑层]
    Service --> DAL[数据访问层 (Prisma)]
    Service --> OSS[对象存储服务]
    Service --> AI[AI 模型服务]
    DAL --> DB[(PostgreSQL)]
    DAL --> Redis[(Redis Cache)]
```

---

## 2. 数据库设计 (Schema 规范)

### 2.1 用户中心与权限 (RBAC)

**Users (用户表)**
| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | 用户唯一标识 |
| email | VARCHAR | UNIQUE | 登录邮箱 |
| phone | VARCHAR | UNIQUE, NULLABLE | 手机号 |
| password_hash | VARCHAR | NOT NULL | Bcrypt 加密密码 |
| name | VARCHAR | | 显示昵称 |
| avatar | VARCHAR | | 头像 URL |
| role | ENUM | NOT NULL | 'root_admin', 'enterprise', 'creator' |
| status | ENUM | DEFAULT 'active' | 'active', 'banned', 'inactive' |
| created_at | TIMESTAMP | DEFAULT NOW() | |

**UserProfiles (用户扩展信息表)**
| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| user_id | UUID | PK, FK -> Users | 一对一关联 |
| bio | TEXT | | 个人简介 |
| company_name | VARCHAR | | 企业名称 (仅企业用户) |
| skills | JSONB | | 技能标签数组 e.g. ["PS", "3D"] |
| preferences | JSONB | | 个性化设置 (主题色等) |

### 2.2 项目与交易系统

**Projects (企划/项目表)**
| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | |
| creator_id | UUID | FK -> Users | 发布者 (甲方) |
| title | VARCHAR | NOT NULL | 标题 |
| description | TEXT | | 详细需求 |
| budget_min | DECIMAL | | 预算下限 |
| budget_max | DECIMAL | | 预算上限 |
| status | ENUM | | 'recruiting', 'in_progress', 'review', 'completed' |
| deadline | TIMESTAMP | | 截止日期 |
| deliverables | JSONB | | 交付物要求 e.g. ["source_file", "jpg"] |

**ProjectApplications (应征记录表)**
| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | |
| project_id | UUID | FK -> Projects | |
| applicant_id | UUID | FK -> Users | 应征画师 |
| quote_price | DECIMAL | | 报价 |
| message | TEXT | | 应征留言 |
| status | ENUM | | 'pending', 'accepted', 'rejected' |

**Transactions (交易流水表)**
| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | |
| user_id | UUID | FK -> Users | 关联账户 |
| amount | DECIMAL | NOT NULL | 金额 (+收入 / -支出) |
| type | ENUM | | 'deposit', 'withdrawal', 'escrow_frozen', 'payment' |
| related_project_id | UUID | NULLABLE | 关联项目 |
| status | ENUM | | 'pending', 'success', 'failed' |

### 2.3 数字资产管理 (DAM)

**Assets (资产表)**
| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| id | UUID | PK | |
| owner_id | UUID | FK -> Users | 所有者 |
| parent_folder_id | UUID | NULLABLE | 父文件夹 ID (支持无限层级) |
| name | VARCHAR | NOT NULL | 文件名 |
| file_key | VARCHAR | | OSS 存储 Key |
| file_url | VARCHAR | | 访问链接 |
| file_type | VARCHAR | | MIME Type (image/png, etc.) |
| file_size | BIGINT | | 字节数 |
| ai_tags | JSONB | | AI 分析标签 e.g. ["landscape", "cyberpunk"] |
| version | INT | DEFAULT 1 | 版本号 |

---

## 3. API 接口定义 (RESTful)

**通用响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 3.1 认证模块 (Auth)

*   `POST /api/v1/auth/register`
    *   功能：用户注册
    *   Body: `{ email, password, role, username }`
*   `POST /api/v1/auth/login`
    *   功能：用户登录
    *   Response: `{ token: "jwt_string", user: { ... } }`
*   `GET /api/v1/auth/me`
    *   功能：获取当前用户信息 (需 Header 携带 Bearer Token)

### 3.2 项目模块 (Projects)

*   `GET /api/v1/projects`
    *   功能：获取项目列表 (支持分页、筛选)
    *   Query: `page=1&limit=10&status=recruiting&keyword=...`
*   `POST /api/v1/projects`
    *   功能：发布新企划 (仅 Enterprise 角色)
*   `GET /api/v1/projects/:id`
    *   功能：获取详情
*   `POST /api/v1/projects/:id/apply`
    *   功能：画师应征
*   `PUT /api/v1/projects/:id/status`
    *   功能：更新状态 (如：选定画师、验收完成)

### 3.3 资产管理 (DAM)

*   `GET /api/v1/assets`
    *   功能：获取文件列表 (支持目录层级)
    *   Query: `parentId=...`
*   `POST /api/v1/assets/upload-url`
    *   **核心逻辑**: 获取 OSS 预签名上传 URL (前端直传，避免大文件经过后端服务器)
    *   Response: `{ uploadUrl: "https://oss...", fileKey: "..." }`
*   `POST /api/v1/assets/confirm`
    *   功能：前端上传 OSS 成功后，回调后端写入数据库
*   `POST /api/v1/assets/:id/analyze`
    *   功能：触发 AI 标签分析 (异步任务)

### 3.4 财务模块 (Finance)

*   `GET /api/v1/finance/balance`
    *   功能：查询余额
*   `GET /api/v1/finance/transactions`
    *   功能：获取流水记录
*   `POST /api/v1/finance/withdraw`
    *   功能：申请提现

---

## 4. 关键业务流程实现细节

### 4.1 资金托管流程 (Escrow)
1.  **发布需求**: 甲方发布项目，状态为 `recruiting`。
2.  **选定画师**: 甲方选择乙方，调用 `POST /projects/:id/hire`。
3.  **托管资金**:
    *   前端调用支付接口。
    *   支付成功后，后端创建一条 `type: escrow_frozen` 的 Transaction 记录。
    *   项目状态变更为 `in_progress`。
4.  **验收释放**:
    *   甲方点击验收。
    *   后端事务：将 `escrow_frozen` 资金解冻，并创建一条转入乙方的 `income` 记录 (扣除平台手续费)。
    *   项目状态变更为 `completed`。

### 4.2 DAM 大文件上传与 AI 分析
1.  **前端**: 请求后端 `/upload-url` 获取带签名的 PUT 地址。
2.  **前端**: 直接 `PUT` 文件到 AWS S3 / Aliyun OSS。
3.  **前端**: 上传完成后调用 `/assets/confirm` 通知后端。
4.  **后端**:
    *   在数据库创建 Asset 记录。
    *   将任务推送到 Redis 队列 `AnalyzeQueue`。
5.  **Worker 服务**:
    *   消费 `AnalyzeQueue`。
    *   调用 Google Gemini Vision API 分析图片内容。
    *   更新 Asset 的 `ai_tags` 字段。
    *   通过 WebSocket 通知前端“分析完成”。

---

## 5. 安全与运维规范

*   **密码安全**: 必须使用 `bcrypt` 或 `argon2` 进行哈希存储，严禁明文。
*   **接口限流**: 配置 Rate Limiting (e.g. 100 req/min) 防止 DDoS。
*   **数据备份**: PostgreSQL 每日定时全量备份，WAL 日志实时归档。
*   **日志审计**: 所有 `POST/PUT/DELETE` 操作必须写入 `AuditLogs` 表 (对应 Admin 后台的审计日志)。

## 6. 开发环境配置 (Docker Compose)

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/xinhuashe
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: xinhuashe

  redis:
    image: redis:alpine

volumes:
  pgdata:
```
