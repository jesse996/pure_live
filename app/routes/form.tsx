import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import { Input,Button } from "@mantine/core";
import { Input, Button } from "antd";

type Inputs = {
  example: string;
  exampleRequired: string;
};

export default function Demo() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name={"example"}
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <Button>aa</Button>
      <input type="submit" />
    </form>
  );
}
