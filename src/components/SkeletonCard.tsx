import React from "react";

export const SkeletonCard: React.FC = () => (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
            <div className="flex gap-4 items-start w-full sm:w-auto sm:flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-700/60 shrink-0" />
                <div className="flex-1 space-y-3 w-full min-w-0">
                    <div className="h-4 bg-slate-700/60 rounded-lg w-1/2 sm:w-1/3" />
                    <div className="h-6 bg-slate-700/60 rounded-lg w-3/4 sm:w-1/2" />
                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
                        <div className="h-3 bg-slate-700/40 rounded w-16 sm:w-24" />
                        <div className="h-3 bg-slate-700/40 rounded w-24 sm:w-32" />
                        <div className="h-3 bg-slate-700/40 rounded w-12 sm:w-20" />
                    </div>
                </div>
            </div>
            <div className="w-full sm:w-28 h-10 bg-slate-700/60 rounded-xl shrink-0 mt-2 sm:mt-0" />
        </div>
    </div>
);