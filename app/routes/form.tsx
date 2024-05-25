import { Controller, useForm } from "react-hook-form";

import { Button, Input } from "antd";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/*<Controller*/}
      {/*  name={"example"}*/}
      {/*  control={control}*/}
      {/*  render={({ field }) => (*/}
      {/*    <div className="flex ">*/}
      {/*      <label className={"shrink-0"}>名称</label>*/}
      {/*      <Input {...field} className={"w-auto bg-red-200"} />*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*/>*/}
      <Button>aa</Button>
      <input type="submit" />
    </form>
  );
}
