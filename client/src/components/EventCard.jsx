import { useState } from "react";

function EventCard({
  title,
  description,
  date,
  location,
}) {

  const [registered, setRegistered] = useState(false);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          {description}
        </p>

        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-700">Date:</span> {date}
          </p>
          <p>
            <span className="font-medium text-slate-700">Location:</span> {location}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-2">
        {registered ? (
          <p className="font-semibold text-green-600">
            ✓ Successfully Registered!
          </p>
        ) : (
          <button
            onClick={() => setRegistered(true)}
            className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2.5
                       text-sm font-semibold text-white transition
                       hover:bg-indigo-700"
          >
            Register
          </button>
        )}
      </div>

    </div>
  );
}

export default EventCard;
