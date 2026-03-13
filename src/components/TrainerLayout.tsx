import React from 'react';
import { Outlet } from 'react-router';
import { TrainerSidebar } from './TrainerSidebar';

export const TrainerLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 bg-linear-to-tr from-slate-900 via-slate-900 to-emerald-900/10 text-slate-200 flex">
            <TrainerSidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};