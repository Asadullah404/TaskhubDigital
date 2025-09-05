import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface TestimonialsProps {
  /** 0 → 1 scroll progress (optional) */
  scrollProgress?: number;
}

const testimonials: Testimonial[] = [
  { id: 1, name: "Sarah Johnson", role: "E-commerce Business Owner", content: "TaskHubDigital transformed our online presence completely. Their web development team created a stunning e-commerce site that increased our sales by 300%!", rating: 5, avatar: "SJ" },
  { id: 2, name: "Mike Chen", role: "Tech Startup Founder", content: "The software development team at TaskHubDigital built our MVP in record time. Their expertise in React and Node.js is unmatched. Highly recommended!", rating: 5, avatar: "MC" },
  { id: 3, name: "Emily Rodriguez", role: "Marketing Director", content: "Their SEO and content writing services helped us rank #1 for our target keywords. Our organic traffic has tripled since working with them!", rating: 5, avatar: "ER" },
  { id: 4, name: "David Park", role: "Restaurant Owner", content: "The graphic design team created a beautiful brand identity for our restaurant. The logo and marketing materials perfectly capture our vision.", rating: 5, avatar: "DP" },
];

const Testimonials: React.FC<TestimonialsProps> = ({ scrollProgress = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Autoplay speed speeds up slightly as you scroll (optional use of prop)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const base = 5000;
    const min = 1500;
    const delay = Math.max(min, Math.round(base - scrollProgress * 3000));

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, delay);

    return () => clearInterval(interval);
  }, [isAutoPlaying, scrollProgress]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full flex-shrink-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="glass-effect p-8 md:p-12 rounded-2xl text-center relative">
                      <div className="absolute top-6 left-6 opacity-20">
                        <Quote size={48} className="text-primary" />
                      </div>

                      <div className="flex justify-center mb-6">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={24} className="text-yellow-400 fill-current" />
                        ))}
                      </div>

                      <blockquote className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed italic">
                        "{t.content}"
                      </blockquote>

                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-lg">{t.avatar}</span>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg text-foreground">{t.name}</div>
                          <div className="text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card hover:bg-card-hover rounded-full flex items-center justify-center hover-glow transition-all"
          >
            <ChevronLeft size={24} className="text-primary" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card hover:bg-card-hover rounded-full flex items-center justify-center hover-glow transition-all"
          >
            <ChevronRight size={24} className="text-primary" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-primary w-8" : "bg-muted hover:bg-primary/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">98%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">48h</div>
            <div className="text-muted-foreground">Average Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">99%</div>
            <div className="text-muted-foreground">Project Success</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-muted-foreground">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
