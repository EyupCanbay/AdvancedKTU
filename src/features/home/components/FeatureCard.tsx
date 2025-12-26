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

export const FeatureCard = ({ title, description, mainIcon, subFeatures }: FeatureCardProps) => (
  <div className="flex flex-col rounded-2xl bg-surface-dark border border-border-dark overflow-hidden group hover:border-primary/50 transition-all duration-300">
    <div className="p-8 pb-4">
      <div className="size-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
        <span className="material-symbols-outlined text-3xl">{mainIcon}</span>
      </div>
      <h3 className="text-white text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
    <div className="p-6 pt-0 flex flex-col gap-4 mt-auto">
      {subFeatures.map((item, index) => (
        <div key={index} className="flex gap-4 p-4 rounded-xl bg-background-dark/50 border border-border-dark items-start">
          <span className={`material-symbols-outlined mt-1 ${item.iconColor || 'text-primary'}`}>{item.icon}</span>
          <div>
            <h4 className="text-white text-base font-bold">{item.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);