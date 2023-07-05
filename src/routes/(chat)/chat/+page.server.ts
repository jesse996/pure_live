export async function load({fetch,getClientAddress}){
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')

  return res.json()
}