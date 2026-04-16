import { createRoot } from 'react-dom/client'
import { StoreProcider } from './redux/StoreProcider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter.tsx'
import './index.scss'

createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <StoreProcider>
      <AppRouter />
    </StoreProcider>
  </BrowserRouter>

)
