
import React from 'react';

const features = [
  {
    title: 'Unique Offers',
    description: 'Access exclusive deals from verified organizers and trusted sellers worldwide.',
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Secure Payments',
    description: 'Every transaction is encrypted and protected by industry-leading security protocols.',
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    bgColor: 'bg-green-50',
  },
  {
    title: 'Global Reach',
    description: 'From local theaters to massive international arenas, we cover the best of Middle East.',
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Expert Support',
    description: 'Our dedicated concierge team is available 24/7 to assist with your booking.',
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    bgColor: 'bg-orange-50',
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-[#f5f5f7]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[48px] font-bold tracking-tight text-[#1d1d1f] mb-4">
            Our Advantages
          </h2>
          <p className="text-lg md:text-xl text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            We prioritize your experience, ensuring every moment from booking to the event is seamless and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-[40px] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[#86868b] text-[15px] leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
