
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ArrowRight, Target, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Sample data that matches the image
const salesData = 118594;
const salesComparison = -10;
const volumeData = 257361;
const volumeComparison = 54;
const profitData = 96715.28;
const profitComparison = 54;

// Faturamento data from the removed section
const totalRevenue = 78500;
const revenueComparison = 22;
const productRevenue = 42200;
const productComparison = 18;
const serviceRevenue = 36300;
const serviceComparison = 26;
const ticketAverage = 265;
const ticketComparison = 8;

const chartData = [
  { name: 'Jan', value: 18000 },
  { name: 'Mar', value: 22000 },
  { name: 'May', value: 35000 },
  { name: 'Jul', value: 28000 },
  { name: 'Sep', value: 24318 },
  { name: 'Nov', value: 19000 },
  { name: 'Dec', value: 21000 },
];

const pieData = [
  { name: 'Electronics', value: 37715, color: '#8B5CF6' },
  { name: 'Furniture', value: 29153, color: '#FCD34D' },
  { name: 'Clothes', value: 11682, color: '#FB7185' },
  { name: 'Shoes', value: 35715, color: '#A78BFA' },
];

const COLORS = ['#8B5CF6', '#FCD34D', '#FB7185', '#A78BFA'];

export const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-6">
      {/* Faturamento Total */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Faturamento Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="text-xs bg-success text-success-foreground">
              +{revenueComparison}% ↑
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Faturamento em Produtos */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Faturamento em Produtos
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {productRevenue.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="text-xs bg-success text-success-foreground">
              +{productComparison}% ↑
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Faturamento em Serviços */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Faturamento em Serviços
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {serviceRevenue.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="text-xs bg-success text-success-foreground">
              +{serviceComparison}% ↑
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Médio */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ticket Médio
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {ticketAverage.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="text-xs bg-success text-success-foreground">
              +{ticketComparison}% ↑
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Products Sales Card */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Products Sales
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{salesData.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="destructive" className="text-xs">
              {salesComparison}% ↓
            </Badge>
          </div>
          <Button variant="ghost" className="w-full mt-4 justify-between text-muted-foreground hover:text-foreground">
            View Sales Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Total Volume Of Products Card */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Volume Of Products
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{volumeData.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="text-xs bg-success text-success-foreground">
              +{volumeComparison}% ↑
            </Badge>
          </div>
          <Button variant="ghost" className="w-full mt-4 justify-between text-muted-foreground hover:text-foreground">
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Total Profit Overview Card */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Profit Overview
          </CardTitle>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${profitData.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="text-xs bg-success text-success-foreground">
              +{profitComparison}% ↑
            </Badge>
          </div>
          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--chart-orange))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
            Total Revenue
            <div className="w-2 h-2 bg-chart-orange rounded-full ml-4 mr-2"></div>
            Total Profit
          </div>
        </CardContent>
      </Card>

      {/* Total Sales Statistics Card */}
      <Card className="rounded-xl shadow-md col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Sales Statistics
          </CardTitle>
          <select className="text-xs border rounded px-2 py-1 text-muted-foreground">
            <option>Monthly</option>
          </select>
        </CardHeader>
        <CardContent>
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Number of Sales</span>
              <span className="text-lg font-bold">$37,715</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Weekly Visits</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">96,715.28</span>
                <Badge className="text-xs bg-success text-success-foreground">
                  +54% ↑
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
