import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { createServerFn, useServerFn } from "@tanstack/start";
import { db } from "@/app/db";
import { roleTable, userTable, userToRoleTable } from "@/app/db/schema";
import { useMutation } from "@tanstack/react-query";
import { validationClient } from "@/app/lib/functions";
import { requireInitialAuthSession } from "@/app/auth/auth-session";
import { eq } from "drizzle-orm";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
});

const updateUser = createServerFn(
  "POST",
  validationClient
    .input(
      formSchema.extend({
        redirectTo: z.string().optional(),
      })
    )
    .handler(async ({ parsedInput: { name, redirectTo } }) => {
      const { user } = await requireInitialAuthSession();

      await db.transaction(async (tx) => {
        tx.update(userTable)
          .set({
            name,
          })
          .where(eq(userTable.id, user.id))
          .execute();

        const userRole = tx
          .select()
          .from(roleTable)
          .where(eq(roleTable.name, "user"))
          .get();

        if (!userRole) {
          throw new Error("User role not found. Was database seeded?");
        }

        tx.insert(userToRoleTable)
          .values({
            userId: user.id,
            roleId: userRole.id,
          })
          .execute();
      });

      throw redirect({
        to: redirectTo || "/dashboard",
      });
    })
);

export const Route = createFileRoute("/(auth)/onboarding")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
  }),
  beforeLoad: ({ context, search }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: search.redirectTo,
        },
      });
    }

    if (context.user.roles.includes("user") && context.user.name) {
      throw redirect({
        to: search.redirectTo || "/dashboard",
      });
    }

    return {
      redirectTo: search.redirectTo,
    };
  },
  component: Onboarding,
});

function Onboarding() {
  const { redirectTo } = Route.useSearch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: useServerFn(updateUser),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateUserMutation.mutateAsync({ ...values, redirectTo });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Onboard!
          </CardTitle>
          <CardDescription className="text-center">
            Let's get to know you better
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's your name?</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending
                  ? "Processing..."
                  : "Complete Onboarding"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
