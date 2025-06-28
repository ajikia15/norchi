"use client";

import { motion } from "framer-motion";
import { Video } from "../types";
// import LiveSection from "./LiveSection"; // Temporarily disabled
import VideoSlider from "./VideoSlider";

interface TreasuryClientProps {
  fun: Video[];
  promises: Video[];
  bestMoments: Video[];
  userId?: string;
}

export default function TreasuryClient({
  // fun,
  promises,
  bestMoments,
  userId,
}: TreasuryClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      {/* Page Header */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-2 text-4xl font-bold text-gray-900">საუნჯე</h1>
        <p className="text-lg text-gray-600">ხალხის რჩეული ვიდეო რგოლები</p>
      </motion.div>

      {/* Live Section - Temporarily disabled */}
      {/* <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <LiveSection />
      </motion.section> */}

      {/* fun Section */}
      {/* <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <VideoSlider
          title="fun"
          videos={fun}
          type="fun"
          userId={userId}
          viewAllHref="/treasury/fun"
        />
      </motion.section> */}

      {/* Promises Section */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <VideoSlider
          title="🗣️ დაპირებები"
          videos={promises}
          type="promises"
          userId={userId}
          viewAllHref="/treasury/promises"
        />
      </motion.section>

      {/* Best Moments Section */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <VideoSlider
          title="🔥გულის ჯიბით სატარებელი"
          videos={bestMoments}
          type="best-moments"
          userId={userId}
          viewAllHref="/treasury/best-moments"
        />
      </motion.section>
    </motion.div>
  );
}
