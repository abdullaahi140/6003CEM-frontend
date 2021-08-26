/// <reference types="react-scripts" />

export interface User {
	ID: number;
	username: string;
	firstName: string;
	lastName: string;
	imageID: number;
	imgURL?: string;
	provider: 'internal' | 'google';
	dateRegistered: string;
	dateModified: string;
	role: 'admin' | 'staff' | 'user';
	locationID?: number;
}

export interface AccessToken {
	token: string;
	expiresIn: number;
}

export interface RefreshToken extends AccessToken {
	userID?: number;
}

export interface UserResponse {
	user: User;
	accessToken: AccessToken;
	refreshToken: RefreshToken;
}

export interface UserState {
	user: User | null;
	loggedIn: boolean;
	accessToken: AccessToken | null;
	refreshToken: RefreshToken | null;
}

interface LoginAction {
	type: 'LOGIN';
	payload: {
		user: User;
		accessToken: AccessToken;
		refreshToken: RefreshToken;
	}
}

interface LogoutAction {
	type: 'LOGOUT';
}

interface RefreshAction {
	type: 'REFRESH_ACCESS_TOKEN';
	payload: { accessToken: AccessToken };
}

export type Action = LoginAction | LogoutAction | RefreshAction;

export type Dispatch = (action: Action) => void;

export interface UserBody {
	username: string;
	firstName?: string;
	lastName?: string;
	password: string;
	upload?: { file: File };
	staffCode?: string;
	[key: string]: string | { file: File };
}

export interface DogBody {
	name: string;
	age: number;
	gender: 'Male' | 'Female';
	breed: string;
	description: string;
	upload?: { file: File };
	[key: string]: string | number | { file: File };
}

export interface Dog {
	ID: number;
	name: string;
	age: number;
	gender: 'Male' | 'Female';
	breed: string;
	description: string;
	imageID: number;
	dateAdded: string;
	dateModified: string;
	locationID: number;
	locationName: string;
}

export interface Dogs {
	dogs: Dog[];
	links: {
		prev: string;
		next: string;
	}
}

export interface Shelter {
	ID: number;
	name: string;
	dateCreated: string;
}

export interface Chat {
	ID: number;
	userID: number;
	locationID: number;
	dateCreated: string;
	dateModified: string;
	locationName: string;
}

export interface ChatResponse {
	ID: number;
	created: boolean;
	link: string;
}

export interface LogoutResponse {
	affectedRows: number;
	loggedOut: true;
}

export interface Message {
	ID: number;
	chatID: number;
	senderID: number;
	message: string;
	dateCreated: string;
	dateModified: string;
	senderName: string;
	senderImageID: number;
}

export interface UserCreatedResponse {
	ID: number;
	created: boolean;
	accessToken: AccessToken;
	refreshToken: RefreshAction;
	links: {
		account: string;
	}
}
