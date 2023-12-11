import { type Writable, writable } from "svelte/store";

export const tabSet: Writable<number> = writable(0);
