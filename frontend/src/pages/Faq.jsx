import React from 'react';

const faqs = [
  {
    q: 'How is the estimate calculated?',
    a: 'We use (views/1000) * CPM * (1 - platform share) * niche multiplier, then multiply by videos per month.',
  },
  {
    q: 'Where do CPM values come from?',
    a: 'Preset CPMs are seeded for select countries (US, UK, IN, PK). You can override with your own CPM.',
  },
  {
    q: 'Is my data stored?',
    a: 'We store only the inputs and results to generate a shareable link. No login is required.',
  },
  {
    q: 'Can I change currency?',
    a: 'Currently we assume USD formatting. You can note this in the shared link.',
  },
];

const Faq = () => (
  <section className="mx-auto max-w-4xl space-y-6 px-4 py-10">
    <div>
      <p className="text-sm font-semibold text-indigo-700">FAQ</p>
      <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
    </div>
    <div className="space-y-4">
      {faqs.map((item) => (
        <div key={item.q} className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-base font-semibold text-slate-900">{item.q}</p>
          <p className="text-sm text-slate-600">{item.a}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Faq;

