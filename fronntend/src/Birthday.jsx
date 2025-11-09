import { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, ChevronLeft, ChevronRight, X, Star, Gift, Cake, Camera } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import cover from './assets/pic1.jpg';
import photo1 from './assets/pic2.jpg';
import photo2 from './assets/pic3.jpg';
import photo3 from './assets/pic6.jpg';
import photo4 from './assets/pic7.jpg';


const images = [
  cover,
  photo2,
  photo1,
  photo3,
  photo4
];


export default function Birthday() {
  const [loaded, setLoaded] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [modal, setModal] = useState({ open: false, index: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredImage, setHoveredImage] = useState(null);
  const galleryRef = useRef(null);
  const imageRefs = useRef([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    setTimeout(() => setShowTitle(true), 600);
    
    const newConfetti = [...Array(60)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      rotation: Math.random() * 360,
      color: ['#ff6b9d', '#ffc371', '#a8edea', '#fed6e3', '#c3cfe2', '#f093fb', '#4facfe'][Math.floor(Math.random() * 7)]
    }));
    setConfetti(newConfetti);
  }, []);

  useEffect(() => {
    if (activeSection !== 'gallery') return;

    // Smooth scroll configuration
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
          scale: 0.6,
          rotationY: 0,
          rotationX: 0,
          z: -500,
        };
        
        if (direction === 0) {
          fromVars.x = -1200;
          fromVars.rotationY = -120;
        } else if (direction === 1) {
          fromVars.x = 1200;
          fromVars.rotationY = 120;
        } else if (direction === 2) {
          fromVars.y = -800;
          fromVars.rotationX = -100;
        } else {
          fromVars.y = 800;
          fromVars.rotationX = 100;
        }

        // Main image animation with smoother settings
        gsap.fromTo(el, 
          fromVars,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            z: 0,
            rotationY: 0,
            rotationX: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
              scrub: 2.5,
              anticipatePin: 1,
              fastScrollEnd: true,
              preventOverlaps: true,
            }
          }
        );

        // Smooth parallax effect
        gsap.to(el, {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 3,
            anticipatePin: 1,
          }
        });

        // Card animation with butter-smooth easing
        const card = cardRefs.current[i];
        if (card) {
          const isLeft = i % 2 === 0;
          gsap.fromTo(card,
            {
              opacity: 0,
              x: isLeft ? -400 : 400,
              scale: 0.6,
              rotation: isLeft ? -20 : 20,
              z: -300,
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              rotation: 0,
              z: 0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 25%',
                toggleActions: 'play none none reverse',
                scrub: 2,
                anticipatePin: 1,
              }
            }
          );
        }

        // Buttery smooth hover animations
        const img = el.querySelector('img');
        if (img) {
          el.addEventListener('mouseenter', () => {
            gsap.to(img, {
              scale: 1.12,
              rotation: 3,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            gsap.to(el, {
              z: 50,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
          
          el.addEventListener('mouseleave', () => {
            gsap.to(img, {
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            gsap.to(el, {
              z: 0,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
        }
      });

      // Gallery title with smooth entrance
      const title = galleryRef.current?.querySelector('.gallery-title');
      if (title) {
        gsap.fromTo(title,
          { opacity: 0, y: -80, scale: 0.7 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    }, galleryRef);

    return () => ctx.revert();
  }, [activeSection]);

  // Hero section animations with ultra-smooth timing
  useEffect(() => {
    // wait until hero content is actually rendered (showTitle controls subtitle/hearts/button)
    if (!loaded || !showTitle || activeSection !== 'hero') return;

    const tl = gsap.timeline({ 
      delay: 0.2,
      defaults: { ease: 'power3.out' }
    });
    
    tl.from('.hero-cake', {
      scale: 0,
      rotation: -360,
      opacity: 0,
      duration: 1.4,
      ease: 'back.out(1.2)'
    })
    .from('.hero-title-1', {
      y: 120,
      opacity: 0,
      scale: 0.3,
      rotation: -15,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.7')
    .from('.hero-title-2', {
      y: 120,
      opacity: 0,
      scale: 0.3,
      rotation: 15,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.9')
    .from('.hero-subtitle', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-hearts .heart-icon', {
      scale: 0,
      opacity: 0,
      rotation: 360,
      stagger: {
        amount: 0.6,
        ease: 'power2.out'
      },
      duration: 0.8,
      ease: 'back.out(2)'
    }, '-=0.5')
    .from('.hero-button', {
      scale: 0,
      rotation: 720,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.5)'
    }, '-=0.4');

  }, [loaded, activeSection, showTitle]);

  const openImage = (i) => {
    setModal({ open: true, index: i });
    
    const tl = gsap.timeline();
    tl.from('.modal-overlay', {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    })
    .from('.modal-image', {
      scale: 0.4,
      rotation: 15,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.2');
  };

  const close = () => {
    gsap.to('.modal-overlay', {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setModal({ open: false, index: modal.index })
    });
  };

  const next = () => {
    const tl = gsap.timeline();
    tl.to('.modal-image', {
      x: -150,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    })
    .call(() => {
      setModal((m) => ({ ...m, index: (m.index + 1) % images.length }));
    })
    .fromTo('.modal-image',
      { x: 150, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  };

  const prev = () => {
    const tl = gsap.timeline();
    tl.to('.modal-image', {
      x: 150,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in'
    })
    .call(() => {
      setModal((m) => ({ ...m, index: (m.index - 1 + images.length) % images.length }));
    })
    .fromTo('.modal-image',
      { x: -150, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900" />
      <div className="fixed inset-0 bg-gradient-to-tl from-rose-500/30 via-fuchsia-500/30 to-violet-600/30 animate-gradient-rotate" />
      
      <div className="fixed inset-0 opacity-40">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000" />
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${c.left}%`,
              top: '-20px',
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          >
            <div 
              className="w-3 h-3 rounded-sm shadow-glow"
              style={{ 
                backgroundColor: c.color,
                transform: `rotate(${c.rotation}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-smooth"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          >
            {i % 5 === 0 ? (
              <Sparkles className="text-yellow-200 opacity-70 drop-shadow-glow" size={20 + Math.random() * 28} />
            ) : i % 5 === 1 ? (
              <Heart className="text-pink-300 opacity-60 drop-shadow-glow" size={16 + Math.random() * 22} fill="currentColor" />
            ) : i % 5 === 2 ? (
              <Star className="text-yellow-300 opacity-70 drop-shadow-glow" size={14 + Math.random() * 20} fill="currentColor" />
            ) : i % 5 === 3 ? (
              <Gift className="text-purple-300 opacity-60 drop-shadow-glow" size={16 + Math.random() * 20} />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full opacity-80 shadow-glow" />
            )}
          </div>
        ))}
      </div>

      <nav className="sticky top-0 z-50 p-6 flex justify-center gap-4 backdrop-blur-sm">
        {[
          { id: 'hero', icon: '🎉', label: 'Home' },
          { id: 'gallery', icon: '✨', label: 'Gallery' },
          { id: 'message', icon: '💝', label: 'Message' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-8 py-3.5 rounded-full font-bold transition-all duration-500 transform flex items-center gap-2 ${
              activeSection === section.id
                ? 'bg-white text-purple-700 shadow-2xl scale-110 -translate-y-2'
                : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-md hover:scale-105 border border-white/20'
            }`}
          >
            <span className="text-xl">{section.icon}</span>
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </nav>

      {activeSection === 'hero' && (
        // add top padding so sticky header doesn't overlap the hero cake/candles
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 pt-24 md:pt-28 lg:pt-32">
          <div className="text-center space-y-10 max-w-5xl">
            <div className="relative inline-block mb-6 hero-cake">
              <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-3xl animate-pulse-glow" />
              <div className="relative">
                <Cake className="w-40 h-40 text-white drop-shadow-2xl animate-bounce-gentle mx-auto" strokeWidth={1.5} />
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-4xl animate-flicker" style={{ animationDelay: `${i * 0.2}s` }}>🕯️</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="hero-title-1 text-8xl md:text-9xl lg:text-[12rem] font-black text-white drop-shadow-2xl tracking-tight leading-none">
                Happy
              </h1>
              <h1 className="hero-title-2 text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl tracking-tight leading-none">
                Birthday!
              </h1>
            </div>

            {showTitle && (
              <div className="space-y-10">
                <p className="hero-subtitle text-3xl md:text-5xl lg:text-6xl text-white font-light drop-shadow-xl tracking-wide">
                  Celebrating the most <span className="font-bold text-yellow-200 animate-pulse">amazing</span> person! ✨
                </p>
                
                <div className="hero-hearts flex justify-center gap-3 flex-wrap">
                  {[...Array(9)].map((_, i) => (
                    <Heart
                      key={i}
                      className="heart-icon text-pink-300 animate-pulse-heart drop-shadow-glow"
                      size={40}
                      style={{ animationDelay: `${i * 0.1}s` }}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-14">
                  <button
                    onClick={() => setActiveSection('gallery')}
                    className="hero-button group relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-12 py-6 rounded-full font-bold text-2xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 hover:-rotate-2 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                    <div className="relative flex items-center gap-3">
                      <Gift className="group-hover:rotate-12 transition-transform duration-300" size={28} />
                      <span>View Memories</span>
                      <Sparkles className="group-hover:scale-125 transition-transform duration-300" size={28} />
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
              <h2 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-4 tracking-tight">
                Your Journey
              </h2>
              <p className="text-2xl md:text-3xl text-yellow-200 font-light drop-shadow-lg">
                Scroll through the memories ✨
              </p>
            </div>

            <div className="space-y-[80vh]">
              {images.map((src, i) => {
                const isLeft = i % 2 === 0;
                
                return (
                  <div
                    key={src}
                    ref={(el) => (imageRefs.current[i] = el)}
                    data-index={i}
                    className="min-h-[80vh] flex items-center justify-center"
                    style={{ perspective: '1000px' }}
                  >
                    <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
                      <div 
                        ref={(el) => (cardRefs.current[i] = el)}
                        className={`flex-1 ${isLeft ? 'md:order-1' : 'md:order-2'}`}
                      >
                        <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl max-w-md mx-auto">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                              Memory #{i + 1}
                            </div>
                            <Camera className="text-white/80" size={24} />
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-3">
                            {i === 0 ? 'The Beginning' : i === images.length - 1 ? 'Recent Times' : `Chapter ${i + 1}`}
                          </h3>
                          <p className="text-white/80 text-xl">
                            {i === 0 ? 'Where it all started...' : i === images.length - 1 ? 'Creating new memories...' : 'Another beautiful moment captured in time'}
                          </p>
                        </div>
                      </div>

                      <div className={`flex-1 ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
                        <button
                          onClick={() => openImage(i)}
                          onMouseEnter={() => setHoveredImage(i)}
                          onMouseLeave={() => setHoveredImage(null)}
                          className="group relative w-full max-w-lg mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-gradient-to-br from-white/10 to-white/5 border-4 border-white/30"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <img
                            src={src}
                            alt={`Memory ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-purple-900/40 to-transparent transition-opacity duration-500 ${hoveredImage === i ? 'opacity-100' : 'opacity-0'}`} />
                          
                          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${hoveredImage === i ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                            <div className="relative mb-4">
                              <div className="absolute inset-0 bg-white rounded-full blur-lg opacity-50" />
                              <div className="relative bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl">
                                <Sparkles className="text-purple-600 w-8 h-8" strokeWidth={3} />
                              </div>
                            </div>
                            <span className="text-white font-bold text-lg bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm">
                              Click to view full size
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
      <div className="relative text-center mt-14 pt-10 border-t-2 border-white/40 animate-fade-in-stagger" style={{ animationDelay: '0.8s' }}>
  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-10 md:p-16 shadow-2xl border border-white/20 max-w-4xl mx-auto space-y-8 text-white text-xl md:text-2xl leading-relaxed font-light italic overflow-hidden">

    {/* Floating sparkles */}
    {[...Array(10)].map((_, i) => (
      <Sparkles
        key={i}
        className="absolute text-yellow-200/70 drop-shadow-glow animate-float-soft"
        size={18 + Math.random() * 12}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.8}s`,
        }}
      />
    ))}

    <p className="text-4xl md:text-5xl font-black mb-10 bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl animate-pulse-glow">
      🎂 Birthday Note 🎂
    </p>

    <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      Today isn’t just another day — it’s the day the world was blessed with someone truly amazing — 
      <span className="text-pink-200 font-semibold"> you. 💖</span>
    </p>

    <p className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      From your laughter that fills every room with <span className="text-yellow-200">light</span>,  
      to your kindness that quietly touches hearts,  
      everything about you feels like sunshine wrapped in warmth. ☀️
    </p>

    <p className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      You have this rare kind of <span className="text-purple-200 font-semibold">magic</span> —  
      the kind that turns ordinary moments into memories,  
      and makes people smile just a little brighter because you’re around. ✨
    </p>

    <p className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
      I hope this year brings you everything your heart has been wishing for —  
      laughter that never fades, peaceful sunsets, soft hugs, and dreams that finally come true. 🌈
    </p>

    <p className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
      Never forget how special you are — not just to me,  
      but to everyone lucky enough to know you.  
      You’re light. You’re love. You’re everything beautiful. 💫
    </p>

    <p className="fade-in-signature text-2xl mt-12 text-white/80 tracking-wide animate-glow-text">
      With all my heart,<br />
      <span className="font-semibold bg-gradient-to-r from-pink-300 via-yellow-200 to-purple-300 bg-clip-text  animate-shimmer text-3xl">
        — PJ <span>💖</span>
      </span>
    </p>

    {/* Floating hearts for ambience */}
    {[...Array(6)].map((_, i) => (
      <Heart
        key={i}
        className="absolute text-pink-400/80 drop-shadow-glow animate-float-soft"
        size={20 + Math.random() * 20}
        style={{
          left: `${10 + i * 14}%`,
          top: `${20 + Math.random() * 60}%`,
          animationDelay: `${i * 0.7}s`,
        }}
        fill="currentColor"
      />
    ))}
  </div>

  <style>{`
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(40px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes float-soft {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
      50% { transform: translateY(-25px) scale(1.15); opacity: 1; }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 6px currentColor); }
      50% { opacity: 1; filter: drop-shadow(0 0 16px currentColor); }
    }
    @keyframes glow-text {
      0%, 100% { text-shadow: 0 0 10px rgba(255, 200, 255, 0.8); }
      50% { text-shadow: 0 0 25px rgba(255, 160, 255, 1); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fade-in-up 1.4s ease forwards;
    }
    .animate-float-soft {
      animation: float-soft 6s ease-in-out infinite;
    }
    .animate-pulse-glow {
      animation: pulse-glow 2.5s ease-in-out infinite;
    }
    .animate-glow-text {
      animation: glow-text 2.5s ease-in-out infinite;
    }
    .animate-shimmer {
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
  `}</style>
</div>

      )}

      {modal.open && (
        <div
          className="modal-overlay fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 bg-white hover:bg-red-500 text-gray-800 hover:text-white rounded-full p-4 transition-all duration-300 hover:scale-125 hover:rotate-180 shadow-2xl z-10 group"
            aria-label="Close"
          >
            <X className="group-hover:scale-110 transition-transform" size={32} strokeWidth={3} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-purple-500 text-gray-800 hover:text-white rounded-full p-5 transition-all duration-300 hover:scale-125 hover:-translate-x-3 shadow-2xl group"
            aria-label="Previous"
          >
            <ChevronLeft className="group-hover:scale-110 transition-transform" size={36} strokeWidth={3} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-purple-500 text-gray-800 hover:text-white rounded-full p-5 transition-all duration-300 hover:scale-125 hover:translate-x-3 shadow-2xl group"
            aria-label="Next"
          >
            <ChevronRight className="group-hover:scale-110 transition-transform" size={36} strokeWidth={3} />
          </button>

          <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[modal.index]}
              alt={`Photo ${modal.index + 1}`}
              className="modal-image max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl border-4 border-white/20"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.2); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(1080deg); opacity: 0; }
        }
        @keyframes float-smooth {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
          25% { transform: translate(20px, -20px) rotate(90deg); opacity: 0.8; }
          50% { transform: translate(40px, 10px) rotate(180deg); opacity: 0.6; }
          75% { transform: translate(10px, 30px) rotate(270deg); opacity: 0.7; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-stagger {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .animate-gradient-rotate { 
          background-size: 200% 200%;
          animation: gradient-rotate 8s ease infinite; 
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-confetti-fall { animation: confetti-fall linear forwards; }
        .animate-float-smooth { animation: float-smooth ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
        .animate-pulse-heart { animation: pulse-heart 1.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-fade-in-stagger { animation: fade-in-stagger 0.8s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.8s ease-out; }
        .animate-flicker { animation: flicker 1.5s ease-in-out infinite; }
        
        .drop-shadow-glow { filter: drop-shadow(0 0 8px currentColor); }
        .shadow-glow { box-shadow: 0 0 15px currentColor; }
      `}</style>
    </div>
  );
}