/**
 * 智能客服机器人
 * 基于规则引擎的简单问答系统
 */

interface Rule {
  pattern: RegExp | string
  response: string | (() => string)
  category?: string
}

export class ChatBot {
  private rules: Rule[] = []

  constructor() {
    this.initRules()
  }

  private initRules() {
    this.rules = [
      // 景点相关
      {
        pattern: /涠洲岛|weizhou/i,
        response: '涠洲岛是广西最著名的海岛景区，拥有火山岩地貌、海滩和灯塔。推荐游玩火山口公园、五彩滩、滴水丹屏。',
        category: '景点',
      },
      {
        pattern: /德天瀑布|detian/i,
        response: '德天瀑布是中国最大的跨国瀑布，位于中越边境。建议清晨或傍晚游览，光线最佳。',
        category: '景点',
      },
      {
        pattern: /阳朔|yangshuo/i,
        response: '阳朔以喀斯特地貌和田园风光闻名，推荐游览遇龙河、十里画廊、西街和相公山。',
        category: '景点',
      },
      {
        pattern: /龙脊梯田|longji/i,
        response: '龙脊梯田是中国最美的梯田之一，建议春季灌水期或秋季金黄期前往。',
        category: '景点',
      },

      // 民宿相关
      {
        pattern: /涠洲岛民宿|涠洲岛住哪里/i,
        response: '涠洲岛推荐住在南湾街附近，交通便利。高端选择有宿海山居、有海无海；平价选择有小猪短租、美团民宿。',
        category: '住宿',
      },
      {
        pattern: /阳朔民宿|阳朔住哪里/i,
        response: '阳朔推荐住在西街周边或遇龙河沿岸。精品民宿有半片星河、既见云山；性价比高的是 Airbnb 和途家。',
        category: '住宿',
      },

      // 旅游咨询
      {
        pattern: /最佳旅游时间|什么时候去/i,
        response: '广西最佳旅游时间为春秋两季（3-5月，9-11月）。夏季注意防晒，冬季温暖适合避寒。',
        category: '咨询',
      },
      {
        pattern: /推荐路线|怎么玩/i,
        response: '推荐7天路线：桂林2天+阳朔2天+涠洲岛3天。也可以选择5天精华游：桂林+阳朔',
        category: '咨询',
      },
      {
        pattern: /交通|怎么去/i,
        response: '飞机：桂林两江机场、南宁吴圩机场。高铁：桂林北站、阳朔站。涠洲岛需从北海港乘船前往。',
        category: '交通',
      },

      // 价格相关
      {
        pattern: /多少钱|价格|收费/i,
        response: '涠洲岛门票115元，德天瀑布115元，阳朔骑行30元/天。民宿价格200-800元/晚不等。',
        category: '价格',
      },

      // 联系客服
      {
        pattern: /客服|联系|电话|微信/i,
        response: '您可以点击页面右下角的"在线客服"按钮，或拨打我们的客服热线：400-123-4567',
        category: '联系',
      },

      // 默认回复
      {
        pattern: /你好|hi|hello/i,
        response: '您好！我是广西旅游助手，可以帮您查询景点、民宿、路线等信息。请问有什么可以帮您？',
        category: '问候',
      },
      {
        pattern: /谢谢|谢谢您|感谢/i,
        response: '不客气！祝您旅途愉快！',
        category: '问候',
      },
      {
        pattern: /.+/,
        response: '抱歉，我暂时不太明白您的意思。您可以咨询景点、民宿、路线、价格等问题，或者点击"在线客服"联系人工客服。',
        category: '默认',
      },
    ]
  }

  /**
   * 回复消息
   */
  async reply(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase()

    for (const rule of this.rules) {
      if (typeof rule.pattern === 'string') {
        if (lowerMessage.includes(rule.pattern.toLowerCase())) {
          return typeof rule.response === 'function' ? rule.response() : rule.response
        }
      } else {
        if (rule.pattern.test(message)) {
          return typeof rule.response === 'function' ? rule.response() : rule.response
        }
      }
    }

    return '您好！请问有什么可以帮您？您可以咨询景点、民宿、路线等问题。'
  }

  /**
   * 获取分类
   */
  getCategory(message: string): string {
    const lowerMessage = message.toLowerCase()

    for (const rule of this.rules) {
      if (typeof rule.pattern === 'string') {
        if (lowerMessage.includes(rule.pattern.toLowerCase())) {
          return rule.category || '其他'
        }
      } else {
        if (rule.pattern.test(message)) {
          return rule.category || '其他'
        }
      }
    }

    return '其他'
  }
}

// 全局实例
let botInstance: ChatBot | null = null

export function getChatBot(): ChatBot {
  if (!botInstance) {
    botInstance = new ChatBot()
  }
  return botInstance
}
