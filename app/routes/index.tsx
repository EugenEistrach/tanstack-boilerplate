import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Button } from "@/app/components/ui/button";
import { db } from "../db";
import { note } from "../db/schema";

import { z } from "zod";
import { actionClient } from "@/app/functions";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";

const getNotes = createServerFn("GET", () => {
  console.log("getNotes");
  return db.query.note.findMany();
});

const noteSchema = z.object({
  content: z.string().min(1),
});

const createNote = createServerFn(
  "POST",
  actionClient
    .input(noteSchema)
    .handler(async ({ parsedInput: { content } }) => {
      return db.insert(note).values({ content }).returning();
    })
);

const notesQueryOptions = () =>
  queryOptions({
    queryKey: ["notes"],
    queryFn: () => getNotes(),
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(notesQueryOptions()),
});

function Home() {
  const queryClient = useQueryClient();
  const { data: notes } = useSuspenseQuery(notesQueryOptions());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      reset();
    },
  });

  const onSubmit = (data: z.infer<typeof noteSchema>) => {
    createNoteMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="flex gap-2">
          <Input
            {...register("content")}
            placeholder="Enter note content"
            className="flex-grow"
          />
          <Button type="submit">Submit</Button>
        </div>
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <p>{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
