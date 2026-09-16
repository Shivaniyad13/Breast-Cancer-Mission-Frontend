"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  actionType: "camp" | "donate";
}

export default function ActionCard({
  title,
  description,
  buttonText,
  actionType,
}: ActionCardProps) {
  const handleClick = () => {
    switch (actionType) {
      case "camp":
        window.location.href = "mailto:breastcancermission3@gmail.com?subject=Awareness Camp Request";
        break;

      case "donate":
        window.location.href = "/donate";
        break;

      default:
        break;
    }
  };

  return (
    <Card className="border-slate-100 hover:border-pink-300 hover:shadow-md transition-all duration-300 rounded-2xl bg-white p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <h4 className="font-heading font-bold text-slate-800 text-base">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      <Button
        onClick={handleClick}
        className="bg-slate-100 hover:bg-pink-50 hover:text-primary text-slate-700 font-bold text-xs py-2 w-full rounded-xl cursor-pointer"
      >
        {buttonText}
      </Button>
    </Card>
  );
}
