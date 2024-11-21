import Link from 'next/link';

export default function OwnerCTA() {
  return (
    <div className="bg-white text-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Want to list a boat?
        </h2>
        <p className="mt-4 text-lg">
          Join our platform and start renting out your yacht today!
        </p>
        <div className="mt-8">
          <Link href="/owner-signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gold bg-white hover:bg-gray-50">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
