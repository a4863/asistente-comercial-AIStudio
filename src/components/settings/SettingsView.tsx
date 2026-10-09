import React from 'react';
import {
  Settings,
  Mail,
  BrainCircuit,
  Calendar,
  Lock,
  ShieldCheck,
  Server,
  Folder,
  Database,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white tracking-tight">Configuración del Entorno Local</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Parámetros técnicos de conectividad IMAP, IA, calendario y directivas de seguridad local en Windows.
        </p>
      </div>

      {/* Section 1: Correo Corporativo IMAP (Section 31) */}
      <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Buzón Corporativo IMAP (Solo Lectura + Carpeta Dedicada)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Conectado (Port 993 TLS)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500">Cuenta de correo configurada:</label>
            <div className="font-semibold text-slate-200 mt-0.5 font-mono">alejandro.lopez@aclimar.es</div>
          </div>
          <div>
            <label className="text-slate-500">Servidor Host IMAP:</label>
            <div className="text-slate-200 mt-0.5 font-mono">imap.aclimar.es (Puerto 993)</div>
          </div>
          <div>
            <label className="text-slate-500">Cifrado de transporte:</label>
            <div className="text-slate-200 mt-0.5">SSL / TLS Estricto (BODY.PEEK activo)</div>
          </div>
          <div>
            <label className="text-slate-500">Contraseña:</label>
            <div className="text-emerald-400 mt-0.5 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" /> Almacenada en Windows Keyring (Oculta)
            </div>
          </div>
          <div>
            <label className="text-slate-500">Carpeta Entrada (Inbox):</label>
            <div className="font-mono text-slate-300 mt-0.5">INBOX</div>
          </div>
          <div>
            <label className="text-slate-500">Carpeta Enviados (Sent):</label>
            <div className="font-mono text-slate-300 mt-0.5">INBOX.Sent</div>
          </div>
          <div className="md:col-span-2 p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200">
            <label className="text-amber-400 font-semibold flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" />
              <span>Carpeta Dedicada de Borradores (Destino Exclusivo IMAP APPEND):</span>
            </label>
            <div className="font-mono text-xs mt-1 text-white">
              INBOX.Drafts.Borradores Asistente
            </div>
            <p className="text-[11px] text-amber-300/80 mt-1">
              Nombre visible en Outlook: <strong>&quot;Borradores Asistente&quot;</strong>. Aislada de la ingesta normal de correo para prevenir bucles.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Motor IA (Gemini) */}
      <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Motor de Análisis &amp; Extracción IA
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Activo (Latencia baja)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500">Proveedor de IA:</label>
            <div className="font-semibold text-slate-200 mt-0.5">Google GenAI (@google/genai)</div>
          </div>
          <div>
            <label className="text-slate-500">Modelo configurado:</label>
            <div className="font-mono text-amber-300 mt-0.5 font-semibold">models/gemini-3.8-flash</div>
          </div>
          <div>
            <label className="text-slate-500">Objetivo de inferencia:</label>
            <div className="text-slate-300 mt-0.5">Extracción estructurada JSON (compromisos, tareas, dudas)</div>
          </div>
          <div>
            <label className="text-slate-500">Directiva de ejecución:</label>
            <div className="text-slate-300 mt-0.5">Modo propuesta únicamente (cero ejecución autónoma)</div>
          </div>
        </div>
      </div>

      {/* Section 3: Google Calendar */}
      <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Integración Google Calendar (OAuth 2.0 Local)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Autorizado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500">Cuenta Google esperada:</label>
            <div className="font-semibold text-slate-200 mt-0.5 font-mono">llopez.alejandro@gmail.com</div>
          </div>
          <div>
            <label className="text-slate-500">Calendario propio seleccionado:</label>
            <div className="font-semibold text-blue-300 mt-0.5">Alex Google</div>
          </div>
          <div>
            <label className="text-slate-500">Zona horaria predeterminada:</label>
            <div className="font-mono text-slate-300 mt-0.5">Europe/Madrid (CET/CEST)</div>
          </div>
          <div>
            <label className="text-slate-500">Política de inserción:</label>
            <div className="text-slate-300 mt-0.5">Eventos temporizados simples, sin asistentes ni recurrencia</div>
          </div>
        </div>
      </div>

      {/* Section 4: Seguridad & Entorno Windows (Section 24) */}
      <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Arquitectura de Seguridad &amp; Contención Local
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Windows Local-Only</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500">Bind de red permitido:</label>
            <div className="font-mono text-emerald-400 mt-0.5 font-bold">127.0.0.1 (Loopback únicamente)</div>
          </div>
          <div>
            <label className="text-slate-500">Bóveda de credenciales:</label>
            <div className="text-slate-200 mt-0.5">Windows Credential Manager / Keyring</div>
          </div>
          <div>
            <label className="text-slate-500">Base de datos persistente:</label>
            <div className="font-mono text-slate-300 mt-0.5">SQLite local (Migración 0011 completada)</div>
          </div>
          <div>
            <label className="text-slate-500">Protección de formularios:</label>
            <div className="text-slate-300 mt-0.5">CSRF + Origin/Host verification + PRG pattern</div>
          </div>
        </div>
      </div>
    </div>
  );
};
