// src/zustand/types/auth.ts

import { Session, User } from "@supabase/supabase-js";

// export interface User {
// 	id: string;
// 	countryId: string;
// 	email: string;
// 	fullName: string;
// 	role: "admin" | "user";
// 	avatarUrl?: string;
// }

export interface Permission {
	id: number;
	permission: string;
}

export interface AuthState {
	authUser: User | null;
	isLoading: boolean;
	error: string | null;
	message: string | null;
	session: Session | null;
	isInitialized: boolean;
	theme: "light" | "dark";
}
