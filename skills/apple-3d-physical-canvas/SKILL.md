---
name: apple-3d-physical-canvas
description: 苹果级极简 3D 物理画布与空灵点阵流体设计系统 (Apple Minimalist 3D Physical Canvas Design System)。当用户希望将网站、官网、个人作品集、SaaS 产品落地页、数字名片或展示页重构成高定苹果极简风（纯白呼吸感画布、Bayer 8x8 空灵半调点阵流体散落、Three.js + Rapier 刚体物理悬浮晃动交互、动态 2D 画布纹理实时烘焙至 3D 刚体 UV、以及瑞士网格微透玻璃拟态浮动控件）时激活此 Skill。提供完整的设计 Tokens、着色器数学公式、物理约束参数、组件模板及全流程改造 SOP。
---

# 苹果级极简 3D 物理画布与空灵点阵交互设计系统 (Apple 3D Physical Canvas)

本 Skill 沉淀了一套融合 **Apple 纯净极简美学**、**Three.js/Rapier 真实三维物理碰撞**、以及 **WebGL2 Bayer 空间半调空灵点阵** 的顶级 Web 前端设计系统。

任何前端网页（个人作品集、SaaS 落地页、数字身份名片、奢侈品标签、活动入场券或产品展示台），均可使用本规范完成由传统平面网页到“触感级物理仿真画布”的高维进化。

---

## 📐 核心设计哲学：呼吸、悬浮、物理碰撞 (Breathe, Float, Collide)

```mermaid
flowchart TD
    A[底层视觉: 纯白呼吸感画布 #ffffff] --> B[氛围层: Bayer 8x8 空灵点阵流体]
    B --> C[避让机制: 中央主体保护圆区 (Radius: 280~360px)]
    C --> D[核心层: Three.js + Rapier 3D 物理悬挂刚体]
    D --> E[纹理层: 动态 2D OffscreenCanvas 实时烘焙至 3D UV]
    E --> F[控件层: 瑞士极简毛玻璃浮动控制坞]
```

### 1. 彻底颠覆沉重暗黑风，回归白底纯粹感
- **纯净基底**：背景严禁任何厚重色块，主底色统一采用 `#ffffff` 或微冷调 `#f8fafc`。
- **视觉层级聚焦**：通过物理阴影（Ambient Occlusion + Soft Contact Shadow）制造自然景深，而非通过高反差黑底强加对比。

### 2. 空灵线稿与点阵半调（Bayer Pointillism）
- **绝无实心色块填充**：背景图形仅使用 `1.0px` 建筑轮廓细线与稀疏点阵星宿。
- **密度硬截断（Density Clamping）**：着色器墨水浓度封顶限制在 `0.15 ~ 0.35`，网格中 65%~85% 必须保留纯白透气空间。
- **中央主体避让铁律**：核心 3D 展品后方严格划定保护半径，背景像素在接近展品时软衰减至 0，绝不干扰前景视觉。

### 3. 指尖物理触感（Tactile Physics）
- **真实重力与关节约束**：核心物体并非机械的 CSS 循环浮动，而是具有质量、角阻尼（Angular Damping）、线阻尼（Linear Damping）和恢复力的物理刚体。
- **拖拽与甩动反馈**：用户可任意抓取、甩动、轻晃物体，支持一键切换引力环境（地球标准 1.0G / 月球轻浮 0.16G / 太空失重 0.0G / 高重力 2.0G）。

---

## 🎨 设计系统 Tokens 与视觉调色盘

### 1. 经典极简调色盘 (The Apple Studio Palette)

| 色彩名称 | 色值 (Hex) | 视觉意象 | 推荐应用场景 |
| :--- | :--- | :--- | :--- |
| **纯白基底 (Pure Canvas)** | `#ffffff` | 纯净空间 | 全局主背景、卡面高光 |
| **微冷浅灰 (Subtle Slate)** | `#f8fafc` / `#f1f5f9` | 柔和微阶 | 浮动胶囊底色、次级卡片底色 |
| **曜石墨黑 (Graphite Noir)** | `#0f172a` / `#09090b` | 精准稳重 | 主标题文字、刚体卡扣、深色工牌 |
| **极简冷灰 (Minimal Slate)** | `#64748b` | 铅笔素描高级灰 | 辅助副标、点阵半调线条、边框线条 |
| **克莱因蔚蓝 (Klein Blue)** | `#0284c7` / `#38bdf8` | 科技理性灵动 | 像素高光、连接点、选中光环、指示条 |
| **翡翠竹青绿 (Forest Emerald)** | `#0f766e` / `#10b981` | 自然空灵生机 | 森林生态轮廓、激活状态脉冲 |
| **钛金与纯银 (Titanium/Silver)**| `#cbd5e1` / `#e2e8f0` | 工业精密感 | 金属挂扣、五金件材质、智能芯片 |
| **安全芯片金 (NFC Gold)** | `#f59e0b` / `#fbbf24` | 专属贵重认证 | 智能芯片触点、限量标签徽记 |

### 2. 瑞士网格微透玻璃控件规范 (Swiss Glassmorphism)
- **浮动控制栏 (Toolbar Pill)**：
  ```css
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
  border-radius: 9999px;
  ```
- **微交互状态**：
  - 常态：`text-neutral-600 hover:text-neutral-900 transition-colors duration-200`
  - 选中态：`bg-white text-black shadow-sm ring-1 ring-black/5 rounded-full font-medium`

---

## ⚙️ 核心技术引擎与数学实现

