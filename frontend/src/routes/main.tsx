import '../index.css'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import App from '../App';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import { Trips } from '../pages/privates/trips/Trips';
import { PrivateRoute } from './private.route';
import { AuthProvider } from '../context/authContext';
import { Ride } from '../pages/privates/ride/Ride';
import { Profile } from '../pages/privates/profile/Profile';
import { PublicRoute } from './public.route';
import { DriverProfile } from '../pages/privates/profile/DriverProfile';



const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter future={{
      v7_startTransition: true,
    }}>
      <AuthProvider>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/' element={<App />}>

            <Route path='/' element={<PublicRoute> <Home /> </PublicRoute>} />
              <Route path='/home' element={<PrivateRoute> <Trips /> </PrivateRoute>} />
              <Route path='/ride/:id' element={<PrivateRoute> <Ride /> </PrivateRoute>} />
              <Route path='/driver/:id' element={<PrivateRoute> <DriverProfile /> </PrivateRoute>} />
              <Route path='/profile/:id' element={<PrivateRoute> <Profile /> </PrivateRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
  </BrowserRouter>
);

