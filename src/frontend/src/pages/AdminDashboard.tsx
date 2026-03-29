import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Link2,
  Loader2,
  MessageSquareHeart,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { FeedbackResponse } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGenerateInviteCode,
  useGetAllResponses,
  useGetFeedbackStats,
  useGetInviteCodes,
  useIsAdmin,
} from "../hooks/useQueries";

function formatDate(ns: bigint) {
  return new Date(Number(ns / BigInt(1_000_000))).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RatingStars({ rating }: { rating: bigint }) {
  const n = Number(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= n ? "fill-star text-star" : "fill-transparent text-star-empty"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: stats } = useGetFeedbackStats();
  const { data: responses = [] } = useGetAllResponses();
  const { data: inviteCodes = [] } = useGetInviteCodes();
  const { mutateAsync: generate, isPending: generating } =
    useGenerateInviteCode();
  const [newCode, setNewCode] = useState("");

  async function handleGenerate() {
    try {
      const code = await generate();
      setNewCode(code);
      toast.success("New invite code generated!");
    } catch {
      toast.error("Failed to generate invite code.");
    }
  }

  function inviteUrl(code: string) {
    return `${window.location.origin}?invite=${code}`;
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="py-5 px-6 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-semibold">Feedback</span>
          </div>
          <a
            href="#/"
            data-ocid="nav.home.link"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Survey
          </a>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm" data-ocid="admin.panel">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign in to access the admin panel.
            </p>
            <Button
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              data-ocid="admin.primary_button"
            >
              {loginStatus === "logging-in" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.error_state"
      >
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-destructive mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
          <a
            href="#/"
            className="mt-4 inline-block text-sm underline text-muted-foreground hover:text-foreground"
            data-ocid="admin.link"
          >
            ← Back to survey
          </a>
        </div>
      </div>
    );
  }

  const sortedResponses = [...responses].sort(
    (a: FeedbackResponse, b: FeedbackResponse) =>
      Number(b.timestamp - a.timestamp),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-5 px-6 flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-2">
          <MessageSquareHeart className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-semibold">
            Feedback — Admin
          </span>
        </div>
        <a
          href="#/"
          data-ocid="nav.home.link"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Survey
        </a>
      </header>

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card data-ocid="admin.card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" /> Total Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-display text-4xl font-bold">
                  {stats ? Number(stats.totalResponses) : "—"}
                </p>
              </CardContent>
            </Card>
            <Card data-ocid="admin.card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" /> Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-display text-4xl font-bold">
                  {stats ? stats.averageRating.toFixed(1) : "—"}
                  <span className="text-lg text-muted-foreground font-body font-normal ml-1">
                    /5
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Invite Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="w-4 h-4" /> Invite Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGenerate}
                disabled={generating}
                data-ocid="admin.primary_button"
                variant="outline"
                className="gap-2"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                Generate new invite link
              </Button>

              {newCode && (
                <div
                  className="p-3 rounded-lg bg-accent border border-border text-sm break-all"
                  data-ocid="admin.success_state"
                >
                  <p className="text-muted-foreground text-xs mb-1">
                    New invite URL:
                  </p>
                  <p className="font-mono text-foreground">
                    {inviteUrl(newCode)}
                  </p>
                </div>
              )}

              {inviteCodes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Existing codes
                  </p>
                  <div className="space-y-1.5">
                    {inviteCodes.map((ic, i) => (
                      <div
                        key={ic.code}
                        data-ocid={`admin.item.${i + 1}` as string}
                        className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/40 text-sm"
                      >
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-xs">
                          {ic.code}
                        </span>
                        <div className="flex items-center gap-3 ml-4 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(ic.created)}
                          </span>
                          <Badge
                            variant={ic.used ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {ic.used ? "Used" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Responses Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Responses</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedResponses.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin.empty_state"
                >
                  <MessageSquareHeart className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No responses yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto" data-ocid="admin.table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedResponses.map((r: FeedbackResponse, i: number) => (
                        <TableRow
                          key={`${r.timestamp}-${i}`}
                          data-ocid={`admin.row.${i + 1}` as string}
                        >
                          <TableCell className="font-medium">
                            {r.name || (
                              <span className="text-muted-foreground italic">
                                Anonymous
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <RatingStars rating={r.rating} />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {r.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate text-sm text-muted-foreground">
                              {r.feedback}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDate(r.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
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
