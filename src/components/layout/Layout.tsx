import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ChatPanel from '../ai/ChatPanel';
import { useAppStore } from '../../store/useAppStore';

export default function Layout() {
  const isChatOpen = useAppStore((s) => s.isChatOpen);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px', backgroundColor: '#f1f5f9' }}>
          <Outlet />
        </main>
      </div>
      {isChatOpen && <ChatPanel />}
    </div>
  );
}
