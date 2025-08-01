import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import React from "react";

interface DishCardProps {
  name: string;
  description: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const DishCard: React.FC<DishCardProps> = ({ name, description, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="h-full w-full flex flex-col justify-between shadow-xl bg-blue-50  border-2 border-blue-300 rounded-2xl transition-transform hover:scale-[1.02] hover:shadow-blue-200 cursor-pointer"
    >
      <CardContent className="px-6 py-2 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
            {name}
          </h2>
          <Badge variant="outline" className="text-blue-700 border-blue-400">
            <Sparkles className="w-5 h-5 text-blue-500" />
            New Recipe
          </Badge>
        </div>
        <p className="text-blue-900 text-sm leading-relaxed line-clamp-4">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default DishCard;
