import Link from 'next/link'
import HeroSlideshow from '@/components/HeroSlideshow'
import { SERVICES_LIST } from '@/data/projects'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#1c1c1c] pb-20">
      {/* Header */}
      <header className="w-full pt-5 pb-10 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-4 mb-10 md:mb-14">
          <div className="md:col-span-3">
            <Link href="/" className="inline-block text-[12px] md:text-[13px] font-normal tracking-tight hover:opacity-50 transition-opacity">
              Ghazwan Allaf
            </Link>
          </div>

          <div className="md:col-span-4">
            <span className="text-[11px] md:text-[12px] font-normal tracking-tight text-[#222]">
              Sculpture & Fine Arts
            </span>
          </div>

          <div className="md:col-span-5 flex justify-start md:justify-end">
            <HeroSlideshow />
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-6 text-[11px] md:text-[12px] leading-[0.9] tracking-tight">
          {/* Column 1: Index link */}
          <div className="md:col-span-3">
            <Link href="/" className="font-medium text-[#111] hover:opacity-50 transition-opacity inline-flex items-center gap-1">
              ← Artworks
            </Link>
          </div>

          {/* Column 2: Statement & Bio */}
          <div className="md:col-span-5 space-y-5 pr-0 md:pr-8 text-[#222]">
            <p className="text-[12px] md:text-[13px] leading-[0.9]">
              Syrian sculptor and educator, born in Damascus. He graduated from the Institute of Applied Arts in Damascus in 1993 and has since developed a career blending both artistic creation and teaching.
            </p>
            <p className="text-[#444] leading-[0.9]">
              Allaf specializes in sculpting and anatomy, and he is a member of the Syrian Plastic Artists Union. Alongside his artistic practice, he teaches at the Adham Ismael Center for Fine Arts, where he shares his expertise with emerging artists. His work has also been represented in regional and international art platforms, with his artist profile listed on Artsy.
            </p>

            {/* Career & Milestones */}
            <div className="pt-5 border-t border-[#f0f0f0] space-y-3">
              <div className="font-medium text-[#111] uppercase tracking-wider text-[10px]">
                Selected Career & Milestones
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b border-[#fafafa] pb-1">
                  <span className="text-[#111]">Adham Ismael Center for Fine Arts (Faculty / Educator)</span>
                  <span className="text-[#888]">Ongoing</span>
                </div>
                <div className="flex justify-between border-b border-[#fafafa] pb-1">
                  <span className="text-[#111]">Syrian Plastic Artists Union (Member)</span>
                  <span className="text-[#888]">Active</span>
                </div>
                <div className="flex justify-between border-b border-[#fafafa] pb-1">
                  <span className="text-[#111]">Institute of Applied Arts, Damascus (Graduate)</span>
                  <span className="text-[#888]">1993</span>
                </div>
              </div>
            </div>

            {/* Exhibitions */}
            <div className="pt-5 border-t border-[#f0f0f0] space-y-3">
              <div className="font-medium text-[#111] uppercase tracking-wider text-[10px]">
                Exhibitions & Activities (40+ Exhibitions)
              </div>
              <div className="space-y-1.5 text-[10.5px] text-[#444] leading-[0.9]">
                <div>• AL-SAYED Art Gallery, Damascus, Syria (2008)</div>
                <div>• OCCASIONS+, Damascus, Syria (2008)</div>
                <div>• KAWAF Art Gallery, Aleppo (Masterpieces Hand Made Jewellery, 2001)</div>
                <div>• Artuel 1999–2001 (Atassi Gallery & Phoenicia Hotel, Beirut, Lebanon)</div>
                <div>• Third Sculpture Reencounter, Damascus Saladin Castle (1999)</div>
                <div>• Second Sculpture Reencounter, Damascus Zabadani (1998)</div>
                <div>• Ministry of Culture & Syndicate of Fine Arts Exhibitions (1993–2000)</div>
              </div>
            </div>
          </div>

          {/* Column 3: Inquiries & Capabilities */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <div className="font-medium text-[#111] uppercase tracking-wider text-[10px] mb-2">
                Contact & Representation
              </div>
              <div className="space-y-1 text-[11px]">
                <div>
                  <a href="https://www.ghazwanallaf.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity text-[#111]">
                    www.ghazwanallaf.com
                  </a>
                </div>
                <div>
                  <a href="https://www.artsy.net" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity text-[#111]">
                    Artsy Profile
                  </a>
                </div>
                <div className="text-[#666]">
                  Damascus, Syria
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium text-[#111] uppercase tracking-wider text-[10px] mb-2">
                Disciplines & Services
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-[10.5px] text-[#444]">
                {SERVICES_LIST.map((service, i) => (
                  <div key={i}>{service}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
