import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Zap, Flame, Trophy, Target, Sparkles } from 'lucide-react';
import pic1 from './assets/pic1.jpg';
import pic2 from './assets/pic2.jpg';
import pic3 from './assets/pic3.jpg';
import pic4 from './assets/pic4.jpg';

const images = [pic1, pic2, pic3, pic4];



// GSAP CDN Integration
const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) {
      resolve(window.gsap);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    script.onload = () => {
      const scrollTriggerScript = document.createElement('script');
      scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      scrollTriggerScript.onload = () => {
        window.gsap.registerPlugin(window.ScrollTrigger);
        resolve(window.gsap);
      };
      document.head.appendChild(scrollTriggerScript);
    };
    document.head.appendChild(script);
  });
};

// Sample images - replace with your actual images


export default function BikerBirthday() {
  const [loaded, setLoaded] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [modal, setModal] = useState({ open: false, index: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredImage, setHoveredImage] = useState(null);
  const [gsapReady, setGsapReady] = useState(false);
  
  const galleryRef = useRef(null);
  const imageRefs = useRef([]);
  const cardRefs = useRef([]);
  const heroRef = useRef(null);

  // Load GSAP
  useEffect(() => {
    loadGSAP().then(() => {
      setGsapReady(true);
      setTimeout(() => setLoaded(true), 100);
      setTimeout(() => setShowTitle(true), 600);
    });
  }, []);

  // Hero animations
  useEffect(() => {
    if (!gsapReady || !loaded || !showTitle || activeSection !== 'hero' || !heroRef.current) return;

    const gsap = window.gsap;
    const tl = gsap.timeline({ 
      delay: 0.2,
      defaults: { ease: 'power3.out' }
    });
    
    tl.from('.hero-bike', {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.7)'
    })
    .from('.hero-title-1', {
      x: -300,
      opacity: 0,
      duration: 1,
    }, '-=0.6')
    .from('.hero-title-2', {
      x: 300,
      opacity: 0,
      duration: 1,
    }, '-=0.8')
    .from('.hero-subtitle', {
      y: 80,
      opacity: 0,
      duration: 0.8,
    }, '-=0.4')
    .from('.hero-icons .icon-item', {
      scale: 0,
      opacity: 0,
      rotation: 180,
      stagger: 0.12,
      duration: 0.7,
      ease: 'back.out(2.5)'
    }, '-=0.3')
    .from('.hero-button', {
      scale: 0,
      opacity: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.6)'
    }, '-=0.2');

    return () => tl.kill();
  }, [gsapReady, loaded, showTitle, activeSection]);

  // Gallery scroll animations
  useEffect(() => {
    if (!gsapReady || activeSection !== 'gallery') return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    ScrollTrigger.config({ 
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      limitCallbacks: true
    });

    const ctx = gsap.context(() => {
      // Animate gallery title
      const title = galleryRef.current?.querySelector('.gallery-title');
      if (title) {
        gsap.fromTo(title,
          { opacity: 0, y: -80, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Animate each image with unique effects
      imageRefs.current.forEach((el, i) => {
        if (!el) return;

        // Different entrance directions
        const direction = i % 4;
        let fromVars = { 
          opacity: 0, 
          scale: 0.6,
          rotationY: 0,
          x: 0,
          y: 0,
        };
        
        if (direction === 0) {
          fromVars.x = -1000;
          fromVars.rotationY = -90;
        } else if (direction === 1) {
          fromVars.x = 1000;
          fromVars.rotationY = 90;
        } else if (direction === 2) {
          fromVars.y = -800;
          fromVars.scale = 0.3;
        } else {
          fromVars.y = 800;
          fromVars.scale = 0.3;
        }

        // Image animation
        gsap.fromTo(el, 
          fromVars,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotationY: 0,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
              scrub: 2,
            }
          }
        );

        // Card animation (info boxes)
        const card = cardRefs.current[i];
        if (card) {
          const isLeft = i % 2 === 0;
          gsap.fromTo(card,
            {
              opacity: 0,
              x: isLeft ? -400 : 400,
              scale: 0.6,
              rotation: isLeft ? -15 : 15,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              rotation: 0,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 25%',
                toggleActions: 'play none none reverse',
                scrub: 1.8,
              }
            }
          );
        }

        // Hover animation for images
        const img = el.querySelector('img');
        if (img) {
          el.addEventListener('mouseenter', () => {
            gsap.to(img, {
              scale: 1.2,
              rotation: 3,
              duration: 0.7,
              ease: 'power2.out',
            });
            gsap.to(el, {
              boxShadow: '0 25px 50px -12px rgba(251, 146, 60, 0.5)',
              borderColor: 'rgba(251, 146, 60, 0.8)',
              duration: 0.5,
            });
          });
          
          el.addEventListener('mouseleave', () => {
            gsap.to(img, {
              scale: 1,
              rotation: 0,
              duration: 0.7,
              ease: 'power2.out',
            });
            gsap.to(el, {
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              borderColor: 'rgba(251, 146, 60, 0.5)',
              duration: 0.5,
            });
          });
        }
      });
    }, galleryRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [gsapReady, activeSection]);

  const openImage = (i) => {
    setModal({ open: true, index: i });
    if (!gsapReady) return;
    
    const gsap = window.gsap;
    const tl = gsap.timeline();
    tl.from('.modal-overlay', {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    })
    .from('.modal-image', {
      scale: 0.3,
      opacity: 0,
      rotation: 180,
      duration: 0.7,
      ease: 'back.out(1.7)'
    }, '-=0.2');
  };

  const close = () => {
    if (!gsapReady) {
      setModal({ open: false, index: modal.index });
      return;
    }
    
    const gsap = window.gsap;
    gsap.to('.modal-overlay', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => setModal({ open: false, index: modal.index })
    });
  };

  const next = () => {
    if (!gsapReady) {
      setModal((m) => ({ ...m, index: (m.index + 1) % images.length }));
      return;
    }
    
    const gsap = window.gsap;
    const tl = gsap.timeline();
    tl.to('.modal-image', {
      x: -150,
      opacity: 0,
      rotation: -20,
      duration: 0.3,
      ease: 'power2.in'
    })
    .call(() => {
      setModal((m) => ({ ...m, index: (m.index + 1) % images.length }));
    })
    .fromTo('.modal-image',
      { x: 150, opacity: 0, rotation: 20 },
      { x: 0, opacity: 1, rotation: 0, duration: 0.5, ease: 'power3.out' }
    );
  };

  const prev = () => {
    if (!gsapReady) {
      setModal((m) => ({ ...m, index: (m.index - 1 + images.length) % images.length }));
      return;
    }
    
    const gsap = window.gsap;
    const tl = gsap.timeline();
    tl.to('.modal-image', {
      x: 150,
      opacity: 0,
      rotation: 20,
      duration: 0.3,
      ease: 'power2.in'
    })
    .call(() => {
      setModal((m) => ({ ...m, index: (m.index - 1 + images.length) % images.length }));
    })
    .fromTo('.modal-image',
      { x: -150, opacity: 0, rotation: -20 },
      { x: 0, opacity: 1, rotation: 0, duration: 0.5, ease: 'power3.out' }
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-900">
      {/* Enhanced gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-slate-900" />
      <div className="fixed inset-0 bg-gradient-to-tl from-rose-900/70 via-red-800/50 to-transparent" />
      
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-orange-500 to-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-20 w-[600px] h-[600px] bg-gradient-to-bl from-sky-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-20 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-gradient-to-tl from-red-700 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000" />
      </div>

      {/* Speed particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-speed-line"
            style={{
              top: `${Math.random() * 100}%`,
              right: '-10px',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${0.8 + Math.random() * 1.5}s`,
            }}
          >
            <div 
              className="h-0.5 bg-gradient-to-l from-white/80 via-orange-400/60 to-transparent"
              style={{ width: `${40 + Math.random() * 80}px` }}
            />
          </div>
        ))}
      </div>

      {/* Floating icons with better animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => {
          const Icon = [Zap, Flame, Trophy, Target, Sparkles][i % 5];
          return (
            <div
              key={i}
              className="absolute animate-float-icon"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 8}s`,
              }}
            >
              <Icon 
                className="text-yellow-300/30" 
                size={20 + Math.random() * 25}
                strokeWidth={2}
              />
            </div>
          );
        })}
      </div>

      {/* Enhanced navigation */}
      <nav className="sticky top-0 z-50 p-6 flex justify-center gap-4 backdrop-blur-md bg-slate-900/20">
        {[
          { id: 'hero', icon: '🏍️', label: 'Home' },
          { id: 'gallery', icon: '🔥', label: 'Gallery' },
          { id: 'message', icon: '⚡', label: 'Message' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`group relative px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-500 transform flex items-center gap-2 overflow-hidden ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/50 scale-110'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md hover:scale-105 border border-white/30'
            }`}
          >
            {activeSection === section.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
            <span className="text-xl relative z-10">{section.icon}</span>
            <span className="hidden sm:inline relative z-10">{section.label}</span>
          </button>
        ))}
      </nav>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 pt-10">
          <div className="text-center space-y-8 max-w-5xl">
            {/* Animated bike icon */}
            <div className="hero-bike relative inline-block">
              <div className="absolute inset-0 bg-orange-500/40 rounded-full blur-3xl animate-pulse-glow" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full blur-2xl animate-pulse-slow" />
              <div className="relative text-9xl animate-bounce-gentle filter drop-shadow-2xl">
                🏍️
              </div>
              <div className="absolute -top-4 -right-4 text-3xl animate-spin-slow">✨</div>
              <div className="absolute -bottom-4 -left-4 text-3xl animate-spin-reverse">⚡</div>
            </div>

            {/* Title animation */}
            <div className="space-y-2">
              <h1 className="hero-title-1 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white drop-shadow-2xl tracking-tight leading-none">
                HAPPY
              </h1>
              <h1 className="hero-title-2 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 drop-shadow-2xl tracking-tight leading-none">
                BIRTHDAY
              </h1>
            </div>

            <div className="space-y-8">
              <p className="hero-subtitle text-xl sm:text-2xl md:text-3xl text-white font-bold drop-shadow-xl tracking-wide uppercase">
                Rev up for another <span className="text-orange-400 animate-pulse-fast inline-block">epic</span> year! 🔥
              </p>
              
              {/* Icon row */}
              <div className="hero-icons flex justify-center gap-3 sm:gap-4 flex-wrap">
                {[Zap, Flame, Trophy, Target, Sparkles, Zap].map((Icon, i) => (
                  <Icon
                    key={i}
                    className="icon-item text-orange-400 drop-shadow-glow hover:scale-125 transition-transform duration-300"
                    size={32}
                    strokeWidth={2.5}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setActiveSection('gallery')}
                  className="hero-button group relative bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-orange-500/60 transform hover:scale-110 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                  <div className="relative flex items-center gap-3">
                    <Zap className="group-hover:rotate-12 transition-transform duration-300" size={24} />
                    <span className="tracking-wide">VIEW THE RIDE</span>
                    <Flame className="group-hover:scale-125 transition-transform duration-300" size={24} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Section */}
      {activeSection === 'gallery' && (
        <div className="relative z-10 py-20" ref={galleryRef}>
          <div className="max-w-7xl mx-auto px-4">
            {/* Sticky title */}
            <div className="gallery-title text-center mb-24 sticky top-32 z-20 pointer-events-none">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-600/30 blur-2xl animate-pulse-slow" />
                <h2 className="relative text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tight uppercase">
                  The Journey
                </h2>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-orange-300 font-bold drop-shadow-lg uppercase mt-2">
                Memories on the Road 🏍️
              </p>
            </div>

            {/* Image grid with scroll animations */}
            <div className="space-y-32">
              {images.map((src, i) => {
                const isLeft = i % 2 === 0;
                
                return (
                  <div
                    key={i}
                    ref={(el) => (imageRefs.current[i] = el)}
                    className="min-h-[60vh] flex items-center justify-center"
                    style={{ perspective: '1500px' }}
                  >
                    <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
                      {/* Info card */}
                      <div 
                        ref={(el) => (cardRefs.current[i] = el)}
                        className={`flex-1 ${isLeft ? 'md:order-1' : 'md:order-2'}`}
                      >
                        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-orange-500/50 shadow-2xl shadow-orange-500/20 max-w-md mx-auto hover:border-orange-400 transition-all duration-500 hover:shadow-orange-500/40 hover:scale-105">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg uppercase tracking-wider">
                              Mile #{i + 1}
                            </div>
                            <Zap className="text-orange-400 animate-pulse-fast" size={20} />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                            {i === 0 ? 'The Start' : i === images.length - 1 ? 'Latest Adventure' : `Checkpoint ${i + 1}`}
                          </h3>
                          <p className="text-gray-300 text-lg">
                            {i === 0 ? 'Where the ride began...' : i === images.length - 1 ? 'Still going strong...' : 'Another mile conquered'}
                          </p>
                        </div>
                      </div>

                      {/* Image */}
                      <div className={`flex-1 ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
                        <button
                          onClick={() => openImage(i)}
                          onMouseEnter={() => setHoveredImage(i)}
                          onMouseLeave={() => setHoveredImage(null)}
                          className="group relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-2xl cursor-pointer bg-slate-800 border-4 border-orange-500/50 hover:border-orange-400 transition-all duration-500"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <img
                            src={src}
                            alt={`Memory ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700"
                          />
                          
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-orange-900/50 to-transparent transition-opacity duration-500 ${hoveredImage === i ? 'opacity-100' : 'opacity-0'}`} />
                          
                          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${hoveredImage === i ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                            <div className="relative mb-3">
                              <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-60 animate-pulse-glow" />
                              <div className="relative bg-white/95 rounded-full p-3 shadow-2xl">
                                <Zap className="text-orange-600 w-7 h-7" strokeWidth={3} />
                              </div>
                            </div>
                            <span className="text-white font-bold text-lg bg-black/70 px-6 py-2 rounded-lg backdrop-blur-sm uppercase tracking-wider">
                              View Full
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
      )}

      {/* Message Section */}
      {activeSection === 'message' && (
        <div className="relative z-10 py-20 px-4 animate-fade-in">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-orange-500/40 hover:border-orange-400 transition-all duration-500">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-8 bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent uppercase tracking-tight">
                🏍️ Birthday Message 🏍️
              </h2>

              <div className="space-y-5 text-base sm:text-lg md:text-xl leading-relaxed">
                <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  Brother, today's your day to celebrate another year of being absolutely <span className="text-orange-400 font-bold">legendary</span>! 🔥
                </p>

                <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  You've always lived life in the fast lane, chasing adventures and making every moment count. Your passion for bikes and the open road is just a reflection of your <span className="text-orange-400 font-bold">fearless spirit</span>.
                </p>

                <p className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  Keep that engine roaring, keep pushing boundaries, and never stop being the <span className="text-orange-400 font-bold">amazing person</span> you are. The best miles are still ahead of you! ⚡
                </p>

                <p className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  Here's to more adventures, more victories, and more unforgettable moments. May this year bring you everything you've been revving up for! 🏆
                </p>
              </div>

              <div className="pt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <p className="text-xl font-bold text-orange-400 mb-2 uppercase tracking-wider">
                  Stay Fast, Stay Fierce!
                </p>
                <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent">
                  — Your Crew 🏍️💨
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <Flame
                  key={i}
                  className="absolute text-orange-500/15 animate-float-icon"
                  size={30 + Math.random() * 25}
                  style={{
                    left: `${10 + i * 8}%`,
                    top: `${10 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${6 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl animate-fade-in"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 bg-white hover:bg-red-600 text-gray-800 hover:text-white rounded-xl p-3 transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-2xl z-10"
            aria-label="Close"
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-500 text-gray-800 hover:text-white rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label="Previous"
          >
            <ChevronLeft size={32} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-500 text-gray-800 hover:text-white rounded-xl p-3 sm:p-4 transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label="Next"
          >
            <ChevronRight size={32} strokeWidth={2.5} />
          </button>

          <div className="max-w-7xl max-h-[90vh] relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[modal.index]}
              alt={`Photo ${modal.index + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border-4 border-orange-500/40"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, -60px) scale(1.15); }
          50% { transform: translate(-30px, 50px) scale(0.95); }
          75% { transform: translate(50px, 30px) scale(1.05); }
        }
        @keyframes speed-line {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateX(-120vw); opacity: 0; }
        }
        @keyframes float-icon {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          25% { transform: translate(30px, -40px) rotate(5deg); opacity: 0.6; }
          50% { transform: translate(-20px, -60px) rotate(-3deg); opacity: 0.8; }
          75% { transform: translate(40px, -30px) rotate(7deg); opacity: 0.5; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes bounce-stagger {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-speed-line { animation: speed-line linear infinite; }
        .animate-float-icon { animation: float-icon ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 3.5s ease-in-out infinite; }
        .animate-bounce-stagger { animation: bounce-stagger 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2.5s infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out backwards; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 15s linear infinite; }
        
        .drop-shadow-glow { filter: drop-shadow(0 0 8px currentColor); }
      `}</style>
    </div>
  );
}