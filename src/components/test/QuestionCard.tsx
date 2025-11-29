import React from 'react';
import { motion } from 'framer-motion';
import { Question, ErrorIDQuestion, MultipleChoiceQuestion, SpellingQuestion, WritingQuestion } from '@/data/questions';
import { Check, X } from 'lucide-react';
import clsx from 'clsx';

interface QuestionCardProps {
  question: Question;
  index: number;
  answer: any;
  onAnswer: (value: any) => void;
  showResult?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, answer, onAnswer, showResult = false }) => {
  
  const renderSpelling = (q: SpellingQuestion) => (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-xl font-mono bg-gray-100 px-3 py-1 rounded text-gray-800">{q.word}</span>
        <span className="text-gray-500 ml-3 text-sm">({q.meaning})</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => !showResult && onAnswer(true)}
          disabled={showResult}
          className={clsx(
            "px-5 py-2 rounded-full font-bold transition-all flex items-center gap-1",
            answer === true ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-green-100",
            showResult && answer === true && "opacity-100",
            showResult && answer !== true && "opacity-50"
          )}
        >
          O
        </button>
        <button
          onClick={() => !showResult && onAnswer(false)}
          disabled={showResult}
          className={clsx(
            "px-5 py-2 rounded-full font-bold transition-all flex items-center gap-1",
            answer === false ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-red-100",
             showResult && answer === false && "opacity-100",
             showResult && answer !== false && "opacity-50"
          )}
        >
          X
        </button>
      </div>
    </div>
  );

  const renderMultipleChoice = (q: MultipleChoiceQuestion) => (
    <>
      <p className="text-gray-700 mb-4 text-lg">{q.question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.options.map((option, optIndex) => (
          <button
            key={optIndex}
            onClick={() => !showResult && onAnswer(optIndex)}
            disabled={showResult}
            className={clsx(
              "p-3 rounded-lg border-2 transition-all text-left text-sm relative",
              answer === optIndex
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-blue-300 text-gray-700",
              showResult && q.correct === optIndex && "!border-green-500 !bg-green-50 !text-green-700",
              showResult && answer === optIndex && answer !== q.correct && "!border-red-500 !bg-red-50 !text-red-700"
            )}
          >
            <span className="font-bold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
            {option}
            {showResult && q.correct === optIndex && (
              <Check className="absolute right-3 top-3 w-4 h-4 text-green-600" />
            )}
             {showResult && answer === optIndex && answer !== q.correct && (
              <X className="absolute right-3 top-3 w-4 h-4 text-red-600" />
            )}
          </button>
        ))}
      </div>
    </>
  );

  const renderErrorID = (q: ErrorIDQuestion) => (
    <>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-700 leading-relaxed text-lg">
          {q.segments.map((seg, segIndex) => (
            <span key={segIndex}>
              <span 
                onClick={() => !showResult && onAnswer(segIndex)}
                className={clsx(
                  "px-1 cursor-pointer transition-all rounded",
                  segIndex === answer ? "bg-purple-200 text-purple-900" : "underline decoration-dotted hover:bg-purple-100",
                  showResult && q.correct === segIndex && "!bg-green-200 !text-green-900 decoration-green-500",
                  showResult && answer === segIndex && answer !== q.correct && "!bg-red-200 !text-red-900"
                )}
              >
                ({seg.id}) {seg.text}
              </span>
              {segIndex < q.segments.length - 1 ? ' ' : '.'}
            </span>
          ))}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {q.segments.map((seg, segIndex) => (
          <button
            key={segIndex}
            onClick={() => !showResult && onAnswer(segIndex)}
            disabled={showResult}
            className={clsx(
              "p-2 rounded-lg border-2 transition-all font-bold",
              answer === segIndex
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-gray-200 hover:border-purple-300 text-gray-600",
               showResult && q.correct === segIndex && "!border-green-500 !bg-green-50 !text-green-700",
               showResult && answer === segIndex && answer !== q.correct && "!border-red-500 !bg-red-50 !text-red-700"
            )}
          >
            {seg.id}
          </button>
        ))}
      </div>
    </>
  );

  const renderWriting = (q: WritingQuestion) => (
    <>
      <p className="text-gray-800 mb-3 font-medium text-lg">{q.korean}</p>
      
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <span className="text-yellow-800 text-sm font-bold flex items-center gap-1">
           💡 Keywords
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {q.keywords.map((word, idx) => (
            <span 
              key={idx} 
              className="bg-white text-yellow-900 border border-yellow-100 px-2 py-1 rounded text-sm font-medium shadow-sm"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <textarea
        value={answer || ''}
        onChange={(e) => !showResult && onAnswer(e.target.value)}
        disabled={showResult}
        placeholder="Write your English sentence here..."
        className={clsx(
          "w-full border-2 rounded-lg px-4 py-3 focus:outline-none min-h-[100px] text-gray-700 transition-all",
          showResult ? "bg-gray-50 border-gray-200" : "border-gray-300 focus:border-teal-500"
        )}
      />
      {showResult && (
        <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
           <p className="text-sm text-teal-800 font-bold mb-1">Model Answer:</p>
           <p className="text-teal-700">{q.modelAnswer}</p>
        </div>
      )}
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4"
    >
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-gray-400">Q{index + 1}.</span>
        {question.type === 'spelling' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Spelling</span>}
        {question.type === 'synonym' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Synonym</span>}
        {question.type === 'collocation' && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Collocation</span>}
        {(question as any).grammar && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">{(question as any).grammar}</span>}
        {(question as any).skill && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">{(question as any).skill}</span>}
      </div>

      {question.type === 'spelling' && renderSpelling(question as SpellingQuestion)}
      {(question.type === 'synonym' || question.type === 'collocation' || (question.type as any) === 'grammar' || question.type === 'reading') && renderMultipleChoice(question as MultipleChoiceQuestion)}
      {question.type === 'error_id' && renderErrorID(question as ErrorIDQuestion)}
      {question.type === 'writing' && renderWriting(question as WritingQuestion)}
      
      {showResult && question.explanation && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
          <span className="font-bold text-gray-700">Explanation:</span> {question.explanation}
        </div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
