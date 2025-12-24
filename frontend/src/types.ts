export interface Message {
  role: string;
  content: string;
  philosopher?: string;
}

export interface ChatResponse {
  messages: Message[];
  conversation_id: string;
}

export interface Philosopher {
  name: string;
  name_en: string;
  color: string;
  avatar: string;
  avatarImage?: string; // Q版头像图片URL
}

export const PHILOSOPHERS: Record<string, Philosopher> = {
  "卡尔·马克思": {
    name: "卡尔·马克思",
    name_en: "Karl Marx",
    color: "#DC2626", // 红色
    avatar: "👨‍🏭",
    avatarImage: "/卡尔马克思.jpg"
  },
  "马克斯·韦伯": {
    name: "马克斯·韦伯",
    name_en: "Max Weber",
    color: "#2563EB", // 蓝色
    avatar: "📚",
    avatarImage: "/马克思韦伯.jpg"
  },
  "米歇尔·福柯": {
    name: "米歇尔·福柯",
    name_en: "Michel Foucault",
    color: "#7C3AED", // 紫色
    avatar: "🔍",
    avatarImage: "/米歇尔福柯.jpg"
  },
  "弗里德里希·哈耶克": {
    name: "弗里德里希·哈耶克",
    name_en: "Friedrich Hayek",
    color: "#059669", // 绿色
    avatar: "💼",
    avatarImage: "/哈耶克.jpg"
  },
  "弗里德里希·尼采": {
    name: "弗里德里希·尼采",
    name_en: "Friedrich Nietzsche",
    color: "#F59E0B", // 橙色
    avatar: "⚡",
    avatarImage: "/尼采.jpg"
  }
};

