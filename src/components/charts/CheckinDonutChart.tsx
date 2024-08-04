"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

type CheckinWithTags = Checkin & { tags: Tags[] };
type CheckinDonutChartProps = {
  checkins: CheckinWithTags[];
  tags: Tags[];
  headerTitle: string;
  headerDescription: string;
};

export default function CheckinDonutChart(props: CheckinDonutChartProps) {
  const { checkins, tags, headerTitle, headerDescription } = props;

  const collateCheckInDataByTag = checkins.reduce(
    (
      result: Record<string, { totalTags: number; tag: string; fill: string }>,
      checkIn
    ) => {
      const tagName = checkIn.tags[0].name;
      const formattedTagName = tagName.toLowerCase().replaceAll(" ", "_");

      if (result[formattedTagName]) {
        return {
          ...result,
          [formattedTagName]: {
            ...result[formattedTagName],
            totalTags: result[formattedTagName].totalTags + 1,
          },
        };
      }

      result[formattedTagName] = {
        totalTags: 1,
        tag: tagName,
        fill: `var(--color-${formattedTagName})`,
      };

      return result;
    },
    {} satisfies ChartConfig
  );

  const checkInChartData = Object.values(collateCheckInDataByTag).map(
    (item) => {
      return {
        tag: item.tag,
        totalTags: item.totalTags,
        fill: item.fill,
      };
    }
  );

  const checkinChartConfig = tags.reduce((acc, tag, index) => {
    return {
      ...acc,
      [tag.name.toLowerCase().replaceAll(" ", "_")]: {
        label: tag.name,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    };
  }, {} satisfies ChartConfig);

  const mostWorkedOnTag = Object.values(collateCheckInDataByTag).sort(
    (a, b) => b.totalTags - a.totalTags
  )[0];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={checkinChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={checkInChartData}
              dataKey="totalTags"
              nameKey="tag"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {checkins.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total check-ins
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {checkins.length > 0 ? (
          <>
            <div className="flex items-center gap-2 font-medium leading-none">
              You did a lot of {mostWorkedOnTag.tag} today!
            </div>
            <div className="leading-none text-muted-foreground">
              with a total of {mostWorkedOnTag.totalTags} check-ins
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 font-medium leading-none">
              No check-ins yet today
            </div>
            <div className="leading-none text-muted-foreground">
              Create one now!
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
