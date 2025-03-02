import { EventCategoryEnum } from "@/types/category.types";
import { EventStatus, EventType, ReadEventDTO } from "@/types/event.types";

export const eventsMock: ReadEventDTO[] = [
    {
        id: "evt_001",
        title: "Accra Tech Summit 2025",
        date: new Date("2025-03-15"),
        time: "09:00 AM",
        coverImage: "https://i.pinimg.com/736x/e3/e8/c1/e3e8c156715cfb14859172a9e4fc61bc.jpg", // Tech conference crowd
        images: ["https://images.unsplash.com/photo-1505373877841-8d25f7d466b1"], // Tech event stage
        venue: "Accra International Conference Centre",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5502, lng: -0.1911 }, // Accra International Conference Centre
        numberOfTickets: 500,
        ticketPrice: { currency: "GHS", amount: 150 },
        category: EventCategoryEnum.TechConferences,
        status: EventStatus.PENDING,
        ticketSold: 0,
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-25"),
        description: "Join industry leaders, innovators, and tech enthusiasts at the Accra Tech Summit 2025, the premier technology conference in Ghana, dedicated to exploring the future of digital transformation, innovation, and entrepreneurship in West Africa. This highly anticipated event will bring together top professionals, startups, policymakers, and investors to discuss emerging trends, challenges, and opportunities in the tech ecosystem. The summit will feature keynote speeches from globally renowned tech experts and business leaders, offering insights into cutting- edge advancements in artificial intelligence, fintech, blockchain, cybersecurity, and software development.Attendees will gain firsthand knowledge of how these technologies are shaping industries and transforming businesses across Africa.Engage in thought - provoking panel discussions covering topics such as the role of AI in Africa’s development, the impact of fintech on financial inclusion, strategies for building resilient startups, and the evolving landscape of digital governance.These discussions will provide valuable perspectives from industry experts, government officials, and successful entrepreneurs who are at the forefront of innovation. Networking opportunities will be a key highlight of the summit, allowing participants to connect with potential collaborators, investors, and mentors.Whether you’re a startup founder looking for funding, a developer seeking career growth, or a corporate executive exploring digital strategies, this event offers the perfect platform to expand your professional network. Attendees will also have the chance to explore tech exhibitions showcasing groundbreaking products and services from leading companies and promising startups.Experience live demos of next - generation solutions and discover how businesses are leveraging technology to solve real - world challenges in Ghana and beyond."
    },
    {
        id: "evt_002",
        title: "Ghana Food Festival",
        date: new Date("2025-04-20"),
        time: "12:00 PM",
        coverImage: "https://images.unsplash.com/photo-1702827482556-481adcd68f3b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZCUyMGluJTIwYWZyaWNhfGVufDB8fDB8fHww", // Food festival scene
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"], // Food stalls
        venue: "Independence Square",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5486, lng: -0.1913 }, // Independence Square
        numberOfTickets: 1000,
        ticketPrice: { currency: "GHS", amount: 50 },
        category: EventCategoryEnum.FoodFestivals,
        status: EventStatus.CONFIRMED,
        ticketSold: 300,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-02-25"),
        description: "Celebrate Ghanaian cuisine at the Ghana Food Festival! Taste local delicacies like jollof rice, waakye, and kelewele from top chefs and vendors. Enjoy live cooking demos, music, and a vibrant atmosphere at Independence Square."
    },
    {
        id: "evt_003",
        title: "Accra Marathon 2025",
        date: new Date("2025-05-10"),
        time: "06:00 AM",
        coverImage: "https://images.pexels.com/photos/14346273/pexels-photo-14346273.jpeg?auto=compress&cs=tinysrgb&w=1200", // Marathon runners
        images: ["https://images.unsplash.com/photo-1517433367423-1d72348e3a39"], // Race start line
        venue: "Black Star Square",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5486, lng: -0.1913 }, // Black Star Square
        numberOfTickets: 2000,
        ticketPrice: { currency: "GHS", amount: 100 },
        category: EventCategoryEnum.Marathons,
        status: EventStatus.PENDING,
        ticketSold: 0,
        createdAt: new Date("2025-02-10"),
        updatedAt: new Date("2025-02-25"),
        description: "Run through the heart of Accra in the 2025 Accra Marathon! This annual event welcomes runners of all levels for a scenic 42km race starting at Black Star Square, promoting fitness and community spirit."
    },
    {
        id: "evt_004",
        title: "AI Ghana Hackathon",
        date: new Date("2025-06-01"),
        time: "10:00 AM",
        coverImage: "https://i.pinimg.com/736x/41/0c/6d/410c6de5c8cc3286a8ca3d8f3f54ae72.jpg", // Hackathon teamwork
        images: ["https://images.unsplash.com/photo-1531482615713-2e85d2f51096"], // Coders at work
        venue: "MEST Africa",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.6111, lng: -0.1864 }, // MEST Africa
        numberOfTickets: 150,
        ticketPrice: { currency: "GHS", amount: 200 },
        category: EventCategoryEnum.Hackathons,
        status: EventStatus.CONFIRMED,
        ticketSold: 50,
        createdAt: new Date("2025-01-20"),
        updatedAt: new Date("2025-02-25"),
        description: "AI Ghana Hackathon is a 24-hour coding marathon where developers, designers, and AI enthusiasts collaborate to solve real-world problems using AI. Hosted at MEST Africa, the event offers mentorship, networking, and access to cutting-edge AI tools. Compete for prizes, gain industry insights, and showcase your skills to tech leaders. Whether you’re an expert or a beginner, this is your chance to innovate and make an impact. Join us in shaping the future of AI in Africa! Work in teams, push the boundaries of AI, and present your ideas to a panel of judges. Top projects stand a chance to receive funding, incubation, and further development support. Don’t miss this opportunity to connect, create, and change the world with AI!"
    },
    {
        id: "evt_005",
        title: "Chale Wote Street Art Festival",
        date: new Date("2025-08-15"),
        time: "08:00 AM",
        coverImage: "https://www.okayafrica.com/media-library/image.jpg?id=10390863&width=980", // Street art
        images: ["https://images.unsplash.com/photo-1569089186877-05e16f279c2f"], // Artists painting
        venue: "Jamestown",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5352, lng: -0.2118 },
        numberOfTickets: 3000,
        category: EventCategoryEnum.ArtExhibitions,
        status: EventStatus.CONFIRMED,
        ticketSold: 0,
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-25"),
        description: "Experience the vibrant Chale Wote Street Art Festival in historic Jamestown. This free event transforms the streets with colorful murals, live performances, and art installations celebrating Ghanaian culture."
    },
    {
        id: "evt_006",
        title: "Ghana Fashion Week",
        date: new Date("2025-09-20"),
        time: "06:00 PM",
        coverImage: "https://i.pinimg.com/736x/70/a0/ad/70a0ad4eda5deaee05f236fa0d0a0a21.jpg", // Fashion runway
        images: ["https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93"], // Models on stage
        venue: "Kempinski Hotel Gold Coast",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5605, lng: -0.1798 }, // Kempinski Hotel
        numberOfTickets: 300,
        ticketPrice: { currency: "GHS", amount: 250 },
        category: EventCategoryEnum.FashionShows,
        status: EventStatus.PENDING,
        ticketSold: 0,
        createdAt: new Date("2025-02-15"),
        updatedAt: new Date("2025-02-25"),
        description: "Ghana Fashion Week showcases the best of African design at the luxurious Kempinski Hotel. Witness stunning runway shows featuring local and international designers, highlighting bold fabrics and innovative styles."
    },
    {
        id: "evt_007",
        title: "Accra Comedy Night",
        date: new Date("2025-03-25"),
        time: "08:00 PM",
        coverImage: "https://pbs.twimg.com/media/FX-EJqQWAAAHlly?format=jpg&name=medium", // Comedy stage
        images: ["https://images.unsplash.com/photo-1519985339828-833e6e90d024"], // Comedian performing
        venue: "Alliance Française Accra",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5731, lng: -0.1927 }, // Alliance Française
        numberOfTickets: 200,
        ticketPrice: { currency: "GHS", amount: 80 },
        category: EventCategoryEnum.ComedyShows,
        status: EventStatus.CONFIRMED,
        ticketSold: 50,
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-02-25"),
        description: "Get ready for an unforgettable night of non-stop laughter at Accra Comedy Night, where Ghana’s top comedians take the stage to deliver side-splitting performances! Hosted at Alliance Française, this exciting event promises an evening filled with witty humor, relatable stories, and lighthearted entertainment that will leave you in stitches. This special comedy night brings together a lineup of seasoned stand-up comedians and rising stars in the Ghanaian comedy scene. Expect a diverse mix of humor—whether it’s sharp observational comedy, hilarious cultural commentary, or spontaneous crowd interactions, there’s something for everyone! From everyday struggles to trending topics, these comedians know exactly how to turn real-life moments into comedic gold. Whether you’re looking for the perfect way to unwind after a long week or planning a fun night out with friends, Accra Comedy Night offers the perfect atmosphere. Grab your drinks, sit back, and enjoy a show that will keep you laughing all night long! The vibrant setting at Alliance Française creates a warm and inviting space where comedy lovers can come together to share moments of pure joy."
    },
    {
        id: "evt_009",
        title: "Accra Film Festival",
        date: new Date("2025-10-05"),
        time: "05:00 PM",
        coverImage: "https://i.pinimg.com/736x/a7/7b/30/a77b30b5e860a35c97497e6335474054.jpg", // Green energy event
        images: ["https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c"], // Cinema screening
        venue: "Silverbird Cinemas",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5557, lng: -0.1981 }, // Accra Mall (Silverbird)
        numberOfTickets: 500,
        ticketPrice: { currency: "GHS", amount: 120 },
        category: EventCategoryEnum.FilmFestivals,
        status: EventStatus.CONFIRMED,
        ticketSold: 100,
        createdAt: new Date("2025-01-25"),
        updatedAt: new Date("2025-02-25"),
        description: "Discover cinematic gems at the Accra Film Festival! Held at Silverbird Cinemas, this event showcases local and international films, with screenings, Q&A sessions, and awards."
    },
    {
        id: "evt_010",
        title: "University of Ghana Career Fair",
        date: new Date("2025-04-15"),
        time: "10:00 AM",
        coverImage: "https://i.pinimg.com/736x/6b/d7/61/6bd761098a3eb6f406201cb7a8250f7f.jpg", // Career fair booths
        images: ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655"], // Job seekers
        venue: "University of Ghana, Legon",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.6508, lng: -0.1869 }, // University of Ghana
        numberOfTickets: 1000,
        category: EventCategoryEnum.CareerFairs,
        status: EventStatus.CONFIRMED,
        ticketSold: 0,
        createdAt: new Date("2025-02-05"),
        updatedAt: new Date("2025-02-25"),
        description: "Kickstart your career at the University of Ghana Career Fair 2025, the ultimate opportunity to connect with top employers, industry professionals, and recruiters right on the Legon campus. Whether you’re a student, recent graduate, or young professional, this event is designed to help you explore job opportunities, internships, and career development resources. Meet representatives from leading companies across various industries, including tech, finance, healthcare, engineering, and more. Gain insights into the latest hiring trends, discover what employers are looking for, and learn how to stand out in a competitive job market. Attend interactive workshops and career coaching sessions covering topics like resume building, interview preparation, networking strategies, and personal branding. Get expert advice from HR specialists and career mentors to refine your job search approach. The career fair also features on-the-spot interviews and networking sessions, giving you a chance to make meaningful connections that could lead to your next big opportunity. Don’t miss this chance to take the next step in your professional journey. Prepare, network, and secure your future! 🚀🎓"
    },
    {
        id: "evt_011",
        title: "Ghana Wine Tasting Evening",
        date: new Date("2025-05-20"),
        time: "06:00 PM",
        coverImage: "https://i.pinimg.com/736x/68/83/14/688314083a6906c8470a5a79ca1bafc2.jpg", // Wine tasting
        images: ["https://images.unsplash.com/photo-1514190496438-3ca7c32696c1"], // Wine glasses
        venue: "Mövenpick Ambassador Hotel",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5578, lng: -0.1987 }, // Mövenpick Hotel
        numberOfTickets: 150,
        ticketPrice: { currency: "GHS", amount: 200 },
        category: EventCategoryEnum.WineTasting,
        status: EventStatus.PENDING,
        ticketSold: 0,
        createdAt: new Date("2025-02-15"),
        updatedAt: new Date("2025-02-25"),
        description: "Indulge in an evening of fine wines at the Ghana Wine Tasting Evening. Held at Mövenpick Ambassador Hotel, this event offers a selection of local and imported wines paired with gourmet bites."
    },
    {
        id: "evt_012",
        title: "Accra Esports Championship",
        date: new Date("2025-06-25"),
        time: "02:00 PM",
        coverImage: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1200", // Esports event
        images: ["https://images.unsplash.com/photo-1590179068383-c1e70e9a4c75"], // Gamers competing
        venue: "Accra Digital Centre",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.6037, lng: -0.1870 }, // Accra Digital Centre
        numberOfTickets: 300,
        ticketPrice: { currency: "GHS", amount: 150 },
        category: EventCategoryEnum.EsportsTournaments,
        status: EventStatus.CONFIRMED,
        ticketSold: 80,
        createdAt: new Date("2025-01-30"),
        updatedAt: new Date("2025-02-25"),
        description: "Compete in the Accra Esports Championship at the Accra Digital Centre! This gaming tournament features popular titles, cash prizes, and a chance to join Ghana’s growing esports scene."
    },
    {
        id: "evt_013",
        title: "Children's Art Workshop",
        date: new Date("2025-07-15"),
        time: "10:00 AM",
        coverImage: "https://i.pinimg.com/736x/e0/7d/54/e07d54c046c08d31c6a547deca46db59.jpg", // Kids painting
        images: ["https://images.unsplash.com/photo-1513366208861-7b1b0e2b4b8a"], // Art supplies
        venue: "National Museum of Ghana",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5566, lng: -0.2056 }, // National Museum
        numberOfTickets: 50,
        ticketPrice: { currency: "GHS", amount: 30 },
        category: EventCategoryEnum.ChildrensWorkshops,
        status: EventStatus.PENDING,
        ticketSold: 0,
        createdAt: new Date("2025-02-10"),
        updatedAt: new Date("2025-02-25"),
        description: "Spark creativity at the Children’s Art Workshop! Hosted at the National Museum, kids aged 5-12 can paint, craft, and explore Ghanaian heritage with expert instructors."
    },
    {
        id: "evt_019",
        title: "React Native Ghana: Building the Future of Mobile Development",
        date: new Date("2025-09-15"),
        time: "11:00 AM",
        coverImage: "https://pbs.twimg.com/media/GdekV3rXQAAnaok?format=jpg&name=medium", // Kids painting
        images: ["https://images.unsplash.com/photo-1513366208861-7b1b0e2b4b8a"], // Art supplies
        venue: "UMB Accra",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5566, lng: -0.2256 }, // National Museum
        numberOfTickets: 50,
        ticketPrice: { currency: "GHS", amount: 30 },
        category: EventCategoryEnum.ChildrensWorkshops,
        status: EventStatus.PENDING,
        ticketSold: 0,
        createdAt: new Date("2025-02-10"),
        updatedAt: new Date("2025-02-25"),
        description: "Join developers, designers, and tech enthusiasts at React Native Ghana, a premier event dedicated to exploring the latest advancements, best practices, and real-world applications of React Native in mobile development. Whether you’re a seasoned React Native developer or just starting out, this event offers a unique opportunity to learn, connect, and grow within Ghana’s thriving tech community. Expect engaging keynote sessions from industry experts, covering topics such as optimizing performance in React Native apps, state management strategies, and integrating native modules for enhanced functionality. Learn from experienced developers who have built and scaled React Native applications for real-world use cases across various industries. Participate in interactive workshops designed to equip attendees with hands-on experience in building high-performance mobile applications. Topics may include Expo and React Native CLI, best practices for debugging and testing, integrating third-party APIs, and leveraging React Native for cross-platform development. Whether you’re working on a personal project or building apps for businesses, these workshops will provide valuable insights and practical skills. Network with fellow developers, startup founders, and industry professionals to exchange ideas, discuss challenges, and explore collaboration opportunities. This event fosters an inclusive and supportive environment where knowledge sharing is encouraged, making it the perfect place to meet like-minded individuals passionate about mobile development."
    },
    {
        id: "evt_0208",
        title: "React Native Ghana: Building the Future of Mobile Development",
        date: new Date("2025-09-15"),
        time: "11:00 AM",
        coverImage: "https://pbs.twimg.com/media/GdekV3rXQAAnaok?format=jpg&name=medium", // Kids painting
        images: ["https://images.unsplash.com/photo-1513366208861-7b1b0e2b4b8a"], // Art supplies
        venue: "UMB Accra",
        eventType: EventType.FREE,
        location: "Accra, Ghana",
        locationCordinates: { lat: 5.5566, lng: -0.2256 }, // National Museum
        numberOfTickets: 50,
        ticketPrice: { currency: "GHS", amount: 30 },
        category: EventCategoryEnum.ChildrensWorkshops,
        status: EventStatus.PENDING,
        ticketSold: 0,
        createdAt: new Date("2025-02-10"),
        updatedAt: new Date("2025-02-25"),
        description: "Join developers, designers, and tech enthusiasts at React Native Ghana, a premier event dedicated to exploring the latest advancements, best practices, and real-world applications of React Native in mobile development. Whether you’re a seasoned React Native developer or just starting out, this event offers a unique opportunity to learn, connect, and grow within Ghana’s thriving tech community. Expect engaging keynote sessions from industry experts, covering topics such as optimizing performance in React Native apps, state management strategies, and integrating native modules for enhanced functionality. Learn from experienced developers who have built and scaled React Native applications for real-world use cases across various industries. Participate in interactive workshops designed to equip attendees with hands-on experience in building high-performance mobile applications. Topics may include Expo and React Native CLI, best practices for debugging and testing, integrating third-party APIs, and leveraging React Native for cross-platform development. Whether you’re working on a personal project or building apps for businesses, these workshops will provide valuable insights and practical skills. Network with fellow developers, startup founders, and industry professionals to exchange ideas, discuss challenges, and explore collaboration opportunities. This event fosters an inclusive and supportive environment where knowledge sharing is encouraged, making it the perfect place to meet like-minded individuals passionate about mobile development."
    },
];

