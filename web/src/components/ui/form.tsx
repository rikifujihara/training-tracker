"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Control,
  Controller,
  FormProvider,
  useController,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { ValidNumericField } from "@/types/helpers";
import { LiftSet } from "@/types/programs/trainingProgram";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

interface InputFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  placeholder?: string;
  inputType?: React.HTMLInputTypeAttribute;
}

function TableInputField<T extends FieldValues>({
  name,
  control,
  placeholder,
  inputType = "text",
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-[100px]">
          <FormControl>
            <Input type={inputType} placeholder={placeholder} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

interface RangeInputProps<
  TFormData extends FieldValues,
  TFieldPath extends FieldPath<TFormData>
> {
  name: TFieldPath; // The base field path like "days.0.lifts.0.sets.0"
  control: Control<TFormData>; // React Hook Form control
  minField: ValidNumericField<LiftSet>; // Only allows valid numeric fields from LiftSet
  maxField: ValidNumericField<LiftSet>; // Only allows valid numeric fields from LiftSet
  placeholder?: string; // Optional placeholder text
  className?: string; // Optional CSS classes
}

function RangeInput<
  TFormData extends FieldValues,
  TFieldPath extends FieldPath<TFormData>
>({
  name,
  control,
  minField,
  maxField,
  placeholder = "10-15",
  className,
}: RangeInputProps<TFormData, TFieldPath>) {
  // Step 4a: Construct the full field paths by combining base name with field names
  const minFieldPath = `${name}.${String(minField)}` as FieldPath<TFormData>;
  const maxFieldPath = `${name}.${String(maxField)}` as FieldPath<TFormData>;

  const minController = useController({
    name: minFieldPath,
    control,
  });

  const maxController = useController({
    name: maxFieldPath,
    control,
  });

  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    setInputValue(getDisplayValue());
  }, [minController.field.value, maxController.field.value]);

  const getDisplayValue = (): string => {
    const minVal = minController.field.value;
    const maxVal = maxController.field.value;

    // Handle different combinations of min/max values
    if (
      minVal !== null &&
      minVal !== undefined &&
      maxVal !== null &&
      maxVal !== undefined
    ) {
      // Both values exist: "10-15"
      return `${minVal}-${maxVal}`;
    } else if (minVal !== null && minVal !== undefined) {
      // Only min value: "10"
      return `${minVal}`;
    } else if (maxVal !== null && maxVal !== undefined) {
      // Only max value: "15"
      return `${maxVal}`;
    }
    // No values: empty string
    return "";
  };

  const handleChange = (inputValue: string): void => {
    setInputValue(inputValue);
    // Remove all whitespace for easier parsing
    const cleaned = inputValue.replace(/\s/g, "");

    // Match range patterns: "10-15", "10to15", "10:15", etc.
    const rangeMatch = cleaned.match(/^(\d+)[-–—to:]+(\d+)$/i);

    if (rangeMatch) {
      // Range format detected: "10-15"
      const min = parseInt(rangeMatch[1], 10);
      const max = parseInt(rangeMatch[2], 10);

      // Ensure min is not greater than max (optional validation)
      if (min <= max) {
        minController.field.onChange(min);
        maxController.field.onChange(max);
      }
      // If min > max, we could swap them or just ignore the input
    } else if (/^\d+$/.test(cleaned)) {
      // Single number format: "10" -> use for both min and max
      const value = parseInt(cleaned, 10);
      minController.field.onChange(value);
      maxController.field.onChange(value);
    } else if (cleaned === "") {
      // Empty input: clear both fields
      minController.field.onChange(null);
      maxController.field.onChange(null);
    }
  };
  return (
    <Input
      value={inputValue}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  TableInputField,
  RangeInput,
};
