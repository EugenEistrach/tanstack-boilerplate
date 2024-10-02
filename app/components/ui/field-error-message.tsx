import type { FieldError } from "react-hook-form";
import { useTranslations } from "use-intl";

export const FieldErrorMessage = ({
  error,
}: {
  error: FieldError | undefined;
}) => {
  const t = useTranslations();

  if (!error || !error.message) {
    return null;
  }

  // @ts-ignore if the message key is not found, it will return messageKey as value
  const message = t(error.message);
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
};
