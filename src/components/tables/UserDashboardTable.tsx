"use client";

import { Checkin, Tags } from "@prisma/client";
import React from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DeleteIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { deleteCheckin } from "@/serverActions/checkins";
import { format } from "date-fns";

type CheckinWithTags = Checkin & { tags: Tags[] };
type CheckinTableProps = {
  data: CheckinWithTags[];
};

export default function UserDashboardTable(props: CheckinTableProps) {
  const { data } = props;
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedCheckin, setSelectedCheckin] =
    React.useState<CheckinWithTags | null>(null);

  const checkInColumnDefinition: ColumnDef<CheckinWithTags>[] = [
    {
      header: "Duration",
      cell: ({ cell }) => {
        const checkin = cell.row.original;
        const { timeSpent, timeUnit } = checkin;
        const formattedTimeUnit = timeUnit.toLowerCase();

        return `${timeSpent} ${
          timeSpent > 1 ? `${formattedTimeUnit}s` : formattedTimeUnit
        }`;
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ cell }) => {
        const checkin = cell.row.original;

        return (
          <ul className="flex flex-wrap gap-2">
            {checkin.tags.map((tag) => (
              <li key={tag.id}>
                <Badge variant="secondary" key={tag.id}>
                  {tag.name}
                </Badge>
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ cell }) => {
        const checkin = cell.row.original;
        const { createdAt } = checkin;

        return <span>{format(createdAt, "yyyy-MM-dd")}</span>;
      },
    },
    {
      accessorKey: "activity",
      header: "Activity",
    },
    {
      header: "Actions",
      cell: ({ cell }) => {
        const checkin = cell.row.original;

        return (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsDialogOpen(true);
              setSelectedCheckin(checkin);
            }}
          >
            <DeleteIcon className="text-red-400" />
          </Button>
        );
      },
    },
  ];

  const handleDeleteCheckin = async () => {
    if (!selectedCheckin) {
      return;
    }

    const response = await deleteCheckin(selectedCheckin.id);

    setIsDialogOpen(false);
    setSelectedCheckin(null);

    toast.success("Check-in deleted successfully");
  };

  return (
    <>
      <DataTable data={data} columns={checkInColumnDefinition} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this check-in?
            </DialogTitle>
          </DialogHeader>
          <p>This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteCheckin}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
