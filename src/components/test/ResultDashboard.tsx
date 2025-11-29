import React from 'react';
import { ProficiencyResult } from '@/utils/scoring';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { RefreshCw, Download, Share2 } from 'lucide-react';

interface ResultDashboardProps {
  results: any;
  levelInfo: ProficiencyResult;
  onRetake: () => void;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ results, levelInfo, onRetake }) => {
  
  const chartData = [
    { subject: 'Vocabulary', A: (results.partA.score / results.partA.total) * 100, fullMark: 100 },
    { subject: 'Grammar', A: (results.partB.score / results.partB.total) * 100, fullMark: 100 },
    { subject: 'Error ID', A: (results.partC.score / results.partC.total) * 100, fullMark: 100 },
    { subject: 'Reading', A: (results.partD.score / results.partD.total) * 100, fullMark: 100 },
    { subject: 'Writing', A: (results.partE.score / results.partE.total) * 100, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Test Results Analysis</h2>
        <p className="text-gray-500">Comprehensive English Proficiency Report</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4" style={{ borderColor: levelInfo.color }}>
        <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left: Score & Level */}
          <div className="text-center md:text-left space-y-6">
            <div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Overall Proficiency</div>
              <h1 className="text-5xl font-extrabold mb-2" style={{ color: levelInfo.color }}>{levelInfo.level}</h1>
              <p className="text-gray-600 font-medium text-lg">{levelInfo.description}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 font-bold">IELTS</div>
                <div className="text-xl font-bold text-gray-800">{levelInfo.ielts}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 font-bold">CEFR</div>
                <div className="text-xl font-bold text-gray-800">{levelInfo.cefr}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 font-bold">Lexile</div>
                <div className="text-xl font-bold text-gray-800">{levelInfo.lexile}</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
               <div>
                 <div className="text-xs text-blue-600 font-bold uppercase">Estimated AR Index</div>
                 <div className="text-2xl font-bold text-blue-800">{levelInfo.ar}</div>
               </div>
               <div className="text-right">
                 <div className="text-xs text-blue-600 font-bold uppercase">Weighted Score</div>
                 <div className="text-2xl font-bold text-blue-800">{results.weightedScore.toFixed(1)}%</div>
               </div>
            </div>
          </div>

          {/* Right: Radar Chart */}
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="My Score"
                  dataKey="A"
                  stroke={levelInfo.color}
                  strokeWidth={3}
                  fill={levelInfo.color}
                  fillOpacity={0.4}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: levelInfo.color, fontWeight: 'bold' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Action Plan
          </h3>
          <ul className="space-y-3">
            {levelInfo.recommendations.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                <span className="text-blue-500 font-bold mt-0.5">{i + 1}.</span>
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🚀</span> Next Steps
          </h3>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Based on your <strong>{levelInfo.level}</strong> level, we recommend focusing on the specific weaknesses identified in the radar chart. Consistent practice with materials rated <strong>{levelInfo.lexile}</strong> will help improve your reading speed and comprehension.
          </p>
          <button 
            onClick={onRetake}
            className="w-full py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retake Test
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultDashboard;
