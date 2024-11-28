import { Outlet } from "react-router-dom"
import Header from "./pages/components/partials/Header"
import { Footer } from "./pages/components/partials/Footer"

function App() {

  return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default App
