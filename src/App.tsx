import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  Layers, 
  Cpu, 
  Network, 
  ShieldAlert, 
  TrendingUp, 
  ChevronDown, 
  Menu, 
  X,
  Server,
  Cloud,
  Zap,
  Database,
  CheckCircle2,
  ArrowRight,
  Search,
  Move,
  BarChart3,
  Globe,
  Box
} from 'lucide-react';

import { FundamentalsVisual, TechnologiesVisual, StrategyVisual, FutureVisual } from './components/SectionVisuals';
import WastedResourcesScene from './components/WastedResourcesScene';
import HypervisorStackScene from './components/HypervisorStackScene';
import DynamicMigrationScene from './components/DynamicMigrationScene';
import SinglePointOfFailureScene from './components/SinglePointOfFailureScene';
import FutureTrendsScene from './components/FutureTrendsScene';
import TechnologiesScene from './components/TechnologiesScene';
import CaseStudiesScene from './components/CaseStudiesScene';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'intro', label: 'Introduction' },
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'impact', label: 'Impact' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'case-studies', label: 'Real-World Case Studies' },
  { id: 'future', label: 'Future Trends' },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.section-fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen selection:bg-secondary/30">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-secondary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-16 items-center relative">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center justify-center flex-wrap gap-x-4 lg:gap-x-8">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-gray-text hover:text-secondary transition-colors whitespace-nowrap"
                >
                  {section.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden absolute right-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-text hover:text-primary"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-text hover:text-secondary hover:bg-neutral-bg rounded-md"
              >
                {section.label}
              </a>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Virtualization Strategy for <br />
              <span className="text-secondary">Digital Transformation</span>
            </h1>


            {/* Table of Contents */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {[
                { num: '01', title: 'Introduction', desc: 'Digital Transformation Overview', href: '#intro' },
                { num: '02', title: 'Fundamentals', desc: 'VMs & Hypervisors', href: '#fundamentals' },
                { num: '03', title: 'Technologies', desc: 'Server, Storage & Cloud', href: '#technologies' },
                { num: '04', title: 'Impact', desc: 'Benefits & Challenges', href: '#impact' },
                { num: '05', title: 'Strategy', desc: 'Assessment & Migration', href: '#strategy' },
                { num: '06', title: 'Real-World Case Studies', desc: 'Netflix & AWS', href: '#case-studies' },
                { num: '07', title: 'Future Trends', desc: 'Cloud-Native & AI', href: '#future' },
              ].map((item, i) => (
                <motion.a
                  key={item.num}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="group text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-secondary/10 hover:border-secondary/30 transition-all"
                >
                  <span className="text-secondary/50 text-xs font-bold tracking-widest group-hover:text-secondary transition-colors">{item.num}</span>
                  <h3 className="text-white font-bold text-sm mt-1 group-hover:text-secondary transition-colors">{item.title}</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">{item.desc}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
          

        </div>
      </section>

      {/* 1. Introduction Section */}
      <section id="intro" className="pt-32 pb-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">1. Introduction to Digital Transformation</h2>
            <p className="text-gray-text mb-4 text-lg">The Core of Modern Business Evolution</p>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="section-fade-in space-y-8">
              <div className="bg-neutral-bg p-8 rounded-2xl border border-slate-100">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Globe className="text-secondary" /> Definition
                </h3>
                <p className="text-gray-text leading-relaxed">
                  Integration of digital technology into all business areas, fundamentally changing operations and customer value delivery.
                </p>
              </div>
              <div className="bg-primary text-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-secondary" /> The Goal
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Increase agility, efficiency, and innovation across the entire enterprise ecosystem.
                </p>
              </div>
            </div>
            <div className="section-fade-in space-y-6">
              <h3 className="text-2xl font-bold text-primary">Role of Virtualization</h3>
              <p className="text-gray-text leading-relaxed">
                Virtualization acts as the <strong>foundational enabler</strong>. It transforms rigid physical infrastructure into flexible, software-defined resources that can be provisioned in minutes.
              </p>
              <div className="p-6 bg-secondary/10 border-l-4 border-secondary rounded-r-xl">
                <p className="text-primary font-medium italic">
                  "Example: A bank using virtualization to deploy new services in days instead of months."
                </p>
              </div>
            </div>
          </div>

          {/* 3D Wasted Resources Visualization */}
          <div className="section-fade-in mt-16 bg-[#0f172a] p-8 md:p-12 rounded-[3rem] border border-blue-500/20 shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden relative">
            <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-white/5 relative z-10">
              <WastedResourcesScene />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. Fundamentals Section */}
      <section id="fundamentals" className="pt-32 pb-24 bg-neutral-bg scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">2. Fundamentals of Virtualization</h2>
            <p className="text-gray-text mb-4 text-lg">Understanding VMs and Hypervisors</p>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="section-fade-in bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-4">Simple Definitions</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-secondary uppercase text-xs tracking-widest mb-2">Virtualization</h4>
                  <p className="text-gray-text">Creating a software-based (virtual) version of servers, storage, or networks instead of using physical hardware.</p>
                </div>
                <div>
                  <h4 className="font-bold text-secondary uppercase text-xs tracking-widest mb-2">Hypervisor</h4>
                  <p className="text-gray-text">Software layer that allows multiple virtual machines to run on a single physical machine.</p>
                </div>
              </div>
            </div>
            <div className="section-fade-in bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-4">Virtual Machines (VMs)</h3>
              <p className="text-gray-text mb-4">A software-based computer that runs its own OS and applications, isolated from other VMs.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-gray-text">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <span>Behaves exactly like a physical computer.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-text">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <span>Shares underlying hardware resources.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-text">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <span>Example: Running Linux and Windows simultaneously on one MacBook.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="section-fade-in">
            <h3 className="text-2xl font-bold text-primary mb-8 text-center">Hypervisor Types</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary text-white rounded-lg"><Server size={20} /></div>
                  <h4 className="text-xl font-bold text-primary">Type 1 (Bare-Metal)</h4>
                </div>
                <p className="text-gray-text mb-4 text-sm">Runs directly on physical hardware. Used primarily in enterprise data centers.</p>
                <p className="text-xs font-bold text-secondary">EXAMPLES: VMware ESXi, Microsoft Hyper-V</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-secondary text-primary rounded-lg"><Layers size={20} /></div>
                  <h4 className="text-xl font-bold text-primary">Type 2 (Hosted)</h4>
                </div>
                <p className="text-gray-text mb-4 text-sm">Runs on top of an existing OS. Used for testing and development environments.</p>
                <p className="text-xs font-bold text-secondary">EXAMPLES: Oracle VirtualBox, VMware Workstation</p>
              </div>
            </div>
          </div>



          {/* 3D Hypervisor Stack Visualization */}
          <div className="section-fade-in mt-16 bg-[#0f172a] p-8 md:p-12 rounded-[3rem] border border-blue-500/20 shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden relative">
            <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-white/5 relative z-10">
              <HypervisorStackScene />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>



      {/* 3. Technologies Section */}
      <section id="technologies" className="pt-32 pb-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-4 uppercase tracking-tighter">3. Virtualization Technologies</h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          {/* Primary Virtualization Types */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            <div className="bg-neutral-bg p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-secondary opacity-[0.03] group-hover:opacity-10 transition-opacity"><Cpu size={160} /></div>
              <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary font-bold">01</div>
                Server Virtualization (:
              </h3>
              <p className="text-gray-text leading-relaxed font-medium">
                This means partitioning one physical server into multiple Virtual Machines (VMs) .
              </p>
              <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all group-hover:border-secondary/30">
                <p className="text-sm text-primary/80 italic font-bold leading-relaxed">
                  "For example, instead of running 15 physical servers, we can run them all on just 2 physical machines, saving huge amounts of space and power."
                </p>
              </div>
            </div>

            <div className="bg-neutral-bg p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-secondary opacity-[0.03] group-hover:opacity-10 transition-opacity"><Database size={160} /></div>
              <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary font-bold">02</div>
                Storage Virtualization :
              </h3>
              <p className="text-gray-text leading-relaxed font-medium">
                This is pooling physical storage from multiple devices into one logical unit ).
              </p>
              <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all group-hover:border-secondary/30">
                <p className="text-sm text-primary/80 italic font-bold leading-relaxed">
                  "For example, combining 3 different hard drives to act as one large drive for easier management and backup."
                </p>
              </div>
            </div>

            <div className="bg-neutral-bg p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-secondary opacity-[0.03] group-hover:opacity-10 transition-opacity"><Network size={160} /></div>
              <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary font-bold">03</div>
                Network Virtualization :
              </h3>
              <p className="text-gray-text leading-relaxed font-medium">
                Combining network resources into a software-based service , like creating isolated virtual networks or VLANs without changing the physical cables.
              </p>
              <div className="mt-8 h-4 w-1/2 bg-secondary/5 rounded-full" />
            </div>
          </div>

          {/* 3 Modern Technologies */}
          <div className="mb-32 bg-[#0f172a] rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
             
             <div className="relative z-10 text-center mb-16">
               <h3 className="text-4xl md:text-5xl font-black mb-6 flex flex-col items-center gap-4">
                 <span className="text-secondary text-sm font-bold tracking-[0.6em] uppercase italic">Modern Era</span>
                 3. Building on Foundations
               </h3>
               <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">Reaching the peak of software-governed infrastructure.</p>
             </div>

             <div className="grid md:grid-cols-2 gap-12 relative z-10">
               <div className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/10 hover:border-secondary/30 transition-all group">
                 <div className="w-16 h-16 bg-secondary text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.4)]"><Cloud size={32} /></div>
                 <h4 className="text-3xl font-black text-white">Cloud Computing ):</h4>
                 <p className="text-slate-300 text-xl leading-relaxed font-medium italic">
                   "The cloud takes those virtualized servers, storage, and networks, and delivers them overت). It uses a Pay-as-you-go model )."
                 </p>
                 <div className="pt-6 border-t border-white/10 flex flex-wrap gap-3">
                   <p className="w-full text-xs text-secondary font-bold uppercase tracking-widest mb-2 italic">Top Examples:</p>
                   <span className="px-4 py-2 bg-secondary/10 rounded-xl border border-secondary/20 text-secondary text-sm font-black">AWS (Amazon Web Services)</span>
                   <span className="px-4 py-2 bg-secondary/10 rounded-xl border border-secondary/20 text-secondary text-sm font-black">Microsoft Azure</span>
                 </div>
               </div>

               <div className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/10 hover:border-secondary/30 transition-all group">
                 <div className="w-16 h-16 bg-secondary text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.4)]"><Box size={32} /></div>
                 <h4 className="text-3xl font-black text-white">Containerization ت):</h4>
                 <p className="text-slate-300 text-xl leading-relaxed font-medium italic">
                   "While traditional Virtual Machines are heavy, Containers are a modern, lightweight evolution ن). They package only the application code, making them much faster."
                 </p>
                 <div className="pt-6 border-t border-white/10 flex flex-wrap gap-3">
                   <p className="w-full text-xs text-secondary font-bold uppercase tracking-widest mb-2 italic">Essential Tools:</p>
                   <span className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-slate-300 text-sm font-bold">Docker (Creation)</span>
                   <span className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-slate-300 text-sm font-bold">Kubernetes (Scaling اً))</span>
                 </div>
               </div>
             </div>
          </div>

          {/* 4 On-Premise vs Cloud - Car Analogy */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-5xl font-black text-primary mb-4 uppercase tracking-tighter">4. (On-Premise vs. Cloud)</h3>
              <p className="text-gray-text text-xl font-bold italic">" owning your own car vs. using a ride-sharing app ة) "</p>
            </div>

            <div className="bg-neutral-bg rounded-[3.5rem] p-10 md:p-16 border border-slate-200 shadow-xl">
               <div className="grid md:grid-cols-2 gap-8">
                 {[
                   { 
                     label: "Cost اة):", 
                     text: "Owning a car is a CapEx (Capital Expenditure) requiring a big upfront payment ( The Cloud is OpEx (Operational Expenditure), you pay only for the ride",
                     accent: "bg-blue-500"
                   },
                   { 
                     label: "Scalability ة):", 
                     text: "If you need more seats locally, you must buy a new car. In the cloud, you instantly request a bigger vehicle ().",
                     accent: "bg-secondary"
                   },
                   { 
                     label: "Maintenance ():", 
                     text: "On-premise, your IT team fixes the engine. In the cloud, the provider handles all maintenan.",
                     accent: "bg-emerald-500"
                   },
                   { 
                     label: "Security):", 
                     text: "On-premise gives you physical control in your garage. The cloud secures your data with world-class enterprise cybersecurity).",
                     accent: "bg-red-500"
                   }
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                     <div className="flex items-center gap-4 mb-6">
                       <div className={`w-3 h-3 rounded-full ${item.accent} group-hover:scale-150 transition-transform`} />
                       <h5 className="text-xl font-black text-primary tracking-tight">{item.label}</h5>
                     </div>
                     <p className="text-gray-text text-lg leading-relaxed font-medium italic border-l-4 border-slate-100 pl-6 group-hover:border-secondary transition-colors">
                       {item.text}
                     </p>
                   </div>
                 ))}
               </div>

               <div className="mt-16 p-8 bg-primary text-white rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full" />
                 <p className="text-2xl font-black leading-relaxed italic relative z-10">
                   "Finally, for an enterprise forming its strategy, what is the difference between On-Premise and the Cloudة؟)"
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact Section */}
      <section id="impact" className="pt-32 pb-24 bg-neutral-bg scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">4. Impact of Virtualization</h2>
            <p className="text-gray-text mb-4 text-lg">Benefits & Challenges in Digital Transformation</p>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Benefits */}
            <div className="section-fade-in space-y-6">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <CheckCircle2 className="text-secondary" /> Key Benefits
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Cost Reduction", desc: "Reduces the need for physical servers, saving up to 30-50% on hardware, electricity, and cooling." },
                  { title: "Better Resource Utilization", desc: "Instead of using only 10-15% of a server's capacity, virtualization increases usage to 70-80%." },
                  { title: "Scalability & Flexibility", desc: "New applications and services can be deployed quickly without buying new hardware." },
                  { title: "Disaster Recovery", desc: "Virtual machines can be backed up and restored quickly, reducing downtime." },
                  { title: "Business Continuity", desc: "Helps companies continue operations even after system failures." },
                  { title: "Simplified Management", desc: "Centralized tools allow automation of updates, monitoring, and maintenance." }
                ].map((benefit, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-primary">{benefit.title}</h4>
                    <p className="text-gray-text text-sm mt-1">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="section-fade-in space-y-6">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> Challenges & Risks
              </h3>
              <div className="space-y-4">
                {[
                  { title: "High Initial Cost", desc: "Requires investment in software, hardware, and licenses." },
                  { title: "Need for Skilled Staff", desc: "Managing virtual environments requires expertise." },
                  { title: "Security Risks", desc: "Multiple virtual machines on one server increase risk of attacks." },
                  { title: "Performance Issues", desc: "Sharing resources between VMs can reduce performance." },
                  { title: "Single Point of Failure", desc: "If the main server fails, all virtual machines are affected." },
                  { title: "Licensing Complexity", desc: "Some software licenses are difficult to manage in virtual environments." }
                ].map((challenge, i) => (
                  <div key={i} className="bg-red-50 p-4 rounded-xl border border-red-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-red-900">{challenge.title}</h4>
                    <p className="text-red-700 text-sm mt-1">{challenge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Real Case Example */}
            <div className="section-fade-in bg-primary text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-secondary">Real Case Example</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3"><ArrowRight className="text-secondary w-5 h-5 shrink-0" /> Company reduced 100 physical servers to 15 virtual servers</li>
                <li className="flex items-center gap-3"><ArrowRight className="text-secondary w-5 h-5 shrink-0" /> Hardware costs reduced by 40%</li>
                <li className="flex items-center gap-3"><ArrowRight className="text-secondary w-5 h-5 shrink-0" /> Energy consumption reduced by 35%</li>
                <li className="flex items-center gap-3"><ArrowRight className="text-secondary w-5 h-5 shrink-0" /> Annual savings: <span className="font-bold text-secondary ml-1">$50,000 - $100,000</span></li>
                <li className="flex items-center gap-3"><ArrowRight className="text-secondary w-5 h-5 shrink-0" /> Recovery time improved from 24 hours to less than 1 hour</li>
              </ul>
            </div>

            {/* Conclusion */}
            <div className="section-fade-in bg-white p-8 rounded-2xl border border-slate-200 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 text-primary">Conclusion</h3>
              <ul className="space-y-4 text-gray-text font-medium">
                <li className="flex items-start gap-3"><CheckCircle2 className="text-secondary w-5 h-5 shrink-0 mt-0.5" /> Virtualization is a key enabler of digital transformation.</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-secondary w-5 h-5 shrink-0 mt-0.5" /> It improves cost efficiency, flexibility, and performance.</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-secondary w-5 h-5 shrink-0 mt-0.5" /> However, companies must manage security, cost, and complexity.</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-secondary w-5 h-5 shrink-0 mt-0.5" /> When well implemented, it provides strong long-term benefits.</li>
              </ul>
            </div>
          </div>

          <div className="mt-20 bg-black p-8 md:p-12 rounded-[3rem] border border-red-500/20 shadow-[0_0_50px_rgba(255,0,0,0.1)] overflow-hidden relative">
            <h3 className="text-3xl font-bold text-white mb-2 text-center relative z-10 flex flex-col items-center gap-4">
              <span className="text-red-500 flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-2">
                <ShieldAlert className="w-8 h-8" />
              </span>
              The Centralization Risk
            </h3>
            <p className="text-slate-400 text-center mb-10 text-lg max-w-2xl mx-auto relative z-10">
              Centralizing multiple virtual machines on a single physical server increases the impact of hardware failure if not managed with proper redundancy.
            </p>
            
            <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-white/5 relative z-10">
              <SinglePointOfFailureScene />
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 5. Strategy Section */}
      <section id="strategy" className="pt-32 pb-24 bg-primary text-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">5. Virtualization Strategy</h2>
            <p className="text-slate-300 text-lg mb-16">A simple 3-step method for enterprise migration.</p>
          </div>

          <div className="mb-20 max-w-6xl mx-auto">
            <h3 className="text-4xl font-bold text-center mb-8">What is a Strategy?</h3>
            <div className="section-fade-in bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-16 shadow-2xl">
              <p className="text-slate-300 text-xl leading-relaxed mb-10 border-b border-white/10 pb-10 text-center max-w-4xl mx-auto">
                A strategy is simply a structured plan that answers three questions:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#111827] rounded-3xl p-8 border border-secondary/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full transition-transform group-hover:scale-110" />
                  <h4 className="text-3xl font-bold text-white mb-4 relative z-10 flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-secondary text-[#111827] flex items-center justify-center font-black text-xl">1</div> What?</h4>
                  <p className="text-secondary font-medium relative z-10 text-xl ml-14">&rarr; What do we want to do?</p>
                </div>
                <div className="bg-[#111827] rounded-3xl p-8 border border-secondary/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full transition-transform group-hover:scale-110" />
                  <h4 className="text-3xl font-bold text-white mb-4 relative z-10 flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-secondary text-[#111827] flex items-center justify-center font-black text-xl">2</div> How?</h4>
                  <p className="text-secondary font-medium relative z-10 text-xl ml-14">&rarr; How will we do it?</p>
                </div>
                <div className="bg-[#111827] rounded-3xl p-8 border border-secondary/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full transition-transform group-hover:scale-110" />
                  <h4 className="text-2xl lg:text-3xl font-bold text-white mb-4 relative z-10 flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-secondary text-[#111827] flex items-center justify-center font-black text-xl">3</div> In what order?</h4>
                  <p className="text-secondary font-medium relative z-10 text-xl ml-14">&rarr; Where do we start?</p>
                </div>
              </div>

              <p className="text-slate-300 text-xl leading-loose text-center max-w-4xl mx-auto px-6 border-l-4 border-r-4 border-secondary/50 py-6 italic bg-black/20 rounded-3xl">
                "For virtualization, it's the plan to move from physical servers to virtual or cloud environments in a way that is safe, organized, and effective."
              </p>
            </div>

            <h3 className="text-3xl md:text-5xl font-bold text-center mb-12">We will explore a simple 3-step method:</h3>
            <div className="section-fade-in grid md:grid-cols-3 gap-6 mb-16">
              {[
                { step: "1. Assessment", word: "Look", goal: "Know what you have and decide what to do" },
                { step: "2. Migration", word: "Move", goal: "Transfer to the cloud step by step" },
                { step: "3. Optimization", word: "Improve", goal: "Reduce costs and improve performance" }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2.5rem] p-10 border border-white/10 relative shadow-2xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
                  <div className="text-secondary font-bold text-3xl mb-6">{item.step}</div>
                  <div className="bg-secondary/10 text-secondary text-sm font-bold tracking-[0.2em] uppercase py-3 px-8 rounded-full mb-8 whitespace-nowrap shadow-inner border border-secondary/20">
                    In One Word: {item.word}
                  </div>
                  <p className="text-slate-300 text-xl leading-relaxed"><strong className="text-white block mb-3 text-lg opacity-60 uppercase tracking-widest">Goal</strong> {item.goal}</p>
                </div>
              ))}
            </div>

            <div className="w-24 h-1 bg-white/10 mx-auto my-24 rounded-full" />

            {/* Step 1 */}
            <div className="section-fade-in mb-24">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-12 justify-center">
                <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-primary font-black text-4xl shadow-[0_0_40px_rgba(34,211,238,0.3)]">1</div>
                <div className="text-center md:text-left">
                  <h3 className="text-5xl font-bold text-white mb-2">Assessment</h3>
                  <span className="text-slate-400 text-2xl font-medium">(Looking at What You Have)</span>
                </div>
              </div>
              
              <div className="bg-[#111827] rounded-3xl p-10 border-l-4 border-l-secondary mb-16 shadow-xl max-w-4xl mx-auto">
                <h4 className="text-secondary font-bold mb-4 uppercase tracking-widest">What it means:</h4>
                <p className="text-slate-300 text-2xl leading-relaxed font-light">
                  Before you move anything, you need to know exactly what you own. You look at every physical server, every application, every piece of data. Then you decide what to do with each one.
                </p>
              </div>

              <h4 className="text-3xl font-bold text-white mb-8 text-center">What you do in this step:</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {[
                  { action: "Make a list", exp: "Write down each server and what it does (email, website, etc.)" },
                  { action: "Check usage", exp: "Many servers run but are not really used" },
                  { action: "Identify dependencies", exp: "Some applications are linked: if you move one, the other must follow" },
                  { action: "Check rules", exp: "Some data must stay in the country or on-premises due to regulations" },
                  { action: "Categorize", exp: "Decide for each server: move, keep on-premise, or retire" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors shadow-lg shadow-black/20">
                    <div className="text-secondary font-bold text-2xl mb-4 flex items-center gap-4"><CheckCircle2 className="w-6 h-6"/> {item.action}</div>
                    <div className="text-slate-300 text-lg leading-relaxed">{item.exp}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
                <div className="relative z-10">
                  <h4 className="text-3xl font-bold text-white mb-2">Simple Example</h4>
                  <p className="text-secondary font-medium text-xl mb-12">A small company has 4 servers:</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-black/20 rounded-3xl p-8 border border-white/5 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                      <div>
                        <div className="font-bold text-white text-2xl mb-2">Email</div>
                        <div className="text-slate-400 text-lg mb-8">Usage: Used every day</div>
                      </div>
                      <div className="text-emerald-400 font-bold bg-emerald-400/10 py-3 px-6 text-lg rounded-2xl w-fit flex items-center gap-2 group-hover:bg-emerald-400/20 transition-colors"><ArrowRight className="w-5 h-5"/> Move to cloud</div>
                    </div>
                    <div className="bg-black/20 rounded-3xl p-8 border border-white/5 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                      <div>
                        <div className="font-bold text-white text-2xl mb-2">Customer database</div>
                        <div className="text-slate-400 text-lg mb-8">Usage: Used every day</div>
                      </div>
                      <div className="text-emerald-400 font-bold bg-emerald-400/10 py-3 px-6 text-lg rounded-2xl w-fit flex items-center gap-2 group-hover:bg-emerald-400/20 transition-colors"><ArrowRight className="w-5 h-5"/> Move to cloud</div>
                    </div>
                    <div className="bg-black/20 rounded-3xl p-8 border border-white/5 flex flex-col justify-between group hover:border-red-400/30 transition-colors">
                      <div>
                        <div className="font-bold text-white text-2xl mb-2">Old HR system</div>
                        <div className="text-slate-400 text-lg mb-8">Usage: Used twice a month</div>
                      </div>
                      <div className="text-red-400 font-bold bg-red-400/10 py-3 px-6 text-lg rounded-2xl w-fit flex items-center gap-2 group-hover:bg-red-400/20 transition-colors"><ArrowRight className="w-5 h-5"/> Retire <span className="font-normal opacity-70 text-sm ml-2">(no longer needed)</span></div>
                    </div>
                    <div className="bg-black/20 rounded-3xl p-8 border border-white/5 flex flex-col justify-between group hover:border-blue-400/30 transition-colors">
                      <div>
                        <div className="font-bold text-white text-2xl mb-2">Financial data</div>
                        <div className="text-slate-400 text-lg mb-8">Usage: Legal requirement</div>
                      </div>
                      <div className="text-blue-400 font-bold bg-blue-400/10 py-3 px-6 text-lg rounded-2xl w-fit flex items-center gap-2 group-hover:bg-blue-400/20 transition-colors"><ArrowRight className="w-5 h-5"/> Keep on-premise</div>
                    </div>
                  </div>

                  <div className="bg-secondary/10 border border-secondary/30 p-8 rounded-3xl">
                    <h4 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3"><CheckCircle2 className="w-6 h-6"/> Result Summary</h4>
                    <ul className="space-y-4 text-slate-200 text-xl font-medium">
                      <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(34,211,238,0.8)]" /> <span className="text-white font-bold w-28">2 servers</span> &rarr; move to cloud</li>
                      <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" /> <span className="text-white font-bold w-28">1 server</span> &rarr; keep on-premise</li>
                      <li className="flex items-center gap-4"><div className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" /> <span className="text-white font-bold w-28">1 server</span> &rarr; retire <span className="text-slate-400 font-normal italic ml-2">(immediate savings)</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-24 h-1 bg-white/10 mx-auto my-24 rounded-full" />

            {/* Step 2 */}
            <div className="section-fade-in mb-24">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-12 justify-center">
                <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-primary font-black text-4xl shadow-[0_0_40px_rgba(34,211,238,0.3)]">2</div>
                <div className="text-center md:text-left">
                  <h3 className="text-5xl font-bold text-white mb-2">Migration</h3>
                  <span className="text-slate-400 text-2xl font-medium">(Moving to the Cloud)</span>
                </div>
              </div>
              
              <div className="bg-[#111827] rounded-3xl p-10 border-l-4 border-l-secondary mb-16 shadow-xl max-w-4xl mx-auto">
                <h4 className="text-secondary font-bold mb-4 uppercase tracking-widest">What it means:</h4>
                <p className="text-slate-300 text-2xl leading-relaxed font-light">
                  Now you actually move the systems. You take what was running on physical machines and make it run on virtual machines in the cloud.
                </p>
              </div>

              <h4 className="text-3xl font-bold text-center text-white mb-10">Migration Strategies: The 6 R's</h4>
              <div className="grid lg:grid-cols-3 gap-8 mb-24">
                {[
                  { 
                    method: "Rehosting", 
                    alias: "Lift & Shift",
                    exp: "Copying applications directly to the cloud without any changes to the code or architecture.", 
                    tech: ["AWS SMS", "Azure Site Recovery", "VM Import/Export"],
                    effort: "Low Effort",
                    speed: "Fastest"
                  },
                  { 
                    method: "Replatforming", 
                    alias: "Lift & Reshape",
                    exp: "Making minor adjustments to take advantage of cloud-managed services (like switching from self-managed DB to managed RDS).", 
                    tech: ["DB Migration Services", "Managed Runtimes", "Container Sidecars"],
                    effort: "Medium Effort",
                    speed: "Moderate"
                  },
                  { 
                    method: "Refactoring", 
                    alias: "Re-architecting",
                    exp: "Full redesign to cloud-native microservices. Uses serverless, K8s, and event-driven architectures.", 
                    tech: ["AWS Lambda", "Kubernetes", "Microservices"],
                    effort: "High Effort",
                    speed: "Slow"
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full group hover:border-secondary/50 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-2">
                    <div className="bg-black/30 p-8 border-b border-white/5">
                      <div className="text-secondary font-bold text-3xl mb-1">{item.method}</div>
                      <div className="text-slate-500 text-sm font-mono uppercase tracking-widest">{item.alias}</div>
                    </div>
                    <div className="p-8 flex-grow flex flex-col justify-between">
                      <div className="space-y-6">
                        <p className="text-slate-300 text-lg leading-relaxed">{item.exp}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tech.map((t, ti) => (
                            <span key={ti} className="text-[10px] px-2 py-1 bg-white/5 rounded-md border border-white/10 text-slate-400">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Effort: <span className="text-secondary">{item.effort}</span></span>
                        <span className="text-slate-500">Speed: <span className="text-secondary">{item.speed}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="text-3xl font-bold text-center text-white mb-12">How to Move Safely (Step by Step)</h4>
              <div className="relative max-w-5xl mx-auto padding-8">
                <div className="absolute left-[47px] md:left-1/2 md:-ml-[2px] top-4 bottom-4 w-1 bg-gradient-to-b from-secondary/50 via-secondary/20 to-transparent rounded-full hidden md:block" />
                <div className="space-y-6 relative">
                  {[
                    { title: "Start small", exp: "Move a low-risk application first to learn the process" },
                    { title: "Use tools", exp: "Cloud providers (Azure, AWS) offer tools that automate migration" },
                    { title: "Test before switching", exp: "Run the system in the cloud while the old one is still running to verify everything works" },
                    { title: "Cut over", exp: "When ready, redirect users to the cloud version" },
                    { title: "Keep a backup", exp: "Keep the old server running for a few days in case something goes wrong, then turn it off" }
                  ].map((item, i) => (
                    <div key={i} className={`flex flex-col md:flex-row gap-6 relative group items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="md:w-1/2" />
                      <div className="absolute left-0 md:left-1/2 md:-ml-10 w-20 h-20 shrink-0 bg-[#0f172a] rounded-full border-4 border-secondary flex items-center justify-center font-black text-3xl text-white shadow-[0_0_30px_rgba(34,211,238,0.2)] z-10 group-hover:scale-110 transition-transform">{i+1}</div>
                      <div className={`pl-28 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                        <div className="bg-[#111827] rounded-3xl p-8 border border-white/5 hover:border-secondary/30 transition-colors shadow-lg">
                          <h5 className="text-3xl font-bold text-white mb-3">{item.title}</h5>
                          <p className="text-slate-300 text-lg leading-relaxed">{item.exp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-24 h-1 bg-white/10 mx-auto my-24 rounded-full" />

            {/* Step 3 */}
              <div className="section-fade-in">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12 justify-center">
                <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-primary font-black text-4xl shadow-[0_0_40px_rgba(34,211,238,0.3)]">3</div>
                <div className="text-center md:text-left">
                  <h3 className="text-5xl font-bold text-white mb-2">Optimization</h3>
                  <span className="text-slate-400 text-2xl font-medium">(Making Things Better After the Move)</span>
                </div>
              </div>
              
              <div className="bg-[#111827] rounded-3xl p-10 border-l-4 border-l-secondary mb-16 shadow-xl max-w-4xl mx-auto">
                <h4 className="text-secondary font-bold mb-4 uppercase tracking-widest">What it means:</h4>
                <p className="text-slate-300 text-2xl leading-relaxed font-light">
                  After everything is in the cloud, you don't just leave it. You look at how it's running and make changes to save money, improve speed, and increase reliability.
                </p>
              </div>

              <h4 className="text-3xl font-bold text-center text-white mb-10">What You Can Improve</h4>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  { title: "Right-sizing servers", desc: "Downgrade overly powerful VMs to match actual usage and cut wasted expenses." },
                  { title: "Auto-scaling resources", desc: "Automatically spin up new instances during high traffic, and remove them when traffic drops." },
                  { title: "Reserved instances", desc: "Commit to long-term usage (1-3 years) for steady workloads to get massive discounts." }
                ].map((item, i) => (
                  <div key={i} className="bg-gradient-to-b from-[#111827] to-black/20 rounded-[2.5rem] p-10 border border-white/5 text-center hover:-translate-y-3 transition-transform shadow-2xl hover:border-secondary/30">
                    <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary mb-8 shrink-0"><CheckCircle2 className="w-10 h-10"/></div>
                    <h5 className="font-bold text-white text-2xl mb-4">{item.title}</h5>
                    <p className="text-slate-400 leading-relaxed text-lg">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="section-fade-in mt-16 overflow-hidden rounded-3xl border border-white/10 shadow-2xl max-w-5xl mx-auto bg-black/20">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#111827] text-secondary text-sm uppercase tracking-widest border-b border-white/10">
                    <tr>
                      <th className="px-8 py-5 font-bold">Action</th>
                      <th className="px-8 py-5 font-bold">Simple Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { action: "Right-sizing", exp: "Many servers are oversized \"just in case.\" Reduce them if needed." },
                      { action: "Auto-scaling", exp: "The system grows when many people use it. It shrinks when few people use it. You pay only for what you need." },
                      { action: "Delete unused resources", exp: "Forgotten test servers still cost money. Find and delete them." },
                      { action: "Reserved instances", exp: "If you know you will use a server for a long time, you can promise to keep it. The cloud provider gives you a lower price." },
                      { action: "Monitor and alert", exp: "Make a dashboard to watch your spending. Get a warning if you spend too much." }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6 font-bold text-white text-lg">{row.action}</td>
                        <td className="px-8 py-6 text-slate-300 text-lg leading-relaxed">{row.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
           
          </div>
        </div>
      </section>

      {/* 6. Case Studies Section */}
      <section id="case-studies" className="pt-32 pb-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">6. Real-World Case Studies</h2>
            <p className="text-gray-text mb-4 text-lg">How Leaders Transform Their Operations</p>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="section-fade-in bg-neutral-bg p-10 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black">N</div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">Netflix</h3>
                  <p className="text-sm text-gray-text">Global Streaming Leader</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-primary mb-2">The Problem</h4>
                  <p className="text-sm text-gray-text">Traffic explodes during weekends or new releases. Traditional infrastructure couldn't handle the scale.</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-2">The Solution</h4>
                  <p className="text-sm text-gray-text">Moved to virtualized cloud infrastructure on AWS. Uses virtual servers instead of physical ones.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-secondary font-bold text-xl">Auto</p>
                    <p className="text-[10px] uppercase tracking-tighter text-gray-text">Scaling</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-secondary font-bold text-xl">High</p>
                    <p className="text-[10px] uppercase tracking-tighter text-gray-text">Availability</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-fade-in bg-primary p-10 rounded-3xl text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3">
                  <Cloud className="text-primary w-full h-full" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Amazon Web Services (AWS)</h3>
                  <p className="text-sm text-slate-400">Pioneer of Public Cloud</p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed">
                  By virtualizing their massive excess capacity, AWS transformed internal operations into the world's leading cloud platform, hosting millions of virtualized workloads globally.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Availability Zones", value: "30+" },
                    { label: "Active Customers", value: "1M+" },
                    { label: "EC2 Instances", value: "700+" },
                    { label: "Global Regions", value: "100+" }
                  ].map((stat, si) => (
                    <div key={si} className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                      <p className="text-secondary font-bold text-sm tracking-tight">{stat.value}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* 7. Future Trends Section */}
      <section id="future" className="pt-0 pb-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <div className="flex justify-center mb-6">
              <FutureVisual className="w-[200px] h-[200px]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">7. Future Trends</h2>
            <p className="text-gray-text mb-4 text-lg">The Next Generation of Virtualized Systems</p>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Cloud-Native", desc: "Apps designed specifically for the cloud using microservices and K8s." },
              { title: "AI Infrastructure", desc: "Allocating GPU resources for massive computing power needed for AI models." },
              { title: "Automation", desc: "Automatic deployment, scaling, and monitoring of virtual environments." },
              { title: "Serverless", desc: "Running code without managing servers, paying only for execution time." },
              { title: "Edge Computing", desc: "Bringing virtualization closer to the data source for ultra-low latency." }
            ].map((item, i) => (
              <div key={i} className="section-fade-in bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-2 transition-transform shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 section-fade-in bg-primary text-white p-12 rounded-3xl text-center">
            <h3 className="text-3xl font-bold mb-6">Conclusion</h3>
            <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed italic">
              "Virtualization has become a fundamental technology for digital transformation. Real-world examples like Netflix demonstrate how it enables scalable, flexible, and cost-efficient infrastructure. Looking ahead, cloud-native architectures and AI will further expand its role in shaping the future of digital enterprises."
            </p>
          </div>

        </div>
      </section>

      <footer className="py-10 bg-[#070b14] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="w-8 h-1 bg-secondary/20 rounded-full" />
          <p className="text-slate-600 text-[10px] uppercase font-bold tracking-[0.25em]">
            Virtualization Strategy Presentation
          </p>
        </div>
      </footer>
    </div>
  );
}
