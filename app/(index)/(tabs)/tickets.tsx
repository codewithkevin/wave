import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { primaryColor } from "@/lib/Colors";
import TicketCard from "@/components/hoc/ticket-card";
import { BodyScrollView } from "@/components/BodyScrollView";
import HorizontalTicketCard from "@/components/hoc/horizontal-ticket-card";
import { BodyFlatList } from "@/components/BodyFlatList";
import { useUserStore } from "@/store/auth";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface DateItem {
  fullDate: Date;
  date: number;
  day: string;
  selected: boolean;
}

interface Ticket {
  title: string;
  time: string;
  seat: string;
  icon: string;
  iconBgColor: string;
  date: Date;
}

const TicketsScreen: React.FC = () => {
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [dates, setDates] = useState<DateItem[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const scrollViewRef = React.useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const { user } = useUserStore();

  // Sample tickets data
  const tickets: Ticket[] = [
    {
      title: "Biggest Tech Startup & Business Professional",
      time: "08:45 AM",
      seat: "No seat",
      icon: "videocam",
      iconBgColor: "#8080FF",
      date: new Date(2022, 2, 25),
    },
    {
      title: "California Area Craft Beer Festival 2022",
      time: "07:00 PM",
      seat: "No seat",
      icon: "color-palette",
      iconBgColor: "#FF8C66",
      date: new Date(2022, 2, 25),
    },
    {
      title: "Santa Barbara: Lucidicy Festival - Dance Party",
      time: "09:00 PM",
      seat: "40 B",
      icon: "musical-notes",
      iconBgColor: "#40E0D0",
      date: new Date(2022, 2, 25),
    },
  ];

  // Generate dates for the scrollable calendar strip
  const generateDates = (baseDate: Date): DateItem[] => {
    const dates: DateItem[] = [];
    const startDate = new Date(baseDate);

    // First add the selected date
    dates.push({
      fullDate: new Date(startDate),
      date: startDate.getDate(),
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        startDate.getDay()
      ],
      selected: true,
    });

    // Add future dates
    for (let i = 1; i < 10; i++) {
      const futureDate = new Date(startDate);
      futureDate.setDate(startDate.getDate() + i);
      dates.push({
        fullDate: new Date(futureDate),
        date: futureDate.getDate(),
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          futureDate.getDay()
        ],
        selected: false,
      });
    }

    // Add past dates at the end
    for (let i = 1; i < 5; i++) {
      const pastDate = new Date(startDate);
      pastDate.setDate(startDate.getDate() - i);
      dates.unshift({
        fullDate: new Date(pastDate),
        date: pastDate.getDate(),
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          pastDate.getDay()
        ],
        selected: false,
      });
    }

    return dates;
  };

  // Generate calendar grid for modal
  const generateCalendarGrid = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startingDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    let calendarDays = [];
    let week = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      week.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendarDays.push(week);
        week = [];
      }
    }

    // Add empty cells for remaining days
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendarDays.push(week);
    }

    return calendarDays;
  };

  // Effects
  useEffect(() => {
    const newDates = generateDates(selectedDate);
    setDates(newDates);
  }, [selectedDate]);

  // Handlers
  const handleDateSelect = (date: DateItem) => {
    setSelectedDate(date.fullDate);

    // Scroll to the beginning after a short delay to allow state update
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }, 100);
  };

  const handleCalendarDaySelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const getMonthYearString = (date: Date): string => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Filter tickets based on selected date
  const filteredTickets = tickets.filter(
    (ticket) => ticket.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />

      <View
        style={{
          marginTop: 50,
        }}
      />

      <View>
        <View style={styles.header}>
          <TouchableOpacity></TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Tickets</ThemedText>
          <TouchableOpacity></TouchableOpacity>
        </View>

        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>
          <ThemedText style={styles.monthYear}>
            {getMonthYearString(currentMonth)}
          </ThemedText>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calendarIcon}
            onPress={() => setShowCalendar(true)}
          >
            <Ionicons name="calendar-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Date Selector */}
        <View style={styles.dateSelectorContainer}>
          <ScrollView
            horizontal
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            style={styles.dateSelector}
            contentContainerStyle={styles.dateSelectorContent}
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateItem,
                  date.selected && styles.selectedDateItem,
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <ThemedText
                  style={[
                    styles.dateNumber,
                    date.selected && styles.selectedDateText,
                  ]}
                >
                  {date.date}
                </ThemedText>
                <Text
                  style={[
                    styles.dateDay,
                    date.selected && styles.selectedDateText,
                  ]}
                >
                  {date.day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={goToPreviousMonth}>
                <Ionicons name="chevron-back" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>
                {getMonthYearString(currentMonth)}
              </Text>
              <TouchableOpacity onPress={goToNextMonth}>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarGrid}>
              {/* Weekday headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekdayHeader}>
                  {day}
                </Text>
              ))}

              {/* Calendar days */}
              {generateCalendarGrid(currentMonth).map((week, weekIndex) => (
                <View key={weekIndex} style={styles.calendarRow}>
                  {week.map((day, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.calendarDay,
                        day === selectedDate.getDate() &&
                          currentMonth.getMonth() === selectedDate.getMonth() &&
                          styles.selectedCalendarDay,
                      ]}
                      onPress={() => day && handleCalendarDaySelect(day)}
                      disabled={!day}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          day === selectedDate.getDate() &&
                            currentMonth.getMonth() ===
                              selectedDate.getMonth() &&
                            styles.selectedCalendarDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BodyFlatList
        data={user?.ticketsPurchased}
        renderItem={(ticket) => <HorizontalTicketCard ticket={ticket.item} />}
        contentContainerStyle={{
          padding: 10,
          gap: wp(5),
        }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  calendarStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  monthYear: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  calendarIcon: {
    marginLeft: 16,
  },

  dateSelectorContainer: {
    height: 80, // Fixed height for the container
    marginTop: 16,
  },
  dateSelector: {
    flex: 0, // Prevents ScrollView from expanding
  },
  dateSelectorContent: {
    paddingHorizontal: 16,
    alignItems: "center", // Centers items vertically
  },
  dateItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
    width: 64,
    height: 64, // Fixed height for date items
    marginRight: 8,
  },

  selectedDateItem: {
    backgroundColor: primaryColor,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateDay: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  selectedDateText: {
    color: "#fff",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tab: {
    marginRight: 16,
    paddingVertical: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#003366",
  },
  tabText: {
    color: "#666",
  },
  tabTextActive: {
    color: "#003366",
    fontWeight: "600",
  },
  ticketsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ticketItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketContent: {
    flex: 1,
    marginRight: 16,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  ticketDetails: {
    flexDirection: "row",
  },
  detailItem: {
    marginRight: 24,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
  },
  ticketIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  successBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
  },
  successText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "500" as const,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 16,
    textAlign: "center",
  },
  modalCalendar: {
    maxHeight: 300,
  },
  modalDateItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedModalDateItem: {
    backgroundColor: "#003366",
  },
  modalDateText: {
    fontSize: 16,
    color: "#000",
  },
  selectedModalDateText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: Dimensions.get("window").width - 40,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  weekdayHeader: {
    width: "14.28%",
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDayText: {
    fontSize: 16,
  },
  selectedCalendarDay: {
    backgroundColor: "#003366",
    borderRadius: 20,
  },
  selectedCalendarDayText: {
    color: "#fff",
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#003366",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TicketsScreen;
