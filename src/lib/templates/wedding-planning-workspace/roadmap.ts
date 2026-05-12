import type { RoadmapSeed } from "../types";

export const roadmap: RoadmapSeed = {
  sections: [
    {
      title: "Venue and ceremony",
      description: "Contracts, layout, ceremony order, weather backup.",
    },
    {
      title: "Suppliers and catering",
      description: "Bookings, timings, menu decisions, payments.",
    },
    {
      title: "Guests and decisions",
      description: "Numbers, dietary, seating, family photo list.",
    },
    {
      title: "Final week",
      description: "Walkthrough, supplier confirmations, morning kit, day-of timeline.",
    },
  ],
  milestones: [
    {
      title: "Venue contract signed",
      description: "Deposit paid, dates locked, ceremony room agreed.",
      status: "shipped",
    },
    {
      title: "Suppliers confirmed",
      description: "Catering, photographer, florist, music — all booked and on the timeline.",
      status: "in-flight",
      when: "12 weeks out",
    },
    {
      title: "Guest numbers final",
      description: "RSVPs in, dietary notes collected, seating sketched.",
      status: "in-flight",
      when: "8 weeks out",
    },
    {
      title: "Final-week walkthrough",
      description: "Venue walk, supplier arrivals confirmed, day-of timeline shared.",
      status: "next",
      when: "Final week",
    },
    {
      title: "Wedding day",
      description: "Morning kit, photo list, weather call, day-of run-of-show.",
      status: "later",
      when: "Day-of",
    },
  ],
};
