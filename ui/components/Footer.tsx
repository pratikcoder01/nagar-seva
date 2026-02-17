"use client";

import Link from "next/link";
import { Building2, Globe, Share2, MessageSquare, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-20 pb-10 px-6 md:px-10 lg:px-40">
            <div className="mx-auto max-w-[1280px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-slate-800">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 flex items-center justify-center bg-sky-500 rounded-lg text-white">
                                <Building2 className="size-5" />
                            </div>
                            <h2 className="text-white text-xl font-extrabold tracking-tight uppercase">NAGAR-SEVA</h2>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            India's leading citizen grievance platform connecting people with power for cleaner, safer, and smarter cities.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="size-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Globe className="size-4" /></Link>
                            <Link href="#" className="size-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Share2 className="size-4" /></Link>
                            <Link href="#" className="size-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><MessageSquare className="size-4" /></Link>
                        </div>
                    </div>
                    {/* Links Column */}
                    <div className="flex flex-col gap-6">
                        <h4 className="font-bold text-base uppercase tracking-widest text-slate-200">Services</h4>
                        <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Report Garbage</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Street Light Fix</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Road Repair</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Water Supply</Link></li>
                        </ul>
                    </div>
                    {/* Policy Column */}
                    <div className="flex flex-col gap-6">
                        <h4 className="font-bold text-base uppercase tracking-widest text-slate-200">Support</h4>
                        <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Knowledge Base</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">API Docs</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Terms of Use</Link></li>
                            <li><Link href="#" className="hover:text-sky-500 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    {/* Helpline Column */}
                    <div className="flex flex-col gap-6">
                        <h4 className="font-bold text-base uppercase tracking-widest text-slate-200">24/7 Helpline</h4>
                        <div className="bg-sky-500/10 border border-sky-500/30 p-4 rounded-xl flex flex-col gap-1">
                            <p className="text-xs text-sky-500 font-bold uppercase tracking-wider">Toll Free Number</p>
                            <a href="tel:180062427" className="text-2xl font-black text-white hover:text-sky-500 transition-colors">1800-NAGAR</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <Mail className="text-sky-500 size-4" />
                            <span>support@nagar-seva.gov.in</span>
                        </div>
                    </div>
                </div>
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs">© 2024 NAGAR-SEVA. Ministry of Housing and Urban Affairs.</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-6 bg-slate-800 rounded flex flex-col overflow-hidden opacity-80" aria-label="Small Indian flag icon">
                                <div className="w-full h-1/3 bg-[#FF9933]"></div>
                                <div className="w-full h-1/3 bg-white flex items-center justify-center"><div className="size-1 bg-blue-900 rounded-full"></div></div>
                                <div className="w-full h-1/3 bg-[#128807]"></div>
                            </div>
                            <span className="text-xs text-slate-500 font-bold uppercase">Digital India Initiative</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
