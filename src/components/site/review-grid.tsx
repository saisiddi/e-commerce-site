import { reviews } from "@/data/reviews";

export function ReviewGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-3xl border border-stone bg-white/70 p-6 shadow-soft"
        >
          <p className="text-lg">“{review.quote}”</p>
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-ink/60">
            {review.name}
          </p>
          <p className="mt-2 text-sm text-ink/70">{review.rating} rating</p>
        </div>
      ))}
    </div>
  );
}
