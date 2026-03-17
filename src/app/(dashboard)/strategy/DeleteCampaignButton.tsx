"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteCampaignButton({ planId }: { planId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the link
        e.stopPropagation(); // Prevent bubbling up to the Link component
        
        if (!confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/agents/strategy/${planId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            
            if (data.success) {
                router.refresh(); // Refresh the page to remove the deleted item
            } else {
                alert("Failed to delete campaign: " + data.error);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the campaign.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 flex-shrink-0"
            title="Delete Campaign"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
