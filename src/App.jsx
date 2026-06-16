import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { Auth, Canvas, ErrorPage } from './pages'
export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout></AppLayout>}>
          <Route path='/canvas' element={<Canvas></Canvas>}></Route>
          <Route path='/auth' element={<Auth></Auth>}></Route>
          <Route path='*' element={<ErrorPage></ErrorPage>}></Route>
        </Route>
      </Routes>
    </>
  )
}
