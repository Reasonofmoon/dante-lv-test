"use client";

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Question } from '@/data/questions';
import { Download, Upload, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<string>('');
  const [csvData, setCsvData] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTestConnection = async () => {
    if (!apiKey) {
      setStatus('error');
      setMessage('Please enter an API Key');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          modelName: model,
          prompt: 'Hello! Just reply with "Connection Successful".'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(`Success: ${data.text}`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!apiKey) return;
    setStatus('loading');
    
    const prompt = `
      Generate 3 IELTS Reading comprehension multiple choice questions in JSON format.
      The output should be a JSON array of objects with the following structure:
      {
        "type": "reading",
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0, // Index of correct option
        "skill": "Skill name (e.g., Inference)"
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          modelName: model,
          prompt
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setGeneratedQuestions(data.text);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        setMessage(`Loaded ${results.data.length} rows from CSV.`);
      },
      error: (error) => {
        setMessage(`CSV Error: ${error.message}`);
      }
    });
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      { type: "synonym", question: "The word 'abundant' is closest in meaning to:", options: "scarce|plentiful|rare|empty", correct: 1, explanation: "Abundant means existing in large quantities." },
      { type: "grammar", question: "She ___ to the store yesterday.", options: "go|gone|went|goes", correct: 2, explanation: "Past tense of go is went." }
    ];
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_questions.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        {/* LLM Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-500" /> LLM Configuration (Gemini)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Gemini API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your AI Studio API Key"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (New)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (New)</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleTestConnection}
                disabled={status === 'loading'}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {status === 'loading' ? 'Testing...' : 'Test Connection'}
              </button>
              <button 
                onClick={handleGenerateQuestions}
                disabled={status === 'loading' || !apiKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Generate Sample Questions
              </button>
            </div>
            {message && (
              <div className={`p-3 rounded-lg text-sm ${status === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Generated Content Preview */}
        {generatedQuestions && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Generated Output</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {generatedQuestions}
            </pre>
          </div>
        )}

        {/* CSV Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="text-blue-500" /> Question Management
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Import Questions</h3>
              <p className="text-sm text-gray-500">Upload a CSV file to bulk import questions.</p>
              <input 
                type="file" 
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Templates</h3>
              <p className="text-sm text-gray-500">Download the standard CSV template.</p>
              <button 
                onClick={downloadSampleCSV}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Download className="w-4 h-4" /> Download Sample CSV
              </button>
            </div>
          </div>

          {csvData.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">Preview ({csvData.length} items)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {Object.keys(csvData[0]).map((key) => (
                        <th key={key} className="px-6 py-3">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="bg-white border-b">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-6 py-4 truncate max-w-xs">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 5 && <p className="text-xs text-gray-400 mt-2">...and {csvData.length - 5} more rows</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
