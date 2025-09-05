import { useState, useEffect, useRef } from "react";
import { Code, Globe, Search, PenTool, Palette, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const services = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Custom websites, web apps, and responsive designs that captivate your audience.',
    icon: Globe,
    color: 'from-neon-cyan to-neon-blue',
    features: ['React/Next.js', 'E-commerce', 'CMS Integration', 'Mobile Responsive']
  },
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Desktop applications, mobile apps, and enterprise solutions tailored to your needs.',
    icon: Code,
    color: 'from-neon-blue to-neon-purple',
    features: ['Custom Software', 'Mobile Apps', 'API Development', 'Database Design']
  },
  {
    id: 'seo',
    title: 'SEO Optimization',
    description: 'Boost your online visibility and drive organic traffic to your business.',
    icon: Search,
    color: 'from-neon-purple to-primary',
    features: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Analytics']
  },
  {
    id: 'content-writing',
    title: 'Content Writing',
    description: 'Engaging content that tells your story and converts visitors into customers.',
    icon: PenTool,
    color: 'from-primary to-neon-cyan',
    features: ['Blog Posts', 'Website Copy', 'Social Media', 'Technical Writing']
  },
  {
    id: 'graphics-design',
    title: 'Graphics & Design',
    description: 'Visual identity, logos, and marketing materials that make your brand shine.',
    icon: Palette,
    color: 'from-neon-cyan to-neon-purple',
    features: ['Logo Design', 'Branding', 'Marketing Materials', 'UI/UX Design']
  }
];

const Services = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.service-card-container');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleServiceClick = (service: typeof services[0]) => {
    const message = `Hello TaskHubDigital, I want help with ${service.title}. Please guide me!`;
    const whatsappUrl = `https://wa.me/923022111051?text=${encodeURIComponent(message)}`;
    
    // Show toast notification
    toast({
      title: "Redirecting to WhatsApp",
      description: `Connecting you for ${service.title} services...`,
    });

    // Open WhatsApp after a brief delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  };

  return (
    <section id="services" ref={sectionRef} className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">Digital Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our comprehensive range of digital services. 
            Click any service to get started with a WhatsApp consultation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isVisible = visibleCards.has(index);
            
            return (
              <div
                key={service.id}
                className={`service-card-container transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                data-index={index}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div 
                  className="service-card p-8 h-full cursor-pointer group"
                  onClick={() => handleServiceClick(service)}
                >
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${service.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <div className="flex items-center text-primary group-hover:text-primary-glow transition-colors">
                    <MessageCircle size={18} className="mr-2" />
                    <span className="font-semibold">Get Started</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-4">
            Don't see what you're looking for?
          </p>
          <button 
            className="text-primary hover:text-primary-glow font-semibold text-lg hover:underline transition-all"
            onClick={() => {
              const message = "Hello TaskHubDigital, I have a custom project requirement. Please guide me!";
              const whatsappUrl = `https://wa.me/923022111051?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            Contact us for custom solutions →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;