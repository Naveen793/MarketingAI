"use client";

import Link from "next/link";
import { ArrowRight, Bot, Target, Zap, LayoutDashboard, CheckCircle2, DollarSign, TrendingUp, Mail, Users, Megaphone, Activity, BarChart3, Inbox, MessageSquareText, PhoneCall, Handshake, BrainCircuit } from "lucide-react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-primary/30 overflow-hidden">
      
      {/* 1. Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors border border-primary/20">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">MarketAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Pro</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#agents" className="hover:text-white transition-colors">AI Agents</a>
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2 & 3. Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-8 text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            MarketAI Pro is an AI-powered marketing and sales platform
          </motion.div>
          
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05] text-balance">
            AI-Powered Marketing & <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400">
              Sales Automation.
            </span>
          </motion.h1>
          
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl text-balance font-medium">
            MarketAI Pro helps businesses generate marketing strategies, nurture leads, automate outreach, and close deals using intelligent AI agents.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link 
              href="/signup" 
              className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 w-full sm:w-auto"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#demo" 
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white border border-white/10 hover:bg-white/5 px-8 py-4 rounded-full text-lg font-medium transition-colors w-full sm:w-auto"
            >
              <Zap className="w-5 h-5 text-primary" /> Watch Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hero Visual Mockup */}
      <section className="px-6 pb-24 relative z-20">
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="max-w-6xl mx-auto rounded-xl md:rounded-3xl border border-white/10 bg-[#121212] shadow-2xl overflow-hidden relative"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10 opacity-60" />
            {/* Fake Mac Titlebar */}
            <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0A0A0A]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {/* Fake Dashboard Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-[url('/noise.png')] bg-repeat opacity-90 relative">
                
                {/* Mock Sidebar */}
                <div className="hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                    <div className="h-6 w-32 bg-white/10 rounded mb-8" />
                    <div className="h-4 w-full bg-primary/20 rounded" />
                    <div className="h-4 w-3/4 bg-white/5 rounded" />
                    <div className="h-4 w-5/6 bg-white/5 rounded" />
                    <div className="h-4 w-2/3 bg-white/5 rounded" />
                </div>
                
                {/* Mock Content */}
                <div className="md:col-span-3 space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-8 w-48 bg-white/10 rounded-lg" />
                        <div className="h-8 w-24 bg-primary rounded-lg" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-white/5 rounded-2xl border border-white/5 flex items-center px-4 relative overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 mr-4" />
                            <div><div className="w-12 h-4 bg-white/20 mb-2 rounded"/><div className="w-8 h-6 bg-white/40 rounded"/></div>
                        </div>
                        <div className="h-24 bg-white/5 rounded-2xl border border-white/5 flex items-center px-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                            <div className="w-10 h-10 rounded-full bg-primary/20 mr-4" />
                            <div><div className="w-16 h-4 bg-white/20 mb-2 rounded"/><div className="w-10 h-6 bg-white/40 rounded"/></div>
                        </div>
                        <div className="h-24 bg-white/5 rounded-2xl border border-white/5 flex items-center px-4 relative overflow-hidden">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 mr-4" />
                            <div><div className="w-20 h-4 bg-white/20 mb-2 rounded"/><div className="w-12 h-6 bg-white/40 rounded"/></div>
                        </div>
                    </div>

                    <div className="h-64 bg-white/5 rounded-3xl border border-white/5 mt-8 p-6 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent" />
                        <div className="w-1/3 h-6 bg-white/10 rounded mb-8" />
                        <div className="flex items-end gap-4 h-32">
                            {[40, 60, 30, 80, 50, 90, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/10 rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      </section>

      {/* 4. Trust / Impact Section */}
      <section className="py-16 border-y border-white/5 bg-[#0D0D0D] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
                {[
                    { icon: Zap, text: "Marketing Strategy Generated in 10 Seconds", color: "text-amber-400" },
                    { icon: TrendingUp, text: "Up to 3x Faster Lead Conversion", color: "text-emerald-400" },
                    { icon: DollarSign, text: "Reduce Marketing Cost by 70%", color: "text-blue-400" },
                    { icon: BrainCircuit, text: "Powered by Intelligent AI Agents", color: "text-primary" }
                ].map((stat, i) => (
                    <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-3">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        <h4 className="text-sm md:text-base font-semibold text-white/90 text-balance">{stat.text}</h4>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* 5. Core Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">6 Powerful Core Features</h2>
                <p className="text-muted-foreground text-lg">Everything you need to run an autonomous marketing engine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 hover:bg-[#1A1A1A] transition-colors relative overflow-hidden group">
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Marketing Strategy Generator</h3>
                    <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-white/5">Generate a complete marketing strategy for your business instantly.</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Social Media & Email Plan</div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Google & Meta Ads Targeting</div>
                    </div>
                    <div className="mt-6 bg-black/50 rounded-xl p-4 border border-white/5 font-mono text-xs text-primary/80">
                        {">"} Instagram: 3 posts, 2 reels/wk<br/>
                        {">"} Google Ads: Budget & Keywords
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Lead Management System</h3>
                    <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-white/5">Organize and track all potential customers in one intelligent dashboard.</p>
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                            <span className="bg-white/5 px-2 py-1 rounded">Name</span>
                            <span className="bg-white/5 px-2 py-1 rounded">Email</span>
                            <span className="bg-white/5 px-2 py-1 rounded">Company</span>
                        </div>
                        <div className="bg-blue-500/10 text-blue-400 text-xs px-3 py-2 rounded-lg flex items-center justify-between">
                            New <ArrowRight className="w-3 h-3" /> Contacted <ArrowRight className="w-3 h-3" /> Closed
                        </div>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-12 h-12 bg-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center mb-6">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Outreach Email Generator</h3>
                    <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-white/5">Automatically create personalized outreach emails for potential customers.</p>
                    <div className="bg-black/50 rounded-xl p-4 border border-white/5 text-sm">
                        <p className="text-muted-foreground mb-2 text-xs uppercase tracking-wider">Subject</p>
                        <p className="font-semibold mb-4 border-b border-white/5 pb-3">Improve Your Sales Strategy with MarketAI</p>
                        <p className="text-muted-foreground mb-2 text-xs uppercase tracking-wider">Body</p>
                        <p className="text-gray-300">Hello Rahul, I noticed your company focuses on digital marketing...</p>
                    </div>
                </div>

                {/* Feature 4 */}
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                        <MessageSquareText className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Reply Assistant</h3>
                    <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-white/5">AI reads customer replies, classifies sentiment, and drafts smart responses.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded">Interested</span>
                        <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded">Objection</span>
                        <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded">Not now</span>
                    </div>
                    <div className="bg-white/5 text-xs text-muted-foreground p-3 rounded-lg flex items-center gap-2">
                        <Bot className="w-4 h-4" /> Auto-drafting response...
                    </div>
                </div>

                {/* Feature 5 */}
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 hover:bg-[#1A1A1A] transition-colors">
                    <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                        <PhoneCall className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Sales Call Assistant</h3>
                    <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-white/5">Prepare smarter sales calls with custom AI-generated call scripts.</p>
                    <div className="space-y-3">
                        <div className="bg-black/50 p-3 rounded-lg border border-white/5 border-l-2 border-l-primary">
                            <h4 className="text-xs text-primary mb-1 uppercase font-bold">Opening</h4>
                            <p className="text-xs text-gray-300 text-balance">Thank you for taking time to discuss your marketing needs.</p>
                        </div>
                        <div className="bg-black/50 p-3 rounded-lg border border-white/5 border-l-2 border-l-amber-500">
                            <h4 className="text-xs text-amber-500 mb-1 uppercase font-bold">Questions</h4>
                            <p className="text-xs text-gray-300 text-balance">What challenges do you face in lead generation?</p>
                        </div>
                    </div>
                </div>

                {/* Feature 6 */}
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 hover:bg-[#1A1A1A] transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px]" />
                    <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center mb-6">
                        <Handshake className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Deal Closing</h3>
                    <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-white/5">AI analyzes the entire conversation and recommends the next action.</p>
                    <div className="space-y-3">
                        <div className="bg-emerald-500 border border-emerald-400 text-white font-bold text-center py-2 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-5 h-5" /> CLOSE NOW
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white/5 text-center py-2 rounded-lg text-xs text-muted-foreground">Nurture</div>
                            <div className="flex-1 bg-white/5 text-center py-2 rounded-lg text-xs text-muted-foreground">Walk Away</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. AI Agents Section */}
      <section id="agents" className="py-24 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-primary/20">The Unfair Advantage</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">7 AI Agents Working Together</h2>
                <p className="text-muted-foreground text-lg">Displaying multiple AI agents makes your product advanced and intelligent. They operate asynchronously to build your business.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 hidden md:flex mb-12 relative">
                <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2 -z-10" />
                {["Strategy", "Goals", "Outreach", "Reply", "Call Script", "Debrief", "Close Signal"].map((agent, i) => (
                    <div key={i} className="bg-[#1A1A1A] border border-white/10 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Bot className="w-4 h-4 text-primary" />
                        {agent} Agent
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121212] p-5 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-white mb-1">Strategy Agent</h4>
                    <p className="text-sm text-muted-foreground">Generates cross-channel marketing plans instantly.</p>
                </div>
                <div className="bg-[#121212] p-5 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-white mb-1">Outreach Agent</h4>
                    <p className="text-sm text-muted-foreground">Writes deeply personalized cold emails at scale.</p>
                </div>
                <div className="bg-[#121212] p-5 rounded-2xl border border-border bg-gradient-to-br from-[#121212] to-primary/10">
                    <h4 className="font-bold text-white mb-1">Reply Agent</h4>
                    <p className="text-sm text-white/80">Analyzes inbound sentiment & handles objections.</p>
                </div>
                <div className="bg-[#121212] p-5 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-white mb-1">Call Script Agent</h4>
                    <p className="text-sm text-muted-foreground">Prepares dynamic sales scripts from email context.</p>
                </div>
            </div>
        </div>
      </section>

      {/* 7. How It Works */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">How MarketAI Pro Works</h2>
            <p className="text-muted-foreground text-lg">End-to-End Business Workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[20%] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent border-t border-dashed border-white/20" />
            
            <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black text-2xl mb-6 shadow-[0_0_30px_rgba(124,58,237,0.5)]">1</div>
                <h3 className="text-xl font-bold mb-3">Create Strategy</h3>
                <p className="text-muted-foreground text-sm">Input company details and our intelligent AI instantly generates a complete, multi-channel marketing plan.</p>
            </div>

            <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-2xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]">2</div>
                <h3 className="text-xl font-bold mb-3">Lead Nurturing</h3>
                <p className="text-muted-foreground text-sm">Add leads to the CRM. AI drafts emails, sends outreach, and handles responses autonomously.</p>
            </div>

            <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 relative z-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-2xl mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]">3</div>
                <h3 className="text-xl font-bold mb-3">Call & Close</h3>
                <p className="text-muted-foreground text-sm">AI prepares call scripts before meetings and recommends precisely when to close deals for max conversion.</p>
            </div>
        </div>
      </section>

      {/* 8. Dashboard Preview */}
      <section className="py-24 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">The Ultimate Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["Marketing Dashboard", "Leads Pipeline", "Email Threads", "AI Recommendations"].map((tab, i) => (
                    <div key={i} className="bg-[#1A1A1A] py-8 px-4 rounded-3xl border border-white/5 flex items-center justify-center text-muted-foreground font-medium hover:text-white hover:border-primary/50 transition-colors cursor-pointer">
                        {tab}
                    </div>
                ))}
            </div>
            <div className="mt-8 w-full h-[300px] md:h-[500px] bg-[url('/noise.png')] bg-[#121212] rounded-3xl border border-white/10 flex items-center justify-center">
                 <div className="text-center space-y-4">
                     <LayoutDashboard className="w-16 h-16 text-white/20 mx-auto" />
                     <p className="text-muted-foreground font-medium">Interactive Platform Mockup</p>
                 </div>
            </div>
        </div>
      </section>

      {/* 9 & 10. Benefits & Who Can Use It */}
      <section id="benefits" className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
            <h2 className="text-4xl font-bold tracking-tight mb-8">Why Businesses Choose Us</h2>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0"><CheckCircle2 className="text-emerald-500 w-5 h-5"/></div>
                    <div><h4 className="text-lg font-bold">Save Time</h4><p className="text-muted-foreground text-sm mt-1">Generate marketing strategies in seconds, not weeks.</p></div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"><CheckCircle2 className="text-blue-500 w-5 h-5"/></div>
                    <div><h4 className="text-lg font-bold">Reduce Costs</h4><p className="text-muted-foreground text-sm mt-1">Replace expensive marketing consultants with 24/7 AI agents.</p></div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><CheckCircle2 className="text-primary w-5 h-5"/></div>
                    <div><h4 className="text-lg font-bold">Increase Sales</h4><p className="text-muted-foreground text-sm mt-1">AI improves lead conversion with instant, smart replies.</p></div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0"><CheckCircle2 className="text-orange-500 w-5 h-5"/></div>
                    <div><h4 className="text-lg font-bold">Beginner Friendly</h4><p className="text-muted-foreground text-sm mt-1">So simple to use, even interns can manage marketing operations.</p></div>
                </div>
            </div>
        </div>

        <div className="bg-[#121212] p-10 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[60px]" />
            <h2 className="text-3xl font-bold tracking-tight mb-8 relative z-10">Who Can Use It?</h2>
            <div className="flex flex-wrap gap-3 relative z-10">
                {["Startups", "Small Businesses", "Marketing Teams", "Sales Teams", "Freelancers", "Marketing Interns"].map((user, i) => (
                    <span key={i} className="bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-full text-foreground/80 font-medium">
                        {user}
                    </span>
                ))}
            </div>
            <p className="mt-8 text-muted-foreground text-sm border-t border-white/5 pt-8 relative z-10">
                Complete Marketing + Sales Automation. Most tools only do one task. MarketAI Pro does strategy, lead management, email automation, sales calls, and closing recommendations.
            </p>
        </div>
      </section>

      {/* 11. CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-primary/30 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-white">Start Growing Your Business with AI Today.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 w-full sm:w-auto shadow-2xl">
                    Get Started Now
                </Link>
                <Link href="#demo" className="flex items-center justify-center gap-2 bg-black/50 text-white backdrop-blur-md border border-white/20 hover:bg-black/70 px-8 py-4 rounded-full text-lg font-medium transition-colors w-full sm:w-auto">
                    Try Interactive Demo
                </Link>
            </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-primary" />
                    <span className="font-bold text-xl tracking-tight text-white">MarketAI Pro</span>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">hello@marketaipro.com</a>
                </div>
            </div>
            <div className="text-center text-xs text-muted-foreground flex flex-col items-center justify-center border-t border-white/5 pt-8">
                <p>© 2026 MarketAI Pro. All rights reserved.</p>
                <p className="mt-2 text-white/30 truncate max-w-sm overflow-hidden">Crafted for the future of bold autonomous automation.</p>
            </div>
        </div>
      </footer>

    </div>
  );
}
