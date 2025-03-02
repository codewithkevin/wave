import { EventStatus, EventType, ReadEventDTO } from "../types/event.types";

export const createMockEvents = (count: number, prefix: string): ReadEventDTO[] =>
    Array.from({ length: count }, (_, index) => ({
        id: `${prefix}-${index}`,
        title:
            index === 0
                ? "Blood & Gold"
                : index === 1
                    ? "The Little Mermaid"
                    : index === 2
                        ? "To Catch a Killer"
                        : `Movie ${index + 1}`,
        imageUrl:
            "https://mir-s3-cdn-cf.behance.net/project_modules/1400/66932197773601.5ecd2ebb832dc.jpeg",

        // ✅ Add missing properties
        description: "A sample movie description",
        date: new Date(), // Set a sample date
        location: "Virtual", // Set a default location
        type: EventType.CONFERENCE, // Assign a valid EventType
        status: EventStatus.PENDING, // Assign a default EventStatus
        createdAt: new Date(), // Auto-generate timestamps
        updatedAt: new Date(),
    }));
