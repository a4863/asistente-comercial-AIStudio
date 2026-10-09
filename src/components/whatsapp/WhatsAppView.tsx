import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Plus,
  Send,
  Building,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhatsAppView: React.FC = () => {
  const { whatsappSnippets, addWhatsAppSnippet } = useApp();

  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [rawText, setRawText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || !contactName.trim()) {
      alert('Por favor introduce el nombre del contacto y el texto copiado.');
      return;
    }

    addWhatsAppSnippet(rawText, contactName, phone || '+34 600 00 00 00');
    setRawText('');
    setContactName('');
    setPhone('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Entrada de Chats WhatsApp (MVP)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pegado manual y estructuración de conversaciones rápidas con jefes de obra, compras y facultativos.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancelar' : 'Pegar Chat WhatsApp'}</span>
        </button>
      </div>

      {/* Input box */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-5 rounded-lg bg-slate-900 border border-slate-700 space-y-4 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Importar Fragmento de Chat
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400">Contacto / Cargo:</label>
              <input
                type="text"
                placeholder="Ej. Gabriel Bertolín, Carlos Edifesa..."
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Teléfono (opcional):</label>
              <input
                type="text"
                placeholder="+34 619 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-400">Texto copiado de WhatsApp:</label>
              <textarea
                rows={5}
                placeholder="Pega aquí el historial de mensajes de WhatsApp..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
            >
              Procesar y Extraer
            </button>
          </div>
        </form>
      )}

      {/* List of WhatsApp transcripts */}
      <div className="space-y-4">
        {whatsappSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{snippet.contact_name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{snippet.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                  {snippet.status}
                </span>
                <span className="text-slate-400">
                  {new Date(snippet.date).toLocaleString('es-ES')}
                </span>
              </div>
            </div>

            {/* Raw Transcript Box */}
            <pre className="p-3 rounded bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {snippet.raw_text}
            </pre>

            {/* Extracted commitments */}
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/60 space-y-1 text-xs">
              <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Compromisos detectados en chat:</span>
              </div>
              <ul className="space-y-1">
                {snippet.extracted_commitments.map((c, i) => (
                  <li key={i} className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
