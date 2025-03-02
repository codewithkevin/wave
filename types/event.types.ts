import { EventCategoryEnum } from "./category.types";

export enum EventType {
    PAID = "paid",
    FREE = "free",
}

export enum EventStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
}

export interface CreateEventDTO {
    title: string;
    date: Date;
    time: string;
    coverImage: string;
    images: string[];
    venue: string;
    eventType: EventType;
    location?: string;
    locationCordinates?: {
        lat: number;
        lng: number;
    };
    video?: string;
    numberOfTickets: number;
    ticketPrice?: {
        currency: string;
        amount: number;
    };
    category: EventCategoryEnum
    description: string;
}

export interface BaseEvent extends CreateEventDTO {
    id: string;
    status: EventStatus;
    ticketSold: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface ReadEventDTO extends BaseEvent { }
