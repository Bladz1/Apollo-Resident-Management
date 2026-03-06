'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface TypewriterProps {
  text: string;
}

interface WelcomeScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingText = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent w-[300px] text-left">
      Loading{dots}
    </span>
  );
};

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-red-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-white-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });

    const finishLoading = () => {
      setIsLoading(false);
      setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 1000); // Đợi hiệu ứng exit chạy xong
    };

    let isLoaded = document.readyState === 'complete';
    let minTimeElapsed = false;

    const tryFinish = () => {
      if (isLoaded && minTimeElapsed) {
        finishLoading();
      }
    };

    const handleLoad = () => {
      isLoaded = true;
      tryFinish();
    };

    if (!isLoaded) {
      window.addEventListener('load', handleLoad);
    }

    // Minimum display time of 1500ms so the user can actually see it
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      tryFinish();
    }, 1500);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(minTimer);
    };
  }, [onLoadingComplete]);

  // 2. Thêm định nghĩa kiểu ': Variants' ở đây để hết lỗi đỏ
  const containerVariants: Variants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  // 3. Thêm định nghĩa kiểu ': Variants' ở đây nữa
  const childVariants: Variants = {
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] z-50 flex items-center justify-center"
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />

          <div className="relative w-full max-w-4xl mx-auto px-4">
            <motion.div
              className="text-center"
              variants={childVariants}
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold flex justify-center space-y-2 sm:space-y-4">
                <LoadingText />
              </h1>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;