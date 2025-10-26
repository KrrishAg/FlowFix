import { Feature } from "./Feature";

export const WorkflowList = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          How FlowFix Works
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Automate in 3 simple steps:
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
              1
            </div>
            <Feature
              title="Choose a Trigger"
              subtitle="Select the event in an app that starts your automation (e.g.,
                  New Email Received)."
              size="big"
            />
          </div>
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
              2
            </div>
            <Feature
              title="Add Actions"
              subtitle="Define what happens next. Add filters, delays, or actions in other apps (e.g., Add Row to Sheet)."
              size="big"
            />
          </div>
          <div className="flex flex-col items-center max-w-xs">
            <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
              3
            </div>
            <Feature
              title="Publish & Relax"
              subtitle="Turn on your Flow and let it run automatically in the background."
              size="big"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
