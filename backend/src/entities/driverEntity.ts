
export class DriverEntity {
    private uid: string;
    private car: string;
    private cnh: string;
    private description: string;
    private minKm: number;
    private fee: number;

    constructor(uid: string, car: string, cnh: string, description: string, minKm: number, fee: number) {
        this.uid = uid;
        this.car = car;
        this.cnh = cnh;
        this.description = description;
        this.minKm = minKm;
        this.fee = fee;
    }

    public getUid(): string {
        return this.uid;
    }

    public setUid(uid: string): void {
        this.uid = uid;
    }

    public getCar(): string {
        return this.car;
    }

    public setCar(car: string): void {
        this.car = car;
    }

    public getCnh(): string {
        return this.cnh;
    }

    public setCnh(cnh: string): void {
        this.cnh = cnh;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }
    public getMinKm(): number {
        return this.minKm;
    }

    public setMinKm(minKm: number): void {
        this.minKm = minKm;
    }
        public getFee(): number {
        return this.fee;
    }

    public setFee(fee: number): void {
        this.fee = fee;
    }
}

export interface SafeDriver {
    uid: string;
    name: string;
    car: string;
    description: string;
    minKm: number;
    value: number;
    review: Array<{
        rating: number;
        comment: string;
    }>;
    createdAt?: string;
}