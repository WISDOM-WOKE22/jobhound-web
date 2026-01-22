'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { applicationAnalyticsTypes } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

export function StatsChart({
  chartData,
}: {
  chartData: applicationAnalyticsTypes[] | undefined;
}) {
  const chartColor = 'oklch(0.646 0.222 41.116)';

  // Process chart data - add a start point if only 1 data point exists
  const processedChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    // If only 1 data point, add a "Previous" point at 0 to create a line
    if (chartData.length === 1) {
      return [
        { month: 'Previous', totalApplications: 0 },
        ...chartData,
      ];
    }

    return chartData;
  }, [chartData]);

  const chartConfig = {
    totalApplications: {
      label: 'Total Applications',
      color: chartColor,
    },
  } satisfies ChartConfig;

  // Calculate statistics from original data
  const stats = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { totalApplications: 0, trend: 0, isPositive: true };
    }

    const totalApplications = chartData.reduce(
      (sum, entry) => sum + (entry.totalApplications || 0),
      0
    );

    // Calculate trend
    if (chartData.length < 2) {
      return { totalApplications, trend: 0, isPositive: true };
    }

    const lastMonth = chartData[chartData.length - 1]?.totalApplications || 0;
    const prevMonth = chartData[chartData.length - 2]?.totalApplications || 0;
    
    const trend = prevMonth > 0 
      ? ((lastMonth - prevMonth) / prevMonth) * 100 
      : lastMonth > 0 ? 100 : 0;

    return {
      totalApplications,
      trend: Math.abs(trend),
      isPositive: trend >= 0,
    };
  }, [chartData]);

  // Format month for display
  const formatMonth = (month: string) => {
    if (typeof month === 'string') {
      // Handle various formats
      if (month.length > 3) return month.slice(0, 3);
      return month;
    }
    return month;
  };

  // Handle undefined or empty chartData
  if (!processedChartData || processedChartData.length === 0) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Application Activity</CardTitle>
          <CardDescription>Job application trends over time</CardDescription>
        </CardHeader>
        <CardContent className='h-[400px] p-6'>
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Application Activity</CardTitle>
        <CardDescription>
          Total applications submitted over time
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[450px] p-6'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={processedChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id='fillTotalApplications'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor={chartColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset='95%'
                    stopColor={chartColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={32}
                tickFormatter={formatMonth}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                style={{ fontSize: '12px' }}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string) => `Month: ${value}`}
                    indicator='dot'
                  />
                }
              />
              <Area
                dataKey='totalApplications'
                type='natural'
                fill='url(#fillTotalApplications)'
                stroke={chartColor}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, stroke: chartColor, strokeWidth: 2, fill: chartColor }}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          {stats.isPositive ? (
            <>
              Trending up by {stats.trend.toFixed(1)}% this period{' '}
              <TrendingUp className='h-4 w-4 text-green-500' />
            </>
          ) : (
            <>
              Trending down by {stats.trend.toFixed(1)}% this period{' '}
              <TrendingDown className='h-4 w-4 text-red-500' />
            </>
          )}
        </div>
        <div className='leading-none text-muted-foreground'>
          Total: {stats.totalApplications.toLocaleString()} applications
          {chartData && chartData.length > 0 && ` over ${chartData.length} month${chartData.length !== 1 ? 's' : ''}`}
        </div>
      </CardFooter>
    </Card>
  );
}
