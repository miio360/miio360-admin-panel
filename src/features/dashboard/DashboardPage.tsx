import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import { Avatar, AvatarFallback } from "../../shared/components/ui/avatar";
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardPage = () => {
  const chartData = [
    { name: 'Sep 07', order: 5000, income: 4000 },
    { name: 'Sep 08', order: 7500, income: 5500 },
    { name: 'Sep 09', order: 5500, income: 4500 },
    { name: 'Sep 10', order: 4500, income: 3500 },
    { name: 'Sep 11', order: 6000, income: 5000 },
    { name: 'Sep 12', order: 7000, income: 6500 },
    { name: 'Sep 13', order: 6500, income: 6000 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">¡Bienvenido de Vuelta!</h1>
          <p className="text-sm text-muted-foreground">Aquí está lo que está pasando con tu tienda hoy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Año Anterior</Button>
          <Button variant="outline" size="sm">Ver Todo el Tiempo</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Ingresos Ecommerce */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Ingresos Ecommerce</p>
            <p className="text-3xl font-bold text-foreground mb-2">$245,450</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-600">
                <ArrowUp className="w-3 h-3 mr-1" />
                16.9%
              </span>
              <span className="text-muted-foreground">(+$21.5k)</span>
            </div>
          </CardContent>
        </Card>

        {/* Nuevos Clientes */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Nuevos Clientes</p>
            <p className="text-3xl font-bold text-foreground mb-2">684</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-red-600">
                <ArrowDown className="w-3 h-3 mr-1" />
                58.5%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tasa de Recompra */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Tasa de Recompra</p>
            <p className="text-3xl font-bold text-foreground mb-2">75.12 %</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-600">
                <ArrowUp className="w-3 h-3 mr-1" />
                25.5%
              </span>
              <span className="text-muted-foreground">(+20.1%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Valor Promedio de Orden */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Valor Promedio de Orden</p>
            <p className="text-3xl font-bold text-foreground mb-2">$2,412.23</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-green-600">
                <ArrowUp className="w-3 h-3 mr-1" />
                35.3%
              </span>
              <span className="text-muted-foreground">(+ $754)</span>
            </div>
          </CardContent>
        </Card>

        {/* Tasa de Conversión */}
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Tasa de Conversión</p>
            <p className="text-3xl font-bold text-foreground mb-2">32.65 %</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-red-600">
                <ArrowDown className="w-3 h-3 mr-1" />
                13.62%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Resumen - Takes 2 columns */}
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

        {/* Productos Más Vendidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Productos Más Vendidos</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sticker Vento", id: "ID: 26d380", sales: "128 Ventas", color: "bg-blue-100" },
                { name: "Mochila Azul", id: "ID: 130338", sales: "601 Ventas", color: "bg-blue-200" },
                { name: "Botella de Agua", id: "ID: 8641573", sales: "1K+ Ventas", color: "bg-orange-100" },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${product.color} flex items-center justify-center`}>
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.id}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{product.sales}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Órdenes Recientes - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Órdenes Recientes</CardTitle>
            <Button variant="link" className="text-primary text-sm">Ver Todo</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left py-3 font-medium">Producto</th>
                    <th className="text-left py-3 font-medium">Cliente</th>
                    <th className="text-left py-3 font-medium">ID Orden</th>
                    <th className="text-left py-3 font-medium">Fecha</th>
                    <th className="text-left py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { product: "Botella de Agua", customer: "Peterson Jack", id: "#8641573", date: "27 Jun 2025", status: "Pendiente", statusColor: "bg-yellow-100 text-yellow-700" },
                    { product: "iPhone 15 Pro", customer: "Michal Datta", id: "#2457841", date: "26 Jun 2025", status: "Cancelado", statusColor: "bg-red-100 text-red-700" },
                    { product: "Audífonos", customer: "Jeslyn Rose", id: "#1026784", date: "20 Jun 2025", status: "Enviado", statusColor: "bg-green-100 text-green-700" },
                  ].map((order, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-200"></div>
                          <span className="text-sm">{order.product}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-primary">{order.customer}</td>
                      <td className="py-4 text-sm">{order.id}</td>
                      <td className="py-4 text-sm text-muted-foreground">{order.date}</td>
                      <td className="py-4">
                        <Badge className={`${order.statusColor} border-0`}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mejores Clientes de la Semana */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Mejores Clientes de la Semana</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Marks Howerson", orders: "25 Órdenes" },
                { name: "Marks Howerson", orders: "15 Órdenes" },
                { name: "Jhony Peters", orders: "23 Órdenes" },
              ].map((customer, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.orders}</p>
                    </div>
                  </div>
                  <Button variant="link" size="sm" className="text-primary">Ver</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
