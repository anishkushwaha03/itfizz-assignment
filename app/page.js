import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="bg-[#f8f9fa]">
      <Hero />
      <section className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] text-[#111] relative z-10 border-t border-[#e5e7eb]">
        <div className="text-center max-w-3xl px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">End of Animation</h2>
          <p className="text-gray-700 text-lg md:text-xl font-light leading-relaxed">
            The road continues here. This validates that the unpinning functionality correctly allows you to keep scrolling smoothly to subsequent website sections.
          </p>
        </div>
      </section>
    </main>
  );
}