### 1. Three.js + Rapier 3D 刚体绳索动力学

使用 `@react-three/rapier` 构建真实物理钟摆模型：

```tsx
import { RigidBody, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier';

// 1. 顶部固定锚点 (Fixed Anchor)
<RigidBody type="fixed" position={[0, 4.5, 0]} ref={fixedAnchor} />

// 2. 柔性绳索节点 (Segmented Rope Chain)
// 串联 4~6 个轻质微小刚体，使用球状关节 (SphericalJoint) 相互约束
useSphericalJoint(prevSegmentRef, nextSegmentRef, [
  [0, -segmentLength, 0], // Anchor on body A
  [0, 0, 0]              // Anchor on body B
]);

// 3. 悬挂核心刚体 (Suspended Rigid Body)
<RigidBody
  ref={badgeRef}
  colliders={false}
  mass={0.8}
  linearDamping={1.2}
  angularDamping={1.8}
  canSleep={false}
>
  <CuboidCollider args={[0.8, 1.2, 0.05]} />
  {/* 3D 网格模型，绑定烘焙 Canvas 材质 */}
</RigidBody>
```

### 2. WebGL2 Bayer 8x8 空间点阵流体算法

背景利用 8x8 Bayer Dithering 矩阵进行空间半色调计算，鼠标滑过产生流体脉冲：

```glsl
// 8x8 标准 Bayer 矩阵常数
const int bayer8[64] = int[](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

// 核心着色逻辑
float density = texture(u_density_map, v_uv).r;

// 1. 中央主体避让截断 (Center Exclusion Zone)
float distFromCenter = distance(v_uv, vec2(0.5, 0.5));
float exclusionMask = smoothstep(0.18, 0.32, distFromCenter);
density *= exclusionMask;

// 2. 浓度硬上限截断 (Peak Density Clamping: 防止死色成坨)
density = clamp(density, 0.0, 0.32);

// 3. 空间半色调抖动判断
ivec2 coord = ivec2(gl_FragCoord.xy) % 8;
float threshold = float(bayer8[coord.y * 8 + coord.x]) / 64.0;

if (density > threshold) {
    fragColor = vec4(u_accent_color, 0.85); // 绘制细微点阵
} else {
    fragColor = vec4(1.0, 1.0, 1.0, 1.0);   // 保留高透气纯白底
}
```

### 3. 动态 2D 画布纹理实时烘焙至 3D UV 管线

```ts
// 离屏 Canvas 生成 2048x2048 超高清工牌贴图
export async function generateFrontBadge(data: BadgeData): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d')!;

  // 1. 底色渐变绘制与圆角卡身剪切
  // 2. 瑞士网格微排版（对齐网格、精致条码、机构水印）
  // 3. 肖像照片圆形裁剪与精致发丝级描边
  // 4. 金属芯片与防伪激光镭射渐变叠加
  
  return canvas.toDataURL('image/png');
}
```

---

## 🛠️ 任意网站快速改造 SOP（Step-by-Step）

当你需要将一个普通的网页/项目重构为本系统风格时，遵循以下 4 步标准流：

### 第一步：清理视觉噪音（De-Cluttering）
1. 将 `body` 背景色统一置为纯白 `#ffffff`，移除原有厚重的深色卡片、彩色渐变大背景与刺眼的霓虹光晕。
2. 引入标准无衬线字体体系（如 `Plus Jakarta Sans` / `-apple-system` / `Inter`），等宽字符使用 `JetBrains Mono`。

### 第二步：挂载空灵点阵流体层（Mount Ambient Canvas）
1. 引入 WebGL2 Bayer Canvas 组件，置于绝对定位底层（`z-index: 0`）。
2. 在中央关键区域设置避让半径（根据页面 Hero 区域尺寸动态配置 280px ~ 420px）。
3. 鼠标交互事件绑定流体脉冲软衰减（指数衰减系数 `0.92`）。

### 第三步：打造 3D 物理交互 Hero（3D Physics Focal Point）
1. 根据业务属性选择 3D 悬挂物理刚体：
   - **个人作品集 / 简历**：3D 员工工牌、设计师通关铭牌、极简 VIP 会员卡。
   - **SaaS 软件 / 开发工具**：3D 悬挂快捷键操作卡、API 鉴权凭证、虚拟服务器机柜吊牌。
   - **电商 / 消费品**：奢侈品吊牌、服装洗水标、实体开箱证书。
2. 配置物理阻尼与引力模式，开启鼠标抓取（PointerDrag）与轻摇微震。

### 第四步：注入浮动瑞士微透控制坞（Floating Dock Controls）
1. 顶部操作栏收敛为单条浮动胶囊（Pill Toolbar），宽度自适应，半透明高斯模糊。
2. 右侧配置抽屉式属性调控面板（Slide-out Drawer），提供实时参数微调与一键导出。

---

## 📦 检查清单与验收标准 (Acceptance Checklist)

- [ ] **纯净度校验**：全站无大面积实心深色块压迫感，背景呼吸感充足。
- [ ] **避让校验**：当鼠标滑过两侧时粒子散开，但核心展品正后方 100% 保持清爽干净。
- [ ] **物理真实度**：松开拖拽后，刚体呈现自然的钟摆衰减摆动，无瞬间抽搐或穿模。
- [ ] **Retina 屏适配**：Canvas 贴图渲染分辨率倍率 `window.devicePixelRatio >= 2`，文字与条形码边缘极度锐利。
- [ ] **自适应国际化**：所有文本标签支持中英双语即时切换，无页面重载白屏。
