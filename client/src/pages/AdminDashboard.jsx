import { useEffect, useState } from "react";
import { getEvents, createEvent, deleteEvent } from "../services/api";
import Loading from "../components/Loading";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to load events",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.date ||
      !formData.time ||
      !formData.location.trim()
    ) {
      setFeedback({ type: "error", text: "All fields are required." });
      return;
    }

    try {
      setSubmitting(true);
      const res = await createEvent(formData);

      setFeedback({
        type: "success",
        text: `Event "${formData.title}" created successfully! Real-time notification broadcasted.`,
      });

      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });

      // Refresh event list
      if (res.event) {
        setEvents((prev) => [res.event, ...prev]);
      } else {
        await loadEvents();
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to create event. Please ensure you have admin rights.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEvent(id, title) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      setFeedback({ type: "", text: "" });

      await deleteEvent(id);

      setEvents((prev) => prev.filter((ev) => ev._id !== id));
      setFeedback({
        type: "success",
        text: `Event "${title}" deleted successfully! Real-time cancellation notification sent.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to delete event.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Create new events, manage existing schedules, and broadcast real-time updates to all connected users.
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback.text && (
          <div
            className={`mb-6 rounded-lg p-4 text-sm font-medium ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Create Event Card */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Add New Event
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Adding an event instantly sends a notification to all online users.
              </p>

              <form onSubmit={handleCreateEvent} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="event-title" className="mb-1 block text-sm font-medium text-slate-700">
                    Event Title
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Hackathon 2026"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="event-desc" className="mb-1 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="event-desc"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the event..."
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="event-date" className="mb-1 block text-sm font-medium text-slate-700">
                      Date
                    </label>
                    <input
                      id="event-date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="event-time" className="mb-1 block text-sm font-medium text-slate-700">
                      Time
                    </label>
                    <input
                      id="event-time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="event-loc" className="mb-1 block text-sm font-medium text-slate-700">
                    Location
                  </label>
                  <input
                    id="event-loc"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Auditorium / Mumbai"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Creating Event..." : "+ Create Event"}
                </button>
              </form>
            </div>
          </div>

          {/* Event Management List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Events ({events.length})
                </h2>
                <button
                  type="button"
                  onClick={loadEvents}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div className="py-12">
                  <Loading />
                </div>
              ) : events.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p>No events found in the database.</p>
                  <p className="mt-1 text-xs">Use the form on the left to add your first event.</p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-slate-100">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {event.title}
                          </h3>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {event.location}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {event.description}
                        </p>
                        <p className="text-xs font-medium text-slate-600">
                          📅 {new Date(event.date).toLocaleDateString("en-IN", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" })} | ⏰ {event.time}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          disabled={deletingId === event._id}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingId === event._id ? "Deleting..." : "Delete Event"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
