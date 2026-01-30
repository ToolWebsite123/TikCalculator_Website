import React from 'react';

const About = () => (
  <section className="mx-auto max-w-4xl space-y-4 px-4 py-10">
    <h2 className="text-3xl font-bold text-slate-900">About TikCalulaator</h2>
    <p className="text-slate-600">
      TikCalulaator is a lightweight earnings estimator for TikTok creators and brands. It combines
      CPM presets, platform share, and niche multipliers to help you reason about revenue potential
      before negotiating deals.
    </p>
    <p className="text-slate-600">
      Built with React, Tailwind CSS, and an Express + MongoDB API, it focuses on clarity and
      responsiveness so you can run quick what-if scenarios on any device.
    </p>
  </section>
);

export default About;

