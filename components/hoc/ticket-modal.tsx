import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { BlurView } from "expo-blur";
import { primaryColor } from "@/lib/Colors";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import TicketCard from "./ticket-card";
import { router } from "expo-router";
import { EventType, ReadEventDTO } from "@/types/event.types";
import { useUserStore } from "@/store/auth";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  event: ReadEventDTO;
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  event,
}) => {
  const { updateUser, user } = useUserStore();
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(
    null
  );
  const [premiumQuantity, setPremiumQuantity] = useState(0);
  const [regularQuantity, setRegularQuantity] = useState(0);
  const [ticketPurchased, setTicketPurchased] = useState(false);
  const [isGettingTicket, setIsGettingTicket] = useState(false);

  const isFreeEvent = event?.eventType === EventType.FREE;

  // Memoize calculations to improve performance
  const canProceed = useMemo(
    () => premiumQuantity > 0 || regularQuantity > 0,
    [premiumQuantity, regularQuantity]
  );

  const totalPrice = useMemo(() => {
    const premiumTotal = 35.0 * premiumQuantity;
    const regularTotal = 25.98 * regularQuantity;
    return (premiumTotal + regularTotal).toFixed(2);
  }, [premiumQuantity, regularQuantity]);

  // Calculate modal height based on state
  const modalHeight = useMemo(() => {
    if (ticketPurchased) return SCREEN_HEIGHT * 0.85;
    if (isFreeEvent) return SCREEN_HEIGHT * 0.45;
    return SCREEN_HEIGHT * 0.7;
  }, [ticketPurchased, isFreeEvent, SCREEN_HEIGHT]);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleSelectTicket = useCallback(
    (type: string) => {
      setSelectedTicketType(type);
      if (type === "premium" && premiumQuantity === 0) {
        setPremiumQuantity(1);
      } else if (type === "regular" && regularQuantity === 0) {
        setRegularQuantity(1);
      }
    },
    [premiumQuantity, regularQuantity]
  );

  const incrementQuantity = useCallback((type: string) => {
    if (type === "premium") {
      setPremiumQuantity((prev) => prev + 1);
    } else {
      setRegularQuantity((prev) => prev + 1);
    }
    setSelectedTicketType(type);
  }, []);

  const decrementQuantity = useCallback(
    (type: string) => {
      if (type === "premium" && premiumQuantity > 0) {
        setPremiumQuantity((prev) => prev - 1);
      } else if (type === "regular" && regularQuantity > 0) {
        setRegularQuantity((prev) => prev - 1);
      }
    },
    [premiumQuantity, regularQuantity]
  );

  const handleTicketPurchased = useCallback(async () => {
    setIsGettingTicket(true);

    if (ticketPurchased) {
      onClose();
      router.push("/(index)/(tabs)/tickets");
      setTicketPurchased(false);
      setIsGettingTicket(false);
      return;
    }

    if (canProceed) {
      try {
        await updateUser({
          ticketsPurchased: [...(user?.ticketsPurchased || []), event],
        });
        setTicketPurchased(true);
      } catch (error) {
        console.error("Failed to purchase ticket:", error);
      } finally {
        setIsGettingTicket(false);
      }
    }
  }, [ticketPurchased, canProceed, user, event, onClose, updateUser]);

  // Fix the incorrect button text rendering with more readable logic
  const renderButtonText = () => {
    if (isGettingTicket && !ticketPurchased) {
      return "Getting tickets...";
    }

    if (ticketPurchased) {
      return "Ticket Purchased Successfully, Continue";
    }

    if (!canProceed) {
      return "Select a Ticket";
    }

    if (isFreeEvent) {
      return "Get tickets";
    }

    return `Proceed to Payment • $${totalPrice}`;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentContainer}
        >
          <View style={[styles.modalContent, { minHeight: modalHeight }]}>
            {ticketPurchased ? (
              <TicketCard event={event} />
            ) : (
              <>
                <View style={styles.headerContainer}>
                  <ThemedText type="title" style={styles.modalTitle}>
                    Select Tickets
                  </ThemedText>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color={primaryColor} />
                  </TouchableOpacity>
                </View>

                {event?.eventType === EventType.PAID && (
                  <PremiumTicket
                    event={event}
                    selected={selectedTicketType === "premium"}
                    quantity={premiumQuantity}
                    onSelect={() => handleSelectTicket("premium")}
                    onIncrement={() => incrementQuantity("premium")}
                    onDecrement={() => decrementQuantity("premium")}
                  />
                )}

                <RegularTicket
                  event={event}
                  isFreeEvent={isFreeEvent}
                  selected={selectedTicketType === "regular"}
                  quantity={regularQuantity}
                  onSelect={() => handleSelectTicket("regular")}
                  onIncrement={() => incrementQuantity("regular")}
                  onDecrement={() => decrementQuantity("regular")}
                />
              </>
            )}

            <Button
              style={{
                backgroundColor: primaryColor,
              }}
              disabled={!canProceed}
              size="lg"
              onPress={handleTicketPurchased}
            >
              <ThemedText style={styles.buttonText}>
                {renderButtonText()}
              </ThemedText>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

// Split into component functions for better organization and performance
interface TicketProps {
  event: ReadEventDTO;
  selected: boolean;
  quantity: number;
  onSelect: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const PremiumTicket: React.FC<TicketProps> = ({
  event,
  selected,
  quantity,
  onSelect,
  onIncrement,
  onDecrement,
}) => (
  <TouchableOpacity
    style={[styles.ticketCard, selected && styles.selectedCard]}
    onPress={onSelect}
  >
    <View style={styles.cardHeader}>
      <ThemedText type="defaultSemiBold">Premium price</ThemedText>
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={16} color="white" />
        </View>
      )}
    </View>

    <View style={styles.cardContent}>
      <View style={styles.cardLeftSection}>
        <View style={styles.imagePlaceholder}>
          <Image
            source={{ uri: event?.coverImage }}
            style={styles.dummyImage}
          />
        </View>

        <View style={styles.ticketInfo}>
          <ThemedText type="defaultSemiBold">{event?.title}</ThemedText>
          <ThemedText style={styles.smallText}>
            {event?.numberOfTickets} spots left
          </ThemedText>

          <TouchableOpacity style={styles.showBenefitButton}>
            <Ionicons name="chevron-forward" size={16} color={primaryColor} />
            <ThemedText style={styles.benefitText}>Show benefit</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceSection}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity style={styles.quantityButton} onPress={onDecrement}>
            <ThemedText>−</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.quantityText}>{quantity}</ThemedText>

          <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
            <ThemedText>+</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText type="defaultSemiBold">$35.00</ThemedText>
      </View>
    </View>
  </TouchableOpacity>
);

