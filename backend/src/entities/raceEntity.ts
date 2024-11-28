
export class RaceEntity {
    private rId: string;
    private driverId: string;
    private passengerId: string;
    private car: string;
    private origin: string;
    private status?: string;
    private destination: string;
    private distance: number;
    private duration: number;
    private value: number;

    constructor(rId: string, driverId: string, status: string, car: string, passengerId: string, origin: string, destination: string, distance: number, duration: number, value: number) {
        this.rId = rId;
        this.driverId = driverId;
        this.passengerId = passengerId;
        this.origin = origin;
        this.destination = destination;
        this.status = status;
        this.distance = distance;
        this.duration = duration;
        this.value = value;
        this.car = car;
    }


    public getRid(): string {
        return this.rId;
    }

    public setRid(rId: string): void {
        this.rId = rId;
    }

    public getDriverUid(): string {
        return this.driverId;
    }

    public setDriverUid(uid: string): void {
        this.driverId = uid;
    }
    
    public getStatus(): string | undefined {
        return this.status;
    }
    
    public setStatus(status: string): void {
        this.status = status;
    }

    public getPassengerUid(): string {
        return this.passengerId;
    }

    public setPassengerUid(uid: string): void {
        this.passengerId = uid;
    }

    public getCar(): string {
        return this.car;
    }

    public setCar(car: string): void {
        this.car = car;
    }

    public getOrigin(): string {
        return this.origin;
    }

    public setOrigin(origin: string): void {
        this.origin = origin;
    }

    public getDestination(): string {
        return this.destination;
    }

    public setDestination(destination: string): void {
        this.destination = destination;
    }

    public getDistance(): number {
        return this.distance;
    }

    public setDistance(distance: number): void {
        this.distance = distance;
    }

    public getDuration(): number {
        return this.duration;
    }

    public setDuration(duration: number): void {
        this.duration = duration;
    }
    public getValue(): number {
        return this.value;
    }

    public setValue(value: number): void {
        this.value = value;
    }
}

export interface SafeRace {
    driverId: string;
    car: string;
    origin: string;
    destination: string;
    distance: number;
    duration: number;
    value: number;
}