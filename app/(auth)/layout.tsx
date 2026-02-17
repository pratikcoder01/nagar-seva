export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white">
                <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-wider">
                    <span className="material-symbols-outlined">location_city</span> Nagar-Seva
                </div>
                <div className="space-y-4 max-w-lg">
                    <h1 className="text-4xl font-extrabold leading-tight">Empowering Citizens, <br />Transforming Cities.</h1>
                    <p className="text-zinc-400 text-lg">Join the movement for transparent, efficient, and responsive civic governance.</p>
                </div>
                <div className="text-sm text-zinc-500">© 2024 Nagar Seva. All rights reserved.</div>
            </div>
            <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
