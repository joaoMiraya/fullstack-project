
export type FuncType = {
    func: () => void;
};

export interface FormProps {
    name?: string;
    email: string;
    password: string;
    confirmEmail?: string;
    confirmPassword?: string;
    cnh?: string;
    car?: string,
    fee?: string;
    minKm?: string;
    description?: string;
    origin?: string;
    destination?: string;
};

export interface LoginInterface {
    email: string;
    password: string;
};

export interface DriverInterface {
    name: string;
    uid: string;
    car: string;
    minKm: number;
    fee: number;
    description: string;
    review?: {
        rating: number;
        comment: string;
    }[];
};


export interface RouteProps {
    origin:string;
    destination: string;
}

export interface RouteResultProps {
    origin:[
        {
            lat: number,
            lng: number
        }
    ];
    destination:[
        {
            lat: number,
            lng: number
        }
    ];
    distance: number;
    duration: string;
    customer_id: string;
};

export interface RideProps {
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    customer_id: string;
    driver: string;
    driver_name: string;
    car: string;
    value: number;
    rId: string;
};

export interface HistoryProps {
    car: string;
    created_at: string;
    destination: string;
    distance: number;
    driver: string;
    driver_id: string;
    duration: string; 
    id: number;
    origin: string;
    passenger_id: string; 
    r_id: string;
    status: string; 
    updated_at: string;
    value: number;
    rating: number;
    showName?: boolean;
}
