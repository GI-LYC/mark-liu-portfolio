const asset = (path) => path.split("/").map(encodeURIComponent).join("/");

const portfolioData = {
  heroCover: asset("作品集总结/AUDI-E作品/美图/15.png"),
  profile: {
    name: "刘奕辰 Mark",
    nameZh: "刘奕辰",
    nameEn: "MARK LIU",
    title: "AI 创意总监",
    titleZh: "AI 创意总监",
    titleEn: "AI CREATIVE DIRECTOR",
    statement: "以生成式视觉与镜头叙事，构建汽车品牌的未来场景。",
    intro:
      "专注汽车品牌与社媒内容场景，将品牌调性、车型卖点与热点内容转化为电影感海报、TVC 关键帧及可复用的 AIGC 工作流。",
    email: "2029732500@qq.com",
    phone: "13914072852",
    city: "苏州 / 上海",
    portrait: asset("个人照片.png")
  },
  projects: [
    {
      id: "audi-earth-day",
      homeLayout: "hero",
      homeCategories: ["CAMPAIGN", "AIGC FILM", "AUTOMOTIVE", "VISUAL"],
      previewAspectRatio: "6 / 1",
      previewPosition: "50% 52%",
      number: "01",
      brand: "AUDI-E",
      title: "Earth Day / 电动未来自然叙事",
      type: "AIGC 海报美图 / TVC 视频",
      cover: asset("作品集总结/AUDI-E作品/海报/地球日美图 (1).jpg"),
      wideCover: asset("作品集总结/AUDI-E作品/海报/地球日美图 (1).jpg"),
      summary:
        "围绕先锋、豪华与电动科技气质，将车型置于富有生命力的未来自然景观之中，以光影、尺度与空气感建立品牌视觉记忆。",
      role: "项目经理 / AIGC 创意设计",
      services: ["视觉方向", "提示词系统", "批量生成", "筛选精修", "TVC 关键视觉"],
      media: [
        { type: "image", orientation: "wide", src: asset("作品集总结/AUDI-E作品/美图/15.png"), alt: "AUDI-E 15 车型视觉主画面" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/地球日美图 (1).jpg"), alt: "AUDI-E 地球日汽车视觉海报" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/地球日美图 (2).jpg"), alt: "AUDI-E 电动汽车自然场景视觉" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/地球日美图 (3).jpg"), alt: "AUDI-E 地球日系列画面" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/地球日美图 (4).jpg"), alt: "AUDI-E 汽车与自然视觉" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/地球日美图 (5).jpg"), alt: "AUDI-E 地球日收束画面" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/AUDI原力节.png"), alt: "AUDI-E 原力节视觉海报" },
        {
          type: "video",
          src: asset("作品集总结/AUDI-E作品/视频/奥迪世界日.mp4"),
          poster: asset("作品集总结/AUDI-E作品/海报/地球日小红书竖版&抖音封面1.jpg"),
          alt: "AUDI-E 地球日 TVC 视频"
        }
      ]
    },
    {
      id: "audi-seasons",
      homeLayout: "portrait",
      homeCategories: ["CAMPAIGN", "VISUAL"],
      previewAspectRatio: "6 / 1",
      previewPosition: "50% 38%",
      galleryLayout: "carousel",
      number: "02",
      brand: "AUDI-E",
      title: "Seasons / 节气情绪视觉",
      type: "社媒视觉 / 动态内容",
      cover: asset("作品集总结/AUDI-E作品/海报/谷雨海报.png"),
      wideCover: asset("作品集总结/AUDI-E作品/海报/画板 3.png"),
      summary:
        "以谷雨、立夏、大雪与春日后视镜为内容线索，把季节情绪与车型设计语言融合，形成适配多平台传播的系列画面。",
      role: "AIGC 创意设计 / 视频制作支持",
      services: ["节气创意", "海报视觉", "社媒尺寸适配", "动态内容"],
      media: [
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/美图/1.png"), alt: "AUDI-E 系列视觉作品 1" },
        { type: "image", orientation: "wide", src: asset("作品集总结/AUDI-E作品/美图/2.png"), alt: "AUDI-E 系列视觉作品 2" },
        { type: "image", orientation: "wide", src: asset("作品集总结/AUDI-E作品/美图/3.png"), alt: "AUDI-E 系列视觉作品 3" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/美图/4.png"), alt: "AUDI-E 系列视觉作品 4" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/谷雨海报.png"), alt: "AUDI-E 谷雨海报" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/立夏3-4.png"), alt: "AUDI-E 立夏汽车视觉" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/大雪-1080x1440.png"), alt: "AUDI-E 大雪汽车视觉" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/美图/12.png"), alt: "AUDI-E 系列视觉作品 12" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/美图/13.png"), alt: "AUDI-E 系列视觉作品 13" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/1080x1440.png"), alt: "AUDI-E 季节视觉作品" },
        { type: "image", orientation: "portrait", src: asset("作品集总结/AUDI-E作品/海报/小红书竖版&抖音封面1.png"), alt: "AUDI-E 社媒竖版封面视觉" },
        {
          type: "video",
          src: asset("作品集总结/AUDI-E作品/视频/后视镜里的春天.mp4"),
          poster: asset("作品集总结/AUDI-E作品/海报/后视镜里面的春天封面1.jpg"),
          alt: "后视镜里的春天动态视觉"
        },
        {
          type: "video",
          src: asset("作品集总结/AUDI-E作品/视频/清明出行.mp4"),
          poster: asset("作品集总结/AUDI-E作品/海报/小红书竖版&抖音封面1.jpg"),
          alt: "AUDI-E 出行短片"
        },
        {
          type: "video",
          src: asset("作品集总结/AUDI-E作品/视频/秋意感知.mp4"),
          poster: asset("作品集总结/网页封面/audi-autumn.jpg"),
          alt: "秋意感知 · AUDI-E 秋日动态视觉"
        }
      ]
    },
    {
      id: "geely-transformation",
      homeLayout: "wide",
      homeCategories: ["AIGC FILM", "AUTOMOTIVE"],
      previewAspectRatio: "6 / 1",
      previewPosition: "50% 48%",
      number: "03",
      brand: "GEELY",
      title: "Transformation / 车型动态变装",
      type: "TVC 创意 / AI 视频视觉",
      cover: asset("作品集总结/吉利作品/美图/变装视频封面.jpg"),
      wideCover: asset("作品集总结/吉利作品/美图/雪地变装视频视频封面.png"),
      summary:
        "通过车型主体、雪地氛围与光影转场的统一控制，探索适用于短视频传播的汽车变装叙事与动态节奏。",
      role: "AIGC 创意设计 / 视频视觉支持",
      services: ["TVC 分镜", "关键帧生成", "动态转场", "视觉精修"],
      media: [
        { type: "image", src: asset("作品集总结/吉利作品/美图/变装1.png"), alt: "吉利车型变装关键帧一" },
        { type: "image", src: asset("作品集总结/吉利作品/美图/变装2.png"), alt: "吉利车型变装关键帧二" },
        { type: "image", src: asset("作品集总结/吉利作品/美图/变装3.png"), alt: "吉利车型变装关键帧三" },
        {
          type: "video",
          src: asset("作品集总结/吉利作品/视频/变装视频.mp4"),
          poster: asset("作品集总结/吉利作品/美图/变装视频封面.jpg"),
          alt: "吉利汽车变装视频"
        },
        {
          type: "video",
          src: asset("作品集总结/吉利作品/视频/雪地变装视频.mp4"),
          poster: asset("作品集总结/吉利作品/美图/雪地变装视频视频封面.png"),
          alt: "吉利汽车雪地动态视频"
        }
      ]
    },
    {
      id: "geely-china-star",
      homeLayout: "medium",
      homeCategories: ["CAMPAIGN", "AUTOMOTIVE", "VISUAL", "CREATIVE SYSTEM"],
      previewAspectRatio: "6 / 1",
      previewPosition: "50% 50%",
      number: "04",
      brand: "GEELY",
      title: "China Star / 帝豪场景系列",
      type: "商业海报 / 社媒内容",
      cover: asset("作品集总结/吉利作品/美图/吉利帝豪中国星 (1).png"),
      wideCover: asset("作品集总结/吉利作品/美图/雪地变装视频视频封面.png"),
      summary:
        "结合车型卖点与生活方式场景，建立强调质感、氛围与传播效率的商业视觉系列，并延伸至轮播动态内容。",
      role: "AIGC 创意设计",
      services: ["商业海报", "车型质感控制", "多主题出图", "社媒内容"],
      media: [
        { type: "image", src: asset("作品集总结/吉利作品/美图/吉利帝豪中国星 (1).png"), alt: "吉利帝豪中国星视觉作品一" },
        { type: "image", src: asset("作品集总结/吉利作品/美图/吉利帝豪中国星 (2).png"), alt: "吉利帝豪中国星视觉作品二" },
        { type: "image", src: asset("作品集总结/吉利作品/美图/吉利帝豪中国星 (3).png"), alt: "吉利帝豪中国星视觉作品三" },
        { type: "image", src: asset("作品集总结/吉利作品/美图/吉利帝豪中国星 (4).png"), alt: "吉利帝豪中国星视觉作品四" },
        { type: "image", src: asset("作品集总结/吉利作品/美图/领克.png"), alt: "汽车商业社媒视觉作品" },
        {
          type: "video",
          src: asset("作品集总结/吉利作品/视频/轮播.mp4"),
          poster: asset("作品集总结/吉利作品/美图/轮播封面.jpg"),
          alt: "汽车视觉轮播动态内容"
        },
        {
          type: "video",
          src: asset("作品集总结/吉利作品/视频/吉利中国星&蓝猫官宣视频(3).m4v"),
          poster: asset("作品集总结/吉利作品/美图/吉利帝豪中国星 (1).png"),
          alt: "吉利中国星与蓝猫官宣视频"
        }
      ]
    },
  {
    "id": "wuling-palace",
    "homeLayout": "portrait",
    "homeCategories": ["AIGC FILM", "CHARACTER"],
    "previewAspectRatio": "6 / 1",
    "previewPosition": "50% 42%",
    "coverFit": "contain",
    "number": "05",
    "brand": "WULING",
    "title": "Palace / 今日谁配坐这顶轿",
    "type": "AI 创意短片 / 宫廷人物设定",
    "cover": asset("作品集总结/五菱作品/今日这儿顶轿谁来坐封面.png"),
    "wideCover": asset("作品集总结/五菱作品/今日这儿顶轿谁来坐封面.png"),
    "summary": "以宫廷角色与汽车场景的组合展开创意叙事，集中展示短片成片及七位人物的视觉设定。",
    "role": "AIGC 作品",
    "services": [
      "创意短片",
      "人物设定",
      "汽车视觉"
    ],
    "galleryLayout": "carousel",
    "media": [
      {
        "type": "video",
        "src": asset("作品集总结/五菱作品/今日这儿顶轿谁来坐.mp4"),
        "poster": asset("作品集总结/五菱作品/今日这儿顶轿谁来坐封面.png"),
        "alt": "五菱宫廷主题创意短片"
      },
      {
        "type": "image",
        "orientation": "portrait",
        "src": asset("作品集总结/五菱作品/人物/皇上.png"),
        "alt": "五菱宫廷人物设定 · 皇上"
      },
      {
        "type": "image",
        "orientation": "portrait",
        "src": asset("作品集总结/五菱作品/人物/皇后.png"),
        "alt": "五菱宫廷人物设定 · 皇后"
      },
      {
        "type": "image",
        "orientation": "portrait",
        "src": asset("作品集总结/五菱作品/人物/太后.png"),
        "alt": "五菱宫廷人物设定 · 太后"
      },
      {
        "type": "image",
        "orientation": "portrait",
        "src": asset("作品集总结/五菱作品/人物/宠妃.png"),
        "alt": "五菱宫廷人物设定 · 宠妃"
      },
      {
        "type": "image",
        "orientation": "portrait",
        "src": asset("作品集总结/五菱作品/人物/格格.png"),
        "alt": "五菱宫廷人物设定 · 格格"
      },
      {
        "type": "image",
        "orientation": "portrait",
        "src": asset("作品集总结/五菱作品/人物/内侍总管.png"),
        "alt": "五菱宫廷人物设定 · 内侍总管"
      },
      {
        "type": "image",
        "orientation": "portrait",
        "src": asset("作品集总结/五菱作品/人物/小皇子1.png"),
        "alt": "五菱宫廷人物设定 · 小皇子"
      }
    ]
  },
  {
    "id": "audi-world-cup",
    "homeLayout": "hero",
    "homeCategories": ["CAMPAIGN", "AIGC FILM", "AUTOMOTIVE"],
    "previewAspectRatio": "6 / 1",
    "previewPosition": "50% 50%",
    "coverFit": "contain",
    "number": "06",
    "brand": "AUDI-E",
    "title": "World Cup / 世界杯主题短片",
    "type": "汽车视觉 / 主题视频",
    "cover": asset("作品集总结/网页封面/audi-world-cup.jpg"),
    "wideCover": asset("作品集总结/网页封面/audi-world-cup.jpg"),
    "summary": "将世界杯主题与 AUDI-E 汽车视觉结合，作为独立的主题短片展示。",
    "role": "AIGC 作品",
    "services": [
      "汽车视觉",
      "主题短片"
    ],
    "media": [
      {
        "type": "video",
        "src": asset("作品集总结/AUDI-E作品/视频/0718奥迪世界杯-3.m4v"),
        "poster": asset("作品集总结/网页封面/audi-world-cup.jpg"),
        "alt": "AUDI-E 世界杯主题短片"
      }
    ]
  },
  {
    "id": "geely-calendar",
    "previewAspectRatio": "6 / 1",
    "previewPosition": "50% 42%",
    "coverFit": "contain",
    "number": "07",
    "brand": "GEELY",
    "title": "Calendar / 节日与热点动态",
    "type": "节日内容 / 社媒动态海报",
    "cover": asset("作品集总结/网页封面/geely-dragon-boat.jpg"),
    "wideCover": asset("作品集总结/网页封面/geely-dragon-boat.jpg"),
    "summary": "围绕端午节、父亲节与阿根廷主题，将不同时间节点的汽车动态内容整理为系列。",
    "role": "AIGC 作品",
    "services": [
      "节日视觉",
      "热点内容",
      "动态海报"
    ],
    "media": [
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/端午节动态.m4v"),
        "poster": asset("作品集总结/网页封面/geely-dragon-boat.jpg"),
        "alt": "吉利端午节动态"
      },
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/父亲节动态.m4v"),
        "poster": asset("作品集总结/网页封面/geely-fathers-day.jpg"),
        "alt": "吉利父亲节动态"
      },
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/阿根廷.m4v"),
        "poster": asset("作品集总结/网页封面/geely-argentina.jpg"),
        "alt": "吉利阿根廷主题动态"
      }
    ]
  },
  {
    "id": "geely-sales",
    "previewAspectRatio": "6 / 1",
    "previewPosition": "50% 44%",
    "coverFit": "contain",
    "number": "08",
    "brand": "GEELY",
    "title": "Sales / 帝豪月度销量视觉",
    "type": "销量传播 / 动态海报",
    "cover": asset("作品集总结/网页封面/geely-sales-july.jpg"),
    "wideCover": asset("作品集总结/网页封面/geely-sales-july.jpg"),
    "summary": "汇集帝豪六月与七月销量主题动态海报，展示月度传播中的车型视觉与信息呈现。",
    "role": "AIGC 作品",
    "services": [
      "销量海报",
      "信息呈现",
      "动态内容"
    ],
    "media": [
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/吉利帝豪6月销量动态海报.m4v"),
        "poster": asset("作品集总结/网页封面/geely-sales-june.jpg"),
        "alt": "吉利帝豪六月销量动态海报"
      },
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/吉利帝豪7月销量海报.m4v"),
        "poster": asset("作品集总结/网页封面/geely-sales-july.jpg"),
        "alt": "吉利帝豪七月销量动态海报"
      }
    ]
  },
  {
    "id": "geely-everyday",
    "coverFit": "contain",
    "number": "09",
    "brand": "GEELY",
    "title": "Everyday / 省钱·省时·省心",
    "type": "车型卖点 / 系列短片",
    "cover": asset("作品集总结/网页封面/geely-save-money.jpg"),
    "wideCover": asset("作品集总结/网页封面/geely-save-money.jpg"),
    "summary": "以省钱、省时、省心三个日常用车维度组织系列短片，让每个卖点拥有清晰、独立的观看入口。",
    "role": "AIGC 作品",
    "services": [
      "卖点表达",
      "系列短片",
      "汽车视觉"
    ],
    "media": [
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/省钱.m4v"),
        "poster": asset("作品集总结/网页封面/geely-save-money.jpg"),
        "alt": "省钱 · 车型卖点短片"
      },
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/省时.m4v"),
        "poster": asset("作品集总结/网页封面/geely-save-time.jpg"),
        "alt": "省时 · 车型卖点短片"
      },
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/动态海报/省心.m4v"),
        "poster": asset("作品集总结/网页封面/geely-peace-of-mind.jpg"),
        "alt": "省心 · 车型卖点短片"
      }
    ]
  },
  {
    "id": "geely-ai-story",
    "homeLayout": "wide",
    "homeCategories": ["AIGC FILM", "AUTOMOTIVE", "CREATIVE SYSTEM"],
    "coverFit": "contain",
    "number": "10",
    "brand": "GEELY",
    "title": "AI Story / 人类训服 AI",
    "type": "AI 主题 / 创意视频",
    "cover": asset("作品集总结/网页封面/geely-ai-story.jpg"),
    "wideCover": asset("作品集总结/网页封面/geely-ai-story.jpg"),
    "summary": "以「人类训服 AI」为主题的创意视频，作为独立作品展示完整内容。",
    "role": "AIGC 作品",
    "services": [
      "AI 主题",
      "创意视频"
    ],
    "media": [
      {
        "type": "video",
        "src": asset("作品集总结/吉利作品/视频/人类训服AI.mp4"),
        "poster": asset("作品集总结/网页封面/geely-ai-story.jpg"),
        "alt": "人类训服 AI · 创意视频"
      }
    ]
  },
  {
    id: "wuling-reborn",
    homeLayout: "portrait",
    homeCategories: ["AIGC FILM", "CHARACTER", "AUTOMOTIVE"],
    previewPosition: "50% 45%",
    coverFit: "contain",
    brand: "WULING",
    title: "Reborn / 重生我是顾家千金",
    type: "竖屏剧情 / 创意短片",
    cover: asset("作品集总结/网页封面/wuling-reborn.jpg"),
    wideCover: asset("作品集总结/网页封面/wuling-reborn.jpg"),
    summary: "五菱主题剧情短片《重生我是顾家千金》，以独立项目展示完整竖版成片。",
    role: "AIGC 作品",
    services: ["剧情短片", "竖屏叙事"],
    media: [
      {
        type: "video",
        src: asset("作品集总结/五菱作品/重生我是顾家千金.mp4"),
        poster: asset("作品集总结/网页封面/wuling-reborn.jpg"),
        alt: "五菱《重生我是顾家千金》完整竖版短片"
      }
    ]
  }
  ]
};

