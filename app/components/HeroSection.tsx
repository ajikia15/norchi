"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  VideoIcon,
  Shield,
  Search,
  Zap,
  Users,
  ArrowRight,
  Sword,
  Target,
  Eye,
  ChevronRight,
} from "lucide-react";

type UserType = "supporter" | "skeptic" | null;

interface FloatingElement {
  id: string;
  type: "hotcard" | "story" | "treasury";
  x: number;
  y: number;
  title: string;
  preview: string;
}

const floatingElements: FloatingElement[] = [
  {
    id: "hot1",
    type: "hotcard",
    x: 15,
    y: 20,
    title: "ნარკოტიკების ლეგალიზაცია",
    preview: "რატომ უნდა იყოს ადამიანს უფლება...",
  },
  {
    id: "story1",
    type: "story",
    x: 75,
    y: 25,
    title: "სოკრატული გზა",
    preview: "შენ სწყნარი ხარ თავისუფლების შეზღუდვისთვის?",
  },
  {
    id: "treasury1",
    type: "treasury",
    x: 45,
    y: 80,
    title: "საუნჯის მომენტები",
    preview: "საზოგადოების საყვარელი კლიპები",
  },
  {
    id: "hot2",
    type: "hotcard",
    x: 85,
    y: 60,
    title: "სავალდებულო სამხედრო",
    preview: "დემოკრატია თუ ძალადობა?",
  },
  {
    id: "story2",
    type: "story",
    x: 25,
    y: 70,
    title: "ლოგიკური გამოწვევა",
    preview: "გადამოწმე შენი რწმენა",
  },
];

