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

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'intro', label: 'Introduction' },
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'future', label: 'Future' },

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
                { num: '02', title: 'Fundamentals', desc: 'VMs, Hypervisors & Benefits', href: '#fundamentals' },
                { num: '03', title: 'Technologies', desc: 'Server, Storage & Cloud', href: '#technologies' },
                { num: '04', title: 'Strategy', desc: 'Assessment, Migration & Optimization', href: '#strategy' },
                { num: '05', title: 'Case Studies', desc: 'Netflix & AWS', href: '#case-studies' },
                { num: '06', title: 'Future Trends', desc: 'Cloud-Native, AI & Automation', href: '#future' },
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
      <section id="intro" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">1. Introduction to Digital Transformation</h2>
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
          <div className="section-fade-in mt-16">
            <WastedResourcesScene className="shadow-2xl border border-slate-200" />
          </div>
        </div>
      </section>

      {/* 2. Fundamentals Section */}
      <section id="fundamentals" className="pt-8 pb-24 bg-neutral-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">2. Fundamentals of Virtualization</h2>
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

          <div className="section-fade-in mt-20">
            <h3 className="text-2xl font-bold text-primary mb-8 text-center">Key Benefits of Virtualization</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Cost Reduction", desc: "Less hardware, power, and cooling.", ex: "From 10 servers to 2, saving $5k/year." },
                { title: "Isolation", desc: "VMs remain unaffected if others crash.", ex: "Test VM crashes, production stays up." },
                { title: "Rapid Deployment", desc: "New servers ready in minutes.", ex: "Web server in 10 mins vs weeks." },
                { title: "Live Migration", desc: "Move VMs without downtime.", ex: "Zero service interruption during maintenance." },
                { title: "Snapshots", desc: "Quick backup and restore points.", ex: "Rollback in seconds if updates fail." },
                { title: "Legacy Support", desc: "Run old OS on modern hardware.", ex: "Running Windows XP for legacy apps." }
              ].map((benefit, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <CheckCircle2 className="text-secondary w-4 h-4" /> {benefit.title}
                  </h4>
                  <p className="text-gray-text text-xs mb-3">{benefit.desc}</p>
                  <p className="text-[10px] text-primary/50 italic bg-neutral-bg p-2 rounded">
                    <strong>EX:</strong> {benefit.ex}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Hypervisor Stack Visualization */}
          <div className="section-fade-in mt-16">
            <HypervisorStackScene className="shadow-2xl border border-slate-200" />
          </div>
        </div>
      </section>

      {/* 3. Technologies Section */}
      <section id="technologies" className="pt-8 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">3. Virtualization Technologies</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: <Cpu />, title: "Server", desc: "Partitioning one physical server into multiple VMs.", ex: "Reduces 15 physical servers to 2." },
              { icon: <Database />, title: "Storage", desc: "Pooling physical storage from multiple devices into one logical unit.", ex: "Combining 3 hard drives for easier backup." },
              { icon: <Network />, title: "Network", desc: "Combining network resources into a software-based service.", ex: "Creating isolated virtual networks (VLANs)." }
            ].map((item, i) => (
              <div key={i} className="section-fade-in p-8 rounded-2xl bg-neutral-bg border border-slate-100">
                <div className="text-secondary mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{item.title} Virtualization</h3>
                <p className="text-gray-text text-sm mb-4">{item.desc}</p>
                <div className="text-xs font-medium text-primary/60 bg-white p-3 rounded-lg border border-slate-200">
                  <strong>EXAMPLE:</strong> {item.ex}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div className="section-fade-in space-y-6">
              <h3 className="text-3xl font-bold text-primary">Modern Evolution</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                    <Cloud />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary">Cloud Computing</h4>
                    <p className="text-gray-text text-sm leading-relaxed">Delivering virtualized resources (EC2, S3) over the internet on a pay-as-you-go basis. Enablers: AWS, Microsoft Azure.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Box />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary">Containerization</h4>
                    <p className="text-gray-text text-sm leading-relaxed">Lightweight evolution of VMs. Packages app code with dependencies, sharing the host OS kernel. Tools: Docker, Kubernetes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="section-fade-in overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-primary text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Aspect</th>
                    <th className="px-6 py-4">On-Premise</th>
                    <th className="px-6 py-4">Cloud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-6 py-4 font-bold text-primary">Cost Model</td>
                    <td className="px-6 py-4 text-gray-text">CapEx (Upfront)</td>
                    <td className="px-6 py-4 text-gray-text">OpEx (Pay-as-you-go)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-bold text-primary">Scalability</td>
                    <td className="px-6 py-4 text-gray-text">Limited & Slow</td>
                    <td className="px-6 py-4 text-gray-text">Highly Elastic</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-bold text-primary">Maintenance</td>
                    <td className="px-6 py-4 text-gray-text">Internal IT Team</td>
                    <td className="px-6 py-4 text-gray-text">Cloud Provider</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3D Dynamic Migration Visualization */}
          <div className="section-fade-in mt-16">
            <DynamicMigrationScene className="shadow-2xl border border-slate-200" />
          </div>
        </div>
      </section>

      {/* 4. Strategy Section */}
      <section id="strategy" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <div className="flex justify-center mb-6">
              <StrategyVisual className="w-[200px] h-[200px]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">4. Virtualization Strategy</h2>
            <p className="text-slate-300">A simple 3-step method for enterprise migration.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                icon: <Search />, 
                title: "Assessment", 
                word: "LOOK", 
                goal: "Know what you have.",
                details: ["Make a list of servers", "Check actual usage", "Identify dependencies"]
              },
              { 
                step: "02", 
                icon: <Move />, 
                title: "Migration", 
                word: "MOVE", 
                goal: "Transfer to the cloud.",
                details: ["Lift and Shift (Fastest)", "Re-platform (Optimized)", "Re-architect (Full Cloud)"]
              },
              { 
                step: "03", 
                icon: <BarChart3 />, 
                title: "Optimization", 
                word: "IMPROVE", 
                goal: "Reduce costs & improve.",
                details: ["Right-sizing servers", "Auto-scaling resources", "Reserved instances"]
              }
            ].map((item, i) => (
              <div key={i} className="section-fade-in relative group">
                <div className="absolute -top-4 -left-4 text-6xl font-black text-white/5 group-hover:text-secondary/10 transition-colors">{item.step}</div>
                <div className="relative bg-white/5 border border-white/10 p-8 rounded-2xl h-full flex flex-col">
                  <div className="text-secondary mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                  <p className="text-secondary font-bold text-xs tracking-widest mb-4 uppercase">"{item.word}"</p>
                  <p className="text-slate-300 text-sm mb-6 font-medium">{item.goal}</p>
                  <ul className="mt-auto space-y-3">
                    {item.details.map((detail, di) => (
                      <li key={di} className="flex items-center gap-2 text-xs text-slate-400">
                        <ArrowRight size={12} className="text-secondary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Case Studies Section */}
      <section id="case-studies" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Case Studies</h2>
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
                  <h3 className="text-2xl font-bold">AWS</h3>
                  <p className="text-sm text-slate-400">Cloud Provider Giant</p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed">
                  AWS provides virtual resources (EC2, Storage, Networks) instead of physical hardware. Companies rent these resources online.
                </p>
                <div className="space-y-4">
                  <h4 className="font-bold text-secondary">Key Benefits:</h4>
                  {[
                    "Fast deployment of applications",
                    "Flexible infrastructure",
                    "Pay-as-you-go model",
                    "Global scalability"
                  ].map((benefit, bi) => (
                    <div key={bi} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-secondary w-4 h-4" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Future Trends Section */}
      <section id="future" className="py-24 bg-neutral-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in text-center mb-16">
            <div className="flex justify-center mb-6">
              <FutureVisual className="w-[200px] h-[200px]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Future Trends</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Cloud-Native", desc: "Apps designed specifically for the cloud using microservices and K8s." },
              { title: "AI Infrastructure", desc: "Allocating GPU resources for massive computing power needed for AI models." },
              { title: "Automation", desc: "Automatic deployment, scaling, and monitoring of virtual environments." }
            ].map((item, i) => (
              <div key={i} className="section-fade-in bg-white p-8 rounded-2xl border border-slate-200 hover:-translate-y-2 transition-transform">
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



      {/* Footer */}
      <footer className="bg-primary py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm mb-8">
            University Presentation: Virtualization Strategy for Enabling Digital Transformation
          </p>
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Virtualization Strategy Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
