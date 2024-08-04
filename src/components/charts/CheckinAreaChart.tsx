"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkin, Tags } from "@prisma/client";
import { format } from "date-fns";

type CheckinWithTags = Checkin & { tags: Tags[] };
type CheckinAreaChartProps = {
  checkins: CheckinWithTags[];
  tags: Tags[];
  headerTitle: string;
  headerDescription: string;
};

export default function CheckinAreaChart(props: CheckinAreaChartProps) {
  const { checkins, tags, headerTitle, headerDescription } = props;

  const calculateCheckTagsByMonth = checkins.reduce(
    (result: Record<string, Record<string, number>>, checkIn) => {
      const month = format(checkIn.createdAt, "LLLL");
      const tagName = checkIn.tags[0].name;
      const formattedTagName = tagName.toLowerCase().replaceAll(" ", "_");

      if (result[month]) {
        if (result[month][formattedTagName]) {
          result = {
            ...result,
            [month]: {
              ...result[month],
              [formattedTagName]: result[month][formattedTagName] + 1,
            },
          };
        } else {
          result = {
            ...result,
            [month]: {
              ...result[month],
              [formattedTagName]: 1,
            },
          };
        }

        return result;
      }

      result[month] = {
        [formattedTagName]: 1,
      };

      return result;
    },
    {} satisfies ChartConfig
  );

  const checkInChartData = Object.entries(calculateCheckTagsByMonth).map(
    ([month, tags]) => {
      return {
        month,
        ...tags,
      };
    }
  );

  const checkInAreaChartConfig = tags.reduce((acc, tag, index) => {
    const formattedTagName = tag.name.toLowerCase().replaceAll(" ", "_");

    return {
      ...acc,
      [formattedTagName]: {
        label: tag.name,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    };
  }, {} satisfies ChartConfig) as Record<
    string,
    { label: string; color: string }
  >;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={checkInAreaChartConfig}>
          <AreaChart
            accessibilityLayer
            data={checkInChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {Object.entries(checkInAreaChartConfig).map(([key, config]) => {
              return (
                <Area
                  key={config.label}
                  dataKey={key}
                  type="natural"
                  fill={config.color}
                  fillOpacity={0.4}
                  stroke={config.color}
                  stackId="a"
                />
              );
            })}
          </AreaChart>
        </ChartContainer>
        {!checkins.length && (
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              No check-ins yet
            </div>
            <div className="leading-none text-muted-foreground">
              Create one now!
            </div>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
}
