import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Delete,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface PinLockScreenProps {
  correctPin: string;
  onUnlocked: () => void;
  sellerBusinessName: string;
  lang: Language;
  onToggleLang: (newLang: Language) => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin,
  onUnlocked,
  sellerBusinessName,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Step: 'cover' = animated TAYSIR cover screen with modern slider, 'pin' = 4-digit PIN keypad
  const [step, setStep] = useState<'cover' | 'pin'>('cover');

  // Live time for the top bar
  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // PIN state
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Slider state
  const [sliderProgress, setSliderProgress] = useState<number>(0);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const maxDrag = 220;

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setError(false);

    if (nextPin.length === 4) {
      if (nextPin === correctPin) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([40, 30, 40]);
        }
        setTimeout(() => {
          onUnlocked();
        }, 150);
      } else {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 700);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError(false);
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleSliderComplete = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }
    setSliderProgress(1);
    setTimeout(() => {
      setStep('pin');
      setSliderProgress(0);
    }, 180);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#212B1C]/95 backdrop-blur-md select-none overflow-hidden ${
        isRtl ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 bg-radial from-[#3C4C34]/40 via-[#212B1C]/90 to-[#141A11] pointer-events-none" />

      {/* Main Single Phone Container (Exact Matcha Olive #3C4C34 from 103.jpg) */}
      <div className="relative w-full max-w-sm sm:max-w-md h-full min-h-screen sm:min-h-[844px] sm:max-h-[92vh] flex flex-col justify-between overflow-hidden shadow-2xl sm:rounded-[48px] sm:border-[8px] sm:border-[#2C3826] bg-[#3C4C34] text-[#ECE5D8]">
        {/* Subtle Botanical Leaf Watermark in Lower Right (drawn from 103.jpg top-left screen) */}
        <div className="absolute -bottom-6 -right-6 pointer-events-none z-10 opacity-30 text-[#5A734F]">
          <svg
            viewBox="0 0 240 340"
            className="w-64 h-96"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main stem */}
            <path
              d="M190 330 C 160 250, 130 180, 95 90 C 85 60, 75 30, 65 10"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Top leaf */}
            <path
              d="M65 10 C 50 25, 45 45, 65 60 C 80 45, 80 25, 65 10 Z"
              strokeWidth="1.4"
            />
            {/* Leaf 1 (Left) */}
            <path
              d="M95 90 C 65 75, 30 65, 18 45 C 20 70, 55 95, 95 90 Z"
              strokeWidth="1.4"
            />
            <path d="M22 48 C 45 68, 70 80, 95 90" strokeWidth="0.9" strokeDasharray="2 2" />
            {/* Leaf 2 (Right) */}
            <path
              d="M115 135 C 150 120, 195 130, 215 110 C 200 145, 160 155, 115 135 Z"
              strokeWidth="1.4"
            />
            <path d="M115 135 C 155 140, 185 130, 210 114" strokeWidth="0.9" strokeDasharray="2 2" />
            {/* Leaf 3 (Left) */}
            <path
              d="M135 190 C 95 180, 55 195, 35 175 C 55 210, 105 210, 135 190 Z"
              strokeWidth="1.4"
            />
            {/* Leaf 4 (Right) */}
            <path
              d="M160 245 C 195 235, 230 255, 240 235 C 225 270, 185 270, 160 245 Z"
              strokeWidth="1.4"
            />
            {/* Leaf 5 (Bottom) */}
            <path
              d="M175 295 C 140 285, 105 310, 85 290 C 105 325, 150 325, 175 295 Z"
              strokeWidth="1.4"
            />
          </svg>
        </div>

        {/* Clean Top Bar (WITHOUT camera, wifi, or battery - per request) */}
        <div className="relative z-30 flex items-center justify-between px-7 pt-5 text-xs font-semibold text-[#ECE5D8]">
          {/* Live digital time */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/10 text-[11px] font-mono tracking-wider text-[#ECE5D8] shadow-xs">
            <span>{currentTime}</span>
          </div>

          {/* Clean Language Switcher Pill */}
          <div className="bg-black/20 backdrop-blur-xs rounded-full p-0.5 border border-white/10 flex items-center text-[10px]">
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#ECE5D8] text-[#3C4C34] shadow-xs'
                  : 'text-[#ECE5D8]/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('ar')}
              className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                lang === 'ar'
                  ? 'bg-[#ECE5D8] text-[#3C4C34] shadow-xs'
                  : 'text-[#ECE5D8]/70 hover:text-white'
              }`}
            >
              عربي
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'cover' ? (
            /* =========================================================================
               STEP 1: TAYSIR COVER SCREEN WITH MODERN WIDE SLIDER
               ========================================================================= */
            <motion.div
              key="cover-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative z-20 w-full flex-1 flex flex-col justify-between px-7 sm:px-8 pb-10 pt-4"
            >
              <div className="h-2" />

              {/* Center Hero: TAYSIR (EN) / تيسير (AR) Brand Typography */}
              <div className="my-auto flex flex-col items-center text-center space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="space-y-1"
                >
                  {/* Brand Main Title: TAYSIR in EN, تيسير in Arabic */}
                  {lang === 'ar' ? (
                    <h1 className="text-5xl sm:text-6xl font-arabic font-bold text-[#ECE5D8] tracking-wider select-none drop-shadow-xs">
                      تيسير
                    </h1>
                  ) : (
                    <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#ECE5D8] tracking-[0.28em] uppercase select-none drop-shadow-xs">
                      TAYSIR
                    </h1>
                  )}

                  {/* Brand Subtitle */}
                  <div className="text-[10.5px] sm:text-[11.5px] font-sans font-medium uppercase tracking-[0.3em] text-[#ECE5D8]/80 pt-1">
                    {lang === 'ar'
                      ? 'نظام إدارة الأقساط والديون الشهرية'
                      : 'GESTION DES TRAITES & CRÉDITS'}
                  </div>

                  {/* Minimalist delicate curved contour line from 103.jpg */}
                  <div className="pt-2 flex justify-center">
                    <svg viewBox="0 0 60 24" className="w-11 h-4 text-[#ECE5D8]/80">
                      <path
                        d="M 6 12 Q 30 1, 54 12 Q 30 9, 6 12 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 16 13 Q 30 21, 44 13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </motion.div>

                {/* Secure Offline Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#ECE5D8]/65 tracking-wider"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.encryptedData}</span>
                </motion.div>
              </div>

              {/* Bottom Section: Modern Wide Slider "Glisser pour ouvrir" */}
              <div className="w-full space-y-4">
                {/* 2-line Minimalist Motto */}
                <div className="text-left rtl:text-right space-y-0.5 px-1">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ECE5D8]/90">
                    {lang === 'ar' ? 'تيسير المعاملات المالية.' : 'PREMIUM CRÉDIT.'}
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#ECE5D8]/70">
                    {lang === 'ar' ? 'حفظ الحقوق وراحة البال.' : 'MINDFUL MOMENTS.'}
                  </div>
                </div>

                {/* MODERN WIDE SLIDER BAR (Style plus large, moderne et tactile) */}
                <div className="relative">
                  <div
                    ref={sliderTrackRef}
                    onClick={handleSliderComplete}
                    className="relative w-full h-15 rounded-2xl bg-[#232E1F]/90 backdrop-blur-md border border-[#526848]/70 p-1.5 flex items-center overflow-hidden cursor-pointer shadow-2xl transition-all hover:border-[#ECE5D8]/60"
                  >
                    {/* Glowing progressive fill following drag */}
                    <motion.div
                      className="absolute inset-y-1 left-1 rounded-xl bg-gradient-to-r from-[#ECE5D8]/30 via-[#ECE5D8]/50 to-[#ECE5D8]/80 pointer-events-none"
                      style={{
                        width: `${Math.max(15, sliderProgress * 100)}%`,
                      }}
                    />

                    {/* Centered Modern Animated Prompt */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
                      <motion.div
                        animate={{ opacity: [0.65, 1, 0.65], x: isRtl ? [-3, 3, -3] : [3, -3, 3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ECE5D8]"
                      >
                        <span>
                          {lang === 'ar' ? 'اسحب لفتح التطبيق' : 'Glisser pour ouvrir'}
                        </span>
                        {isRtl ? (
                          <ChevronsLeft className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                        ) : (
                          <ChevronsRight className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                        )}
                      </motion.div>
                    </div>

                    {/* Modern Sleek Draggable Knob */}
                    <motion.div
                      drag="x"
                      dragConstraints={
                        isRtl ? { left: -maxDrag, right: 0 } : { left: 0, right: maxDrag }
                      }
                      dragElastic={0.08}
                      dragMomentum={false}
                      onDrag={(_, info) => {
                        const travel = isRtl ? -info.point.x : info.point.x;
                        const progress = Math.max(0, Math.min(1, Math.abs(travel) / maxDrag));
                        setSliderProgress(progress);
                      }}
                      onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > maxDrag * 0.45) {
                          handleSliderComplete();
                        } else {
                          setSliderProgress(0);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-[#ECE5D8] via-[#FAF6ED] to-[#DDD4C5] text-[#2C3B24] shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing border border-white/60"
                    >
                      {isRtl ? (
                        <ChevronLeft className="w-5 h-5 text-[#2C3B24] stroke-[2.8]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#2C3B24] stroke-[2.8]" />
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               STEP 2: 4-DIGIT PIN KEYPAD SCREEN (CLEAN & MODERN MATCHA PALETTE)
               ========================================================================= */
            <motion.div
              key="pin-keypad-screen"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ duration: 0.3 }}
              className="relative z-20 w-full flex-1 flex flex-col justify-between px-7 pb-8 pt-3 bg-[#3C4C34]"
            >
              {/* Back Button & Header */}
              <div className="w-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep('cover');
                    setPin('');
                    setError(false);
                  }}
                  className="py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 text-[#ECE5D8] transition-all flex items-center gap-1.5 text-xs border border-white/15 cursor-pointer shadow-xs"
                >
                  {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  <span className="text-[11px] font-semibold">{t.back}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[10px] text-[#ECE5D8]/70 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.encryptedData}</span>
                </div>
              </div>

              {/* Title & Key Emblem */}
              <div className="flex flex-col items-center text-center mt-2">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-14 h-14 rounded-2xl bg-black/25 text-[#ECE5D8] flex items-center justify-center mb-2 shadow-lg border border-white/15"
                >
                  <KeyRound className="w-7 h-7 text-[#D4AF37]" />
                </motion.div>

                <h2 className="text-xl font-serif font-normal text-[#ECE5D8] tracking-widest uppercase">
                  {t.enterPinPrompt}
                </h2>
                <p className="text-xs text-[#ECE5D8]/70 mt-0.5">
                  {lang === 'ar' ? 'تيسير • رمز الدخول السري' : 'TAYSIR • CODE DE SÉCURITÉ'}
                </p>
              </div>

              {/* PIN Indicator Dots */}
              <div className="flex flex-col items-center my-2">
                <motion.div
                  animate={error ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-4 mb-2"
                >
                  {[0, 1, 2, 3].map((idx) => {
                    const isFilled = pin.length > idx;
                    return (
                      <motion.div
                        key={idx}
                        animate={
                          isFilled
                            ? { scale: [1, 1.25, 1], backgroundColor: '#ECE5D8' }
                            : { scale: 1, backgroundColor: 'transparent' }
                        }
                        transition={{ duration: 0.2 }}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          error
                            ? 'bg-rose-500 border-rose-500 scale-110 shadow-sm'
                            : isFilled
                            ? 'border-[#ECE5D8] shadow-xs'
                            : 'border-[#ECE5D8]/40'
                        }`}
                      />
                    );
                  })}
                </motion.div>

                <p
                  className={`text-xs h-4 font-medium transition-opacity ${
                    error ? 'text-rose-300 opacity-100 font-bold' : 'text-[#ECE5D8]/60 opacity-80'
                  }`}
                >
                  {error ? t.wrongPin : t.pinPlaceholder}
                </p>
              </div>

              {/* Numeric Keypad in Translucent Matcha Glass */}
              <div className="w-full max-w-[270px] mx-auto grid grid-cols-3 gap-2.5 mb-2" dir="ltr">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <motion.button
                    key={num}
                    type="button"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    whileTap={{ scale: 0.92, backgroundColor: '#ECE5D8', color: '#3C4C34' }}
                    onClick={() => handleDigit(num.toString())}
                    className="h-12 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xl font-medium text-[#ECE5D8] transition-colors flex items-center justify-center shadow-xs cursor-pointer active:text-[#3C4C34]"
                  >
                    {num}
                  </motion.button>
                ))}

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={handleClear}
                  className="h-12 rounded-2xl bg-transparent hover:bg-white/10 text-xs font-semibold text-[#ECE5D8]/70 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {t.clear}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  whileTap={{ scale: 0.92, backgroundColor: '#ECE5D8', color: '#3C4C34' }}
                  onClick={() => handleDigit('0')}
                  className="h-12 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xl font-medium text-[#ECE5D8] transition-colors flex items-center justify-center shadow-xs cursor-pointer active:text-[#3C4C34]"
                >
                  0
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={handleDelete}
                  aria-label={t.delete}
                  className="h-12 rounded-2xl bg-transparent hover:bg-white/10 text-[#ECE5D8]/80 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Delete className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Forgot PIN help notice */}
              <div className="flex flex-col items-center text-center text-xs text-[#ECE5D8]/70 gap-1 pb-1">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-[11px] text-[#ECE5D8] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{showHint ? t.hideHelp : t.forgotPinHelp}</span>
                </button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/40 text-[11px] text-[#ECE5D8] max-w-[270px] leading-relaxed shadow-xs"
                  >
                    {t.defaultPinNotice}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
