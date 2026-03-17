import Link from "next/link";
import { Plus } from "lucide-react";

export default function NewCampaignButton() {
    return (
        <Link 
            href="/onboarding"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
            <Plus className="w-4 h-4" />
            New Campaign
        </Link>
    )
}
