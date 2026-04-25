import React from "react";

export const SkeletonCard: React.FC = () => (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 animate-pulse">
        <div className="flex gap-5 items-start">
            <div className="w-14 h-14 rounded-2xl bg-slate-700/60 shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-700/60 rounded-lg w-1/3" />
                <div className="h-6 bg-slate-700/60 rounded-lg w-1/2" />
                <div className="flex gap-4">
                    <div className="h-3 bg-slate-700/40 rounded w-24" />
                    <div className="h-3 bg-slate-700/40 rounded w-32" />
                    <div className="h-3 bg-slate-700/40 rounded w-20" />
                </div>
            </div>
            <div className="w-28 h-10 bg-slate-700/60 rounded-xl shrink-0" />
        </div>
    </div>
);