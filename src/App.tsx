import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Users from "./component/User"


function App() {
  const queryClient = new QueryClient()
  return (

    <QueryClientProvider client={queryClient}>
     <Users/>
     </QueryClientProvider>
  )
}

export default App
