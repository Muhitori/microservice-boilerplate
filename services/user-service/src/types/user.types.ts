export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface UserCreate {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface UserId {
	id: string;
}

export interface UpdateUserRequest {
	id: string;
	userData: User;
}

export interface Empty {}
