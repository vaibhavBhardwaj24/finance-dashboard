import dayjs from "dayjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF69B4",
  "#6A4C93",
];

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  timestamp: Date;
  type: string;
}

const chartConfig: ChartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
};

const Dashboard = ({ data }: { data: Transaction[] | undefined }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  const types = [
    "Housing",
    "Food",
    "Transport",
    "Health",
    "Entertainment",
    "Savings",
    "Miscellaneous",
  ];
  const formattedData = data
    .map((transaction) => ({
      ...transaction,
      timestamp: dayjs(transaction.timestamp).format("MMM DD, HH:mm"),
      amount: Math.abs(transaction.amount),
    }))
    .sort(
      (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
    );
  // let total = 0;
  const typeData: Record<string, number> = {};

  types.forEach((type) => {
    typeData[type] = 0;

    data.forEach((transaction) => {
      if (transaction.type === type) {
        typeData[type] += Math.abs(transaction.amount);
      }
      // total += Math.abs(transaction.amount);
    });
  });
  const chartData = Object.keys(typeData).map((key) => ({
    name: key,
    value: typeData[key],
  }));
  const insights = getInsights(data, types);
  return (
    <div className="flex md:flex-row flex-col gap-5  p-4">
      <div className="flex flex-col md:w-1/2 gap-5">
        <Card className="  bg-white/5">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}`}
                    className=""
                    // tickFormatter={(value) => dayjs(value).format("MMM DD")}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Bar
                    dataKey="amount"
                    fill="var(--color-amount)"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as Transaction;
                        return (
                          <div className="bg-background border border-border p-2 rounded-md shadow-md">
                            <p className="font-semibold">
                              {String(data.timestamp)}
                            </p>
                            <p>{data.description}</p>
                            <p className="text-primary">
                              ₹{data.amount.toFixed(2)} ({data.type})
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex md:flex-row flex-col-reverse bg-white/5 p-4 gap-6">
          {/* Insights Section */}
          {insights && (
            <Card className="p-4 flex-1">
              <h2 className="text-xl font-bold mb-2">Transaction Insights</h2>
              <ul className="space-y-1 text-sm">
                <li>Total Transactions: {insights.totalTransactions}</li>
                <li>Total Amount: ₹{insights.totalAmount}</li>
                <li>Most Frequent Type: {insights.mostFrequentType}</li>
                <li>Most Spent On: {insights.mostSpentType}</li>
                <li>
                  Avg Transaction Value: ₹{insights.averageTransactionValue}
                </li>
              </ul>
            </Card>
          )}
          {chartData && chartData.length > 0 && (
            <div className="flex justify-center items-center">
              <PieChart width={380} height={250}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          )}
        </Card>
      </div>
      <div className="md:w-1/2 grid grid-cols-2 gap-5 overflow-auto md:max-h-[90vh]">
        {types.map((type, i) => {
          const filteredData = data
            .filter((dat) => dat.type === type)
            .map((transaction) => {
              return {
                name: dayjs(transaction.timestamp).format("MMM DD"),
                value: Math.abs(transaction.amount),
              };
            });

          if (filteredData.length === 0) return null;

          const totalAmount = filteredData.reduce((sum, t) => sum + t.value, 0);

          return (
            <Card
              key={i}
              className="bg-white/10 p-4 flex justify-center flex-col items-center shadow-lg"
            >
              <PieChart
                width={250}
                height={250}
                className="scale-75 md:scale-100"
              >
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // Makes it a donut chart
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {filteredData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xl font-bold"
                  fill="#fff"
                >
                  ₹{totalAmount}
                </text>

                <Tooltip />
              </PieChart>

              <h3 className="text-lg font-bold text-center mt-2">{type}</h3>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
const getInsights = (data: Transaction[], types: string[]) => {
  if (data.length === 0) return null;

  const totalTransactions = data.length;
  let totalAmount = 0;
  const typeCounts: Record<string, number> = {};
  const typeSums: Record<string, number> = {};

  types.forEach((type) => {
    typeCounts[type] = 0;
    typeSums[type] = 0;
  });

  data.forEach((transaction) => {
    totalAmount += Math.abs(transaction.amount);

    if (typeCounts[transaction.type] !== undefined) {
      typeCounts[transaction.type]++;
      typeSums[transaction.type] += Math.abs(transaction.amount);
    }
  });

  const mostFrequentType = Object.keys(typeCounts).reduce((a, b) =>
    typeCounts[a] > typeCounts[b] ? a : b
  );

  const mostSpentType = Object.keys(typeSums).reduce((a, b) =>
    typeSums[a] > typeSums[b] ? a : b
  );

  return {
    totalTransactions,
    totalAmount,
    mostFrequentType,
    mostSpentType,
    averageTransactionValue: (totalAmount / totalTransactions).toFixed(2),
  };
};
export default Dashboard;
