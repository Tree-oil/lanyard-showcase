export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    brand: {
      title: 'Lanyard 3D',
      subtitle: '物理仿真画布'
    },
    header: {
      animalLabel: '像素形象:',
      animals: {
        deer: '🌲 森林神鹿',
        whale: '🐋 深海巨鲸',
        fox: '🦊 极光白狐'
      },
      colorLabel: '像素色:',
      colors: {
        emerald: '翡翠竹青绿',
        klein: '克莱因蔚蓝',
        slate: '极简冷灰色',
        noir: '曜石石墨黑',
        violet: '暮光丁香紫',
        amber: '加州晨曦橙'
      },
      gravity: {
        space: '0.0 G (太空失重)',
        moon: '0.16 G (月球低引力)',
        earth: '1.0 G (地球标准)',
        heavy: '2.0 G (高重力)'
      },
      customizeBtn: '自定工牌',
      tip: '像素动物全屏展开，中央工牌区域已保护避让；鼠标滑过两侧可产生流体位移散落！'
    },
    dock: {
      swingBadge: '轻摇工牌',
      export: '导出',
      exportConfetti: '工牌高清图片导出成功！'
    },
    status: {
      rendering: '正在渲染材质...'
    },
    customizer: {
      title: '工牌属性定制',
      subtitle: '实时生成 2D 画布贴图并烘焙至 3D 刚体模型',
      reset: '重置',
      tabs: {
        basic: '基础信息',
        theme: '视觉主题',
        lanyard: '挂绳与物理'
      },
      fields: {
        name: '中文姓名 (Chinese Name)',
        englishName: '英文姓名 (English Name)',
        role: '职位角色 (Role / Title)',
        department: '部门 / 机构 (Department)',
        company: '公司名称 (Company)',
        companyAddress: '机构地址 (Location)',
        employeeId: '员工工号 (Employee ID)',
        accessLevel: '通行权限等级 (Clearance)',
        issueDate: '生效日期 (Issue Date)',
        expiryDate: '有效截止 (Expiry Date)',
        avatarUpload: '头像照片 (Photo Avatar)',
        uploadPhotoBtn: '上传自定照片',
        uploadHint: '支持 JPG、PNG 格式，系统将自动进行居中裁剪与高质量圆角渲染',
        brandLogo: '品牌标志 (Brand Logo)',
        logos: {
          minimal: '◈ 几何棱晶',
          nexus: '✦ 蜂巢连结',
          swiss: '▪ 瑞士网格'
        },
        cardColorTone: '卡片主色调 (Card Theme)',
        cardThemes: {
          obsidian: '曜石极简黑',
          slate: '雾面石板灰',
          ceramic: '哑光陶瓷白',
          charcoal: '极简碳黑',
          swiss: '瑞士极简黑'
        },
        smartChip: '安全智能芯片材质 (Smart Chip)',
        chips: {
          titanium: '钛金属 (Titanium)',
          silver: '纯银精钢 (Silver)',
          stealth: '隐形深黑 (Stealth)',
          gold: '流金典藏 (Gold)'
        },
        lanyardWidth: '挂绳织带宽度 (Strap Width)',
        strapText: '织带印刷文字 (Strap Inscription)',
        strapPlaceholder: '例如: STUDIO LAB • INTERFACE DESIGN • CREATIVE ACCESS',
        gravityControl: '物理重力环境 (Gravity Field)'
      },
      exportSection: {
        title: '高清工牌导出 (Export HQ Images)',
        desc: '导出高分辨率正面与反面 PNG 贴图卡片，可直接用于社交媒体分享或实体工牌印刷参考。',
        downloadFront: '下载正工牌 PNG',
        downloadBack: '下载背工牌 PNG'
      }
    }
  },
  en: {
    brand: {
      title: 'Lanyard 3D',
      subtitle: 'Physical Canvas'
    },
    header: {
      animalLabel: 'Silhouette:',
      animals: {
        deer: '🌲 Forest Stag',
        whale: '🐋 Ocean Whale',
        fox: '🦊 Arctic Fox'
      },
      colorLabel: 'Pixel Color:',
      colors: {
        emerald: 'Emerald Green',
        klein: 'Klein Blue',
        slate: 'Minimal Slate',
        noir: 'Graphite Black',
        violet: 'Twilight Violet',
        amber: 'California Amber'
      },
      gravity: {
        space: '0.0 G (Zero-G)',
        moon: '0.16 G (Moon)',
        earth: '1.0 G (Earth)',
        heavy: '2.0 G (Heavy)'
      },
      customizeBtn: 'Customize',
      tip: 'Full-screen pixel animal with central badge protection. Sweep mouse across to disperse fluid particles!'
    },
    dock: {
      swingBadge: 'Swing Badge',
      export: 'Export',
      exportConfetti: 'High-res badge exported successfully!'
    },
    status: {
      rendering: 'Rendering textures...'
    },
    customizer: {
      title: 'Badge Customizer',
      subtitle: 'Bakes real-time 2D canvas textures into 3D rigid bodies',
      reset: 'Reset',
      tabs: {
        basic: 'Identity',
        theme: 'Appearance',
        lanyard: 'Lanyard & Physics'
      },
      fields: {
        name: 'Chinese Name',
        englishName: 'English Name',
        role: 'Role / Title',
        department: 'Department / Team',
        company: 'Company / Studio',
        companyAddress: 'Location / Campus',
        employeeId: 'Employee ID',
        accessLevel: 'Security Clearance',
        issueDate: 'Issue Date',
        expiryDate: 'Expiry Date',
        avatarUpload: 'Photo Avatar',
        uploadPhotoBtn: 'Upload Custom Photo',
        uploadHint: 'Supports JPG or PNG. Auto-centered and rounded into modern profile layout',
        brandLogo: 'Brand Emblem',
        logos: {
          minimal: '◈ Studio Prism',
          nexus: '✦ Nexus Hex',
          swiss: '▪ Swiss Grid'
        },
        cardColorTone: 'Card Color Tone',
        cardThemes: {
          obsidian: 'Studio Obsidian',
          slate: 'Frosted Slate',
          ceramic: 'Matte Ceramic',
          charcoal: 'Minimal Charcoal',
          swiss: 'Swiss Monolith'
        },
        smartChip: 'Security Smart Chip Style',
        chips: {
          titanium: 'Titanium',
          silver: 'Pure Silver',
          stealth: 'Stealth Black',
          gold: 'Classic Gold'
        },
        lanyardWidth: 'Lanyard Strap Width',
        strapText: 'Strap Woven Inscription',
        strapPlaceholder: 'e.g. STUDIO LAB • INTERFACE DESIGN • CREATIVE ACCESS',
        gravityControl: 'Physics Gravity Environment'
      },
      exportSection: {
        title: 'High-Res Badge Export',
        desc: 'Export high-resolution front & back PNG textures for digital showcase or physical printing.',
        downloadFront: 'Download Front PNG',
        downloadBack: 'Download Back PNG'
      }
    }
  }
};
