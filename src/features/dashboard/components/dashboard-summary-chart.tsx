import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Sep 07', order: 5000, income: 4000 },
  { name: 'Sep 08', order: 7500, income: 5500 },
  { name: 'Sep 09', order: 5500, income: 4500 },
  { name: 'Sep 10', order: 4500, income: 3500 },
  { name: 'Sep 11', order: 6000, income: 5000 },
  { name: 'Sep 12', order: 7000, income: 6500 },
  { name: 'Sep 13', order: 6500, income: 6000 },
];

export function DashboardSummaryChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Resumen</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-muted-foreground">Órdenes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-muted-foreground">Crecimiento de Ingresos</span>
          </div>
          <select className="text-xs border rounded px-2 py-1">
            <option>Últimos 7 días</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="order" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
