import React from 'react';
import {
  Home,
  Mail,
  BrainCircuit,
  CheckSquare,
  ArrowRightCircle,
  Calendar,
  FileEdit,
  FileText,
  MessageSquare,
  Database,
  ShieldCheck,
  Settings,
  RefreshCw,
  Lock,
  AlertTriangle,
  Server,
  Layers,
} from 'lucide-react';
import { useApp, NavigationSection } from '../../context/AppContext';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentSection,
    setCurrentSection,
    syncImap,
    isSyncingImap,
    emails,
    tasks,
    nextSteps,
    calendarActions,
    draftActions,
    resetToDefaultData,
  } = useApp();

  // Metrics for side badges (clean text numbers)
  const pendingEmailsToAnalyze = emails.filter((e) => e.analysis_state === 'pending').length;
  const pendingTasksToReview = tasks.filter((t) => t.review_state === 'not_reviewed').length;
  const pendingNextStepsToReview = nextSteps.filter((ns) => ns.review_state === 'not_reviewed').length;
  const preparedCalendar = calendarActions.filter((c) => c.state === 'prepared').length;
  const draftActionsApproved = draftActions.filter((d) => d.state === 'approved').length;
  const uncertainDrafts = draftActions.filter((d) => d.state === 'uncertain').length;

  const navItems: { id: NavigationSection; label: string; icon: React.ReactNode; badgeCount?: number; badgeColor?: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
    {
      id: 'correo',
      label: 'Correo',
      icon: <Mail className="w-4 h-4" />,
      badgeCount: pendingEmailsToAnalyze > 0 ? pendingEmailsToAnalyze : undefined,
      badgeColor: 'text-amber-400 bg-amber-950/60 border border-amber-800/40',
    },
    { id: 'analisis', label: 'Análisis IA', icon: <BrainCircuit className="w-4 h-4" /> },
    {
      id: 'tareas',
      label: 'Tareas',
      icon: <CheckSquare className="w-4 h-4" />,
      badgeCount: pendingTasksToReview > 0 ? pendingTasksToReview : undefined,
      badgeColor: 'text-amber-400 bg-amber-950/60 border border-amber-800/40',
    },
    {
      id: 'siguientes-pasos',
      label: 'Siguientes pasos',
      icon: <ArrowRightCircle className="w-4 h-4" />,
      badgeCount: pendingNextStepsToReview > 0 ? pendingNextStepsToReview : undefined,
      badgeColor: 'text-blue-400 bg-blue-950/60 border border-blue-800/40',
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: <Calendar className="w-4 h-4" />,
      badgeCount: preparedCalendar > 0 ? preparedCalendar : undefined,
      badgeColor: 'text-amber-400 bg-amber-950/60 border border-amber-800/40',
    },
    {
      id: 'borradores',
      label: 'Borradores',
      icon: <FileEdit className="w-4 h-4" />,
      badgeCount: draftActionsApproved + uncertainDrafts > 0 ? draftActionsApproved + uncertainDrafts : undefined,
      badgeColor: uncertainDrafts > 0 ? 'text-rose-400 bg-rose-950/60 border border-rose-800/40' : 'text-blue-400 bg-blue-950/60 border border-blue-800/40',
    },
    { id: 'notas', label: 'Notas comerciales', icon: <FileText className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'crm', label: 'CRM ACLIMAR', icon: <Database className="w-4 h-4" /> },
    { id: 'auditoria', label: 'Auditoría', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 flex flex-col border-r border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        {/* Brand identity */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
              AC
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                ACLIMAR Assistant
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>127.0.0.1:8000</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">FastAPI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge / local single user callout */}
        <div className="px-3 pt-3 pb-1">
          <div className="px-2.5 py-1.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Keyring Local Activo</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">Cero SMTP</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors text-left ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border-l-2 border-amber-500 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`ml-2 px-1.5 py-0.2 font-mono text-[10px] rounded tabular-nums shrink-0 ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Delegate Card & Reset */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
          <div className="flex items-center gap-2.5 p-1.5 rounded bg-slate-950/40 border border-slate-800/50">
            <img
              src="/src/assets/images/avatar_alex_comercial_1791309510702.jpg"
              alt="Alejandro López"
              className="w-8 h-8 rounded object-cover border border-slate-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-200 truncate">Alejandro López</div>
              <div className="text-[10px] text-slate-400 truncate">Delegado Comercial Levante</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>ACLIMAR v1.2 (0011)</span>
            <button
              onClick={resetToDefaultData}
              title="Restablecer datos demo del Master File"
              className="hover:text-amber-400 transition-colors underline cursor-pointer"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* TOP BAR CONTRACT: Zone 1 (Brand) - Zone 2 (Breadcrumbs) - Zone 3 (Actions) */}
        <header className="h-14 border-b border-slate-800/80 bg-slate-900/70 px-6 flex items-center justify-between shrink-0">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm tracking-tight text-white font-sans">
              ACLIMAR Commercial Cockpit
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-medium text-slate-400 capitalize">
              {navItems.find((n) => n.id === currentSection)?.label || currentSection}
            </span>
          </div>

          {/* Zone 2: Informational context indicator */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              IMAP: <span className="font-mono text-slate-200">INBOX.Drafts.Borradores Asistente</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Agenda: <strong>Alex Google</strong></span>
            </span>
          </div>

          {/* Zone 3: Primary operational actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={syncImap}
              disabled={isSyncingImap}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              title="Sincronizar buzón IMAP con BODY.PEEK (solo lectura)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingImap ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
              <span>{isSyncingImap ? 'Sincronizando...' : 'Sincronizar IMAP'}</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Modo Supervisado: La IA propone, tú autorizas</span>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};
