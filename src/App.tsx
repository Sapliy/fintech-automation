import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import FlowBuilder from './pages/FlowBuilder';
import EventTimeline from './pages/EventTimeline';
import Transactions from './pages/Transactions';
import AuditLogs from './pages/AuditLogs';

import FlowTemplates from './pages/FlowTemplates';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<FlowBuilder />} />
          <Route path="/templates" element={<FlowTemplates />} />
          <Route path="/timeline" element={<EventTimeline />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/audit" element={<AuditLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
