import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { AuthState } from "../types/auth";
import { createSelectors } from "../util";

interface AuthActions {
	signup: ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => Promise<boolean>;
	signin: (email: string, password: string) => Promise<void>;
	signout: () => void;
	setSession: (newSession: Session | null) => void;
	setIsInitialized: (initialized: boolean) => void;
	setTheme: (theme: "light" | "dark") => void;
	getAuthUser: () => Promise<User | null>;
	setAuthUser: (user: User | null) => void;
}

const initialState: AuthState = {
	authUser: null,
	isLoading: false,
	error: null,
	message: null,
	session: null,
	isInitialized: false,
	theme: "light",
};

type AuthSlice = AuthState & AuthActions;

export const useAuthStoreBase = create<AuthSlice>()(
	devtools(
		persist(
			immer((set) => ({
				...initialState,

				getAuthUser: async () => {
					try {
						const response = await supabase.auth.getUser();
						if (response.error) throw response.error;
						return response.data.user;
					} catch (error) {
						console.log("Get auth user error:", error);
						return null;
					}
				},

				setAuthUser: (user: User | null) => {
					set((state) => {
						state.authUser = user;
					});
				},

				signup: async ({ email, password }): Promise<boolean> => {
					try {
						set((state) => {
							state.isLoading = true;
							state.error = null;
						});
						return true;
					} catch {
						return false;
					} finally {
						set((state) => {
							state.isLoading = false;
						});
					}
				},

				signin: async (email: string, password: string) => {
					try {
						set((state) => {
							state.isLoading = true;
							state.error = null;
						});
					} catch {
					} finally {
						set((state) => {
							state.isLoading = false;
						});
					}
				},

				signout: () => {},

				setSession: async (newSession: Session | null) => {
					try {
						set((state) => {
							state.session = newSession;
						});
					} catch (error) {
						console.log("Session update error:", error);
					}
				},

				setIsInitialized: (initialized: boolean) => {
					set((state) => {
						state.isInitialized = initialized;
					});
				},

				setTheme: (theme: "light" | "dark") => {
					set((state) => {
						state.theme = theme;
					});
				},
			})),
			{
				name: process.env.EXPO_PUBLIC_STORAGE_KEY!,
				storage: createJSONStorage(() => AsyncStorage),
			}
		)
	)
);

export const useAuthStore = createSelectors(useAuthStoreBase);
