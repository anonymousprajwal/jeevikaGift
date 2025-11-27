import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Zap, Flame, Trophy, Target, Bike, Route, HeartHandshake } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Placeholder images - using a variety of landscape/nature images
const images = [
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&h=600&fit=crop', // Darker Road
  'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&h=600&fit=crop', // Sunset Road
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop', // Mountain Trail
  'https://images.unsplash.com/photo-1471506480208-91b3a4cc99be?w=800&h=600&fit=crop', // Desert Road
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' // Coastal Drive
];

export default function BikerBirthday() {
  const [loaded, setLoaded] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [modal, setModal] = useState({ open: false, index: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredImage, setHoveredImage] = useState(null);
  const [particles, setParticles] = useState([]);
  const galleryRef = useRef(null);
  const imageRefs = useRef([]);
  const cardRefs = useRef([]);
  // Ref for all sections to simplify smooth scrolling
  const sectionRefs = useRef({
    hero: useRef(null),
    gallery: useRef(null),
    message: useRef(null),
  });

  useEffect(() => {
    // Initial loading state
    setTimeout(() => setLoaded(true), 100);
    setTimeout(() => setShowTitle(true), 600);
    
    // Create speed particles
    const newParticles = [...Array(40)].map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // Smooth Scroll to Section on activeSection change
  useEffect(() => {
    if (sectionRefs.current[activeSection]?.current) {
      sectionRefs.current[activeSection].current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'gallery') return;

    ScrollTrigger.config({ 
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      limitCallbacks: true
    });

    const ctx = gsap.context(() => {
      imageRefs.current.forEach((el, i) => {
        if (!el) return;

        // ANIMATION 1: Image entrance
        const direction = i % 4;
        let fromVars = { 
          opacity: 0, 
          scale: 0.5,
          rotationY: 0,
          x: 0,
          y: 0,
        };
        
        if (direction === 0) {
          fromVars.x = -800;
          fromVars.rotationY = -90;
        } else if (direction === 1) {
          fromVars.x = 800;
          fromVars.rotationY = 90;
        } else if (direction === 2) {
          fromVars.y = -600;
        } else {
          fromVars.y = 600;
        }

        gsap.fromTo(el, 
          fromVars,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotationY: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 25%',
              toggleActions: 'play none none reverse',
              scrub: 2,
            }
          }
        );

        // ANIMATION 2: Card entrance (side-in)
        const card = cardRefs.current[i];
        if (card) {
          const isLeft = i % 2 === 0;
          gsap.fromTo(card,
            {
              opacity: 0,
              x: isLeft ? -300 : 300,
              scale: 0.7,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 30%',
                toggleActions: 'play none none reverse',
                scrub: 1.5,
              }
            }
          );
        }

        // ANIMATION 3: Hover effect (refined with GSAP)
        const imgContainer = el.querySelector('.image-container');
        const img = el.querySelector('img');
        if (imgContainer && img) {
          const hoverTween = gsap.to(img, {
            scale: 1.15,
            rotation: 2,
            duration: 0.6,
            ease: 'power2.out',
            paused: true
          });
          
          imgContainer.addEventListener('mouseenter', () => hoverTween.play());
          imgContainer.addEventListener('mouseleave', () => hoverTween.reverse());
        }
      });

      // ANIMATION 4: Gallery Title entrance
      const title = galleryRef.current?.querySelector('.gallery-title');
      if (title) {
        gsap.fromTo(title,
          { opacity: 0, y: -60, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    }, galleryRef);

    return () => ctx.revert();
  }, [activeSection]);

  // Hero Section Entrance Animation
  useEffect(() => {
    if (!loaded || !showTitle || activeSection !== 'hero') return;

    const tl = gsap.timeline({ 
      delay: 0.2,
      defaults: { ease: 'power3.out' }
    });
    
    tl.from('.hero-bike', {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.5)'
    })
    .from('.hero-title-1', {
      x: -200,
      opacity: 0,
      duration: 1,
    }, '-=0.6')
    .from('.hero-title-2', {
      x: 200,
      opacity: 0,
      duration: 1,
    }, '-=0.8')
    .from('.hero-subtitle', {
      y: 60,
      opacity: 0,
      duration: 0.8,
    }, '-=0.4')
    .from('.hero-icons .icon-item', {
      scale: 0,
      opacity: 0,
      rotation: 180,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(2)'
    }, '-=0.3')
    .from('.hero-button', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.2');

  }, [loaded, activeSection, showTitle]);

  // Modal handlers (keep original for smooth transitions)
  const openImage = (i) => {
    setModal({ open: true, index: i });
    
    const tl = gsap.timeline();
    tl.from('.modal-overlay', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
    .from('.modal-image', {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.2');
  };

  const close = () => {
    gsap.to('.modal-overlay', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => setModal({ open: false, index: modal.index })
    });
  };

  const next = () => {
    const tl = gsap.timeline();
    tl.to('.modal-image', {
      x: -100,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    })
    .call(() => {
      setModal((m) => ({ ...m, index: (m.index + 1) % images.length }));
    })
    .fromTo('.modal-image',
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  };

  const prev = () => {
    const tl = gsap.timeline();
    tl.to('.modal-image', {
      x: 100,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    })
    .call(() => {
      setModal((m) => ({ ...m, index: (m.index - 1 + images.length) % images.length }));
    })
    .fromTo('.modal-image',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  };

  // --- RENDER ---
  return (
    <div className="relative overflow-x-hidden bg-slate-900 min-h-[300vh]">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#10162A] via-[#1F2937] to-slate-900" />
      <div className="fixed inset-0 bg-gradient-to-tl from-[#6D071A]/70 via-[#A32D2D]/40 to-transparent" />
      
      {/* Animated blobs - Adjusted colors for better blend */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-red-800 rounded-full mix-blend-lighten filter blur-3xl animate-blob" style={{ backgroundColor: '#800020' }} />
        <div className="absolute top-0 -right-20 w-96 h-96 bg-orange-400 rounded-full mix-blend-lighten filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-blue-700 rounded-full mix-blend-lighten filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600 rounded-full mix-blend-lighten filter blur-3xl animate-blob animation-delay-3000" />
      </div>

      {/* Speed particles - more subtle effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-60">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-speed-line"
            style={{
              top: `${p.top}%`,
              right: '-10px',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            <div className="w-20 h-0.5 bg-gradient-to-l from-orange-400/80 to-transparent shadow-orange-500/50 shadow-md" />
          </div>
        ))}
      </div>

      {/* Floating icons - More thematic icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-smooth opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Zap className="text-orange-400" size={24 + Math.random() * 20} />
            ) : i % 4 === 1 ? (
              <Flame className="text-red-500" size={20 + Math.random() * 16} />
            ) : i % 4 === 2 ? (
              <Route className="text-white/80" size={22 + Math.random() * 18} />
            ) : (
              <Bike className="text-red-400" size={20 + Math.random() * 16} />
            )}
          </div>
        ))}
      </div>

      {/* NAVIGATION - Smoother, more defined */}
      <nav className="sticky top-0 z-50 p-4 flex justify-center gap-2 md:gap-4 bg-slate-900/60 backdrop-blur-md border-b border-orange-500/20 shadow-xl">
        {[
          { id: 'hero', icon: Bike, label: 'Home' },
          { id: 'gallery', icon: Route, label: 'Gallery' },
          { id: 'message', icon: HeartHandshake, label: 'Message' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-bold transition-all duration-300 transform flex items-center gap-2 text-sm md:text-base ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 scale-105 border border-white/50'
                : 'bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm hover:scale-[1.02] border border-white/10'
            }`}
          >
            <section.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </nav>

      {/* SECTIONS */}
      
      {/* 1. HERO SECTION */}
      <div id="hero" ref={sectionRefs.current.hero} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center space-y-8 max-w-5xl">
          <div className="relative inline-block hero-bike">
            <div className="absolute inset-0 bg-orange-500/40 rounded-full blur-3xl animate-pulse-glow" />
            <div className="relative text-9xl animate-bounce-gentle p-2">
              <Bike className="text-white drop-shadow-lg" size={120} strokeWidth={1} style={{ filter: 'drop-shadow(0 0 10px #f97316)' }} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="hero-title-1 text-8xl md:text-9xl lg:text-[10rem] font-extrabold text-white drop-shadow-2xl tracking-tighter leading-none">
              HAPPY
            </h1>
            <h1 className="hero-title-2 text-8xl md:text-9xl lg:text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-red-800 drop-shadow-2xl tracking-tighter leading-none">
              BIRTHDAY
            </h1>
          </div>

          {showTitle && (
            <div className="space-y-8">
              <p className="hero-subtitle text-xl md:text-3xl text-white font-semibold drop-shadow-xl tracking-wide uppercase mt-4">
                Rev up for another <span className="text-orange-400 animate-pulse font-extrabold">EPIC</span> year! 🔥
              </p>
              
              <div className="hero-icons flex justify-center gap-6 flex-wrap pt-4">
                {[Zap, Flame, Trophy, Target, Zap, Flame].map((Icon, i) => (
                  <Icon
                    key={i}
                    className="icon-item text-orange-400 drop-shadow-glow"
                    size={40}
                    strokeWidth={2.5}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setActiveSection('gallery')}
                  className="hero-button group relative bg-gradient-to-r from-orange-500 via-red-600 to-red-700 text-white px-12 py-5 rounded-xl font-black text-xl shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden border-2 border-white/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                  <div className="relative flex items-center gap-3">
                    <Route className="group-hover:translate-x-1 transition-transform" size={24} />
                    <span className="tracking-widest">VIEW THE RIDE</span>
                    <Zap className="group-hover:scale-125 transition-transform" size={24} />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. GALLERY SECTION */}
      <div id="gallery" ref={sectionRefs.current.gallery} className="relative z-10 py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-4" ref={galleryRef}>
          <div className="gallery-title text-center mb-40 sticky top-28 z-20 pointer-events-none">
            <h2 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-4 tracking-tighter uppercase">
              The Journey
            </h2>
            <p className="text-2xl md:text-3xl text-orange-400 font-extrabold drop-shadow-lg uppercase tracking-wider">
              Memories on the Open Road 🗺️
            </p>
          </div>

          <div className="space-y-[80vh]">
            {images.map((src, i) => {
              const isLeft = i % 2 === 0;
              
              return (
                <div
                  key={src}
                  ref={(el) => (imageRefs.current[i] = el)}
                  className="min-h-[40vh] flex items-center justify-center"
                  style={{ perspective: '1000px' }}
                >
                  <div className="w-full flex flex-col md:flex-row items-center gap-10 md:gap-20">
                    
                    {/* INFO CARD */}
                    <div 
                      ref={(el) => (cardRefs.current[i] = el)}
                      className={`flex-1 ${isLeft ? 'md:order-1' : 'md:order-2'} w-full`}
                    >
                      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-orange-500/50 shadow-2xl max-w-md mx-auto transform hover:scale-[1.02] transition duration-300 ease-in-out">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-extrabold shadow-lg uppercase tracking-widest">
                            RIDE #{i + 1}
                          </div>
                          <Flame className="text-red-500" size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">
                          {i === 0 ? 'Ignition Point' : i === images.length - 1 ? 'Latest Conquest' : `The Open Trail`}
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed border-t border-white/10 pt-4 mt-4">
                          {i === 0 ? 'The start of the unforgettable journey. Every great story begins here.' : i === images.length - 1 ? 'The throttle is still wide open. More adventures await around the bend!' : `Conquering new highways and leaving tracks in the dust. Another memory locked in.`}
                        </p>
                      </div>
                    </div>

                    {/* IMAGE CONTAINER */}
                    <div className={`flex-1 ${isLeft ? 'md:order-2' : 'md:order-1'} w-full`}>
                      <button
                        onClick={() => openImage(i)}
                        onMouseEnter={() => setHoveredImage(i)}
                        onMouseLeave={() => setHoveredImage(null)}
                        className="image-container group relative w-full max-w-lg mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/70 cursor-pointer bg-slate-800 border-6 border-orange-500/60 transform transition-all duration-500"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <img
                          src={src}
                          alt={`Memory ${i + 1}`}
                          className="w-full h-full object-cover transition-all duration-600 ease-out"
                        />
                        
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-red-900/40 to-transparent transition-opacity duration-300 ${hoveredImage === i ? 'opacity-100' : 'opacity-0'}`} />
                        
                        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${hoveredImage === i ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                          <div className="relative mb-3">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-70" />
                            <div className="relative bg-white/95 rounded-full p-4 shadow-2xl">
                              <Route className="text-red-600 w-8 h-8" strokeWidth={3} />
                            </div>
                          </div>
                          <span className="text-white font-extrabold text-lg bg-black/70 px-6 py-3 rounded-full backdrop-blur-sm uppercase tracking-widest border border-white/20">
                            Open Photo
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MESSAGE SECTION */}
      <div id="message" ref={sectionRefs.current.message} className="relative z-10 py-32 md:py-40 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 md:p-16 shadow-2xl shadow-red-900/50 border-4 border-red-700/50">
            <div className="space-y-8 text-white">
              <h2 className="text-4xl md:text-6xl font-black text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-red-800 uppercase tracking-tighter" style={{ filter: 'drop-shadow(0 0 5px rgba(251, 146, 60, 0.5))' }}>
                <HeartHandshake className="inline-block w-10 h-10 md:w-12 md:h-12 mr-3 align-text-top" />
                Birthday Message
                <Bike className="inline-block w-10 h-10 md:w-12 md:h-12 ml-3 align-text-top" />
              </h2>

              <p className="text-xl md:text-2xl leading-relaxed text-gray-200">
                Brother, today's your day to celebrate another year of being absolutely <span className="text-orange-400 font-extrabold shadow-text-sm">legendary</span>! 🔥
              </p>

              <p className="text-xl md:text-2xl leading-relaxed text-gray-200">
                You've always lived life in the fast lane, chasing adventures and making every mile count. Your passion for bikes and the open road is just a reflection of your <span className="text-red-400 font-extrabold shadow-text-sm">fearless spirit</span>.
              </p>

              <p className="text-xl md:text-2xl leading-relaxed text-gray-200">
                Keep that engine roaring, keep pushing boundaries, and never stop being the <span className="text-orange-400 font-extrabold shadow-text-sm">amazing person</span> you are. The best miles are still ahead of you! ⚡
              </p>

              <p className="text-xl md:text-2xl leading-relaxed text-gray-200">
                Here's to more adventures, more victories, and more unforgettable moments. May this year bring you everything you've been revving up for! 🏆
              </p>

              <div className="pt-10 text-center">
                <p className="text-2xl font-black text-orange-400 mb-3 uppercase tracking-wider">
                  Stay Fast, Stay Fierce!
                </p>
                <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-red-800" style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))' }}>
                  — Your Crew 🏍️💨
                </p>
              </div>
            </div>

            {/* Decorative flames/sparks */}
            {[...Array(8)].map((_, i) => (
              <Zap
                key={i}
                className="absolute text-yellow-500/40 animate-float-smooth-slow"
                size={30 + Math.random() * 20}
                strokeWidth={1}
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
      </div>


      {/* MODAL (kept mostly the same, refined buttons) */}
      {modal.open && (
        <div
          className="modal-overlay fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-xl border-2 border-white/50 z-10"
            aria-label="Close"
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-orange-500 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-2xl border border-white/30"
            aria-label="Previous"
          >
            <ChevronLeft size={32} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-orange-500 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-2xl border border-white/30"
            aria-label="Next"
          >
            <ChevronRight size={32} strokeWidth={2.5} />
          </button>

          <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[modal.index]}
              alt={`Photo ${modal.index + 1}`}
              className="modal-image max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl border-4 border-orange-500/50"
            />
          </div>
        </div>
      )}

      {/* STYLES (Adjusted for better visuals) */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-40px, 40px) scale(0.9); }
        }
        @keyframes speed-line {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateX(-120vw); opacity: 0; }
        }
        @keyframes float-smooth {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(25px, -35px); opacity: 0.4; }
        }
        @keyframes float-smooth-slow {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(15px, -20px); opacity: 0.4; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-blob { animation: blob 8s ease-in-out infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-speed-line { animation: speed-line linear infinite; }
        .animate-float-smooth { animation: float-smooth 12s ease-in-out infinite; }
        .animate-float-smooth-slow { animation: float-smooth-slow 10s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 4s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        
        .drop-shadow-glow { filter: drop-shadow(0 0 8px #f97316) drop-shadow(0 0 1px white); }
        .shadow-text-sm { text-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }
      `}</style>
    </div>
  );
}