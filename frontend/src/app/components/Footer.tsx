import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Image src="/logo.png" alt="KOS Yachts Logo" width={50} height={50} />
            <p className="text-gray-400 text-base">
              Luxury yachting experiences for the discerning traveler.
            </p>
            <div className="flex space-x-6">
              {/* Add social media icons here */}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/about" className="text-base text-gray-300 hover:text-white">About</Link></li>
                  <li><Link href="/careers" className="text-base text-gray-300 hover:text-white">Careers</Link></li>
                  <li><Link href="/contact" className="text-base text-gray-300 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/privacy" className="text-base text-gray-300 hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="text-base text-gray-300 hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2023 KOS Yachts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
