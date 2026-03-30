"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Send, LogIn, MessageCircle, MoreHorizontal, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Image from "next/image";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  prayerRequestId: string;
}

export default function CommentsSection({ prayerRequestId }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [prayerRequestId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/prayers/${prayerRequestId}/comment`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/prayers/${prayerRequestId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setNewComment("");
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-stone-100 dark:border-stone-800 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-4 w-4 text-stone-400" />
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Komentar {comments.length > 0 && `(${comments.length})`}
        </span>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 rounded-full skeleton shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 skeleton" />
                <div className="h-4 w-full skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                  {comment.userImage ? (
                    <Image
                      src={comment.userImage}
                      alt={comment.userName}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                      {comment.userName[0]?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="rounded-xl bg-stone-50 dark:bg-stone-800 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">{comment.userName}</p>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: idLocale })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {comments.length === 0 && !loading && (
              <p className="text-center text-sm text-stone-400 py-4">
                Belum ada komentar. Jadilah yang pertama!
              </p>
            )}
          </div>
        </AnimatePresence>
      )}

      {/* Input */}
      <div className="mt-3">
        {session?.user ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Tulis komentar atau dukungan..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 rounded-xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-800 dark:text-stone-200 outline-none transition-all focus:border-amber-400 dark:focus:border-amber-500 placeholder:text-stone-400"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="flex items-center justify-center rounded-xl bg-stone-900 dark:bg-stone-100 px-3 text-white dark:text-stone-900 disabled:opacity-40 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </form>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-stone-50 dark:bg-stone-800 px-4 py-3 text-sm text-stone-500 dark:text-stone-400">
            <LogIn className="h-4 w-4" />
            <a href="/masuk" className="font-semibold text-amber-700 dark:text-amber-400 hover:underline">
              Masuk
            </a>{" "}
            untuk berkomentar
          </div>
        )}
      </div>
    </div>
  );
}
