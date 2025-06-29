"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Coins,
  ArrowLeft,
  SquareDashed,
  TriangleDashed,
} from "lucide-react";

type Panel = "initial" | "supporter" | "non-supporter";
type CardData = {
  q: string;
  id: number;
};

const panelVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const dummyQuestions: CardData[] = [
  { id: 1, q: "სავალდებულოა თუ არა სამხედრო სამსახური?" },
  { id: 2, q: "ნარკოტიკების მოხმარება დანაშაულია?" },
  { id: 3, q: "ვის ეკუთვნის შენი სხეული?" },
  { id: 4, q: "აქვს თუ არა სახელმწიფოს უფლება შენს შემოსავალზე?" },
  { id: 5, q: "არის თუ არა სიტყვის თავისუფლება აბსოლუტური?" },
  { id: 6, q: "რა არის საზღვრის მიზანი?" },
  { id: 7, q: "უნდა არსებობდეს თუ არა აქციზის გადასახადი?" },
];

const BlueprintBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a101f]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
        backgroundSize: `50px 50px`,
        opacity: 0.05,
      }}
    />
    <motion.div
      className="absolute bottom-1/4 left-1/4"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      <SquareDashed className="h-48 w-48 text-white/5" />
    </motion.div>
    <motion.div
      className="absolute right-1/4 top-1/4"
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      <TriangleDashed className="h-40 w-40 text-white/5" />
    </motion.div>
  </div>
);

export default function HeroSection() {
  const [panel, setPanel] = useState<Panel>("initial");
  const [direction, setDirection] = useState(1);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const showPanel = (newPanel: Panel, dir: number) => {
    setDirection(dir);
    setPanel(newPanel);
    setSelectedCard(null); // Reset card selection when changing panels
  };

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
  };

  const resetSelection = () => {
    setSelectedCard(null);
  };

  return (
    <div className="relative h-[80vh] min-h-[700px] w-full overflow-hidden bg-gray-900 text-white">
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
            {/* ... Initial Panel Content ... */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              გამარჯობა ნორჩის სტუმარო!
            </h1>
            <p className="mt-4 text-2xl">
              <strong className="text-primary font-semibold">ვინ ხარ?</strong>
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
            </div>
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
            <BlueprintBackground />
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
              <AnimatePresence>
                {!selectedCard && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-[20%]"
                  >
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      ყველა იდეოლოგიას აქვს საძირკველი.
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-300">
                      შეამოწმე შენი.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedCard && (
                <motion.div
                  layoutId={`card-container-${selectedCard.id}`}
                  className="flex h-96 w-72 flex-col items-center justify-center rounded-xl border border-white/20 bg-[#0a101f]/80 p-6 shadow-2xl backdrop-blur-lg"
                  transition={{ duration: 0.5, ease: "circOut" }}
                >
                  <p className="text-xl font-bold">{selectedCard.q}</p>
                  <Button
                    variant="outline"
                    className="mt-6 bg-transparent"
                    onClick={() => alert("Answer Revealed!")}
                  >
                    პასუხის ნახვა
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-4"
                    onClick={resetSelection}
                  >
                    სხვა კითხვის არჩევა
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Deck of Cards */}
            <AnimatePresence>
              {!selectedCard && (
                <motion.div
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1/3 w-full"
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a101f] to-transparent" />
                  <motion.div
                    className="absolute bottom-[-20px] z-20 flex w-max gap-4"
                    animate={{ x: ["-100%", "0%"] }}
                    transition={{
                      x: {
                        duration: 40,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "linear",
                      },
                    }}
                  >
                    {[...dummyQuestions, ...dummyQuestions].map((card, i) => (
                      <motion.div
                        key={i}
                        layoutId={`card-container-${card.id}`}
                        className="h-40 w-60 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-[#0f172a]/70 p-4 shadow-lg backdrop-blur-md"
                        whileHover={{ y: -20, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleCardClick(card)}
                      >
                        <p className="font-semibold text-white">{card.q}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 z-30 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => showPanel("initial", -1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან
            </Button>
          </motion.div>
        )}
        {/* Supporter Panel Placeholder */}
        {panel === "supporter" && (
          <motion.div
            key="supporter"
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-8 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              დაეხმარე პარტიას{" "}
              <strong className="text-primary">იდეოლოგიურ ბრძოლაში</strong>
            </h2>
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
