import type { Actions } from "@sveltejs/kit";

export const actions = {
  default: async(event) => {
    console.log(await event.request.formData());

    const res =await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const data = await res.json()
    console.log(data)
    return data
  }
} satisfies Actions;