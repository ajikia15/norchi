"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Coins, ArrowLeft } from "lucide-react";
import Image from "next/image";

type Panel = "initial" | "supporter" | "non-supporter";

const panelVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const dummyQuestions = [
  {
    q: "სავალდებულოა თუ არა სამხედრო სამსახური?",
    pos: { top: "15%", left: "10%" },
    rot: -8,
  },
  {
    q: "ნარკოტიკების მოხმარება დანაშაულია თუ ჯანმრთელობის პრობლემა?",
    pos: { top: "30%", left: "60%" },
    rot: 5,
  },
  { q: "ვის ეკუთვნის შენი სხეული?", pos: { top: "65%", left: "20%" }, rot: 10 },
  {
    q: "აქვს თუ არა სახელმწიფოს უფლება შენს შემოსავალზე?",
    pos: { top: "5%", left: "45%" },
    rot: 3,
  },
  {
    q: "არის თუ არა სიტყვის თავისუფლება აბსოლუტური?",
    pos: { top: "70%", left: "70%" },
    rot: -5,
  },
  { q: "რა არის საზღვრის მიზანი?", pos: { top: "45%", left: "5%" }, rot: 7 },
];

export default function HeroSection() {
  const [panel, setPanel] = useState<Panel>("initial");
  const [direction, setDirection] = useState(1);

  const showPanel = (newPanel: Panel, dir: number) => {
    setDirection(dir);
    setPanel(newPanel);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-gray-900 text-white">
      <AnimatePresence initial={false} custom={direction}>
        {panel === "initial" && (
          <motion.div
            key="initial"
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              გამარჯობა ნორჩის სტუმარო!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 text-2xl"
            >
              <strong className="text-primary font-semibold">ვინ ხარ?</strong>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white hover:bg-white hover:text-black"
                onClick={() => showPanel("non-supporter", 1)}
              >
                არ ვარ გირჩელი
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" onClick={() => showPanel("supporter", 1)}>
                გირჩელი ვარ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {panel === "non-supporter" && (
          <motion.div
            key="non-supporter"
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.15, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 15, ease: "easeInOut" }}
            >
              <Image
                src="/norchi2.png"
                alt="Challenge"
                layout="fill"
                objectFit="cover"
                className="opacity-80"
              />
            </motion.div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at center, transparent 40%, black 100%)",
              }}
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative z-20 mb-8 max-w-2xl rounded-lg bg-black/30 p-4 backdrop-blur-sm"
              >
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  ყოველი კითხვა ახალი პერსპექტივის კარია
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-300">
                  აირჩიე ნებისმიერი და დაიწყე თამაში.
                </p>
              </motion.div>

              <div className="absolute inset-0 z-10">
                {dummyQuestions.map((item, index) => (
                  <motion.div
                    key={index}
                    className="absolute cursor-pointer rounded-lg border border-white/20 bg-black/40 p-4 shadow-xl backdrop-blur-md"
                    style={{ top: item.pos.top, left: item.pos.left }}
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: item.rot + (Math.random() - 0.5) * 10,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: item.rot,
                      y: [0, -10, 0],
                    }}
                    transition={{
                      delay: 0.8 + index * 0.1,
                      duration: 0.5,
                      y: {
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      },
                    }}
                    whileHover={{ scale: 1.1, zIndex: 50, rotate: 0 }}
                    onClick={() => scrollTo("hot-questions")}
                  >
                    <p className="text-sm font-medium text-white">{item.q}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="relative z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                <Button
                  size="lg"
                  className="mt-10"
                  onClick={() => scrollTo("hot-questions")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  თამაშის დაწყება
                </Button>
              </motion.div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => showPanel("initial", -1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან
            </Button>
          </motion.div>
        )}

        {panel === "supporter" && (
          <motion.div
            key="supporter"
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-8 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              დაეხმარე პარტიას{" "}
              <strong className="text-primary">იდეოლოგიურ ბრძოლაში</strong>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              დაეხმარე საზოგადოებას მნიშვნელოვანი ვიდეოების არჩევაში და ახლების
              დამატებაში.
            </p>
            <Button asChild size="lg" className="mt-10">
              <Link href="/treasury">
                <Coins className="mr-2 h-5 w-5" />
                საუნჯეში გადასვლა
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => showPanel("initial", -1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
