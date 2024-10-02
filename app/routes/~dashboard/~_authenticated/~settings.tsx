import { useAuth } from "@/app/auth/auth-hooks";
import { H1, H2 } from "@/app/components/ui/typography";
import { Subtitle } from "@/app/components/ui/typography";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useTranslations } from "use-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/start";
import { db } from "@/app/db";
import { userTable } from "@/app/auth/auth-tables";
import { eq } from "drizzle-orm";
import { getTranslations, tk } from "@/app/lib/i18n";
import { FieldErrorMessage } from "@/app/components/ui/field-error-message";
import { validationClient } from "@/app/lib/functions";
import { requireAuthSession } from "@/app/auth/auth-session";
import { useSpinDelay } from "spin-delay";
import { toast } from "sonner";

const updateNameSchema = z.object({
  name: z.string().min(1, { message: tk("settings.validation.nameRequired") }),
});

const updateName = createServerFn(
  "POST",
  validationClient
    .input(async () => {
      const t = await getTranslations();
      return updateNameSchema;
    })
    .handler(async ({ parsedInput: { name } }) => {
      const { user } = await requireAuthSession();
      await db.update(userTable).set({ name }).where(eq(userTable.id, user.id));
      return { success: true };
    })
);

export const Route = createFileRoute("/dashboard/_authenticated/settings")({
  beforeLoad: () => {
    return {
      breadcrumb: "Settings",
    };
  },
  component: () => <Settings />,
});

function Settings() {
  const t = useTranslations();
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: user.name || "",
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: useServerFn(updateName),
    onSuccess: async () => {
      await router.invalidate();
    },
  });

  const onSubmit = (data: z.infer<typeof updateNameSchema>) => {
    updateNameMutation.mutate(data);
    toast.success(t("settings.success"));
  };

  const isPending = useSpinDelay(updateNameMutation.isPending);

  return (
    <div className="space-y-6">
      <div>
        <H1>{t("settings.title")}</H1>
        <Subtitle>{t("settings.subtitle")}</Subtitle>
      </div>

      <Card className="max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <H2>{t("settings.basicInfo")}</H2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-grow">
                <div className="space-y-1">
                  <Label htmlFor="email">{t("settings.emailLabel")}</Label>
                  <Input id="email" value={user.email} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">{t("settings.nameLabel")}</Label>
                  <Input id="name" {...register("name")} />
                  <FieldErrorMessage error={errors.name} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4">
            <Button
              type="submit"
              disabled={isValidating || isPending}
              className="ml-auto"
            >
              {isPending ? t("common.updating") : t("common.saveChanges")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
