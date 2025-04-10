import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GigContextProvider } from './Context/gigContext.jsx'
import { AuthContextProvider } from './Context/AuthContext.jsx'
import { OrderContextProvider } from './Context/OrderContext.jsx'
import { SocketContextProvider } from './Context/SocketContext.jsx'
import { MessageContextProvider } from './Context/MessageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <MessageContextProvider>
            <GigContextProvider>
              <OrderContextProvider>
                <App />
              </OrderContextProvider>
            </GigContextProvider>
          </MessageContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
