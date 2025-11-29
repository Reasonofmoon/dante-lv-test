export type QuestionType = "spelling" | "synonym" | "collocation" | "grammar" | "error_id" | "reading" | "writing";

export interface BaseQuestion {
  type: QuestionType;
  explanation?: string;
}

export interface SpellingQuestion extends BaseQuestion {
  type: "spelling";
  word: string;
  correct: boolean;
  correctSpelling: string;
  meaning: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "synonym" | "collocation" | "grammar" | "reading";
  question: string; // or sentence for grammar
  options: string[];
  correct: number;
  target?: string;
  grammar?: string;
  skill?: string;
}

export interface ErrorIDSegment {
  text: string;
  id: string;
}

export interface ErrorIDQuestion extends BaseQuestion {
  type: "error_id";
  sentence: string;
  segments: ErrorIDSegment[];
  correct: number;
}

export interface WritingQuestion extends BaseQuestion {
  type: "writing";
  korean: string;
  keywords: string[];
  grammar: string;
  modelAnswer: string;
  keyElements: string[];
}

export type Question = SpellingQuestion | MultipleChoiceQuestion | ErrorIDQuestion | WritingQuestion;

export interface Section {
  id: string;
  name: string;
  icon: string;
  time: string;
  questions: Question[];
  description: string;
}

export const sections: Section[] = [
  {
    id: "partA",
    name: "Vocabulary & Spelling",
    icon: "📚",
    time: "3 min",
    description: "Test your knowledge of academic vocabulary and correct spelling.",
    questions: [
      {
        type: "spelling",
        word: "accomodation",
        correct: false,
        correctSpelling: "accommodation",
        meaning: "숙소"
      },
      {
        type: "spelling", 
        word: "occurrence",
        correct: true,
        correctSpelling: "occurrence",
        meaning: "발생"
      },
      {
        type: "synonym",
        question: "The government aims to *reduce* carbon emissions by 2030.",
        target: "reduce",
        options: ["increase", "diminish", "maintain", "produce"],
        correct: 1,
        explanation: "reduce = diminish (줄이다)"
      },
      {
        type: "collocation",
        question: "Scientists ___ research to find new treatments.",
        options: ["make", "do", "conduct", "perform"],
        correct: 2,
        explanation: "conduct research (연구를 수행하다) - academic collocation"
      }
    ]
  },
  {
    id: "partB",
    name: "Grammar in Context",
    icon: "📝",
    time: "3 min",
    description: "Choose the grammatically correct option for each sentence.",
    questions: [
      {
        type: "grammar",
        question: "The number of students who ___ online courses has increased significantly.",
        options: ["takes", "take", "taking", "taken"],
        correct: 1,
        grammar: "Subject-Verb Agreement",
        explanation: "관계절 내 동사는 선행사 'students'(복수)에 일치"
      },
      {
        type: "grammar",
        question: "If the government ___ stricter regulations, pollution would decrease.",
        options: ["implements", "implemented", "had implemented", "will implement"],
        correct: 1,
        grammar: "Conditional Type 2",
        explanation: "가정법 과거: If + 과거동사, would + 동사원형"
      },
      {
        type: "grammar",
        question: "The report, ___ was published last month, highlights key environmental issues.",
        options: ["that", "which", "what", "who"],
        correct: 1,
        grammar: "Relative Clause (Non-defining)",
        explanation: "콤마가 있는 비제한적 관계절에는 'which' 사용"
      },
      {
        type: "grammar",
        question: "By the time the project is completed, the team ___ for three years.",
        options: ["will work", "will have worked", "worked", "has worked"],
        correct: 1,
        grammar: "Future Perfect",
        explanation: "By the time + 현재시제, 주절은 미래완료"
      }
    ]
  },
  {
    id: "partC",
    name: "Error Identification",
    icon: "🔍",
    time: "3 min",
    description: "Identify the underlined part that contains a grammatical error.",
    questions: [
      {
        type: "error_id",
        sentence: "The increasing number of tourists are causing environmental damage to historical sites.",
        segments: [
          { text: "The increasing number of tourists", id: "A" },
          { text: "are causing", id: "B" },
          { text: "environmental damage", id: "C" },
          { text: "to historical sites", id: "D" }
        ],
        correct: 1, // B - should be "is causing"
        explanation: "'The number of'가 주어이므로 단수동사 'is causing' 사용"
      },
      {
        type: "error_id",
        sentence: "Despite of the economic challenges, many businesses have managed to survive.",
        segments: [
          { text: "Despite of", id: "A" },
          { text: "the economic challenges", id: "B" },
          { text: "many businesses have managed", id: "C" },
          { text: "to survive", id: "D" }
        ],
        correct: 0, // A - should be "Despite" (no "of")
        explanation: "'Despite' 뒤에는 'of' 없이 명사구가 바로 옴"
      },
      {
        type: "error_id",
        sentence: "The data shows that unemployment has raised significantly over the past decade.",
        segments: [
          { text: "The data shows that", id: "A" },
          { text: "unemployment has raised", id: "B" },
          { text: "significantly", id: "C" },
          { text: "over the past decade", id: "D" }
        ],
        correct: 1, // B - should be "has risen"
        explanation: "'raise'는 타동사, 'rise'는 자동사. unemployment가 스스로 증가하므로 'risen'"
      }
    ]
  },
  {
    id: "partD",
    name: "Reading Comprehension",
    icon: "📖",
    time: "3 min",
    description: "Read the passage and answer the questions.",
    questions: [
      {
        type: "reading",
        question: "According to the passage, critics of remote work believe it:",
        options: [
          "improves employee satisfaction",
          "damages workplace relationships and company identity",
          "increases overall productivity",
          "reduces operational costs"
        ],
        correct: 1,
        skill: "Detail Identification",
        explanation: "Passage mentions critics contend it undermines team cohesion."
      },
      {
        type: "reading",
        question: "The author's tone towards the hybrid work model can best be described as:",
        options: [
          "strongly supportive",
          "entirely dismissive", 
          "cautiously optimistic",
          "deeply pessimistic"
        ],
        correct: 2,
        skill: "Tone/Attitude Inference",
        explanation: "Author suggests it 'may offer the optimal solution' but implications 'remain to be seen'."
      }
    ]
  },
  {
    id: "partE",
    name: "Sentence Construction",
    icon: "✍️",
    time: "3 min",
    description: "Translate the Korean sentences using the given keywords.",
    questions: [
      {
        type: "writing",
        korean: "기술의 급속한 발전이 전통적인 산업을 변화시키고 있다.",
        keywords: ["rapid", "advancement", "technology", "transforming", "traditional"],
        grammar: "현재진행 수동/능동",
        modelAnswer: "The rapid advancement of technology is transforming traditional industries.",
        keyElements: ["rapid", "advancement", "technology", "transform", "traditional"]
      },
      {
        type: "writing",
        korean: "교육에 더 많이 투자하는 국가들이 더 높은 경제 성장을 이루는 경향이 있다.",
        keywords: ["countries", "invest", "education", "tend", "achieve", "economic growth"],
        grammar: "관계절 + to부정사",
        modelAnswer: "Countries that invest more in education tend to achieve higher economic growth.",
        keyElements: ["countries", "invest", "education", "tend", "achieve", "growth"]
      }
    ]
  }
];

export const readingPassage = `The shift towards remote work has fundamentally altered workplace dynamics. While proponents argue that it enhances productivity and work-life balance, critics contend that it undermines team cohesion and corporate culture. Recent studies suggest that a hybrid model—combining office and remote work—may offer the optimal solution, though its long-term implications remain to be seen.`;
