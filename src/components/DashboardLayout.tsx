import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar.tsx';
import { Menu, Dumbbell } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div
            className="min-h-screen text-slate-200 flex flex-col lg:flex-row"
            style={{
                background: 'radial-gradient(ellipse 80% 60% at 80% 0%, rgba(139,92,246,0.07) 0%, transparent 60%), #0F172A',
            }}
        >
            <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                    >
                        <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold tracking-tight">GymSystem</span>
                </div>

                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-400 hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 lg:ml-64 p-4 lg:p-8 min-h-screen w-full relative z-0">
                <Outlet />
            </main>
        </div>
    );
};