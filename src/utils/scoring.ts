export type ProficiencyResult = {
  level: string;
  ielts: string;
  cefr: string;
  lexile: string;
  ar: string;
  color: string;
  description: string;
  recommendations: string[];
};

export const getAdvancedProficiencyLevel = (score: number): ProficiencyResult => {
  // Score is expected to be a percentage (0-100)
  
  if (score >= 85) return { 
    level: "Upper-Intermediate", 
    ielts: "6.5-7.0", 
    cefr: "B2+/C1",
    lexile: "1100L-1300L",
    ar: "7.5-9.0",
    color: "#10b981", 
    description: "높은 수준의 학술적 텍스트를 분석하고 추론할 수 있습니다.",
    recommendations: [
      "IELTS Writing Task 2 고득점 전략 학습",
      "Academic collocation 및 고급 어휘 확장",
      "Speaking Part 3 논리적 답변 구조화 연습",
      "Reading passage 시간 관리 전략 습득"
    ]
  };
  
  if (score >= 70) return { 
    level: "Intermediate+", 
    ielts: "5.5-6.0", 
    cefr: "B2",
    lexile: "900L-1050L",
    ar: "5.5-7.0",
    color: "#3b82f6", 
    description: "복잡한 문장 구조를 이해하며 논리적 흐름을 파악합니다.",
    recommendations: [
      "Complex sentence 구조 정확성 훈련",
      "Discourse markers 활용 능력 강화",
      "Paraphrasing 스킬 집중 연습",
      "Academic Word List 2000 단어 암기"
    ]
  };

  if (score >= 55) return { 
    level: "Intermediate", 
    ielts: "5.0-5.5", 
    cefr: "B1+",
    lexile: "700L-850L",
    ar: "4.0-5.4",
    color: "#f59e0b", 
    description: "기본 의사소통은 가능하나 Academic English 보강 필요합니다.",
    recommendations: [
      "핵심 문법 (시제, 관계사, 조건문) 정리",
      "주제별 필수 어휘 500개 암기",
      "문장 구조 다양화 연습",
      "Reading skimming/scanning 기법 학습"
    ]
  };

  if (score >= 40) return { 
    level: "Pre-Intermediate", 
    ielts: "4.5-5.0", 
    cefr: "B1",
    lexile: "500L-650L",
    ar: "2.5-3.9",
    color: "#f97316", 
    description: "기초 문법과 어휘 확장이 시급합니다.",
    recommendations: [
      "기본 시제 (현재/과거/미래/완료) 완벽 정리",
      "기초 Academic 어휘 300개 우선 암기",
      "단문 → 복문 확장 연습",
      "Dictation을 통한 듣기/쓰기 동시 훈련"
    ]
  };

  return { 
    level: "Elementary", 
    ielts: "4.0 이하", 
    cefr: "A2",
    lexile: "BR-400L",
    ar: "1.0-2.4",
    color: "#ef4444", 
    description: "체계적인 기초 영어 학습이 필요합니다.",
    recommendations: [
      "기초 문법 (be동사, 일반동사, 시제) 재정립",
      "일상 필수 어휘 500개 암기",
      "기본 문장 패턴 50개 체화",
      "매일 영어 일기 쓰기로 output 연습"
    ]
  };
};
