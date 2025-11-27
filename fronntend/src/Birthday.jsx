import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Zap, Flame, Trophy, Target } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Placeholder images - using a variety of landscape/nature images
const images = [
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1471506480208-91b3a4cc99be?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
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

  useEffect(() => {
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

  useEffect(() => {
    if (activeSection !== 'gallery') return;

    ScrollTrigger.config({ 
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      limitCallbacks: true
    });

    const ctx = gsap.context(() => {
      imageRefs.current.forEach((el, i) => {
        if (!el) return;

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

        const img = el.querySelector('img');
        if (img) {
          el.addEventListener('mouseenter', () => {
            gsap.to(img, {
              scale: 1.15,
              rotation: 2,
              duration: 0.6,
              ease: 'power2.out',
            });
          });
          
          el.addEventListener('mouseleave', () => {
            gsap.to(img, {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: 'power2.out',
            });
          });
        }
      });

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

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-900">
      {/* Sky blue and maroon gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-slate-800" />
      <div className="fixed inset-0 bg-gradient-to-tl from-rose-900/60 via-red-800/40 to-transparent" />
      
      {/* Animated blobs */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-maroon-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ backgroundColor: '#800020' }} />
        <div className="absolute top-0 -right-20 w-96 h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000" />
      </div>

      {/* Speed particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
            <div className="w-20 h-0.5 bg-gradient-to-l from-white/80 to-transparent" />
          </div>
        ))}
      </div>

      {/* Floating icons */}
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
              <Zap className="text-yellow-300" size={24 + Math.random() * 20} />
            ) : i % 4 === 1 ? (
              <Flame className="text-orange-400" size={20 + Math.random() * 16} />
            ) : i % 4 === 2 ? (
              <Trophy className="text-yellow-400" size={22 + Math.random() * 18} />
            ) : (
              <Target className="text-red-400" size={20 + Math.random() * 16} />
            )}
          </div>
        ))}
      </div>

      <nav className="sticky top-0 z-50 p-6 flex justify-center gap-4 backdrop-blur-sm">
        {[
          { id: 'hero', icon: '🏍️', label: 'Home' },
          { id: 'gallery', icon: '🔥', label: 'Gallery' },
          { id: 'message', icon: '⚡', label: 'Message' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-8 py-3.5 rounded-lg font-bold transition-all duration-300 transform flex items-center gap-2 ${
              activeSection === section.id
                ? 'bg-white text-slate-900 shadow-2xl scale-110'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md hover:scale-105 border border-white/20'
            }`}
          >
            <span className="text-xl">{section.icon}</span>
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </nav>

      {activeSection === 'hero' && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 pt-20">
          <div className="text-center space-y-8 max-w-5xl">
            <div className="relative inline-block hero-bike">
              <div className="absolute inset-0 bg-orange-500/40 rounded-full blur-3xl animate-pulse-glow" />
              <div className="relative text-9xl animate-bounce-gentle">
                🏍️
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="hero-title-1 text-7xl md:text-8xl lg:text-9xl font-black text-white drop-shadow-2xl tracking-tight leading-none">
                HAPPY
              </h1>
              <h1 className="hero-title-2 text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-maroon-600 drop-shadow-2xl tracking-tight leading-none">
                BIRTHDAY
              </h1>
            </div>

            {showTitle && (
              <div className="space-y-8">
                <p className="hero-subtitle text-2xl md:text-4xl text-white font-bold drop-shadow-xl tracking-wide uppercase">
                  Rev up for another <span className="text-orange-400 animate-pulse">epic</span> year! 🔥
                </p>
                
                <div className="hero-icons flex justify-center gap-4 flex-wrap">
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
                    className="hero-button group relative bg-gradient-to-r from-orange-500 via-red-600 to-maroon-700 text-white px-10 py-5 rounded-lg font-bold text-xl shadow-2xl hover:shadow-orange-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                    <div className="relative flex items-center gap-3">
                      <Zap className="group-hover:rotate-12 transition-transform" size={24} />
                      <span>VIEW THE RIDE</span>
                      <Flame className="group-hover:scale-125 transition-transform" size={24} />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'gallery' && (
        <div className="relative z-10 py-20" ref={galleryRef}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="gallery-title text-center mb-32 sticky top-32 z-20 pointer-events-none">
              <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 tracking-tight uppercase">
                The Journey
              </h2>
              <p className="text-xl md:text-2xl text-orange-300 font-bold drop-shadow-lg uppercase">
                Memories on the Road 🏍️
              </p>
            </div>

            <div className="space-y-[60vh]">
              {images.map((src, i) => {
                const isLeft = i % 2 === 0;
                
                return (
                  <div
                    key={src}
                    ref={(el) => (imageRefs.current[i] = el)}
                    className="min-h-[60vh] flex items-center justify-center"
                    style={{ perspective: '1000px' }}
                  >
                    <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
                      <div 
                        ref={(el) => (cardRefs.current[i] = el)}
                        className={`flex-1 ${isLeft ? 'md:order-1' : 'md:order-2'}`}
                      >
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-orange-500/40 shadow-2xl max-w-md mx-auto">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg uppercase">
                              Mile #{i + 1}
                            </div>
                            <Zap className="text-orange-400" size={20} />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2 uppercase">
                            {i === 0 ? 'The Start' : i === images.length - 1 ? 'Latest Adventure' : `Checkpoint ${i + 1}`}
                          </h3>
                          <p className="text-gray-300 text-lg">
                            {i === 0 ? 'Where the ride began...' : i === images.length - 1 ? 'Still going strong...' : 'Another mile conquered'}
                          </p>
                        </div>
                      </div>

                      <div className={`flex-1 ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
                        <button
                          onClick={() => openImage(i)}
                          onMouseEnter={() => setHoveredImage(i)}
                          onMouseLeave={() => setHoveredImage(null)}
                          className="group relative w-full max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden shadow-2xl cursor-pointer bg-slate-800 border-4 border-orange-500/50"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <img
                            src={src}
                            alt={`Memory ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-orange-900/50 to-transparent transition-opacity duration-300 ${hoveredImage === i ? 'opacity-100' : 'opacity-0'}`} />
                          
                          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${hoveredImage === i ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                            <div className="relative mb-3">
                              <div className="absolute inset-0 bg-orange-500 rounded-full blur-lg opacity-60" />
                              <div className="relative bg-white/95 rounded-full p-3 shadow-2xl">
                                <Zap className="text-orange-600 w-6 h-6" strokeWidth={3} />
                              </div>
                            </div>
                            <span className="text-white font-bold text-base bg-black/60 px-5 py-2 rounded-lg backdrop-blur-sm uppercase">
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

      {activeSection === 'message' && (
        <div className="relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-orange-500/30">
            <div className="space-y-6 text-white">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-8 bg-gradient-to-r from-orange-400 via-red-500 to-maroon-600 bg-clip-text text-transparent uppercase">
                🏍️ Birthday Message 🏍️
              </h2>

              <p className="text-lg md:text-xl leading-relaxed">
                Brother, today's your day to celebrate another year of being absolutely <span className="text-orange-400 font-bold">legendary</span>! 🔥
              </p>

              <p className="text-lg md:text-xl leading-relaxed">
                You've always lived life in the fast lane, chasing adventures and making every moment count. Your passion for bikes and the open road is just a reflection of your <span className="text-orange-400 font-bold">fearless spirit</span>.
              </p>

              <p className="text-lg md:text-xl leading-relaxed">
                Keep that engine roaring, keep pushing boundaries, and never stop being the <span className="text-orange-400 font-bold">amazing person</span> you are. The best miles are still ahead of you! ⚡
              </p>

              <p className="text-lg md:text-xl leading-relaxed">
                Here's to more adventures, more victories, and more unforgettable moments. May this year bring you everything you've been revving up for! 🏆
              </p>

              <div className="pt-8 text-center">
                <p className="text-xl font-bold text-orange-400 mb-2 uppercase">
                  Stay Fast, Stay Fierce!
                </p>
                <p className="text-2xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-maroon-600 bg-clip-text text-transparent">
                  — Your Crew 🏍️💨
                </p>
              </div>
            </div>

            {/* Decorative flames */}
            {[...Array(8)].map((_, i) => (
              <Flame
                key={i}
                className="absolute text-orange-500/20 animate-float-smooth"
                size={30 + Math.random() * 20}
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {modal.open && (
        <div
          className="modal-overlay fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 bg-white hover:bg-red-600 text-gray-800 hover:text-white rounded-lg p-3 transition-all duration-300 hover:scale-110 shadow-2xl z-10"
            aria-label="Close"
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-500 text-gray-800 hover:text-white rounded-lg p-4 transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label="Previous"
          >
            <ChevronLeft size={32} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-500 text-gray-800 hover:text-white rounded-lg p-4 transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label="Next"
          >
            <ChevronRight size={32} strokeWidth={2.5} />
          </button>

          <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[modal.index]}
              alt={`Photo ${modal.index + 1}`}
              className="modal-image max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border-4 border-orange-500/30"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes speed-line {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateX(-120vw); opacity: 0; }
        }
        @keyframes float-smooth {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(20px, -30px); opacity: 0.8; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-speed-line { animation: speed-line linear infinite; }
        .animate-float-smooth { animation: float-smooth ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        
        .drop-shadow-glow { filter: drop-shadow(0 0 6px currentColor); }
      `}</style>
    </div>
  );
}