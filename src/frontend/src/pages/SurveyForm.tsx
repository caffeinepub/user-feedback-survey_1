import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, MessageSquareHeart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { StarRating } from "../components/StarRating";
import { useSubmitFeedback } from "../hooks/useQueries";

const CATEGORIES = ["Product", "Support", "Website", "Other"] as const;

export default function SurveyForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync, isPending } = useSubmitFeedback();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }
    if (!feedback.trim()) {
      toast.error("Please tell us a little more!");
      return;
    }
    try {
      await mutateAsync({
        name: name.trim(),
        rating: BigInt(rating),
        category,
        feedback: feedback.trim(),
      });
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-5 px-6 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <MessageSquareHeart className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-semibold text-foreground">
            Feedback
          </span>
        </div>
        <a
          href="#/admin"
          data-ocid="nav.admin.link"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin →
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-center max-w-sm mx-auto"
              data-ocid="survey.success_state"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.15,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                Thank you!
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We really appreciate you taking the time to share your thoughts.
                Your feedback helps us grow. 🌱
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setName("");
                  setRating(0);
                  setCategory("");
                  setFeedback("");
                  setSubmitted(false);
                }}
                data-ocid="survey.secondary_button"
              >
                Submit another response
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-lg"
            >
              <div className="mb-8 text-center">
                <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                  Share your thoughts
                </h1>
                <p className="text-muted-foreground">
                  We'd love to hear what you think — good or bad!
                </p>
              </div>

              <Card className="shadow-warm border-border/50">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Your name{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="name"
                        data-ocid="survey.input"
                        placeholder="e.g. Alex"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-muted/40 border-input"
                      />
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        How would you rate your experience?
                      </Label>
                      <div className="pt-1">
                        <StarRating value={rating} onChange={setRating} />
                        {rating > 0 && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {
                              ["Terrible", "Poor", "Okay", "Good", "Amazing!"][
                                rating - 1
                              ]
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        What is your feedback about?
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            data-ocid={"survey.category.toggle" as string}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                              category === cat
                                ? "bg-primary text-primary-foreground border-primary shadow-warm"
                                : "bg-background border-border text-foreground hover:bg-accent hover:border-accent-foreground/30"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="space-y-2">
                      <Label htmlFor="feedback" className="text-sm font-medium">
                        Tell us more...
                      </Label>
                      <Textarea
                        id="feedback"
                        data-ocid="survey.textarea"
                        placeholder="What did you love? What could be better?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                        className="bg-muted/40 border-input resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      data-ocid="survey.submit_button"
                      className="w-full h-11 text-base font-medium"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        "Send feedback 🚀"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-5 text-center text-xs text-muted-foreground border-t border-border/60">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
