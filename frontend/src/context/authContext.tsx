
import { createContext ,ReactNode, useContext, useState, useEffect } from 'react';
import { deleteCookie, getCookie } from '../services/cookiesManager';
import { DriverInterface, RideProps } from '../types/types';
import { useNavigate } from 'react-router-dom';


interface User {
    uid: string;
    name: string;
    email: string;
    driver?: DriverInterface;
    createdAt: string;
}

interface AuthContextProps {
    user: User | null;
    isAuth: boolean;
    setUser: (user: User | null) => void;
    setInRide: (ride: RideProps) => void;
    getCurrentRide: () => RideProps | undefined;
    setEndRide: () => void;
    logout: () => void;
}
interface AuthProviderProps  {
    children: ReactNode 
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userCookie = getCookie('user');
        const tokenCookie = getCookie('token');
        
        if (userCookie && tokenCookie) {
            setUser(JSON.parse(userCookie));
            setIsAuth(true);
        } else {
            setUser(null);
            setIsAuth(false);
        }
    }, []);

    const setInRide = (ride:RideProps) => { 
        localStorage.removeItem('ride');
        const data = {
            customer_id: ride.customer_id,
            origin: ride.origin,
            destination: ride.destination,
            distance: ride.distance,
            duration: ride.duration,
            driver: ride.driver,
            driver_name: ride.driver_name,
            car: ride.car,
            value: ride.value,
            rId: ride.rId
        }
        
        localStorage.setItem('ride', JSON.stringify(data));
    };

    const getCurrentRide = (): RideProps | undefined => { 
        const ride = localStorage.getItem('ride');
        if (ride) {
            return JSON.parse(ride) as RideProps; 
        }
        return undefined;
    };

    const setEndRide = () => { 
        return localStorage.removeItem('ride');
    };

    const logout = () => {
        deleteCookie('user');
        deleteCookie('token');
        setIsAuth(false);
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isAuth, setInRide, getCurrentRide, setEndRide}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
