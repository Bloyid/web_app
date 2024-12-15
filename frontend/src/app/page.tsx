'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2
    }
  }
};

export default function Home() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto px-4"
    >
      <div className="hero text-center py-20">
        <motion.h1 variants={item} className="text-4xl font-bold mb-4">
          Welcome to Bloyid
        </motion.h1>
        
        <motion.p variants={item} className="text-gray-300 mb-8">
          Secure messaging for everyone
        </motion.p>
        
        <motion.div variants={item} className="flex gap-4 justify-center">
          <Link href="/login">
            <Button className="bg-[#3b82f6] hover:bg-[#2563eb] font-bold">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button 
              variant="outline" 
              className="border-white text-black hover:bg-white hover:text-gray-700 font-bold"
            >
              Register
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}