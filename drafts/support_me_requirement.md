
---

# 📘 SupportMe 组件需求文档（V1.0）

## 1. 概述

**SupportMe** 是一个基于 **React + TypeScript** 开发的打赏/点赞组件，适用于个人博客或内容网站。
该组件放置在文章末尾，提供「打赏」与「点赞」功能，支持后台数据存储、统计展示和管理员管理。

组件支持 **npm 包引入**与**iframe 嵌入**两种方式，便于灵活集成。

---

## 2. 功能需求

### 2.1 打赏功能

* **入口**：文章末尾的「打赏」按钮（文字或图标）。
* **交互**：点击后弹出弹窗，包含：

  1. 微信/支付宝支付二维码（通过配置传入）。
  2. 感谢文字（可配置，默认：“感谢您的支持！”）。
  3. 关闭按钮。
  4. 查看打赏记录按钮。

---

### 2.2 点赞功能

* **入口**：文章末尾的「点赞」按钮（竖起大拇指图标）。
* **交互**：

  * 点击按钮后，点赞次数 +1。
  * 点赞按钮旁实时展示点赞总次数（如 👍 25）。
  * 下方显示提示语 —— “真诚点赞，手留余香”。
  * 弹出感谢文字（默认：“感谢点赞！”）。
* **可选开关**：是否显示点赞按钮可通过配置决定。

---

### 2.3 打赏记录管理

* **打赏记录页面**：

  * 展示字段：用户名、金额、时间。
  * 数据仅来源于管理员手动添加。
* **管理员操作**：

  * 在组件启动时输入访问密码（复杂字符串）。
  * 验证通过后显示「添加记录」按钮。
  * 点击后弹窗中填写：用户名、金额、时间。

---

### 2.4 配置与主题

* **配置项**（可传入 Props 或后台设置）：

| 配置项              | 类型                                             | 默认值         | 说明         |
| ---------------- | ---------------------------------------------- | ----------- | ---------- |
| `wechatQr`       | `string`                                       | -           | 微信支付二维码链接  |
| `alipayQr`       | `string`                                       | -           | 支付宝支付二维码链接 |
| `thanksText`     | `string`                                       | `"感谢您的支持！"` | 打赏感谢文字     |
| `theme`          | `"light" \| "dark" \| "colorful" \| "minimal"` | `"light"`   | 固定的主题样式选择  |
| `showLike`       | `boolean`                                      | `true`      | 是否显示点赞按钮   |
| `showReward`     | `boolean`                                      | `true`      | 是否显示打赏按钮   |
| `showRecordPage` | `boolean`                                      | `true`      | 是否显示记录页面入口 |
| `apiBaseUrl`     | `string`                                       | -           | 后端 API 地址  |
| `adminPassword`  | `string`                                       | -           | 管理员访问密码    |

* **后台配置页面**：

  * 通过输入 `adminPassword` 进入。
  * 支持修改支付二维码、感谢文字、主题样式、按钮显示开关等。

---

### 2.5 引入方式

1. **npm 包引入（推荐）**

   ```tsx
   import { SupportMe } from "support-me";

   export default function SupportWrapper() {
     return (
       <SupportMe
         wechatQr="/img/wechat.png"
         alipayQr="/img/alipay.png"
         thanksText="感谢支持，您的鼓励是我前进的动力！"
         theme="dark"
         showLike={true}
         showReward={true}
         apiBaseUrl="https://api.example.com"
         adminPassword="S3cR3t!"
       />
     );
   }
   ```

   在 `.mdx` 文件中：

   ```mdx
   <SupportWrapper />
   ```

2. **iframe 嵌入**

   * 将组件部署到 Vercel。
   * 使用：

     ```html
     <iframe src="https://support-me.vercel.app" width="100%" height="400"></iframe>
     ```
   * 样式隔离与兼容性需保证（CSS Modules / Shadow DOM）。

---

## 3. 技术需求

### 3.1 前端实现

* **技术栈**：React + TypeScript。
* **样式**：TailwindCSS，支持多主题切换（light/dark/colorful/minimal）。
* **状态管理**：React Hooks + Context（存储点赞数、打赏弹窗状态）。
* **打包**：Rollup 或 Vite，支持 ESM + CommonJS。
* **兼容性**：支持主流浏览器，最低要求 Chrome 90+。

---

### 3.2 后端实现

#### 技术栈

* **运行环境**：Node.js (>=18)
* **框架**：Express.js / Fastify（轻量 API） 或 NestJS（完整架构）。
* **数据库**：PostgreSQL (>=14)
* **ORM**：Prisma（推荐）。

#### 数据库 Schema

1. **打赏记录表 `rewards`**

   * id: SERIAL PRIMARY KEY
   * username: VARCHAR(100)
   * amount: NUMERIC(10,2)
   * created\_at: TIMESTAMP DEFAULT NOW()

2. **点赞表 `likes`**

   * id: SERIAL PRIMARY KEY
   * count: INT DEFAULT 0
   * updated\_at: TIMESTAMP DEFAULT NOW()

3. **配置表 `config`**

   * id: SERIAL PRIMARY KEY
   * wechat\_qr: TEXT
   * alipay\_qr: TEXT
   * thanks\_text: TEXT
   * theme: VARCHAR(20)
   * show\_like: BOOLEAN DEFAULT true
   * show\_reward: BOOLEAN DEFAULT true
   * show\_record\_page: BOOLEAN DEFAULT true
   * updated\_at: TIMESTAMP DEFAULT NOW()

#### API 设计

* **打赏记录**

  * `POST /api/support/reward` —— 添加记录（需管理员密码）。
  * `GET /api/support/reward` —— 获取记录列表。
* **点赞**

  * `POST /api/support/like` —— 点赞 +1。
  * `GET /api/support/like` —— 获取点赞次数。
* **配置**

  * `POST /api/support/config` —— 保存配置（需管理员密码）。
  * `GET /api/support/config` —— 获取配置。

#### 安全与权限

* 管理员密码存储为哈希（bcrypt）。
* 写操作需验证密码（前端 + 后端双重校验）。
* 点赞接口加防刷（IP 限制 + 速率限制）。
* 所有 SQL 使用 ORM 防止注入。

#### 部署方案

* **后端**：Vercel Serverless Functions / Railway / Render。
* **数据库**：Supabase / Neon / RDS。
* **环境变量**：

  * `DATABASE_URL`
  * `ADMIN_PASSWORD_HASH`
  * `NODE_ENV`

---

## 4. 权限与安全

* 管理员：输入正确密码才能添加打赏记录或修改配置。
* 普通用户：只能点赞和查看打赏记录。
* 防刷机制：IP 限制 & 速率限制。

---

## 5. 待办清单（MVP）

- [ ] 打赏按钮 + 弹窗。
- [ ] 点赞按钮 + 点赞数展示。
- [ ] 配置项支持（Props + 后台修改）。
- [ ] 打赏记录页面（管理员添加）。
- [ ] 管理员密码校验（前端 + 后端）。
- [ ] npm 包打包与发布。
- [ ] Vercel iframe 部署。

---
