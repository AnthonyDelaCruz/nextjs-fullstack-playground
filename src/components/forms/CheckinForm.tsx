"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tags, TimeUnit } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";
import MultiSelectInput from "../MultiSelectInput";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { createCheckin } from "@/serverActions/checkins";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const checkinFormSchema = z.object({
  timeSpent: z.number().min(1, { message: "Time spent is required" }),
  timeUnit: z.enum([TimeUnit.MINUTE, TimeUnit.HOUR]),
  activity: z
    .string({ required_error: "Activity is required" })
    /**
     * Need to explicitly set length validation here
     * because zod accepts empty strings.
     * Check https://github.com/colinhacks/zod/issues/2466
     */
    .min(1, { message: "Activity is required" }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
});

const TIME_UNIT_OPTIONS = [
  { label: TimeUnit.HOUR, value: TimeUnit.HOUR },
  { label: TimeUnit.MINUTE, value: TimeUnit.MINUTE },
];

type CheckinFormProps = {
  tags: Tags[];
};

export default function CheckinForm(props: CheckinFormProps) {
  const { tags } = props;
  const tagOptions = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof checkinFormSchema>>({
    defaultValues: {
      timeSpent: 1,
      timeUnit: TimeUnit.HOUR,
      activity: "",
      tags: [],
    },
    resolver: zodResolver(checkinFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof checkinFormSchema>) => {
    const result = await createCheckin(data);

    setIsDialogOpen(false);

    toast.success("Check-in created!");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-1" />{" "}
          <span className="hidden md:block">Add Check-In</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What did you do today?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <div className="grid grid-cols-2 gap-x-4">
              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) => {
                          field.onChange(+event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeUnit"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-between">
                    <FormLabel>Time Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={TimeUnit.HOUR}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TimeUnit.HOUR}>Hours</SelectItem>
                        <SelectItem value={TimeUnit.MINUTE}>Minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className="flex justify-between w-full"
                          variant="outline"
                          role="combobox"
                        >
                          <span>
                            {field.value.length
                              ? tags.find((tag) => tag.id === field.value[0])
                                  ?.name
                              : "Select a tag"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder="Select a tag" />
                        <CommandEmpty>No tag selected</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {tagOptions.map((option) => (
                              <CommandItem
                                className="flex justify-between gap-2"
                                onSelect={() => {
                                  form.setValue("tags", [option.value]);
                                }}
                                value={option.label}
                                key={option.value}
                              >
                                {option.label}{" "}
                                {option.value === field.value[0] && (
                                  <CheckIcon className="ml-2 h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {/* This was the initial multiselect input idea where
                  a user can select multiple tags for a single check-in,
                  decided to opt for single tag selection instead, because
                  I found it confusing how to divide the duration of the check-in
                  activity across multiple tags.

                  Comment it out if you want to see what it looks like.
                  This comes with a downside of messing up the tab indexes
                  when you are using the keyboard to navigate through the form.
                  I have not found a workaround it yet.
                   */}
                  {/* <MultiSelectInput
                      options={tagOptions}
                      onChange={(tags) => {
                        form.setValue("tags", tags);
                        form.clearErrors("tags");
                      }}
                    /> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Check-In</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