// Particle animation component
function ParticleField() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-primary/20 absolute h-1 w-1 rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Floating preview card component
function FloatingPreview({
  element,
  isVisible,
}: {
  element: FloatingElement;
  isVisible: boolean;
}) {
  const getIcon = () => {
    switch (element.type) {
      case "hotcard":
        return <Zap className="h-4 w-4" />;
      case "story":
        return <Target className="h-4 w-4" />;
      case "treasury":
        return <VideoIcon className="h-4 w-4" />;
    }
  };

  const getColor = () => {
    switch (element.type) {
      case "hotcard":
        return "from-yellow-400 to-orange-500";
      case "story":
        return "from-blue-400 to-purple-500";
      case "treasury":
        return "from-green-400 to-teal-500";
    }
  };

  return (
    <motion.div
      className="absolute z-10"
      style={{ left: `${element.x}%`, top: `${element.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
        rotate: isVisible ? 0 : 180,
      }}
      transition={{
        duration: 0.5,
        delay: Math.random() * 2,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.1,
        z: 20,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="max-w-[200px] cursor-pointer border bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-r ${getColor()} flex items-center justify-center text-white mb-2`}
        >
          {getIcon()}
        </div>
        <h4 className="mb-1 text-sm font-semibold text-gray-800">
          {element.title}
        </h4>
        <p className="line-clamp-2 text-xs text-gray-600">{element.preview}</p>
      </Card>
    </motion.div>
  );
}

export default function HeroSection() {
  const [userType, setUserType] = useState<UserType>(null);
  const [showFloatingElements, setShowFloatingElements] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const supporterContent = {
    badge: "შენი არსენალი",
    title: "გირჩელ მეგობარო!",
    subtitle:
      "აქ შენ იპოვი ყველაფერს რაც გჭირდება იმისთვის, რომ ეფექტურად წარმოადგინო შენი რწმენა",
    features: [
      {
        icon: <Zap className="h-5 w-5" />,
        text: "ცხელი კითხვების არსენალი ონლაინ დებატებისთვის",
      },
      {
        icon: <VideoIcon className="h-5 w-5" />,
        text: "საზოგადოების მიერ კურირებული საუნჯე",
      },
      {
        icon: <Target className="h-5 w-5" />,
        text: "სოკრატული ხელოვნების დახვეწა",
      },
    ],
    primaryButton: {
      text: "დაიწყე მართამაშე",
      icon: <Sword className="h-4 w-4" />,
    },
    secondaryButton: {
      text: "საუნჯე",
      icon: <VideoIcon className="h-4 w-4" />,
    },
  };

  const skepticContent = {
    badge: "გამოწვევა მიიღე",
    title: "ეჭვის მქონე მეგობარო!",
    subtitle:
      "ჩვენ აქ არ ვართ ქადაგებისთვის — ჩვენ აქ ვართ დებატისთვის. შეამოწმე შენი რწმენა ჩვენი წინააღმდეგ",
    features: [
      {
        icon: <Eye className="h-5 w-5" />,
        text: "პირდაპირი, ფილტრისგარეშე პასუხები",
      },
      {
        icon: <Target className="h-5 w-5" />,
        text: "ლოგიკური ბავშვი შენი რწმენისთვის",
      },
      {
        icon: <Users className="h-5 w-5" />,
        text: "ნახე რა ახალისებს ჩვენს მხარდამჭერებს",
      },
    ],
    primaryButton: {
      text: "მიიღე გამოწვევა",
      icon: <Target className="h-4 w-4" />,
    },
    secondaryButton: {
      text: "გზების მიღმა",
      icon: <ArrowRight className="h-4 w-4" />,
    },
  };

  const currentContent =
    userType === "supporter"
      ? supporterContent
      : userType === "skeptic"
      ? skepticContent
      : null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Particle field background */}
      <ParticleField />

      {/* Background logo watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image
          src="/logo36.png"
          alt=""
          width={800}
          height={800}
          className="h-auto w-[60%] opacity-5"
        />
      </div>

      {/* Floating preview elements */}
      {floatingElements.map((element) => (
        <FloatingPreview
          key={element.id}
          element={element}
          isVisible={showFloatingElements && userType !== null}
        />
      ))}

      {/* Main content */}
      <div className="relative z-20 mx-auto h-screen max-w-7xl">
        <AnimatePresence mode="wait">
          {userType === null ? (
            // Initial choice screen
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid h-full grid-cols-1 lg:grid-cols-2"
            >
              {/* Supporter side */}
              <motion.div
                className="relative flex items-center justify-center bg-gradient-to-br from-emerald-600/20 to-blue-600/20 p-8 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                onClick={() => setUserType("supporter")}
                style={{ cursor: "pointer" }}
              >
                <div className="text-center text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <Shield className="mx-auto mb-4 h-24 w-24 text-emerald-400" />
                    <h2 className="mb-4 text-3xl font-bold">ჯარისკაცი</h2>
                    <p className="mb-6 text-lg text-gray-300">
                      გირჩელი ხარ და არსენალი გჭირდება
                    </p>
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <ChevronRight className="ml-2 h-4 w-4" />
                      შემოგიერთდი მებრძოლებს
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Dividing line */}
              <div className="absolute bottom-0 left-1/2 top-0 z-30 hidden w-px bg-gradient-to-b from-transparent via-white/30 to-transparent lg:block" />

              {/* Skeptic side */}
              <motion.div
                className="relative flex items-center justify-center bg-gradient-to-br from-red-600/20 to-purple-600/20 p-8 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                onClick={() => setUserType("skeptic")}
                style={{ cursor: "pointer" }}
              >
                <div className="text-center text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <Search className="mx-auto mb-4 h-24 w-24 text-red-400" />
                    <h2 className="mb-4 text-3xl font-bold">ეჭვის მქონე</h2>
                    <p className="mb-6 text-lg text-gray-300">
                      გირჩს არ ენდობი და გამოწვევა გინდა
                    </p>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      <Target className="mr-2 h-4 w-4" />
                      მიიღე გამოწვევა
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Selected user type content
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full items-center justify-center"
            >
              <div className="mx-auto max-w-4xl px-6 text-center text-white">
                {/* Back button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setUserType(null)}
                  className="absolute left-8 top-8 text-white/70 transition-colors hover:text-white"
                >
                  ← უკან
                </motion.button>

                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                    userType === "supporter"
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-400/30"
                      : "bg-red-600/30 text-red-300 border border-red-400/30"
                  }`}
                >
                  {currentContent?.badge}
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 text-4xl font-bold md:text-6xl"
                >
                  {currentContent?.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mx-auto mb-8 max-w-3xl text-lg text-gray-300 md:text-xl"
                >
                  {currentContent?.subtitle}
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                  {currentContent?.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 text-left"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          userType === "supporter"
                            ? "bg-emerald-600/30"
                            : "bg-red-600/30"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <span className="text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Button
                    size="lg"
                    onClick={() => scrollTo("hot-questions")}
                    className={`${
                      userType === "supporter"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white px-8 py-3`}
                  >
                    {currentContent?.primaryButton.icon}
                    {currentContent?.primaryButton.text}
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 px-8 py-3 text-white hover:bg-white/10"
                  >
                    <Link href="/treasury">
                      {currentContent?.secondaryButton.icon}
                      {currentContent?.secondaryButton.text}
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
