import React from "react";
import {
    FaTruck,
    FaShieldAlt,
    FaUndo,
    FaHeadphones,
} from "react-icons/fa";
import FeaturesCard from "./FeaturesCard";

const features = [
    {
        icon: FaTruck,
        title: "Free Shipping",
        description: "On orders over 500 EGP",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-500",
    },
    {
        icon: FaShieldAlt,
        title: "Secure Payment",
        description: "100% secure transactions",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-500",
    },
    {
        icon: FaUndo,
        title: "Easy Returns",
        description: "14-day return policy",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
    },
    {
        icon: FaHeadphones,
        title: "24/7 Support",
        description: "Dedicated support team",
        iconBg: "bg-purple-50",
        iconColor: "text-purple-500",
    },
];

export default function Features() {
    return (
        <div className="px-8 grid w-full grid-cols-1 items-center gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
                <FeaturesCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    iconBg={feature.iconBg}
                    iconColor={feature.iconColor}
                />
            ))}
        </div>
    );
}