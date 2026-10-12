// src/pages/AboutPage.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Coffee, Heart, Leaf, Award } from 'lucide-react';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg pt-24">
      {/* Hero */}
      <section className="bg-surface border-b border-border py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <p className="eyebrow">Our Story</p>
            <h1 className="section-title mb-6">
              More Than Just <span className="text-gradient-gold">Coffee</span>
            </h1>
            <p className="text-textSecondary text-lg leading-relaxed">
              Bean & Brew was born from a simple dream: to create a space where great coffee meets 
              genuine hospitality — a neighbourhood café that feels like a second home.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="relative">
                <img src="/images/hero_cappuccino.jpg" alt="Our story"
                  className="rounded-sm w-full aspect-[4/3] object-cover shadow-card" />
                <div className="absolute -bottom-6 -right-6 bg-gold text-espresso p-6 rounded-sm shadow-xl hidden md:block">
                  <div className="font-serif text-4xl font-bold">5+</div>
                  <div className="text-sm font-medium">Years of Craft</div>
                </div>
              </div>
            </Reveal>
            <div className="space-y-6">
              <Reveal delay={0.1}>
                <h2 className="section-title">Founded with <span className="text-gradient-gold">Passion</span></h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-textSecondary leading-relaxed">
                  In 2019, our founders started Bean & Brew with a single espresso machine and an 
                  unwavering commitment to quality. What began as a small corner café quickly grew 
                  into a beloved community gathering place.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-textSecondary leading-relaxed">
                  We partner directly with small-scale coffee farms across India and the world, 
                  ensuring fair prices for farmers and exceptional freshness for you. Every cup 
                  tells a story — from the highlands where the beans were grown to the latte art 
                  our baristas craft with care.
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <Link to="/menu" className="btn-primary">
                  Explore Our Menu <Coffee size={16} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-12">
              <p className="eyebrow">What We Stand For</p>
              <h2 className="section-title">Our <span className="text-gradient-gold">Values</span></h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Coffee, title: 'Quality First', desc: 'We never compromise on ingredients or craftsmanship.' },
              { icon: Leaf, title: 'Sustainability', desc: 'Eco-friendly practices from sourcing to serving.' },
              { icon: Heart, title: 'Community', desc: 'Building connections one cup at a time.' },
              { icon: Award, title: 'Excellence', desc: 'Constantly refining our craft and menu.' },
            ].map((val, i) => (
              <Reveal key={val.title} delay={i * 0.1}>
                <div className="glass-surface rounded-sm p-6 text-center group hover:border-gold/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4
                                  group-hover:bg-gold/20 transition-colors">
                    <val.icon size={22} className="text-gold" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{val.title}</h3>
                  <p className="text-textSecondary text-sm">{val.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
