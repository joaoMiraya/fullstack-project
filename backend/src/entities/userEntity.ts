export class UserEntity {
    private uid: string;
    private name: string;
    private email: string;
    private password: string;
    private createdAt?: string;

    constructor(uid: string, name: string, email: string, password: string, createdAt?: string) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    public getUid(): string {
        return this.uid;
    }

    public setUid(uid: string): void {
        this.uid = uid;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public getCreatedAt(): string | undefined {
        return this.createdAt;
    }
}

export interface SafeUser {
    uid: string;
    name: string;
    email: string;
    createdAt?: string;
};