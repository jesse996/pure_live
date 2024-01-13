import { writable } from "svelte/store";

export function createTodoStore(initial) {
	let uid = 1;
	console.info("🚀 ~ file:todos method:createTodoStore line:5 -----", uid)
	const todos = initial.map(({ done, description }) => {
		return {
			id: uid++,
			done,
			description,
		};
	});

	const { subscribe, update } = writable(todos);

	return {
		subscribe,
		add: (description) => {
			const todo = {
				id: uid++,
				done: false,
				description,
			};

			update(($todos) => [...$todos, todo]);
		},
		remove: (todo) => {
			update(($todos) => $todos.filter((t) => t !== todo));
		},
		mark: (todo, done) => {
			update(($todos) => [
				...$todos.filter((t) => t !== todo),
				{ ...todo, done },
			]);
		},
	};
}
