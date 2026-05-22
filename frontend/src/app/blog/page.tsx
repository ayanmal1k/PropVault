import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";

interface Post { slug: string; title: string; excerpt?: string; coverImage?: string; publishedAt?: string; }

export const metadata = { title: "Blog & News — PropVault" };

async function getPosts() {
  try {
    const res = await api<{ items: Post[] }>("/blog", { timeoutMs: 5000 });
    return res.items ?? [];
  } catch { return []; }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div style={{ background: "#f5f5f5", minHeight: "80vh" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
        <div className="z-container" style={{ fontSize: 12, color: "#888" }}>
          <Link href="/" style={{ color: "#33a137" }}>Home</Link> › <span>Blog</span>
        </div>
      </div>

      <div className="z-container" style={{ padding: "24px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#333", marginBottom: 20 }}>PropVault Blog & News</h1>

        {posts.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 3, padding: 40, textAlign: "center", color: "#888" }}>
            No posts yet.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="z-prop-card" style={{ display: "block", textDecoration: "none" }}>
                {post.coverImage && (
                  <div style={{ position: "relative", height: 160 }}>
                    <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: "cover" }} sizes="380px" unoptimized />
                  </div>
                )}
                <div style={{ padding: "12px 14px" }}>
                  {post.publishedAt && (
                    <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>
                      {new Date(post.publishedAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#333", lineHeight: 1.4 }}>{post.title}</div>
                  {post.excerpt && <div style={{ fontSize: 12, color: "#888", marginTop: 6, lineHeight: 1.5 }}>{post.excerpt}</div>}
                  <div style={{ marginTop: 10, fontSize: 12, color: "#33a137", fontWeight: 700 }}>Read more →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
