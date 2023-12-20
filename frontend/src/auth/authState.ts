import { User } from "@auth0/auth0-spa-js";

export type AuthState = {
    // Auth state:
    error: Error | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | undefined;
    isAdmin: boolean;
    // Auth methods:
    login: () => Promise<void>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    getAccessToken: () => Promise<string | null>;
};
