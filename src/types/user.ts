export interface User {
    user: string;
    pass: string;
    account: UserAccount;
}

export interface UserAccount {
    id: string;
    username: string;
    roles: string[];
}

export interface UserInfo {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}
