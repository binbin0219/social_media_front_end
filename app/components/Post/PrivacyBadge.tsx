import {
    Globe,
    Users,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";

import { PrivacySetting } from "@/lib/models/post";

type Props = {
    privacy: PrivacySetting;
    isAuthor: boolean;
};

export default function PrivacyBadge({
    privacy,
    isAuthor,
}: Props) {
    const config: Record<
        PrivacySetting,
        {
            label: string;
            icon: any;
            className: string;
            authorOnly?: boolean;
        }
    > = {
        PUBLIC: {
            label: "Public",
            icon: Globe,
            className:
                "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
        },

        FRIENDS: {
            label: "Friends",
            icon: Users,
            className:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        },

        PRIVATE: {
            label: "Private",
            icon: Lock,
            className:
                "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
        },

        WCV: {
            label: "Selected People",
            icon: Eye,
            authorOnly: true,
            className:
                "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20",
        },

        WCNV: {
            label: "Excluded People",
            icon: EyeOff,
            authorOnly: true,
            className:
                "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20",
        },
    };

    const item = config[privacy];

    // Only hide author-only badges
    // if (item.authorOnly && !isAuthor) return null;

    const Icon = item.icon;

    return (
        <div
            className={`
                inline-flex items-center gap-1
                rounded-full px-2 py-0.5
                text-[11px] font-medium
                transition
                ${item.className}
            `}
        >
            <Icon size={12} />
            <span>{item.label}</span>
        </div>
    );
}