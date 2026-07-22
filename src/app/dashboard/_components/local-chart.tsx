import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LocalChart() {
  const data = [
    { day: "Lun", hours: 4 },
    { day: "Mar", hours: 6 },
    { day: "Mer", hours: 8 },
    { day: "Jeu", hours: 5 },
    { day: "Ven", hours: 7 },
    { day: "Sam", hours: 3 },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Heures Bénévoles – Semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4 h-48 pt-6">
          {data.map((item) => (
            <div key={item.day} className="flex flex-col items-center flex-1 gap-2">
              <div
                style={{ height: `${item.hours * 18}px` }}
                className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-t transition-all"
              />
              <span className="text-xs text-slate-400 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
