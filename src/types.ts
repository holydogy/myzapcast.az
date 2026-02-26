export interface Ad {
    id: number;
    title: string;
    price: number | string;
    image: string;
    status: 'active' | 'pending' | 'expired';
    make?: string;
    model?: string;
    category?: string;
    date?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
}

export interface AdminUser {
    user: string;
    pass: string;
}
