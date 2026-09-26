import React from "react";
import type { IconType } from "react-icons";

type FeaturesCardProps = {
    icon: IconType;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
};

export default function FeaturesCard({
    icon: Icon,
    title,
    description,
    iconBg,
    iconColor,
}: FeaturesCardProps) {
    return (
        <div className="flex h-20 w-full items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg} `}
            >
                <Icon className={`text-xl ${iconColor} `} />
            </div>

            <div>
                <h3 className="font-semibold text-gray-900">
                    {title}
                </h3>

                <p className="text-[0.75rem] text-gray-500">
                    {description}
                </p>
            </div>
        </div>
    );
}
