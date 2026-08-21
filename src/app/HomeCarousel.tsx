'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function HomeCarousel({ activeEvents }: { activeEvents: any[] }) {
  if (activeEvents.length === 0) {
    return (
      <div className="w-full relative px-12 sm:px-16 pb-4 max-w-3xl mx-auto flex justify-center">
        <div className="w-full max-w-lg bg-[#0a0a0a] rounded-none border border-neutral-800 flex flex-col relative shadow-[0_0_40px_rgba(220,38,38,0.15)] h-[550px] sm:h-[650px] items-center justify-center overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black pointer-events-none"></div>
          <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>
          
          {/* Question Marks container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <span 
              className="absolute text-accent font-serif font-black drop-shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-float-slow text-[8rem] sm:text-[10rem] left-[15%] sm:left-[20%] -mt-32 sm:-mt-40 opacity-80"
              style={{ animationDelay: '1s' }}
            >
              ?
            </span>
            <span 
              className="absolute text-accent font-serif font-black drop-shadow-[0_0_50px_rgba(220,38,38,0.9)] animate-float text-[14rem] sm:text-[18rem] z-10"
            >
              ?
            </span>
            <span 
              className="absolute text-accent font-serif font-black drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-float-fast text-[6rem] sm:text-[8rem] right-[15%] sm:right-[20%] mt-40 sm:mt-48 opacity-70"
              style={{ animationDelay: '0.5s' }}
            >
              ?
            </span>
          </div>
          
          <div className="absolute bottom-12 text-center w-full px-6 z-20">
             <p className="text-neutral-500 font-light tracking-[0.3em] uppercase text-[10px] sm:text-xs">Misterio en la cartelera...</p>
             <p className="text-white font-serif tracking-widest uppercase text-sm sm:text-base mt-2">Pronto revelaremos la siguiente fiesta</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative px-12 sm:px-16 pb-4 max-w-3xl mx-auto">
      {/* Botones de navegación personalizados (Minimalistas) */}
      <div className="swiper-button-prev !left-2 sm:!left-6 !text-accent opacity-50 hover:opacity-100 transition-all !w-12 !h-12 flex items-center justify-center after:!hidden">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" /></svg>
      </div>
      <div className="swiper-button-next !right-2 sm:!right-6 !text-accent opacity-50 hover:opacity-100 transition-all !w-12 !h-12 flex items-center justify-center after:!hidden">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" /></svg>
      </div>

      <Swiper
        effect="fade"
        fadeEffect={{ crossFade: true }}
        grabCursor={false}
        simulateTouch={false}
        allowTouchMove={false}
        slidesPerView={1}
        spaceBetween={0}
        speed={800}
        loop={activeEvents.length > 1}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[Navigation, Autoplay, EffectFade]}
        className="w-full pb-8 pt-4 px-2 blur-carousel"
      >
        {activeEvents.map((event) => (
          <SwiperSlide key={event.id} className="w-full flex justify-center">
            <div className="w-full max-w-lg bg-[#0a0a0a] rounded-none border border-neutral-800 flex flex-col group relative shadow-[0_0_40px_rgba(0,0,0,0.8)] h-[550px] sm:h-[650px] mx-auto">
              <div className="h-[380px] sm:h-[480px] bg-neutral-900 relative flex items-center justify-center text-center overflow-hidden">
                {event.flyerImageUrl ? (
                  <img src={event.flyerImageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900"></div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none"></div>
                <h3 className="absolute inset-0 flex items-center justify-center z-10 text-4xl sm:text-5xl font-black text-white uppercase italic tracking-widest drop-shadow-2xl px-6 pointer-events-none">
                  {!event.flyerImageUrl && event.title}
                </h3>
              </div>
              
              <div className="p-6 flex-1 flex flex-col bg-black/80 backdrop-blur-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="text-white font-black tracking-wide text-base uppercase">
                      {event.eventDate.split('T')[0]} <span className="text-accent mx-1">•</span> {event.eventTime.substring(11, 16)}
                    </p>
                    <p className="text-xl font-black text-accent">S/ {Number(event.entryCost).toFixed(2)}</p>
                  </div>
                  <div className="px-3 py-1.5 bg-accent/10 text-accent text-sm font-black rounded-none border border-accent/50 shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                    +{event.pointsReward} pts
                  </div>
                </div>
                
                <p className="text-neutral-300 flex-1 leading-relaxed line-clamp-2 text-sm">{event.description}</p>
                
                <div className="mt-5 pt-5 border-t border-neutral-800">
                  <Link href={`/checkin/${event.id}`} className="w-full text-center block px-4 py-3 bg-transparent border border-accent text-accent font-black tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-none hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] text-sm">
                    ASISTIR
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .blur-carousel .swiper-slide {
          transition: filter 0.8s ease, opacity 0.8s ease !important;
          filter: blur(20px);
        }
        .blur-carousel .swiper-slide-active {
          filter: blur(0px);
        }
      `}</style>
    </div>
  );
}
