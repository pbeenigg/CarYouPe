# 编码风格统一规则 (Coding Style)

## 通用原则

- **注释语言**: 业务逻辑注释使用中文，代码标识符使用英文
- **不删除注释**: 禁止删除或修改现有注释，除非用户明确要求
- **类型安全**: TypeScript 使用严格模式，Python 必须有 Type Hints
- **最小改动**: 修改代码时优先做最小范围的改动，避免重构不相关代码

## Python (Backend)

- 格式化: `black`
- 导入排序: `isort`
- 语法检查: `flake8`
- 命名: snake_case (变量/函数), PascalCase (类), UPPER_CASE (常量)
- Docstring: Google 风格，含中文说明
- 每个文件顶部不需要 `# -*- coding: utf-8 -*-`

```python
# ✅ 正确示例
class UserService:
    """
    用户服务类
    处理用户注册、认证及信息管理
    """
    
    def get_user_by_phone(self, db: Session, phone: str) -> Optional[User]:
        """
        根据手机号查找用户
        
        Args:
            db: 数据库会话
            phone: 手机号码
            
        Returns:
            User 对象或 None
        """
        return db.query(User).filter(User.phone == phone).first()
```

## TypeScript/React (Frontend Admin)

- 格式化: ESLint + Prettier
- 命名: camelCase (变量/函数), PascalCase (组件/类型), UPPER_CASE (常量)
- 组件: 函数组件，优先使用 `function` 声明
- Props: 内联 type 或独立 interface，命名 `XxxProps`
- 导入顺序: React → 第三方库 → 内部模块 → 类型

```tsx
// ✅ 正确示例
interface UserTableProps {
  users: UserOut[];
  onEdit: (id: number) => void;
}

function UserTable({ users, onEdit }: UserTableProps) {
  return (
    <Table>
      {/* 用户列表 */}
    </Table>
  );
}
```

## CSS/Tailwind

- **Frontend Admin**: Tailwind v4，使用 CSS 变量模式 (shadcn 风格)
- **Website**: Tailwind v3，使用自定义 CSS 变量 + theme.ts 配置
- 优先使用 Tailwind utility classes，避免自定义 CSS
- 响应式: 使用 Tailwind 断点 (sm/md/lg/xl)
- 颜色: 使用项目定义的 CSS 变量，不要硬编码颜色值

## 新增文件规范

### Backend 新增 API 端点
1. `models/xxx.py` - ORM 模型
2. `schemas/xxx.py` - Pydantic DTO
3. `crud/crud_xxx.py` - CRUD 操作 (继承 CRUDBase)
4. `crud/__init__.py` - 导出实例
5. `api/api_v1/endpoints/admin/xxx.py` 或 `client/xxx.py` - 路由
6. `api/api_v1/api.py` - 注册路由

### Frontend Admin 新增页面
1. `src/app/[locale]/(platform)/admin/xxx/page.tsx` - 页面组件
2. `src/components/business/xxx/` - 业务组件 (如需要)
3. `messages/zh-CN.json` + `messages/en-US.json` - 翻译

### Website 新增产品/案例
1. `config/site-data.json` - 添加数据条目
2. `public/images/xxx/` - 添加图片资源
