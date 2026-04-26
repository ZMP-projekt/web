import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar.tsx';

export const DashboardLayout: React.FC = () => {
    return (
        <div
            className="min-h-screen text-slate-200 flex"
            style={{
                background: 'radial-gradient(ellipse 80% 60% at 80% 0%, rgba(139,92,246,0.07) 0%, transparent 60%), #0F172A',
            }}
        >
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen w-full">
                <Outlet />
            </main>
        </div>
    );
};