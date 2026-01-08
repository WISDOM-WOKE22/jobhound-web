export function FinalCTA() {
    return (
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto text-center rounded-3xl p-10 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-3">
            Start Learning Smarter
          </h3>
          <p className="text-white/80 max-w-2xl mx-auto">
            Unlock personalized, interactive learning with beautiful animations
            and intuitive tools.
          </p>
          <div className="mt-6">
            <a
              href="/home"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:scale-105 transition-transform"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    );
  }