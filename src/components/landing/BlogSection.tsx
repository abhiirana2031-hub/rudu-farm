import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  X, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle,
  Heart,
  BookOpen
} from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  overlayBadgeTitle: string;
  overlayPoints: { icon: string; text: string }[];
  watermark?: string;
  summary: string;
  fullContent: {
    lead: string;
    sections: {
      heading: string;
      body: string;
    }[];
    takeaways: string[];
  };
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'meet-the-farmers',
    title: 'Meet the Farmers: The Hard Work Behind Every Clean Product',
    category: 'Organic Farming',
    date: '26 May 2026',
    readTime: '4 min read',
    author: 'Rameshwar Verma & Field Team',
    image: '/images/blog_farmer_organic.jpg',
    overlayBadgeTitle: 'The Untold Story Behind Organic Farming',
    overlayPoints: [
      { icon: '📅', text: 'Long Transition Period' },
      { icon: '⚖️', text: 'Higher Costs and Risks' },
      { icon: '🏷️', text: 'Uncertain Premiums' },
    ],
    watermark: 'RUDU DAIRY',
    summary: 'Discover the relentless dedication, traditional knowledge, and soil revitalization required by local farmers to produce truly pure, chemical-free crops and fodder.',
    fullContent: {
      lead: 'Switching from conventional chemical agriculture to 100% certified organic dairy and crop farming is not just a commercial choice—it is a rigorous, multi-year generational commitment.',
      sections: [
        {
          heading: 'The 3-Year Soil Detoxification Journey',
          body: 'Before any farm can receive organic accreditation under NPOP or USDA standards, the soil must undergo an unyielding transition period of at least 36 continuous months. During this span, no chemical fertilizers, artificial pesticides, or synthetic growth hormones can touch the land.'
        },
        {
          heading: 'Labor-Intensive Bio-Dynamic Care',
          body: 'Instead of spraying harsh synthetic weedkillers, our partner farmers hand-weed their fodder fields, brew natural Jeevamrit bio-fertilizers from indigenous cow dung and urine, and manage pests through companion planting of marigold and neem extracts.'
        },
        {
          heading: 'Direct Farmer Support & Guaranteed Payouts',
          body: 'To safeguard our farmers against market uncertainties, we guarantee transparent digital fat-testing, fair price minimums, and weekly direct bank transfers, making ethical organic farming financially sustainable.'
        }
      ],
      takeaways: [
        'Over 36 months of organic soil conditioning before first harvest',
        'Traditional Jeevamrit microbial bio-cultures replacing chemicals',
        'Transparent digital milk testing ensures farmers earn 25-30% above market rate'
      ]
    }
  },
  {
    id: 'carbendazim-hidden-danger',
    title: 'Carbendazim in Food: The Hidden Fungicide in Everyday Kitchens',
    category: 'Food Safety & Health',
    date: '27 May 2026',
    readTime: '5 min read',
    author: 'Dr. Sunita Rao (Quality Research)',
    image: '/images/blog_kitchen_danger.jpg',
    overlayBadgeTitle: 'An Invisible Danger in your Kitchen',
    overlayPoints: [
      { icon: '🧬', text: 'Hormone Disruption' },
      { icon: '🧪', text: 'Liver Damage' },
      { icon: '🛡️', text: 'Immune & Developmental Effects' },
    ],
    watermark: 'RUDU DAIRY',
    summary: 'A critical exposé on Carbendazim—a systemic fungicide widely sprayed on conventional cattle fodder and fruits—and why zero-residue testing is crucial for your family.',
    fullContent: {
      lead: 'While families strive to cook wholesome homemade meals, synthetic systemic fungicides like Carbendazim frequently bypass standard water washing, accumulating in animal tissue and dairy fat.',
      sections: [
        {
          heading: 'What is Carbendazim and Why is it Banned Globally?',
          body: 'Carbendazim is a broad-spectrum benzimidazole fungicide. Due to documented risks of endocrine disruption, testicular toxicity, and liver damage, it has been banned or heavily restricted in the European Union, Australia, and the US, yet remains pervasive in non-certified farming.'
        },
        {
          heading: 'How Fungicides Enter the Dairy Chain',
          body: 'When dairy cattle consume commercial fodder treated with systemic fungicides, trace chemical residues dissolve into milk fat globules. Conventional flash boiling does NOT eliminate these persistent molecular compounds.'
        },
        {
          heading: 'Our Zero-Residue Gas Chromatography Protocol',
          body: 'Every single batch of our milk and ghee undergoes Gas Chromatography-Mass Spectrometry (GC-MS) multi-residue pesticide screening. Only milk testing 100% free of synthetic agrochemicals is bottled for our consumers.'
        }
      ],
      takeaways: [
        'Carbendazim is banned in the EU due to endocrine-disrupting risks',
        'Standard boiling does not eliminate persistent synthetic fungicides from milk fat',
        'Our GC-MS laboratory audits verify zero pesticide residue in every batch'
      ]
    }
  },
  {
    id: 'a2-milk-purity',
    title: 'A2 Desi Cow Milk: Why Health-Conscious Families Are Switching',
    category: 'Nutrition & Wellness',
    date: '28 May 2026',
    readTime: '4 min read',
    author: 'Vikramaditya Singh',
    image: '/images/blog_a2_milk.jpg',
    overlayBadgeTitle: 'The Truth About Pure A2 Milk',
    overlayPoints: [
      { icon: '🥛', text: 'Gentle on Digestion' },
      { icon: '🌿', text: '100% Beta-Casein A2' },
      { icon: '❄️', text: '4°C Cold-Chain Sealed' },
    ],
    watermark: 'RUDU DAIRY',
    summary: 'Understand the distinct science between A1 and A2 beta-casein proteins and why unadulterated indigenous cow milk feels lighter, healthier, and easier to digest.',
    fullContent: {
      lead: 'Many people who believe they are lactose intolerant actually suffer from inflammation triggered by the mutated A1 beta-casein protein found in commercial crossbred cows.',
      sections: [
        {
          heading: 'The A1 vs A2 Protein Mutation Difference',
          body: 'Centuries ago, European dairy breeds developed a genetic mutation producing the A1 beta-casein protein, which breaks down into BCM-7 (an inflammatory peptide). Indigenous Indian breeds like Gir, Sahiwal, and Rathi naturally produce pure A2 beta-casein, which digests smoothly without digestive bloating.'
        },
        {
          heading: 'Retaining Raw Bio-Availability with Gentle Pasteurization',
          body: 'Rather than ultra-high temperature processing (UHT) that denatures delicate milk proteins, we employ precise low-temperature pasteurization, preserving natural enzymes, immunoglobulins, and fat-soluble vitamins A & D.'
        },
        {
          heading: 'The 4°C Freshness Promise',
          body: 'From computerized milking stations to your morning doorstep within hours, continuous chilling prevents bacteria proliferation without the need for preservatives or stabilizers.'
        }
      ],
      takeaways: [
        'Native Gir and Sahiwal cows naturally produce 100% non-inflammatory A2 protein',
        'Gentle low-temperature pasteurization retains active natural enzymes and vitamins',
        'Direct farm-to-table cold supply delivers unmatched farm-fresh taste'
      ]
    }
  }
];

