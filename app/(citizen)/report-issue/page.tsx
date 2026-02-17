"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Camera, MapPin, UploadCloud } from "lucide-react";
import { Input } from "@/ui/components/ui/input";
import { Button } from "@/ui/components/ui/button";
import { Label } from "@/ui/components/ui/label";

const formSchema = z.object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    category: z.string().min(1, { message: "Please select a category" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    location: z.string().optional(), // In real app, this would be coords
});

export default function ReportIssuePage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Issue Reported Successfully!</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    Thank you for being a responsible citizen. We have received your report and notified the relevant ward officer. You can track the status in the "Track Issues" section.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Report Another Issue</Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report an Issue</h1>
                <p className="text-slate-500 dark:text-slate-400">Help us maintain our city by reporting civic problems.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Issue Title</Label>
                        <Input id="title" placeholder="e.g., Pothole on M.G. Road" {...register("title")} />
                        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
                            {...register("category")}
                        >
                            <option value="">Select a category</option>
                            <option value="roads">Roads & Potholes</option>
                            <option value="garbage">Garbage & Sanitation</option>
                            <option value="streetlights">Street Lights</option>
                            <option value="water">Water Supply</option>
                            <option value="traffic">Traffic & Parking</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                            placeholder="Describe the issue in detail..."
                            {...register("description")}
                        />
                        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location Placeholder */}
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-lg h-40 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-500 gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <MapPin className="size-8" />
                                <span className="text-xs font-medium">Click to Pin Location</span>
                            </div>
                        </div>

                        {/* Image Upload Placeholder */}
                        <div className="space-y-2">
                            <Label>Upload Photo</Label>
                            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg h-40 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Camera className="size-8" />
                                <span className="text-xs font-medium">Click to Upload Image</span>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UploadCloud className="mr-2 h-5 w-5" />}
                        Submit Report
                    </Button>
                </form>
            </div>
        </div>
    );
}
