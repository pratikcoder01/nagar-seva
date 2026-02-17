"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth";
import { Input } from "@/ui/components/ui/input";
import { Button } from "@/ui/components/ui/button";
import { Label } from "@/ui/components/ui/label";
import { Role } from "@/lib/roles";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum([Role.CITIZEN, Role.ADMIN]),
});

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: Role.CITIZEN,
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await signUp(values.email, values.password, values.role);
            if (error) {
                setError(error.message);
            } else {
                // Redirect to login or verification page
                router.push("/login?message=Account created! Please log in.");
            }
        } catch (e) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                <p className="text-slate-500 dark:text-slate-400">Join Nagar Seva to make a difference</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Role Selection */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setValue("role", Role.CITIZEN)}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${selectedRole === Role.CITIZEN
                                    ? "bg-white dark:bg-slate-700 text-sky-500 shadow-sm border border-slate-200 dark:border-slate-600"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                }`}
                        >
                            Citizen
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue("role", Role.ADMIN)}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${selectedRole === Role.ADMIN
                                    ? "bg-white dark:bg-slate-700 text-sky-500 shadow-sm border border-slate-200 dark:border-slate-600"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                }`}
                        >
                            Official/Admin
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="citizen@example.com" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••" {...register("password")} />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-slate-500 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-sky-500 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
