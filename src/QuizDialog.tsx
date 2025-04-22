import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";


interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string>) => void;
}

export const QuizDialog: React.FC<QuizDialogProps> = ({ open, onClose, onApply }) => {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});

  type ShowTypeOption = keyof typeof showTypeToGenreMovie | keyof typeof showTypeToGenreTV;
  type QuizAnswers = {
    "Show Type"?: ShowTypeOption;
    "Content Type"?: keyof typeof typeToContent;
    "Duration"?: keyof typeof timeToDuration;
  };
  

  const showTypeToGenreMovie = {
    "Relaxing": "10751",
    "Thriller": "53",
    "Comedy": "35",
    "Romance": "10749",
    "Educational": "99"
  };

  const showTypeToGenreTV = {
    "Relaxing": "10751",
    "Thriller": "80",
    "Comedy": "35",
    "Romance": "10766",
    "Educational": "99"
  };

  const timeToDuration = {
    "Under 30 mins": "1",
    "Around an hour": "2",
    "A few hours": "3",
    "I’m here all day": "4"
  };

  const typeToContent = {
    "Show": "tv",
    "Movie": "movie",
  };

  const applyQuizResults = () => {
    const results: Record<string, string> = {};
    const contentType = typeToContent[quizAnswers['Content Type'] as keyof typeof typeToContent];


    if (quizAnswers['Show Type']) {
      results['Genre'] = contentType === 'tv'
        ? showTypeToGenreTV[quizAnswers['Show Type']]
        : showTypeToGenreMovie[quizAnswers['Show Type']];
    }
    if (quizAnswers['Content Type']) {
      results['Content Type'] = contentType;
    }
    if (quizAnswers['Duration']) {
      results['Duration'] = timeToDuration[quizAnswers['Duration']];
    }

    onApply(results);
    setQuizStep(0);
    setQuizAnswers({});
  };

  const cancelQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1f1f1f] text-white">
        <DialogHeader>
          <DialogTitle>Quick Quiz</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={quizStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Step 1 */}
            {quizStep === 0 && (
              <div>
                <p className="text-sm mb-2">What type of show are you looking for?</p>
                <div className="space-y-2">
                  {["Relaxing", "Thriller", "Comedy", "Romance", "Educational"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="showType"
                        value={option}
                        checked={quizAnswers['Show Type'] === option}
                        onChange={(e) => setQuizAnswers(prev => ({ ...prev, 'Show Type': e.target.value as ShowTypeOption}))}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {quizStep === 1 && (
              <div>
                <p className="text-sm mb-2">Do you want to see a show or movie?</p>
                <div className="space-y-2">
                  {["Show", "Movie"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contentType"
                        value={option}
                        checked={quizAnswers['Content Type'] === option}
                        onChange={(e) => setQuizAnswers(prev => ({ ...prev, 'Content Type': e.target.value as keyof typeof typeToContent }))}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {quizStep === 2 && (
              <div>
                <p className="text-sm mb-2">How much time do you have?</p>
                <div className="space-y-2">
                  {["Under 30 mins", "Around an hour", "A few hours", "I’m here all day"].map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="time"
                        value={option}
                        checked={quizAnswers['Duration'] === option}
                        onChange={(e) => setQuizAnswers(prev => ({ ...prev, 'Duration': e.target.value as keyof typeof timeToDuration }))}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <DialogFooter className="mt-4">
          <div className="flex gap-2">
            {quizStep > 0 && (
              <Button variant="secondary" onClick={() => setQuizStep(quizStep - 1)}>
                Back
              </Button>
            )}

            {quizStep < 2 && (
              <Button
                onClick={() => setQuizStep(quizStep + 1)}
                disabled={
                  (quizStep === 0 && !quizAnswers['Show Type']) ||
                  (quizStep === 1 && !quizAnswers['Content Type'])
                }
              >
                Next
              </Button>
            )}

            {quizStep === 2 && (
              <Button
                onClick={applyQuizResults}
                disabled={!quizAnswers['Duration']}
              >
                Apply Filters
              </Button>
            )}

            <DialogClose asChild>
              <Button variant="ghost" onClick={cancelQuiz}>Cancel</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
