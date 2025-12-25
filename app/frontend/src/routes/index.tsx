import { createFileRoute } from '@tanstack/react-router'
import { createClient } from 'backend/src/createClient'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  loader: async () => {
    const client = createClient('http://localhost:3000')
    return (
      await client.demo.$get({
        query: { kind: 'positive' },
      })
    ).json()
  },
  component: App,
})

function App() {
  const data = Route.useLoaderData()

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>{data.message}</p>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
    </div>
  )
}
