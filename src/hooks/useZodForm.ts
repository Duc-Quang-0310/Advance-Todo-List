import {
  DeepPartial,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCallback } from "react";

export const useZodForm = <F extends FieldValues>(
  schema: z.Schema<F>,
  defaultValues: DeepPartial<F>,
  onValid: SubmitHandler<F>,
  onInvalid?: SubmitErrorHandler<F>
) => {
  const { handleSubmit: handleSubmitForm, ...form } = useForm<F>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = useCallback(
    async () =>
      handleSubmitForm(async (f) => {
        await onValid(f);
        form.reset(undefined, {
          keepDefaultValues: true,
          keepDirty: false,
          keepErrors: false,
          keepTouched: false,
          keepDirtyValues: false,
          keepValues: false,
          keepIsSubmitted: false,
          keepIsValid: false,
          keepSubmitCount: false,
        });
      }, onInvalid)(),
    [form, handleSubmitForm, onInvalid, onValid]
  );

  return {
    ...form,
    handleSubmit,
  };
};
