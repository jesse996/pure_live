import { Button, NumberInput, TextInput } from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import { Form } from "@remix-run/react";

interface FormValues {
  name: string;
  age: number | string;
}

function apiRequest(): Promise<FormValues> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: "John Doe", age: 25 });
    }, 1000);
  });
}

export default function Demo() {
  const form = useForm<FormValues>({
    initialValues: { name: "", age: 0 },
    validate: {
      name: isNotEmpty("Name is required"),
      age: isInRange({ min: 18 }, "You must be at least 18 to register"),
    },
  });

  return (
    <Form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        {...form.getInputProps("name")}
        label="Name"
        placeholder="Name"
      />
      <NumberInput
        {...form.getInputProps("age")}
        label="Age"
        placeholder="Age"
        mt="md"
      />
      <Button
        onClick={() => apiRequest().then((values) => form.initialize(values))}
        mt="md"
      >
        Initialize form
      </Button>
      <Button
        onClick={() => {
          form.reset();
        }}
        mt="md"
        ml="md"
      >
        Reset
      </Button>

      <Button type={"submit"}>Submi111t</Button>
      <div>asd12adfadasdasdasd</div>
    </Form>
  );
}
