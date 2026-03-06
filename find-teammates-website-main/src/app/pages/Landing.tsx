import { Link } from 'react-router';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useState, useRef } from 'react';
import {
  Zap,
  Users,
  BookOpen,
  Sparkles,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Target,
  Rocket,
  Brain,
  Code2,
  Globe,
  Cpu,
  Award,
  Lightbulb
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { VirtualDemo } from '../components/VirtualDemo';

const getFeatures = (t: (key: string) => string) => [
  {
    icon: Users,
    title: t('landing.feature1.title'),
    description: t('landing.feature1.desc'),
  },
  {
    icon: Sparkles,
    title: t('landing.feature2.title'),
    description: t('landing.feature2.desc'),
  },
  {
    icon: BookOpen,
    title: t('landing.feature3.title'),
    description: t('landing.feature3.desc'),
  },
  {
    icon: Target,
    title: t('landing.feature4.title'),
    description: t('landing.feature4.desc'),
  },
  {
    icon: BarChart3,
    title: t('landing.feature5.title'),
    description: t('landing.feature5.desc'),
  },
  {
    icon: Shield,
    title: t('landing.feature6.title'),
    description: t('landing.feature6.desc'),
  },
];

const getStats = (t: (key: string) => string) => [
  { label: t('landing.stat1.label'), value: '10K+' },
  { label: t('landing.stat2.label'), value: '50K+' },
  { label: t('landing.stat3.label'), value: '2.5K+' },
  { label: t('landing.stat4.label'), value: '85%' },
];

const floatingIcons = [
  { Icon: Code2, delay: 0, duration: 20, x: '10%', y: '20%' },
  { Icon: Brain, delay: 2, duration: 25, x: '80%', y: '15%' },
  { Icon: Rocket, delay: 4, duration: 22, x: '15%', y: '70%' },
  { Icon: Globe, delay: 1, duration: 23, x: '85%', y: '60%' },
  { Icon: Cpu, delay: 3, duration: 21, x: '20%', y: '45%' },
  { Icon: Lightbulb, delay: 5, duration: 24, x: '75%', y: '85%' },
];

export function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hero parallax effects
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -150]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15, 0.2], [1, 0.5, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);

  // Features parallax
  const featuresY = useTransform(smoothProgress, [0.1, 0.4], [100, -50]);

  // Stats parallax
  const statsY = useTransform(smoothProgress, [0.05, 0.25], [50, -30]);
  const statsScale = useTransform(smoothProgress, [0.05, 0.15], [0.9, 1]);

  const { t } = useLanguage();
  const features = getFeatures(t);
  const stats = getStats(t);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
      {/* Floating 3D Icons Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        {floatingIcons.map(({ Icon, delay, duration, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: x,
              top: y,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="h-16 w-16 text-blue-500/30" />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{t('home.title')}</h1>
                <p className="text-xs text-gray-500">{t('home.subtitle')}</p>
              </div>
            </motion.div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden xs:block">
                <LanguageSelector />
              </div>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden xs:inline-flex">{t('nav.login')}</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">{t('nav.signup')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with 3D Parallax */}
      <section className="px-6 py-20 relative">
        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
            scale: heroScale,
          }}
          className="mx-auto max-w-7xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
              <Rocket className="h-4 w-4" />
              {t('landing.hero.badge')}
            </motion.div>

            <motion.h1
              className="mb-6 text-4xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('landing.hero.title1')}
              <motion.span
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% auto' }}
              >
                {t('landing.hero.title2')}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mb-8 max-w-2xl text-xl text-gray-600"
            >
              {t('landing.hero.desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center justify-center gap-4"
            >
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5, z: 20 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Button size="lg" className="group">
                    {t('landing.hero.cta')}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: -5, z: 20 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Button size="lg" variant="outline" onClick={() => setIsDemoOpen(true)}>
                  {t('landing.hero.demo')}
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats with 3D Effect */}
            <motion.div
              style={{ scale: statsScale, y: statsY }}
              className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 50, rotateX: -30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    rotateY: 10,
                    z: 30,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-gray-600 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section with 3D Cards */}
      <section className="px-6 py-20 bg-white relative">
        <motion.div
          style={{ y: featuresY }}
          className="mx-auto max-w-7xl"
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t('landing.features.title')}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {t('landing.features.subtitle')}
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 100, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 30,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-shadow">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works with 3D Steps */}
      <section className="px-6 py-20 relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t('landing.how.title')}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {t('landing.how.subtitle')}
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: t('landing.how.step1.title'),
                description: t('landing.how.step1.desc'),
              },
              {
                step: '02',
                title: t('landing.how.step2.title'),
                description: t('landing.how.step2.desc'),
              },
              {
                step: '03',
                title: t('landing.how.step3.title'),
                description: t('landing.how.step3.desc'),
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 100, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, z: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.8 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white mb-4"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-xl">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-purple-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <TrendingUp className="h-12 w-12 text-white mx-auto" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('landing.social.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('landing.social.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['IIT Delhi', 'BITS Pilani', 'IIT Bombay', 'NIT Trichy', 'VIT Vellore', 'IIIT Hyderabad'].map((college, index) => (
                <motion.div
                  key={college}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white"
                >
                  {college}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('landing.cta.subtitle')}
            </p>
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.1, rotateZ: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 border-0">
                  {t('landing.cta.button')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">CollabNest</span>
              </div>
              <p className="text-sm text-gray-600">
                {t('landing.footer.desc')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><button onClick={() => setIsDemoOpen(true)} className="hover:text-blue-600 transition-colors">Demo</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            {t('landing.footer.rights')}
          </div>
        </div>
      </footer>
      <VirtualDemo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}