import React from 'react';
import { Package, AlertTriangle, Info, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function DependencyHealth({ dependencies = {} }) {
  const {
    packageManager = "npm",
    packageName = "pulsecart-core",
    version = "1.4.2",
    totalDependencies = 0,
    totalDevDependencies = 0,
    dependencies: depList = [],
    devDependencies: devDepList = [],
    advisories = [],
    redundancies = []
  } = dependencies;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Dependency Health & Package Audit</h2>
        <p className="text-xs text-[#8B949E] mt-0.5">
          Deterministic manifest analysis against verified package maintenance guidelines and bundle footprint.
        </p>
      </div>

      {/* Package Header Card */}
      <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#58A6FF]/15 border border-[#58A6FF]/30 flex items-center justify-center text-[#58A6FF]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#E6EDF3] font-mono">{packageName}</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#161E27] text-[#8B949E] border border-[#21262D]">
                v{version}
              </span>
            </div>
            <p className="text-xs text-[#8B949E] mt-0.5">
              Package Manager: <span className="font-mono text-[#E6EDF3] uppercase">{packageManager}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-[#8B949E] block">Production Dependencies</span>
            <span className="text-lg font-mono font-bold text-[#E6EDF3]">{totalDependencies} packages</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#8B949E] block">Dev Tooling</span>
            <span className="text-lg font-mono font-bold text-[#8B949E]">{totalDevDependencies} packages</span>
          </div>
        </div>
      </div>

      {/* Advisories & Maintenance Notices */}
      {advisories.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] block">
            Package Maintenance & Optimization Notices
          </span>
          <div className="space-y-2">
            {advisories.map((adv, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#161E27] border border-[#D29922]/30 flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-[#D29922] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#E6EDF3]">{adv.package}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#D29922]/15 text-[#D29922]">
                      {adv.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[#E6EDF3]">{adv.issue}</p>
                  <p className="text-[11px] text-[#8B949E]">{adv.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Production Dependencies Grid */}
      <div className="bg-[#111820] border border-[#21262D] rounded-xl p-5 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] block">
          Direct Production Dependencies
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {depList.map(dep => (
            <div
              key={dep.name}
              className="p-3 rounded-lg bg-[#161E27] border border-[#21262D] space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E6EDF3]">{dep.name}</span>
                <span className="font-mono text-[11px] text-[#8B949E]">{dep.version}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#8B949E]">{dep.status?.note || 'Standard'}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  dep.status?.risk === 'medium'
                    ? 'bg-[#D29922]/15 text-[#D29922]'
                    : 'bg-[#3FB950]/15 text-[#3FB950]'
                }`}>
                  {dep.status?.tag || 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
