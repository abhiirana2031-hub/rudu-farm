import React, { useState } from 'react';
import { IndiaOrganicLogo, UsdaOrganicLogo, EuOrganicLogo } from './OrganicCertificates';
import { ShieldCheck, CheckCircle2, Info, X } from 'lucide-react';

interface CertificationDetail {
  id: string;
  title: string;
  badgeName: string;
  authority: string;
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
    standards: [
      'Regulated by European Commission Regulation (EC) 834/2007',
      'Certified by accredited inspection body IN-BIO-132 for global export',
      'Rigorous gas chromatography pesticide residue threshold testing'
    ],
    description: 'The European Union Organic leaf guarantees strict compliance with EU standards for organic food production, respecting biodiversity, high animal welfare, and natural ecological cycles.',
    certCode: 'IN-BIO-132 Non-EU Agriculture'
  }
];

const renderCertLogo = (id: string, isModal = false) => {
  if (isModal) {
    switch (id) {
      case 'india-organic': return <IndiaOrganicLogo size={105} />;
      case 'usda-organic': return <UsdaOrganicLogo size={95} />;
      case 'eu-organic': return <EuOrganicLogo size={105} />;
      default: return null;
    }
  }
  switch (id) {
    case 'india-organic': return <IndiaOrganicLogo className="w-12 h-10 sm:w-16 sm:h-14 md:w-20 md:h-16 lg:w-24 lg:h-20 max-w-full" />;
    case 'usda-organic': return <UsdaOrganicLogo className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-22 lg:h-22 max-w-full" />;
    case 'eu-organic': return <EuOrganicLogo className="w-12 h-10 sm:w-16 sm:h-14 md:w-20 md:h-16 lg:w-24 lg:h-20 max-w-full" />;
    default: return null;
  }
};

export const OrganicCertificationsSection: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<CertificationDetail | null>(null);

  return (
    <section 
      id="organic-certifications" 
      className="relative w-full py-12 sm:py-16 md:py-20 bg-[#FAF9F5] border-y border-stone-200/60 overflow-hidden"
    >
      {/* Subtle organic background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1f3d2b] tracking-tight leading-tight">
            Globally Certified Organic Goodness
          </h2>
          
          {/* Warm Amber/Gold Divider Line */}
          <div className="w-12 sm:w-14 h-1 bg-[#d4a373] rounded-full mx-auto my-3" />
          
          <p className="text-gray-700 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-xl mx-auto">
            Rudu Dairy products are pure, chemical-free, and naturally crafted for honest, healthy nutrition.
          </p>
        </div>

        {/* All 3 Cards side-by-side in a guaranteed 3-column layout without any horizontal scroll */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 max-w-3xl lg:max-w-4xl mx-auto px-0.5 sm:px-4">
          {CERTIFICATIONS_DATA.map((cert) => (
            <div 
              key={cert.id}
              className="flex flex-col items-center group cursor-pointer w-full transition-transform duration-300 hover:-translate-y-1"
              onClick={() => setSelectedCert(cert)}
              title={`Click to view ${cert.title} accreditation details`}
            >
              {/* Top Dark-Green Banner Rod / Accent Hanger */}
              <div className="w-full h-1 sm:h-1.5 md:h-2 bg-[#234b35] rounded-t-sm shadow-2xs transition-colors duration-300 group-hover:bg-[#1b633b]" />

              {/* Pendant Banner / Shield Card Body */}
              <div 
                className="w-full bg-white pt-2.5 sm:pt-4 md:pt-5 pb-3.5 sm:pb-6 md:pb-7 px-1.5 sm:px-3 md:px-5 flex flex-col items-center justify-between border-x border-b border-stone-200/90 shadow-2xs transition-all duration-300 group-hover:shadow-md group-hover:border-[#1b633b]/40"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), 50% 100%, 0 calc(100% - 10px))',
                  minHeight: '135px'
                }}
              >
                {/* Certificate Title Label */}
                <h3 className="text-[9.5px] sm:text-xs md:text-sm font-bold text-gray-800 tracking-tight text-center mb-1 sm:mb-2 transition-colors group-hover:text-emerald-800 leading-tight min-h-[22px] sm:min-h-[28px] flex items-center justify-center">
                  {cert.title}
                </h3>

                {/* Logo Area */}
                <div className="flex-1 flex items-center justify-center py-1 sm:py-2 transition-transform duration-300 group-hover:scale-105">
                  {renderCertLogo(cert.id, false)}
                </div>

                {/* Micro info hint badge */}
                <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] md:text-[11px] font-semibold text-[#1c4d31] bg-[#f0f7f2] border border-[#1c4d31]/15 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1">
                  <ShieldCheck size={11} className="text-[#16a34a] shrink-0" />
                  <span className="hidden xs:inline">Certified</span>
                  <span className="xs:hidden">Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Badge Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-stone-200/60 flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10 text-xs sm:text-sm font-semibold text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#16a34a] flex-shrink-0" />
            <span>100% Chemical & Hormone Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#16a34a] flex-shrink-0" />
            <span>Gas Chromatography (GC) Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#16a34a] flex-shrink-0" />
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
                {renderCertLogo(selectedCert.id, true)}
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
