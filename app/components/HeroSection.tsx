"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  const [showMainText, setShowMainText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userType !== null) {
      const timer = setTimeout(() => setShowMainText(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [userType]);

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
          isVisible={showFloatingElements && userType !== null && showMainText}
        />
      ))}

      {/* Main content */}
      <div className="relative z-20 h-screen w-full">
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
                className="relative flex cursor-pointer items-center justify-center bg-gradient-to-br from-emerald-600/20 to-blue-600/20 p-8 backdrop-blur-sm"
                onClick={() => setUserType("supporter")}
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
                className="relative flex cursor-pointer items-center justify-center bg-gradient-to-br from-red-600/20 to-purple-600/20 p-8 backdrop-blur-sm"
                onClick={() => setUserType("skeptic")}
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
              className="relative h-full w-full"
            >
              {/* Back button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setUserType(null)}
                className="absolute left-8 top-8 z-50 text-white/70 transition-colors hover:text-white"
              >
                ← უკან
              </motion.button>

              {/* Main intro text - disappears after 5 seconds */}
              <AnimatePresence>
                {showMainText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      transition: { duration: 1.5, ease: "easeInOut" },
                    }}
                    className="absolute inset-0 z-40 flex items-center justify-center"
                  >
                    <div className="max-w-4xl px-6 text-center text-white">
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
                        className="mx-auto max-w-3xl text-lg text-gray-300 md:text-xl"
                      >
                        {currentContent?.subtitle}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Three column layout - appears after main text disappears */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showMainText ? 0 : 1 }}
                transition={{ delay: showMainText ? 0 : 1, duration: 1 }}
                className="grid h-full grid-cols-3"
              >
                {currentContent?.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="relative flex cursor-pointer flex-col items-center justify-center p-8"
                    initial={{
                      y: -100,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: showMainText ? 0 : 1,
                    }}
                    transition={{
                      delay: showMainText ? 0 : 1.2 + index * 0.3,
                      duration: 0.8,
                      type: "spring",
                      stiffness: 80,
                      damping: 12,
                    }}
                  >
                    {/* Column content */}
                    <div className="max-w-sm text-center text-white">
                      <motion.div
                        className={`p-4 rounded-full mb-6 mx-auto w-16 h-16 flex items-center justify-center ${
                          userType === "supporter"
                            ? "bg-emerald-600/30"
                            : "bg-red-600/30"
                        }`}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="mb-4 text-xl font-bold">{feature.text}</h3>
                    </div>

                    {/* Action button always visible */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: showMainText ? 0 : 1,
                        y: 0,
                      }}
                      transition={{
                        delay: showMainText ? 0 : 1.5 + index * 0.3,
                        duration: 0.6,
                      }}
                      className="mt-6"
                    >
                      <Button
                        size="lg"
                        onClick={() => {
                          if (index === 0) scrollTo("hot-questions");
                          else if (index === 1)
                            window.location.href = "/treasury";
                          else scrollTo("stories");
                        }}
                        className={`${
                          userType === "supporter"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-red-600 hover:bg-red-700"
                        } text-white`}
                      >
                        {index === 0 ? (
                          <Zap className="mr-2 h-4 w-4" />
                        ) : index === 1 ? (
                          <VideoIcon className="mr-2 h-4 w-4" />
                        ) : (
                          <Target className="mr-2 h-4 w-4" />
                        )}
                        {index === 0
                          ? "ცხელი კითხვები"
                          : index === 1
                          ? "საუნჯე"
                          : "სოკრატული გზები"}
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
