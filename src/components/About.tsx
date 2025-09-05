import { useEffect, useState } from "react";
import { Users, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="about" className="py-20 px-4 bg-background-secondary">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">TaskHubDigital</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are a team of passionate developers, designers, and marketers
            dedicated to helping businesses grow with cutting-edge digital
            solutions.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div
            className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <img
              src="/we2.png"
              alt="About TaskHubDigital"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Text */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Who We <span className="gradient-text">Are</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              From startups to established enterprises, we provide scalable
              digital services that fit your unique needs. Our mission is
              simple: deliver high-quality results that drive measurable growth.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 glass-effect rounded-xl hover-lift">
                <Users className="mx-auto mb-3 text-primary" size={28} />
                <div className="text-2xl font-bold gradient-text">50+</div>
                <div className="text-muted-foreground text-sm">Expert Team</div>
              </div>
              <div className="text-center p-6 glass-effect rounded-xl hover-lift">
                <Target className="mx-auto mb-3 text-primary" size={28} />
                <div className="text-2xl font-bold gradient-text">300+</div>
                <div className="text-muted-foreground text-sm">
                  Projects Done
                </div>
              </div>
              <div className="text-center p-6 glass-effect rounded-xl hover-lift">
                <Award className="mx-auto mb-3 text-primary" size={28} />
                <div className="text-2xl font-bold gradient-text">98%</div>
                <div className="text-muted-foreground text-sm">
                  Client Satisfaction
                </div>
              </div>
            </div>

            {/* CTA - Centered Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-4 text-lg hover-lift"
                onClick={() => {
                  const message =
                    "Hello TaskHubDigital, I’d like to know more about your company!";
                  const whatsappUrl = `https://wa.me/923022111051?text=${encodeURIComponent(
                    message
                  )}`;
                  window.open(whatsappUrl, "_blank");
                }}
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
