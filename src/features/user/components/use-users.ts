"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createUserAction,
  deleteUserAction,
  listUsersAction,
  updateUserAction,
} from "@/features/user/user.action";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/features/user/user.schema";

const USERS_KEY = ["users"] as const;

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const result = await listUsersAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: USERS_KEY });
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const result = await createUserAction(input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number;
      input: UpdateUserInput;
    }) => {
      const result = await updateUserAction(id, input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteUserAction(id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: invalidate,
  });
}
