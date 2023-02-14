
import { error } from '@sveltejs/kit';
/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  return {
    title: 'Hello world!',
    content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
  };
  if (params.slug === 'hello-world') {
    return {
      title: 'Hello world!',
      content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
    };
  }

  throw error(404, 'Not found');
}