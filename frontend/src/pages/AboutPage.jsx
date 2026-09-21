import React from 'react';
import { Compass, Globe2, ShieldCheck, HeartHandshake, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const values = [
    {
      icon: Compass,
      title: 'Curated Excellence',
      description: 'We reject generic mass tourism. Every hotel, rail line, and private guide is individually audited for unparalleled quality.',
    },
    {
      icon: ShieldCheck,
      title: 'Trust & Transparency',
      description: 'Zero hidden resort fees or unannounced charges. What you see during your search is exactly what is settled at checkout.',
    },
    {
      icon: HeartHandshake,
      title: 'Empowering Local Communities',
      description: 'Our private guide partner program connects travelers directly with certified local historians, naturalists, and chefs.',
    },
    {
      icon: Globe2,
      title: 'Sustainable Journeys',
      description: 'We champion carbon-efficient scenic rail transit and sustainable luxury properties operating with organic local sourcing.',
    },
  ];

  const team = [
    {
      name: 'Julian Vance',
      role: 'Co-Founder & Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Former expedition leader and hospitality architect with 15 years in luxury tourism across Asia and Europe.',
    },
    {
      name: 'Maya Lin-Dubois',
      role: 'Head of Global Curator Partnerships',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Art historian and travel writer connecting travelers with certified cultural and culinary experts worldwide.',
    },
    {
      name: 'Dr. Aris Thorne',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Passionate software engineer building resilient real-time reservation engines and spatial map analytics.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5" /> Our Story & Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight max-w-3xl mx-auto">
          We Believe Travel Should Be Extraordinary, Not Overwhelming.
        </h1>
        <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Founded in 2024, Wanderlust was created to replace clunky booking engines with an elegant, unified platform where luxury stays, fast transit, and certified guides exist harmoniously.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              A Platform Designed for Curious Explorers
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When planning a trip, travelers shouldn't have to jump between five tabs to find a hotel, check rail schedules, and hire a trustworthy local guide.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Wanderlust bridges the gap: dynamic maps sync directly with live inventory, prices are itemized transparently, and atomic checkout guarantees your confirmation without stress.
            </p>
            <div className="pt-2 flex items-center gap-6 text-slate-900 font-bold text-sm">
              <div>
                <span className="text-2xl font-black text-brand-600 block font-display">120+</span>
                <span className="text-xs text-slate-500 font-normal">Destinations Worldwide</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-2xl font-black text-emerald-600 block font-display">450+</span>
                <span className="text-xs text-slate-500 font-normal">Audited Stays & Guides</span>
              </div>
            </div>
          </div>

          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
              alt="Roadtrip into scenic nature"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 font-display">What Guides Us</h2>
          <p className="text-sm text-slate-500 mt-1">The fundamental principles behind every stay and feature we craft</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base font-display">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 font-display">Leadership & Curation Team</h2>
          <p className="text-sm text-slate-500 mt-1">Travelers, engineers, and curators building the next era of travel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((m, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-4">
              <img
                src={m.image}
                alt={m.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-brand-500 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">{m.name}</h3>
                <p className="text-xs font-semibold text-brand-600">{m.role}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-tr from-slate-900 to-brand-950 text-white p-10 sm:p-12 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-3xl font-black font-display tracking-tight">Ready to Begin Your Next Chapter?</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Discover handpicked luxury villas, express train connections, and expert local guides across 120 destinations today.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            Start Exploring <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
