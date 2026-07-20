import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const SUPPORT_PHONE = '8340173069';
const SUPPORT_EMAIL = 'support@learningfoxx.com';
const WHATSAPP_NUMBER = '918340173069';

export default function StickyHeader() {
  const { dark, toggle } = useTheme();

  return (
    <>
      <style>{`
        @keyframes hdrGlow {
          0%,100% { box-shadow: 0 4px 24px rgba(239,117,32,0.55), inset 0 1px 0 rgba(255,255,255,0.15); }
          50%      { box-shadow: 0 4px 40px rgba(239,117,32,0.9),  inset 0 1px 0 rgba(255,255,255,0.25); }
        }
        @keyframes sweep {
          0%   { left: -60%; }
          100% { left: 140%;  }
        }
        @keyframes phoneBounce {
          0%,100% { transform: scale(1) rotate(0deg); }
          20%     { transform: scale(1.12) rotate(-8deg); }
          40%     { transform: scale(1.12) rotate(8deg); }
          60%     { transform: scale(1.05) rotate(-4deg); }
          80%     { transform: scale(1.05) rotate(4deg); }
        }
        @keyframes textPulse {
          0%,100% { opacity:1; text-shadow: 0 0 8px rgba(255,255,255,0.3); }
          50%      { opacity:0.85; text-shadow: 0 0 20px rgba(255,220,180,0.8); }
        }
        .phone-icon { animation: phoneBounce 3s ease-in-out infinite; display:inline-block; }
        .contact-text { animation: textPulse 2.5s ease-in-out infinite; }
        .sweep-shine {
          position: absolute; top: 0; bottom: 0; width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: sweep 3s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      <div
        className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
        style={{
          height: '56px',
          background: 'linear-gradient(90deg, #7c2d12 0%, #c2410c 20%, #ea580c 40%, #f97316 50%, #ea580c 60%, #c2410c 80%, #7c2d12 100%)',
          animation: 'hdrGlow 2.5s ease-in-out infinite',
          borderBottom: '2px solid rgba(251,146,60,0.6)',
        }}
      >
        {/* Sweep shimmer */}
        <div className="sweep-shine" />

        <div className="relative max-w-screen-2xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2">

          {/* LEFT: Logo + Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
            <img src="/fox-logo.png" alt="Learning Foxx"
              className="h-10 w-10 rounded-full object-cover border-2 border-white/40 shadow-lg" />
            <span className="font-display font-bold text-white text-base hidden sm:block"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              Learning Foxx
            </span>
          </Link>

          {/* CENTER: Contact info — THE HERO */}
          <div className="flex items-center gap-2 sm:gap-5 flex-1 justify-center">

            {/* Phone */}
            <a href={`tel:${SUPPORT_PHONE}`}
              className="flex items-center gap-1.5 sm:gap-2 group no-underline">
              <span className="phone-icon text-lg sm:text-xl">📞</span>
              <div className="flex flex-col leading-none">
                <span className="text-orange-200 text-[9px] uppercase tracking-widest font-semibold hidden sm:block">
                  Call Us Now
                </span>
                <span className="contact-text font-mono font-black text-white text-sm sm:text-lg tracking-wider"
                  style={{ textShadow: '0 0 12px rgba(255,200,100,0.8), 0 2px 4px rgba(0,0,0,0.5)' }}>
                  {SUPPORT_PHONE}
                </span>
              </div>
            </a>

            {/* Divider */}
            <div className="h-8 w-px bg-white/30 hidden sm:block" />

            {/* Email */}
            <a href={`mailto:${SUPPORT_EMAIL}`}
              className="items-center gap-2 group no-underline hidden md:flex">
              <span className="text-lg">✉️</span>
              <div className="flex flex-col leading-none">
                <span className="text-orange-200 text-[9px] uppercase tracking-widest font-semibold">
                  Email Us
                </span>
                <span className="contact-text font-semibold text-white text-xs sm:text-sm"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                  {SUPPORT_EMAIL}
                </span>
              </div>
            </a>

            {/* Divider */}
            <div className="h-8 w-px bg-white/30 hidden md:block" />

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20need%20help%20with%20Learning%20Fox%20tuition.`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 no-underline"
              style={{
                background: 'rgba(37,211,102,0.25)',
                border: '1.5px solid rgba(37,211,102,0.7)',
                boxShadow: '0 0 16px rgba(37,211,102,0.3)',
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ fill: '#25D366' }} viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div className="hidden sm:block">
                <span className="text-[9px] text-green-300 uppercase tracking-widest font-semibold block leading-none">WhatsApp</span>
                <span className="text-white font-bold text-xs sm:text-sm leading-tight">Chat Now</span>
              </div>
            </a>
          </div>

          {/* RIGHT: Theme toggle */}
          <button onClick={toggle}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex-shrink-0"
            title="Toggle theme">
            {dark
              ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/></svg>
              : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            }
          </button>
        </div>
      </div>
    </>
  );
}

export { SUPPORT_PHONE, SUPPORT_EMAIL, WHATSAPP_NUMBER };
