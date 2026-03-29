import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FeedbackResponse, FeedbackStats, InviteCode } from "../backend.d";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllResponses() {
  const { actor, isFetching } = useActor();
  return useQuery<FeedbackResponse[]>({
    queryKey: ["responses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResponses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeedbackStats() {
  const { actor, isFetching } = useActor();
  return useQuery<FeedbackStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return { averageRating: 0, totalResponses: BigInt(0) };
      return actor.getFeedbackStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInviteCodes() {
  const { actor, isFetching } = useActor();
  return useQuery<InviteCode[]>({
    queryKey: ["inviteCodes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInviteCodes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      rating,
      category,
      feedback,
    }: {
      name: string;
      rating: bigint;
      category: string;
      feedback: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitFeedback(name, rating, category, feedback);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["responses"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useGenerateInviteCode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.generateInviteCode();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inviteCodes"] });
    },
  });
}
