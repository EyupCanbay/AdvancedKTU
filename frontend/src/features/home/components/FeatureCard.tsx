interface SubFeature {
  icon: string;
  title: string;
  description: string;
  iconColor?: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  mainIcon: string;
  subFeatures: SubFeature[];
}

export const FeatureCard = ({ title, description, mainIcon, subFeatures }: any) => (
  <div className="relative group flex flex-col rounded-[48px] bg-surface-dark/40 border border-white/5 overflow-hidden p-1 transition-all duration-500 hover:border-primary/30">
    <div className="p-10">
      <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-inner">
        <span className="material-symbols-outlined text-4xl">{mainIcon}</span>
      </div>
      <h3 className="text-white text-3xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-base leading-relaxed mb-10">{description}</p>
      
      <div className="space-y-4">
        {subFeatures.map((item: any, index: number) => (
          <div key={index} className="flex gap-5 p-5 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors items-center">
            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 bg-background-dark border border-white/5 ${item.iconColor || 'text-primary'}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{item.title}</h4>
              <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Arka Plan Dekoratif Blur Görseli */}
    <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
  </div>
);