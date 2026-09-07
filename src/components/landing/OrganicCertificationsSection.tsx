import React, { useState } from 'react';
import { IndiaOrganicLogo, UsdaOrganicLogo, EuOrganicLogo } from './OrganicCertificates';
import { ShieldCheck, CheckCircle2, Info, X } from 'lucide-react';

interface CertificationDetail {
  id: string;
  title: string;
  badgeName: string;
  authority: string;
  logo: React.ReactNode;
  standards: string[];
  description: string;
  certCode: string;
}

const CERTIFICATIONS_DATA: CertificationDetail[] = [
  {
    id: 'india-organic',
    title: 'India Organic',
    badgeName: 'India Organic (NPOP / Jaivik Bharat)',
    authority: 'APEDA & FSSAI (Govt. of India)',
    logo: <IndiaOrganicLogo size={135} />,
    standards: [
      'National Programme for Organic Production (NPOP) compliant',
      'Zero synthetic fertilizers, GMOs, or chemical growth promoters',
      'Full traceability from indigenous cattle feed to final sealed package'
    ],
    description: 'The National Programme for Organic Production (NPOP) is managed by the Ministry of Commerce and Industry. It establishes rigorous standards for organic agriculture and production, ensuring total purity and ecological balance.',
    certCode: 'NPOP/NAB/0018-ORG'
  },
  {
    id: 'usda-organic',
    title: 'USDA Organic',
    badgeName: 'USDA National Organic Program',
    authority: 'United States Department of Agriculture',
    logo: <UsdaOrganicLogo size={120} />,
    standards: [
      'Strict prohibition of synthetic chemicals and antibiotics',
      '100% organic vegetarian cattle fodder and natural pasture grazing',
      'Rigorous multi-stage unannounced soil and milk residue audits'
    ],
    description: 'USDA Organic certification is one of the world’s most stringent food standards. It guarantees that animals are raised under humane conditions without synthetic hormones or antibiotics, grazing on certified organic pastures.',
    certCode: 'USDA-NOP-99420-IN'
  },
  {
    id: 'eu-organic',
    title: 'EU Organic',
    badgeName: 'European Union Organic Farming',
    authority: 'European Commission (Reg. EC 834/2007)',
    logo: <EuOrganicLogo size={135} />,
    standards: [
      'Regulated by European Commission Regulation (EC) 834/2007',
      'Certified by accredited inspection body IN-BIO-132 for global export',
      'Rigorous gas chromatography pesticide residue threshold testing'
    ],
    description: 'The European Union Organic leaf guarantees strict compliance with EU standards for organic food production, respecting biodiversity, high animal welfare, and natural ecological cycles.',
    certCode: 'IN-BIO-132 Non-EU Agriculture'
  }
];

export const OrganicCertificationsSection: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<CertificationDetail | null>(null);

  return (
    <section 
      id="organic-certifications" 
      className="relative w-full py-16 sm:py-20 bg-[#FAF9F5] border-y border-stone-200/60 overflow-hidden"
    >
      {/* Subtle organic background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1f3d2b] tracking-tight leading-tight">
            Globally Certified Organic Goodness
          </h2>
          
          {/* Warm Amber/Gold Divider Line (matching reference screenshot) */}
          <div className="w-14 h-1 bg-[#d4a373] rounded-full mx-auto my-3.5" />
          
          <p className="text-gray-700 text-base sm:text-lg font-normal leading-relaxed mt-4">
            COWBERRY products are pure, chemical-free, and naturally crafted for honest, healthy nutrition.
          </p>
        </div>

        {/* 3 Hanging Shield / Banner Cards (Horizontal scroll on mobile, Grid on desktop) */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-5 md:gap-8 lg:gap-10 max-w-4xl mx-auto -mx-4 px-6 md:mx-auto md:px-0 pb-6 snap-x snap-mandatory no-scrollbar justify-start md:justify-center">
          {CERTIFICATIONS_DATA.map((cert) => (
            <div 
              key={cert.id}
              className="flex-shrink-0 w-[78vw] sm:w-[68vw] max-w-[270px] md:w-full snap-center flex flex-col items-center group cursor-pointer"
              onClick={() => setSelectedCert(cert)}
              title={`Click to view ${cert.title} accreditation details`}
            >
              {/* Top Dark-Green Banner Rod / Accent Hanger */}
              <div className="w-full max-w-[270px] h-2 bg-[#234b35] rounded-t-sm shadow-sm transition-transform duration-300 group-hover:scale-[1.02]" />

              {/* Pendant Banner / Shield Card Body */}
              <div 
                className="w-full max-w-[270px] bg-white pt-5 pb-9 px-6 flex flex-col items-center justify-between border-x border-b border-stone-200/90 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-emerald-700/40"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 22px), 50% 100%, 0 calc(100% - 22px))',
                  filter: 'drop-shadow(0 10px 22px rgba(35, 75, 53, 0.08))',
                  minHeight: '235px'
                }}
              >
                {/* Certificate Title Label */}
                <h3 className="text-xs sm:text-[13.5px] font-bold text-gray-800 tracking-wide text-center mb-4 transition-colors group-hover:text-emerald-800">
                  {cert.title}
                </h3>

                {/* Logo Area */}
                <div className="flex-1 flex items-center justify-center py-2 transition-transform duration-300 group-hover:scale-105">
                  {cert.logo}
                </div>

                {/* Micro info hint */}
                <div className="mt-2 text-[10.5px] font-semibold text-emerald-800/80 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ShieldCheck size={13} className="text-emerald-700" />
                  <span>Verified Standard</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Cue */}
        <div className="text-center md:hidden -mt-2 mb-4 text-[11px] font-semibold text-stone-400 flex items-center justify-center gap-1">
          <span>Swipe certificates to view all</span>
          <span>→</span>
        </div>

        {/* Bottom Trust Badge Strip */}
        <div className="mt-12 pt-8 border-t border-stone-200/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-emerald-700 flex-shrink-0" />
            <span>100% Chemical & Hormone Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-emerald-700 flex-shrink-0" />
            <span>Gas Chromatography (GC) Batch Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-emerald-700 flex-shrink-0" />
            <span>Direct Village Cold-Chain Sourced</span>
          </div>
        </div>

      </div>

      {/* Interactive Certification Detail Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-center">
                {selectedCert.logo}
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {selectedCert.authority}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-1.5">
                  {selectedCert.badgeName}
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Accreditation: {selectedCert.certCode}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-5">
              {selectedCert.description}
            </p>

            <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-stone-200/80 mb-6">
              <h4 className="text-xs font-bold text-[#1f3d2b] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-700" />
                Guaranteed Audit Standards
              </h4>
              <ul className="space-y-2">
                {selectedCert.standards.map((std, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>{std}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <Info size={13} />
                Audited & verified batch-by-batch
              </span>
              <button 
                onClick={() => setSelectedCert(null)}
                className="bg-[#234b35] hover:bg-[#1b3b29] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md shadow-emerald-950/10"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