const priorityProjects = ["audi-world-cup", "geely-ai-story", "wuling-reborn"];
const projectLanguage = {
  "audi-world-cup": ["世界杯主题短片", "World Cup", "AUTOMOTIVE FILM", "AI VISUAL CREATION"],
  "geely-ai-story": ["人类训服 AI", "AI Story", "AI CREATIVE FILM", "AI VISUAL CREATION"],
  "wuling-reborn": ["重生我是顾家千金", "Reborn", "VERTICAL STORY FILM", "AI VISUAL CREATION"],
  "audi-earth-day": ["电动未来自然叙事", "Earth Day", "AIGC CAMPAIGN / TVC", "PROJECT LEAD / AI DESIGN"],
  "audi-seasons": ["节气情绪视觉", "Seasons", "SOCIAL VISUALS / MOTION", "AI DESIGN / VIDEO SUPPORT"],
  "geely-transformation": ["车型动态变装", "Transformation", "AUTOMOTIVE TRANSFORMATION", "AI VISUAL CREATION"],
  "geely-china-star": ["帝豪场景系列", "China Star", "CAMPAIGN / SOCIAL VISUALS", "AI DESIGN"],
  "wuling-palace": ["今日谁配坐这顶轿", "Palace", "AI FILM / CHARACTER DESIGN", "AI VISUAL CREATION"],
  "geely-calendar": ["节日与热点动态", "Calendar", "SEASONAL MOTION", "AI VISUAL CREATION"],
  "geely-sales": ["帝豪月度销量视觉", "Sales", "SALES CAMPAIGN / MOTION", "AI VISUAL CREATION"],
  "geely-everyday": ["省钱·省时·省心", "Everyday", "AUTOMOTIVE FILM SERIES", "AI VISUAL CREATION"]
};
portfolioData.projects.forEach(project => {
  [project.titleZh, project.titleEn, project.typeEn, project.roleEn] = projectLanguage[project.id];
});
const priority = id => {
  const index = priorityProjects.indexOf(id);
  return index < 0 ? priorityProjects.length : index;
};
portfolioData.projects.sort((a, b) => priority(a.id) - priority(b.id));
portfolioData.projects.forEach((project, index) => { project.number = String(index + 1).padStart(2, "0"); });

window.PORTFOLIO_DATA = portfolioData;
