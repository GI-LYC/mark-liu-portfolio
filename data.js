const asset = (path) => path.split("/").map(encodeURIComponent).join("/");

const portfolioData = {
  profile: {
    name: "刘奕辰 Mark",
    title: "AIGC 创意设计师 / AI 视觉内容项目经理",
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
      number: "01",
      brand: "AUDI-E",
      title: "Earth Day / 电动未来自然叙事",
      type: "AIGC 海报美图 / TVC 视频",
      cover: asset("作品集总结/AUDI-E作品/地球日美图 (1).jpg"),
      wideCover: asset("作品集总结/AUDI-E作品/微博封面竖版1.jpg"),
      summary:
        "围绕先锋、豪华与电动科技气质，将车型置于富有生命力的未来自然景观之中，以光影、尺度与空气感建立品牌视觉记忆。",
      role: "项目经理 / AIGC 创意设计",
      services: ["视觉方向", "提示词系统", "批量生成", "筛选精修", "TVC 关键视觉"],
      media: [
        { type: "image", src: asset("作品集总结/AUDI-E作品/地球日美图 (1).jpg"), alt: "AUDI-E 地球日汽车视觉海报" },
        { type: "image", src: asset("作品集总结/AUDI-E作品/地球日美图 (2).jpg"), alt: "AUDI-E 电动汽车自然场景视觉" },
        { type: "image", src: asset("作品集总结/AUDI-E作品/地球日美图 (3).jpg"), alt: "AUDI-E 地球日系列画面" },
        { type: "image", src: asset("作品集总结/AUDI-E作品/地球日美图 (4).jpg"), alt: "AUDI-E 汽车与自然视觉" },
        { type: "image", src: asset("作品集总结/AUDI-E作品/地球日美图 (5).jpg"), alt: "AUDI-E 地球日收束画面" },
        {
          type: "video",
          src: asset("作品集总结/AUDI-E作品/0422奥迪世界日-1.0.m4v"),
          poster: asset("作品集总结/AUDI-E作品/地球日小红书竖版&抖音封面1.jpg"),
          alt: "AUDI-E 地球日 TVC 视频"
        }
      ]
    },
    {
      id: "audi-seasons",
      number: "02",
      brand: "AUDI-E",
      title: "Seasons / 节气情绪视觉",
      type: "社媒视觉 / 动态内容",
      cover: asset("作品集总结/AUDI-E作品/谷雨海报.png"),
      wideCover: asset("作品集总结/AUDI-E作品/B站&小红书横版封面1.jpg"),
      summary:
        "以谷雨、立夏、大雪与春日后视镜为内容线索，把季节情绪与车型设计语言融合，形成适配多平台传播的系列画面。",
      role: "AIGC 创意设计 / 视频制作支持",
      services: ["节气创意", "海报视觉", "社媒尺寸适配", "动态内容"],
      media: [
        { type: "image", src: asset("作品集总结/AUDI-E作品/谷雨海报.png"), alt: "AUDI-E 谷雨海报" },
        { type: "image", src: asset("作品集总结/AUDI-E作品/立夏3-4.png"), alt: "AUDI-E 立夏汽车视觉" },
        { type: "image", src: asset("作品集总结/AUDI-E作品/大雪-1080x1440.png"), alt: "AUDI-E 大雪汽车视觉" },
        { type: "image", src: asset("作品集总结/AUDI-E作品/1080x1440.png"), alt: "AUDI-E 季节视觉作品" },
        {
          type: "video",
          src: asset("作品集总结/AUDI-E作品/分享后视镜里的春天_13.m4v"),
          poster: asset("作品集总结/AUDI-E作品/后视镜里面的春天小红书竖版&抖音封面1.jpg"),
          alt: "后视镜里的春天动态视觉"
        },
        {
          type: "video",
          src: asset("作品集总结/AUDI-E作品/0402奥迪出行-12.m4v"),
          poster: asset("作品集总结/AUDI-E作品/视频号封面1.jpg"),
          alt: "AUDI-E 出行短片"
        }
      ]
    },
    {
      id: "geely-transformation",
      number: "03",
      brand: "GEELY",
      title: "Transformation / 车型动态变装",
      type: "TVC 创意 / AI 视频视觉",
      cover: asset("作品集总结/吉利作品/变装视频封面.jpg"),
      wideCover: asset("作品集总结/吉利作品/ai视频封面.png"),
      summary:
        "通过车型主体、雪地氛围与光影转场的统一控制，探索适用于短视频传播的汽车变装叙事与动态节奏。",
      role: "AIGC 创意设计 / 视频视觉支持",
      services: ["TVC 分镜", "关键帧生成", "动态转场", "视觉精修"],
      media: [
        { type: "image", src: asset("作品集总结/吉利作品/变装1.png"), alt: "吉利车型变装关键帧一" },
        { type: "image", src: asset("作品集总结/吉利作品/变装2.png"), alt: "吉利车型变装关键帧二" },
        { type: "image", src: asset("作品集总结/吉利作品/变装3.png"), alt: "吉利车型变装关键帧三" },
        {
          type: "video",
          src: asset("作品集总结/吉利作品/变装视频.mp4"),
          poster: asset("作品集总结/吉利作品/变装视频封面.jpg"),
          alt: "吉利汽车变装视频"
        },
        {
          type: "video",
          src: asset("作品集总结/吉利作品/雪地变装视频.mp4"),
          poster: asset("作品集总结/吉利作品/ai视频封面.png"),
          alt: "吉利汽车雪地动态视频"
        }
      ]
    },
    {
      id: "geely-china-star",
      number: "04",
      brand: "GEELY",
      title: "China Star / 帝豪场景系列",
      type: "商业海报 / 社媒内容",
      cover: asset("作品集总结/吉利作品/吉利帝豪中国星 (1).png"),
      wideCover: asset("作品集总结/吉利作品/ai视频封面.png"),
      summary:
        "结合车型卖点与生活方式场景，建立强调质感、氛围与传播效率的商业视觉系列，并延伸至轮播动态内容。",
      role: "AIGC 创意设计",
      services: ["商业海报", "车型质感控制", "多主题出图", "社媒内容"],
      media: [
        { type: "image", src: asset("作品集总结/吉利作品/吉利帝豪中国星 (1).png"), alt: "吉利帝豪中国星视觉作品一" },
        { type: "image", src: asset("作品集总结/吉利作品/吉利帝豪中国星 (2).png"), alt: "吉利帝豪中国星视觉作品二" },
        { type: "image", src: asset("作品集总结/吉利作品/吉利帝豪中国星 (3).png"), alt: "吉利帝豪中国星视觉作品三" },
        { type: "image", src: asset("作品集总结/吉利作品/吉利帝豪中国星 (4).png"), alt: "吉利帝豪中国星视觉作品四" },
        { type: "image", src: asset("作品集总结/吉利作品/领克.png"), alt: "汽车商业社媒视觉作品" },
        {
          type: "video",
          src: asset("作品集总结/吉利作品/轮播.mp4"),
          poster: asset("作品集总结/吉利作品/轮播封面.jpg"),
          alt: "汽车视觉轮播动态内容"
        }
      ]
    }
  ]
};

window.PORTFOLIO_DATA = portfolioData;
