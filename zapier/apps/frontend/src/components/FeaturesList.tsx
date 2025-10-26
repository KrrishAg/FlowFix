import { CodeIcon, CogIcon, LinkIcon } from "lucide-react";
import { Feature } from "./Feature";

export const FeaturesList = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose FlowFix?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <Feature
            title="Connect Everything"
            subtitle="Link hundreds of popular apps like Notion, Google Sheets, Razorpay, and more."
            icon={<LinkIcon size={24} />}
          />
          <Feature
            title="No Code Required"
            subtitle="Build complex workflows with an intuitive visual editor. If you can click, you can automate."
            icon={<CodeIcon size={24} />}
          />
          <Feature
            title="Powerful Automation"
            subtitle="Use filters, delays, and custom logic to create workflows tailored to your exact needs."
            icon={<CogIcon size={24} />}
          />
        </div>
      </div>
    </section>
  );
};
