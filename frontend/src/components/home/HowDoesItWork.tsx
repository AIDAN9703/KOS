import React, { useState } from 'react';
import Image from 'next/image';

// Icon components (replace with your actual icons)
const SearchIcon = () => <span>🔍</span>;
const ChatIcon = () => <span>💬</span>;
const ManageIcon = () => <span>📊</span>;
const BoatIcon = () => <span>🚤</span>;
const ListIcon = () => <span>📝</span>;
const ScheduleIcon = () => <span>📅</span>;
const ApproveIcon = () => <span>✅</span>;
const EarnIcon = () => <span>💰</span>;
const RegisterIcon = () => <span>📋</span>;
const CalendarIcon = () => <span>🗓️</span>;
const MatchIcon = () => <span>🤝</span>;
const AnchorIcon = () => <span>⚓</span>;

type Mode = 'Renter' | 'Owner' | 'Captain';

type Step = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const steps: Record<Mode, Step[]> = {
  Renter: [
    { icon: <SearchIcon />, title: 'Join', description: 'Build your digital profile and select boats to rent in.' },
    { icon: <ChatIcon />, title: 'Connect', description: 'Review booking requests from renters.' },
    { icon: <ManageIcon />, title: 'Manage', description: 'Oversee all your bookings.' },
    { icon: <BoatIcon />, title: 'Cruise & collect', description: 'Get out on the water and watch your bank account grow.' },
  ],
  Owner: [
    { icon: <ListIcon />, title: 'List', description: 'Create a listing for your boat.' },
    { icon: <ScheduleIcon />, title: 'Schedule', description: 'Set your boat\'s availability.' },
    { icon: <ApproveIcon />, title: 'Approve', description: 'Review and approve rental requests.' },
    { icon: <EarnIcon />, title: 'Earn', description: 'Earn money from your boat rentals.' },
  ],
  Captain: [
    { icon: <RegisterIcon />, title: 'Register', description: 'Sign up as a certified captain.' },
    { icon: <CalendarIcon />, title: 'Availability', description: 'Set your available dates and times.' },
    { icon: <MatchIcon />, title: 'Match', description: 'Get matched with boat rentals needing a captain.' },
    { icon: <AnchorIcon />, title: 'Captain', description: 'Lead boat trips and earn money.' },
  ],
};

const HowDoesItWork: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>('Renter');

  return (
    <section className="bg-white py-8 md:py-12 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-start">
          <div className="bg-primary text-white p-4 md:p-6 w-full md:w-1/3 rounded-lg md:absolute md:left-4 md:-top-8 z-10 md:ml-64">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">How it works</h2>
            <h3 className="text-lg md:text-xl mb-2 md:mb-4">I am a...</h3>
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              {(['Renter', 'Owner', 'Captain'] as Mode[]).map((mode) => (
                <button
                  key={mode}
                  className={`py-1 md:py-2 px-2 md:px-4 text-left ${
                    activeMode === mode ? 'underline font-bold' : 'hover:underline'
                  }`}
                  onClick={() => setActiveMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 md:p-6 w-full md:w-3/4 shadow-lg rounded-lg md:ml-auto mt-4 md:mt-8 z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps[activeMode].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl mb-2">{step.icon}</div>
                  <h3 className="text-base md:text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 bg-primary-light py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-2/3 relative overflow-hidden rounded-lg mb-4 md:mb-0 h-64 md:h-96">
              <Image
                src="/images/background2.jpg"
                alt="Summer Collection"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-70"></div>
              <h2 className="absolute top-2 md:top-4 left-2 md:left-4 text-2xl md:text-4xl font-bold text-white">Summer collection</h2>
            </div>
            <div className="w-full md:w-1/3 bg-white p-4 md:p-6 rounded-lg md:-ml-8 z-10">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Summer starts now</h3>
              <p className="text-sm md:text-base text-primary mb-4">A curated selection of small islands and boat rentals, designed for an epic summer.</p>
              <button className="bg-primary text-white font-bold py-2 px-4 rounded text-sm md:text-base">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowDoesItWork;
