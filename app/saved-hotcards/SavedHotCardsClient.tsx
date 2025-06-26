"use client";

import { useEffect, useState } from "react";
import { HotTopic } from "../types";
import HotQuestionsGrid from "../hot-questions/HotQuestionsGrid";
import HotQuestionsGridSkeleton from "../hot-questions/HotQuestionsGridSkeleton";
import { getSavedHotCards } from "../server/saved-hotcards";

interface SavedHotCardsClientProps {
  user?: { id: string } | null;
}

export default function SavedHotCardsClient({
  user,
}: SavedHotCardsClientProps) {
  const [savedTopics, setSavedTopics] = useState<HotTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSavedTopics = async () => {
      try {
        setLoading(true);
        const topics = await getSavedHotCards();
        setSavedTopics(topics);
      } catch (err) {
        setError("შეცდომა შენახული კითხვების ჩატვირთვისას");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSavedTopics();
  }, []);

  if (loading) {
    return <HotQuestionsGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (savedTopics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ჯერ არ გაქვთ შენახული კითხვები</p>
      </div>
    );
  }

  return <HotQuestionsGrid topics={savedTopics} user={user} />;
}
