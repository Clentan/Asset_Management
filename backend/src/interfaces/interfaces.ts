export interface User  {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone: string,
    role: "super-admin" | "admin" | "employee",
    profilePicture: "",
    created_at: string,
    updated_at: string,
    last_signin: string,
    last_login: string
};