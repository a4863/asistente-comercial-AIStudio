/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Shell } from './components/layout/Shell';
import { DashboardView } from './components/dashboard/DashboardView';
import { EmailView } from './components/email/EmailView';
import { AnalysisView } from './components/analysis/AnalysisView';
import { TasksView } from './components/tasks/TasksView';
import { NextStepsView } from './components/nextsteps/NextStepsView';
import { CalendarView } from './components/calendar/CalendarView';
import { DraftsView } from './components/drafts/DraftsView';
import { NotesView } from './components/notes/NotesView';
import { WhatsAppView } from './components/whatsapp/WhatsAppView';
import { CrmView } from './components/crm/CrmView';
import { AuditView } from './components/audit/AuditView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { currentSection } = useApp();

  switch (currentSection) {
    case 'inicio':
      return <DashboardView />;
    case 'correo':
      return <EmailView />;
    case 'analisis':
      return <AnalysisView />;
    case 'tareas':
      return <TasksView />;
    case 'siguientes-pasos':
      return <NextStepsView />;
    case 'calendario':
      return <CalendarView />;
    case 'borradores':
      return <DraftsView />;
    case 'notas':
      return <NotesView />;
    case 'whatsapp':
      return <WhatsAppView />;
    case 'crm':
      return <CrmView />;
    case 'auditoria':
      return <AuditView />;
    case 'configuracion':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <MainContent />
      </Shell>
    </AppProvider>
  );
}
