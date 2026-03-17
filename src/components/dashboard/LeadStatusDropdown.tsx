"use client";

import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

const statuses = [
    { value: 'new', label: 'New Lead' },
    { value: 'contacted', label: 'Contacted (In Progress)' },
    { value: 'replied', label: 'Replied' },
    { value: 'objection', label: 'Objection Handled' },
    { value: 'call_scheduled', label: 'Call Scheduled' },
    { value: 'closed_won', label: 'Closed - Won' },
    { value: 'closed_lost', label: 'Closed - Lost' }
];

export function LeadStatusDropdown({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (newStatus === currentStatus) return;
        
        setIsLoading(true);

        try {
            const res = await fetch(`/api/leads/${leadId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");
            
            // Refresh to show updated tags and timeline states
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error updating status");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative inline-flex">
            {isLoading ? (
                <div className="bg-accent border border-border text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </div>
            ) : (
                <>
                    <select 
                        value={currentStatus}
                        onChange={handleStatusChange}
                        className="appearance-none bg-accent hover:bg-accent/80 border border-border text-white px-4 py-2 pr-10 rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                        {statuses.map(s => (
                            <option key={s.value} value={s.value} className="bg-[#1A1A1A] text-white">
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground flex items-center justify-center">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </>
            )}
        </div>
    );
}
