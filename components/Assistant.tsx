
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Employee, Transaction } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Props {
  employees: Employee[];
  transactions: Transaction[];
}

export const Assistant: React.FC<Props> = ({ employees, transactions }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '¡Hola! Soy tu asistente de NóminaPro. Puedo ayudarte a analizar los costos de tu empresa, explicarte leyes laborales o resumir los pagos de tus empleados. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Eres un experto en contabilidad y leyes laborales para pequeñas empresas.
        Contexto de la empresa:
        - Empleados registrados: ${employees.length}
        - Total planilla base mensual: S/ ${employees.reduce((acc, e) => acc + e.baseSalary, 0)}
        - Detalle empleados: ${JSON.stringify(employees.map(e => ({ name: e.name, position: e.position, salary: e.baseSalary })))}
        - Movimientos recientes: ${JSON.stringify(transactions.map(t => ({ type: t.type, amount: t.amount, desc: t.description })))}

        Responde a la siguiente consulta del usuario de forma breve, profesional y útil en español:
        "${userMsg}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Lo siento, no pude procesar tu solicitud.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Hubo un error al conectar con la IA. Por favor, verifica tu conexión.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {msg.role === 'bot' ? <Bot size={14} className="text-indigo-500" /> : <User size={14} className="text-indigo-200" />}
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  {msg.role === 'bot' ? 'NóminaPro AI' : 'Tú'}
                </span>
              </div>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-pulse flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" />
              <span className="text-xs text-slate-400 font-medium italic">Pensando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t sticky bottom-0">
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl">
          <input
            type="text"
            className="flex-1 bg-transparent px-2 py-1 outline-none text-sm"
            placeholder="Pregunta algo sobre tu nómina..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
