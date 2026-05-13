export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const userImage = formData.get("userImage");
  const productId = formData.get("productId");

  if (!userImage || !productId) {
    return Response.json({ error: "Missing inputs" }, { status: 400 });
  }

  return Response.json({
    resultUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
  });
}
