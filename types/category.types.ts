export enum EventCategoryEnum {
    // Business & Professional
    Conferences = "Conferences",
    NetworkingEvents = "Networking Events",
    TradeShows = "Trade Shows & Expos",
    Seminars = "Seminars & Workshops",
    ProductLaunches = "Product Launches",

    // Technology & Innovation
    TechConferences = "Tech Conferences",
    Hackathons = "Hackathons",
    Webinars = "Webinars",
    StartupEvents = "Startups & Pitch Events",
    AIandBlockchain = "AI & Blockchain Events",

    // Entertainment & Lifestyle
    Concerts = "Concerts & Music Festivals",
    MoviePremieres = "Movie Premieres",
    FashionShows = "Fashion Shows",
    ComedyShows = "Comedy Shows",
    AwardCeremonies = "Award Ceremonies",

    // Sports & Fitness
    Marathons = "Marathons & Races",
    YogaRetreats = "Yoga & Wellness Retreats",
    EsportsTournaments = "Esports & Gaming Tournaments",
    ExtremeSports = "Extreme Sports Events",
    BodybuildingExpos = "Bodybuilding & Fitness Expos",

    // Education & Training
    Workshops = "Workshops & Bootcamps",
    UniversityOpenDays = "University Open Days",
    CareerFairs = "Career Fairs",
    OnlineCourses = "Online Courses & Webinars",
    StudentCompetitions = "Student Competitions",

    // Cultural & Community
    Festivals = "Festivals & Parades",
    ReligiousGatherings = "Religious Gatherings",
    CharityEvents = "Charity & Fundraising Events",
    HeritageCelebrations = "Heritage & Cultural Celebrations",
    CommunityMeetups = "Local Community Meetups",

    // Food & Drinks
    FoodFestivals = "Food Festivals",
    WineTasting = "Wine Tasting & Brewery Tours",
    CookingClasses = "Cooking Classes",
    FarmersMarkets = "Farmers’ Markets",
    RestaurantOpenings = "Restaurant Openings",

    // Arts & Creativity
    ArtExhibitions = "Art Exhibitions & Galleries",
    TheaterPerformances = "Theater & Dance Performances",
    PoetryEvents = "Poetry & Spoken Word Events",
    FilmFestivals = "Photography & Film Festivals",
    WritingWorkshops = "Writing & Storytelling Workshops",

    // Science & Environment
    EnvironmentalSummits = "Environmental Summits",
    SpaceEvents = "Space & Astronomy Events",
    ScienceFairs = "Science Fairs & Exhibitions",
    WildlifeConservation = "Wildlife Conservation Events",
    GreenEnergyConferences = "Sustainability & Green Energy Conferences",

    // Family & Kids
    ChildrensWorkshops = "Children's Workshops",
    StorytellingSessions = "Storytelling Sessions",
    FamilyFunDays = "Family Fun Days",
    AmusementParkEvents = "Amusement Park Events",
    ToyConventions = "Toy & Games Conventions",
    Funeral = "Funeral",
}



export interface CreateEventCategoryDTO {
    name: EventCategoryEnum,
    description: string,
    iconName: string,
    iconType: any,
    color: string
}

export interface ReadEventCategoryDTO extends CreateEventCategoryDTO {
    id: string,
}