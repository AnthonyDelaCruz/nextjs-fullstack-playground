"use client";

import { Checkin, Tags, User } from "@prisma/client";
import React from "react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
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

type CheckinWithTags = Checkin & { tags: Tags[]; user: Pick<User, "username"> };
type CheckinTableProps = {
  data: CheckinWithTags[];
};

export default function AdminDashboardTable(props: CheckinTableProps) {
  const { data } = props;
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedCheckin, setSelectedCheckin] =
    React.useState<CheckinWithTags | null>(null);

  const checkInColumnDefinition: ColumnDef<CheckinWithTags>[] = [
    {
      header: "User",
      cell: ({ cell }) => {
        const checkin = cell.row.original;
        const { user } = checkin;

        return <span>{user.username}</span>;
      },
    },
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
  ];

  const handleDeleteCheckin = async () => {
    if (!selectedCheckin) {
      return;
    }

    const response = await deleteCheckin(selectedCheckin.id);

    if (response?.error) {
      return toast.error(response.error);
    }

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