interface RegularTicketProps extends TicketProps {
  isFreeEvent: boolean;
}

const RegularTicket: React.FC<RegularTicketProps> = ({
  event,
  isFreeEvent,
  selected,
  quantity,
  onSelect,
  onIncrement,
  onDecrement,
}) => (
  <TouchableOpacity
    style={[styles.ticketCard, selected && styles.selectedCard]}
    onPress={onSelect}
  >
    <View style={styles.cardHeader}>
      <ThemedText type="defaultSemiBold">
        {isFreeEvent ? "Ticket" : "Regular price"}
      </ThemedText>
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={16} color="white" />
        </View>
      )}
    </View>

    <View style={styles.cardContent}>
      <View style={styles.cardLeftSection}>
        <View style={styles.imagePlaceholder}>
          <Image
            source={{ uri: event?.coverImage }}
            style={styles.dummyImage}
          />
        </View>

        <View style={styles.ticketInfo}>
          <ThemedText type="defaultSemiBold">{event?.title}</ThemedText>
          <ThemedText style={styles.smallText}>
            {event?.numberOfTickets} spots left
          </ThemedText>

          <TouchableOpacity style={styles.showBenefitButton}>
            <Ionicons name="chevron-forward" size={16} color={primaryColor} />
            <ThemedText style={styles.benefitText}>Show benefit</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceSection}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity style={styles.quantityButton} onPress={onDecrement}>
            <ThemedText>−</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.quantityText}>{quantity}</ThemedText>

          <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
            <ThemedText>+</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText type="defaultSemiBold">
          {isFreeEvent ? "Free" : event?.ticketPrice?.amount}
        </ThemedText>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    justifyContent: "flex-end",
    width: SCREEN_WIDTH,
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    gap: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  ticketCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dddddd",
    padding: 16,
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: primaryColor,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  checkmark: {
    backgroundColor: primaryColor,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLeftSection: {
    flexDirection: "row",
    flex: 1,
  },
  imagePlaceholder: {
    marginRight: 12,
  },
  dummyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  ticketInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  smallText: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },
  showBenefitButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  benefitText: {
    color: primaryColor,
    marginLeft: 4,
  },
  priceSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TicketModal;
