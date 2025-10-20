"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", receivable: 45000, payable: 32000 },
  { month: "Feb", receivable: 52000, payable: 38000 },
  { month: "Mar", receivable: 48000, payable: 35000 },
  { month: "Apr", receivable: 61000, payable: 42000 },
  { month: "May", receivable: 55000, payable: 39000 },
  { month: "Jun", receivable: 67000, payable: 45000 },
]

export function CashFlowChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="receivable" fill="hsl(var(--primary))" name="Receivable" />
            <Bar dataKey="payable" fill="hsl(var(--destructive))" name="Payable" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
