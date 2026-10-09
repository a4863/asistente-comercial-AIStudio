import React, { useState } from 'react';
import {
  FileText,
  Phone,
  Users,
  MapPin,
  Handshake,
  Check,
  Plus,
  Clock,
  Building,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CommercialNote } from '../../types';

export const NotesView: React.FC = () => {
  const { commercialNotes, addCommercialNote } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [type, setType] = useState<CommercialNote['type']>('reunion');
  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !client.trim()) {
      alert('Por favor completa cliente, título y contenido.');
      return;
    }

    addCommercialNote({
      type,
      client,
      project: project || undefined,
      title,
      content,
      extracted_tasks: ['Hacer seguimiento comercial de acuerdos de la nota'],
    });

    // Reset
    setTitle('');
    setContent('');
    setClient('');
    setProject('');
    setIsCreating(false);
  };

  const getIconForType = (noteType: CommercialNote['type']) => {
    switch (noteType) {
      case 'reunion':
        return <Users className="w-3.5 h-3.5 text-blue-400" />;
      case 'llamada':
        return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'visita':
        return <MapPin className="w-3.5 h-3.5 text-amber-400" />;
      case 'acuerdo':
        return <Handshake className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Notas Comerciales &amp; Reuniones de Obra</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro estructurado de llamadas, visitas técnicas y acuerdos presenciales con constructoras e ingenierías.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreating ? 'Cancelar' : 'Nueva Nota Comercial'}</span>
        </button>
      </div>

      {/* Creation form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="p-5 rounded-lg bg-slate-900 border border-slate-700 space-y-4 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Registrar Nueva Interacción Comercial
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400">Tipo de interacción:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none"
              >
                <option value="reunion">Reunión de obra / técnica</option>
                <option value="llamada">Llamada telefónica</option>
                <option value="visita">Visita a instalaciones / obra</option>
                <option value="acuerdo">Acuerdo comercial</option>
                <option value="observacion">Observación general</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400">Cliente / Constructora:</label>
              <input
                type="text"
                placeholder="Ej. Grupo Bertolín, Edifesa, Ferrovial..."
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">Obra / Proyecto (opcional):</label>
              <input
                type="text"
                placeholder="Ej. Policía Local Valencia, Hospital La Fe..."
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-slate-400">Título resumen:</label>
              <input
                type="text"
                placeholder="Ej. Dudas en cubierta técnica y trazado conductos..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-slate-400">Contenido detallado y acuerdos:</label>
              <textarea
                rows={4}
                placeholder="Anota acuerdos clave, requerimientos de la Dirección Facultativa, modificaciones solicitadas..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Guardar Nota Comercial
            </button>
          </div>
        </form>
      )}

      {/* List of notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commercialNotes.map((note) => (
          <div
            key={note.id}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  {getIconForType(note.type)}
                </span>
                <div>
                  <div className="text-xs font-bold text-white">{note.title}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium">{note.client}</span>
                    {note.project && (
                      <>
                        <span>·</span>
                        <span>{note.project}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                {new Date(note.date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-950/50 p-2.5 rounded border border-slate-800/80 leading-relaxed">
              {note.content}
            </p>

            {note.extracted_tasks && note.extracted_tasks.length > 0 && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-amber-400/90 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Seguimiento extraído: {note.extracted_tasks[0]}</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">Actor: {note.actor}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
