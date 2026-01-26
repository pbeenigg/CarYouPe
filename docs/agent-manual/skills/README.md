# Skills 使用手册

## 概述

Skills（技能库）是可重用的知识和最佳实践集合。当遇到特定场景时，AI 助手可以参考这些技能来提供更专业的帮助。

## Skill 配置格式

每个 Skill 是一个目录，包含 `SKILL.md` 主文件：

```
.agent/skills/
├── skill-name/
│   ├── SKILL.md        # 主指令文件 (必需)
│   ├── scripts/        # 辅助脚本 (可选)
│   ├── examples/       # 示例代码 (可选)
│   └── resources/      # 其他资源 (可选)
```

`SKILL.md` 使用 YAML frontmatter：

```markdown
---
name: skill-name
description: 技能的简短描述
---

# 技能标题

详细内容...
```

## 可用技能列表

### 开发模式技能

#### backend-patterns (后端模式)

**用途**：后端架构模式、API 设计、数据库优化

**涵盖内容**：

- RESTful API 结构
- Repository 模式
- Service Layer 模式
- Middleware 模式
- 查询优化
- N+1 查询预防
- 事务模式
- 缓存策略
- 错误处理
- 认证授权
- 限流
- 后台任务和队列
- 日志和监控

**示例模式**：

```typescript
// Repository 模式
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>;
  findById(id: string): Promise<Market | null>;
  create(data: CreateMarketDto): Promise<Market>;
  update(id: string, data: UpdateMarketDto): Promise<Market>;
  delete(id: string): Promise<void>;
}
```

---

#### frontend-patterns (前端模式)

**用途**：React、Next.js、状态管理、性能优化

**涵盖内容**：

- 组件模式（组合、复合组件、渲染属性）
- 自定义 Hooks（状态管理、数据获取、防抖）
- 状态管理（Context + Reducer）
- 性能优化（Memoization、代码分割、虚拟化）
- 表单处理
- 错误边界
- 动画模式
- 可访问性

**示例模式**：

```typescript
// 自定义 Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

---

#### coding-standards (编码标准)

**用途**：通用编码标准和最佳实践

**核心原则**：

1. **可读性优先** - 代码读的次数比写的多
2. **KISS** - 保持简单
3. **DRY** - 不要重复自己
4. **YAGNI** - 不需要的功能不要做

**涵盖内容**：

- 变量命名规范
- 函数命名规范
- 不可变性模式
- 错误处理
- 异步最佳实践
- 类型安全
- API 设计标准
- 文件组织
- 注释和文档
- 性能最佳实践
- 测试标准
- 代码异味检测

---

### 数据库技能

#### clickhouse-io (ClickHouse)

**用途**：ClickHouse 数据库模式、查询优化、分析

**涵盖内容**：

- 表设计模式（MergeTree、ReplacingMergeTree、AggregatingMergeTree）
- 查询优化
- 数据插入模式
- 物化视图
- 性能监控
- 常用分析查询
- 数据管道模式

**关键特性**：

- 列式存储
- 数据压缩
- 并行查询执行
- 分布式查询
- 实时分析

---

### 质量保障技能

#### tdd-workflow (TDD 工作流)

**用途**：测试驱动开发方法论

**核心流程**：

```
RED → GREEN → REFACTOR → REPEAT

RED:      编写失败测试
GREEN:    编写最少代码通过测试
REFACTOR: 改进代码保持测试通过
REPEAT:   下一个功能
```

**覆盖要求**：

- 常规代码：80%
- 关键业务逻辑：100%

**测试类型**：

- 单元测试：独立函数和工具
- 集成测试：API 端点、数据库操作
- E2E 测试：关键用户流程

---

#### verification-loop (验证循环)

**用途**：代码更改的综合验证系统

**验证阶段**：

1. Build 验证
2. Type 检查
3. Lint 检查
4. 测试套件
5. 安全扫描
6. Diff 审查

---

#### eval-harness (评估框架)

**用途**：评估驱动开发（EDD）框架

**评估类型**：

- **能力评估**：测试新功能
- **回归评估**：确保现有功能不受影响

**指标**：

- `pass@k`：k 次尝试中至少一次成功
- `pass^k`：k 次连续成功

---

### 安全技能

#### security-review (安全审查)

**用途**：安全漏洞检查和最佳实践

**何时使用**：

- 实现认证/授权
- 处理用户输入或文件上传
- 创建 API 端点
- 处理密钥或凭据
- 实现支付功能
- 存储或传输敏感数据

**安全清单**：

1. **密钥管理** - 不要硬编码
2. **输入验证** - 使用 Zod 验证
3. **SQL 注入预防** - 使用参数化查询
4. **认证授权** - JWT + RBAC
5. **XSS 预防** - 内容净化
6. **CSRF 防护** - Token 验证
7. **限流** - 防止滥用
8. **敏感数据** - 安全日志记录
9. **依赖安全** - 定期更新

---

### 工作流技能

#### continuous-learning (持续学习)

**用途**：从会话中自动提取可重用模式

**工作原理**：

1. 会话评估：检查会话是否有足够消息
2. 模式检测：识别可提取的模式
3. 技能提取：保存有用模式

**模式类型**：

- 错误解决
- 用户纠正
- 变通方法
- 调试技术
- 项目特定

---

#### strategic-compact (策略性压缩)

**用途**：在逻辑间隔建议手动上下文压缩

**何时压缩**：

- 探索后、执行前
- 完成里程碑后
- 重大上下文切换前

---

### 项目模板

#### project-guidelines-example (项目指南示例)

**用途**：项目特定技能模板

**包含内容**：

- 架构概述
- 文件结构
- 代码模式
- 测试要求
- 部署工作流

## 如何使用技能

### 自动激活

当 AI 助手遇到相关场景时，会自动参考对应技能：

- 处理安全相关代码 → 参考 `security-review`
- 编写后端 API → 参考 `backend-patterns`
- 进行 TDD 开发 → 参考 `tdd-workflow`

### 手动引用

可以明确要求使用某个技能：

```
请参考 security-review 技能来审查这段认证代码
```

## 创建自定义技能

### 步骤

1. 在 `.agent/skills/` 创建目录
2. 创建 `SKILL.md` 文件
3. 添加 YAML frontmatter
4. 编写技能内容

### 模板

```markdown
---
name: my-skill
description: 技能用途描述
---

# 技能名称

技能概述...

## 何时使用

- 场景 1
- 场景 2

## 内容

### 模式/方法

详细说明...

### 示例

\`\`\`typescript
// 代码示例
\`\`\`

## 最佳实践

1. 实践 1
2. 实践 2

## 相关技能

- skill-1
- skill-2
```

## 技能分类参考

| 类别   | 技能                       | 用途       |
| ------ | -------------------------- | ---------- |
| 开发   | backend-patterns           | 后端架构   |
| 开发   | frontend-patterns          | 前端开发   |
| 开发   | coding-standards           | 编码规范   |
| 数据库 | clickhouse-io              | 分析数据库 |
| 质量   | tdd-workflow               | 测试驱动   |
| 质量   | verification-loop          | 验证循环   |
| 质量   | eval-harness               | 评估框架   |
| 安全   | security-review            | 安全审查   |
| 工作流 | continuous-learning        | 持续学习   |
| 工作流 | strategic-compact          | 策略压缩   |
| 模板   | project-guidelines-example | 项目模板   |