export const BlogSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const displayedPosts = showAllArticles ? BLOG_POSTS : BLOG_POSTS.slice(0, 3);

  const handleShare = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#' + post.id);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section id="blogs" className="w-full py-16 sm:py-20 bg-white border-b border-stone-200/70 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Matching Image 2 exactly */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1f3d2b] tracking-tight">
              Blogs
            </h2>
            {/* Gold/Amber Underline Bar under Blogs */}
            <div className="w-12 h-1 bg-[#d4a373] rounded-full mt-2" />
          </div>

          <button 
            onClick={() => setShowAllArticles(!showAllArticles)}
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1f3d2b] hover:text-emerald-800 transition-colors pb-1"
          >
            <span>{showAllArticles ? 'Show featured' : 'See all'}</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Blog Cards (Horizontal scroll on mobile, Grid on tablet/desktop) */}
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 snap-x snap-mandatory no-scrollbar">
          {displayedPosts.map((post) => (
            <article 
              key={post.id}
              className="flex-shrink-0 w-[84vw] max-w-[320px] sm:w-auto snap-center bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-1"
              onClick={() => setSelectedArticle(post)}
            >
              {/* Card Top Image Box */}
              <div className="p-3 pb-0">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Visual Overlay Card matching screenshot */}
                  <div className="absolute top-2.5 left-2.5 bg-black/45 backdrop-blur-md rounded-xl p-2.5 text-white max-w-[85%] sm:max-w-[80%] border border-white/20 shadow-md">
                    <p className="text-[10px] sm:text-[11px] font-extrabold text-amber-200 uppercase tracking-wider mb-1 leading-snug">
                      {post.overlayBadgeTitle}
                    </p>
                    <div className="space-y-0.5">
                      {post.overlayPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-stone-100 font-medium leading-none">
                          <span className="text-[10px]">{pt.icon}</span>
                          <span className="truncate">{pt.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Watermark badge bottom-right */}
                  {post.watermark && (
                    <div className="absolute bottom-2.5 right-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white bg-[#144A29]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-sm border border-white/20">
                      {post.watermark}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>

                <div>
                  {/* Subtle Divider Line */}
                  <div className="w-full h-px bg-stone-200 my-4" />

                  {/* Card Bottom Meta (Date & Reading Time) */}
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{post.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <Clock size={11} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Swipe Cue */}
        <div className="text-center sm:hidden mt-2 text-[11px] font-semibold text-stone-400 flex items-center justify-center gap-1">
          <span>Swipe articles to read all</span>
          <span>→</span>
        </div>

      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between z-10">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedArticle.category}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleShare(selectedArticle, e)}
                  className="p-2 rounded-full hover:bg-stone-100 text-gray-500 hover:text-gray-800 transition-colors"
                  title="Copy link to clipboard"
                >
                  <Share2 size={16} />
                </button>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-full hover:bg-stone-100 text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label="Close article"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {copiedId && (
                <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={14} /> Link copied to clipboard!
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-3">
                {selectedArticle.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-6 pb-4 border-b border-stone-100">
                <span className="font-semibold text-gray-700">{selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              {/* Featured Image */}
              <div className="rounded-2xl overflow-hidden mb-6 shadow-md">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  className="w-full h-64 sm:h-72 object-cover" 
                />
              </div>

              {/* Lead Paragraph */}
              <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed mb-6 italic border-l-4 border-[#d4a373] pl-4">
                "{selectedArticle.fullContent.lead}"
              </p>

              {/* Article Content Sections */}
              <div className="space-y-6 text-sm text-gray-700 leading-relaxed mb-8">
                {selectedArticle.fullContent.sections.map((sec, i) => (
                  <div key={i}>
                    <h4 className="text-base font-bold text-gray-900 mb-2">
                      {sec.heading}
                    </h4>
                    <p>{sec.body}</p>
                  </div>
                ))}
              </div>

              {/* Key Takeaways Callout */}
              <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-5 mb-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1f3d2b] mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-700" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2">
                  {selectedArticle.fullContent.takeaways.map((point, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer action */}
              <div className="flex justify-end pt-2 border-t border-stone-100">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="bg-[#1f3d2b] hover:bg-[#163022] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-md"
                >
                  Done Reading
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
