"use client";

import React, { useState, useEffect } from 'react';
import { sections, readingPassage } from '@/data/questions';
import { getAdvancedProficiencyLevel } from '@/utils/scoring';
import QuestionCard from '@/components/test/QuestionCard';
import Timer from '@/components/test/Timer';
import ResultDashboard from '@/components/test/ResultDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

export default function TestContainer() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [answers, setAnswers] = useState<any>({
    partA: Array(4).fill(null),
    partB: Array(4).fill(null),
    partC: Array(3).fill(null),
    partD: Array(2).fill(null),
    partE: Array(2).fill('')
  });
  const [showResults, setShowResults] = useState(false);

  const currentSection = sections[currentSectionIndex];

  const handleAnswer = (partId: string, index: number, value: any) => {
    setAnswers((prev: any) => ({
      ...prev,
      [partId]: prev[partId].map((item: any, i: number) => i === index ? value : item)
    }));
  };

  const calculateResults = () => {
    let scores = {
      partA: 0,
      partB: 0,
      partC: 0,
      partD: 0,
      partE: 0
    };

    // Part A
    sections[0].questions.forEach((q: any, i) => {
      if (answers.partA[i] === q.correct) scores.partA++;
    });

    // Part B
    sections[1].questions.forEach((q: any, i) => {
      if (answers.partB[i] === q.correct) scores.partB++;
    });

    // Part C
    sections[2].questions.forEach((q: any, i) => {
      if (answers.partC[i] === q.correct) scores.partC++;
    });

    // Part D
    sections[3].questions.forEach((q: any, i) => {
      if (answers.partD[i] === q.correct) scores.partD++;
    });

    // Part E
    sections[4].questions.forEach((q: any, i) => {
      const userAnswer = (answers.partE[i] || '').toLowerCase();
      let matchCount = 0;
      q.keyElements.forEach((keyword: string) => {
        if (userAnswer.includes(keyword.toLowerCase())) matchCount++;
      });
      if (matchCount >= Math.ceil(q.keyElements.length * 0.6)) scores.partE++;
    });

    const weightedScore = (
      (scores.partA / 4) * 20 +
      (scores.partB / 4) * 25 +
      (scores.partC / 3) * 20 +
      (scores.partD / 2) * 15 +
      (scores.partE / 2) * 20
    );

    return {
      partA: { score: scores.partA, total: 4, weight: 20 },
      partB: { score: scores.partB, total: 4, weight: 25 },
      partC: { score: scores.partC, total: 3, weight: 20 },
      partD: { score: scores.partD, total: 2, weight: 15 },
      partE: { score: scores.partE, total: 2, weight: 20 },
      rawTotal: scores.partA + scores.partB + scores.partC + scores.partD + scores.partE,
      totalQuestions: 15,
      weightedScore: weightedScore
    };
  };

  const finishTest = () => {
    setShowResults(true);
  };

  const resetTest = () => {
    setShowResults(false);
    setTestStarted(false);
    setCurrentSectionIndex(0);
    setTimeRemaining(15 * 60);
    setAnswers({
      partA: Array(4).fill(null),
      partB: Array(4).fill(null),
      partC: Array(3).fill(null),
      partD: Array(2).fill(null),
      partE: Array(2).fill('')
    });
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center">
            <h1 className="text-4xl font-extrabold mb-2">IELTS Placement Test</h1>
            <p className="text-blue-100 text-lg">Professional Assessment & Certification</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="font-bold text-gray-800">15 Min</div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <div className="text-2xl mb-1">📝</div>
                <div className="font-bold text-gray-800">15 Qs</div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-bold text-gray-800">CEFR</div>
                <div className="text-xs text-gray-500">A2 - C1</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <div className="text-2xl mb-1">📈</div>
                <div className="font-bold text-gray-800">Lexile</div>
                <div className="text-xs text-gray-500">Measure</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-gray-800 text-lg">Test Structure</h3>
              {sections.map((section, idx) => (
                <div key={idx} className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <span className="text-2xl mr-4">{section.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-700">{section.name}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{section.time}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTestStarted(true)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xl hover:shadow-lg hover:scale-[1.01] transition-all"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const levelInfo = getAdvancedProficiencyLevel(results.weightedScore);
    
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <ResultDashboard results={results} levelInfo={levelInfo} onRetake={resetTest} />
          
          {/* Detailed Review Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Detailed Review</h3>
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="mb-8 last:mb-0">
                <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                  {section.icon} {section.name}
                </h4>
                <div className="space-y-4">
                  {section.questions.map((q, qIdx) => (
                    <QuestionCard
                      key={qIdx}
                      question={q}
                      index={qIdx}
                      answer={answers[section.id][qIdx]}
                      onAnswer={() => {}}
                      showResult={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-gray-800 hidden md:block">IELTS Placement Test</h1>
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {currentSection.icon} {currentSection.name}
            </div>
          </div>
          <Timer 
            timeRemaining={timeRemaining} 
            setTimeRemaining={setTimeRemaining} 
            onTimeUp={finishTest} 
            isActive={!showResults} 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
            <span>Progress</span>
            <span>{Math.round(((currentSectionIndex) / sections.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Reading Passage (Only for Part D) */}
        {currentSection.id === 'partD' && (
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 mb-6 text-gray-800 leading-relaxed shadow-sm">
            <h4 className="font-bold text-orange-800 mb-2 text-sm uppercase">Reading Passage</h4>
            {readingPassage}
          </div>
        )}

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentSection.questions.map((q, idx) => (
              <QuestionCard
                key={idx}
                question={q}
                index={idx}
                answer={answers[currentSection.id][idx]}
                onAnswer={(val) => handleAnswer(currentSection.id, idx, val)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSectionIndex === 0}
            className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          {currentSectionIndex < sections.length - 1 ? (
            <button
              onClick={() => setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1))}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
            >
              Next Section <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={finishTest}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
            >
              Submit Test <CheckCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} IELTS Placement Test. All rights reserved.</p>
          <a href="/admin" className="text-blue-500 hover:underline mt-2 inline-block">Admin Dashboard</a>
        </div>
      </footer>
    </div>
  );
}
