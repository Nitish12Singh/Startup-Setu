import React, { useState } from 'react';
import InitialAvatar from './InitialAvatar';
import { 
  Building2, 
  CheckCircle2, 
  Award, 
  Users, 
  MapPin, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Layers,
  Activity,
  ArrowLeft
} from 'lucide-react';

export default function StartupProfile({ startup, startups, currentUser, onNavigate, onBack }) {
  const [selectedStartup, setSelectedStartup] = useState(null);

  if (!currentUser && startups?.length) {
    if (selectedStartup) {
      return (
        <StartupProfile
          startup={selectedStartup}
          onNavigate={onNavigate}
          onBack={() => setSelectedStartup(null)}
        />
      );
    }

    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Government Startup Directory</p>
            <h1 className="text-2xl font-black text-slate-900">Verified Startups</h1>
            <p className="mt-1 text-sm text-slate-500">Browse innovation partners available for government challenges and pilots.</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{startups.length} startups</span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {startups.map((item) => (
            <article
              key={item.id}
              className="gov-card flex cursor-pointer flex-col gap-4 p-5 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedStartup(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedStartup(item);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <img src={item.logo} alt="" className="h-12 w-12 rounded-xl border border-slate-200 object-cover" />
                <div className="min-w-0">
                  <h2 className="truncate text-base font-extrabold text-slate-900">{item.name}</h2>
                  <p className="text-xs font-semibold text-blue-700">{item.sector}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="h-3 w-3" /> {item.location}</p>
                </div>
                {item.verified && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-600" />}
              </div>
              <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">{item.description}</p>
              <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2">
                  <span className="block text-[10px] font-semibold uppercase text-slate-400">Team</span>
                  <span className="font-bold text-slate-800">{item.teamSize} people</span>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2">
                  <span className="block text-[10px] font-semibold uppercase text-emerald-600">Pilot score</span>
                  <span className="font-bold text-emerald-800">{item.pilotHistoryScore}/100</span>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-700">View startup details →</div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  const st = startup || {
    id: 'st-1',
    name: 'EcoVision AI',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    description: 'Computer vision and IoT solution for urban waste tracking, route optimization, and vehicle monitoring.',
    technology: 'Computer Vision, IoT Sensors, Edge AI, Route Optimization Algorithms',
    sector: 'Smart City',
    foundedYear: 2021,
    teamSize: 28,
    verified: true,
    dpiitRegistered: 'DPIIT-89412',
    location: 'Bengaluru, KA',
    deployments: 4,
    certifications: ['ISO 27001', 'CMMI Level 3', 'STQC Certified'],
    products: ['TrashCam Edge', 'RouteOptima Gov', 'BinSense Telemetry'],
    caseStudies: ['Indore Municipal Sanitation Smart Monitoring (2023)', 'Surat Waste Fleet AI Tracking'],
    pilotHistoryScore: 92,
    website: 'https://ecovision.ai'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="gov-btn-secondary inline-flex items-center gap-2 text-xs font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Startups
        </button>
      )}
      
      {/* HEADER PROFILE CARD */}
      <div className="gov-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            {currentUser ? (
              <InitialAvatar
                name={currentUser.name}
                className="w-16 h-16 rounded-2xl border border-blue-200 text-blue-700 text-xl"
              />
            ) : (
              <img src={st.logo} alt={st.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser?.name || st.name}</h1>
                {!currentUser && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Startup ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {currentUser
                  ? [currentUser.email, currentUser.organization, currentUser.designation].filter(Boolean).join(' • ')
                  : `${st.dpiitRegistered} • ${st.location} • Founded ${st.foundedYear}`}
              </p>
            </div>
          </div>

          {!currentUser && (
            <a 
              href={st.website} 
              target="_blank" 
              rel="noreferrer"
              className="gov-btn-secondary text-xs px-4 py-2 text-blue-600 font-bold"
            >
              Visit Website <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {currentUser ? `Role: ${currentUser.role}` : st.description}
        </p>

        {currentUser && (
          <div className="grid sm:grid-cols-3 gap-4 border-t border-slate-200 pt-5">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Full Name</span>
              <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email / User ID</span>
              <span className="text-sm font-bold text-slate-900 break-all">{currentUser.email || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Organization / Designation</span>
              <span className="text-sm font-bold text-slate-900">
                {[currentUser.organization, currentUser.designation].filter(Boolean).join(' • ') || 'Not provided'}
              </span>
            </div>
          </div>
        )}

        {/* Startup metrics are shown only for a startup record, not as invented account data. */}
        {!currentUser && <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Proven Deployments</span>
            <span className="text-xl font-black text-slate-900">{st.deployments} Cities</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Team Strength</span>
            <span className="text-xl font-black text-blue-700">{st.teamSize} Engineers</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pilot Score History</span>
            <span className="text-xl font-black text-emerald-700">{st.pilotHistoryScore}/100</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Primary Sector</span>
            <span className="text-sm font-bold text-slate-800">{st.sector}</span>
          </div>
        </div>}

      </div>

      {/* TECH STACK & CERTIFICATIONS */}
      {!currentUser && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="gov-card p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Core Technology & Products
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{st.technology}</p>
            <div className="pt-2 flex flex-wrap gap-2">
              {st.products.map((p, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded border border-blue-100">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="gov-card p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Certifications & Compliance
            </h3>
            <div className="space-y-2">
              {st.certifications.map((c, idx) => (
                <div key={idx} className="bg-emerald-50 text-emerald-950 text-xs font-bold p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
