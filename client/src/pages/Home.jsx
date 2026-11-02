import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-slate-100 px-4 py-14 text-center sm:px-6 sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Discover Amazing Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg md:text-xl">
            Find exciting events, connect with people, and
            register for experiences that interest you.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/events"
              className="inline-block rounded-lg bg-indigo-600 px-6 py-3
                         font-semibold text-white shadow-sm transition
                         hover:bg-indigo-700"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Find Your Next Experience
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Explore technology workshops, conferences,
            festivals, and other exciting events happening
            near you.
          </p>
        </div>
      </section>

    </div>
  );
}

export default Home;