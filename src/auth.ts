import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectToDatabase from "./lib/mongodb"
import { User } from "./models/User"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize called with email:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing email or password");
                    return null;
                }
                
                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });
                    console.log("User found:", !!user);
                    
                    if (!user || !user.password) {
                        console.log("No user or no password field");
                        return null;
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password as string, user.password);
                    console.log("Password valid:", isValidPassword);
                    
                    if (!isValidPassword) {
                        console.log("Invalid password");
                        return null;
                    }

                    console.log("Authorize successful for:", user.email);
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    };
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            }
        })
    ],
})
