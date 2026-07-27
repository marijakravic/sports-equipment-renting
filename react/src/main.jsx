import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import {ContextProvider} from "./contexts/ContextProvider.jsx";
import {BasketProvider} from "./contexts/BasketContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BasketProvider>
         <ContextProvider>

            <RouterProvider router={router} />

         </ContextProvider>
      </BasketProvider>
  </StrictMode>
)
