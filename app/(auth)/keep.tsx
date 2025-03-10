import {
    View,
    Text,
    ImageBackground,
    Pressable,
    StyleSheet,
    Animated,
    Dimensions,
} from "react-native";
import React from "react";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";

const { height } = Dimensions.get("window");
const images = [
    require("../../assets/images/_mock/main.avif"),
    require("../../assets/images/_mock/cover0.jpeg"),
    require("../../assets/images/_mock/cover13.jpeg"),
];

export default function MainScreen() {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    // Animation value for the position of the new image
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    // Animation value for the opacity of the new image
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const transitionToNextImage = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const nextImageIndex = (currentImageIndex + 1) % images.length;

        // Reset animation values
        slideAnim.setValue(-height);
        fadeAnim.setValue(0);

        // Run parallel animations
        Animated.parallel([
            // Slide in from top to normal position
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
            }),
            // Fade in while sliding
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // After animation completes, update current image index
            setCurrentImageIndex(nextImageIndex);
            setIsTransitioning(false);
        });
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            transitionToNextImage();
        }, 8800); // 8.8 seconds between transitions

        return () => clearInterval(interval);
    }, [currentImageIndex, isTransitioning]);

    // Calculate the next image index
    const nextImageIndex = (currentImageIndex + 1) % images.length;

    return (
        <View style= {{ flex: 1 }
}>
    {/* Current/base image */ }
    < View style = { StyleSheet.absoluteFill } >
        <ImageBackground
          source={ images[currentImageIndex] }
style = {{ flex: 1 }}
        />
    </View>

{/* Next image animating in */ }
{
    isTransitioning && (
        <Animated.View
          style={
        [
            StyleSheet.absoluteFill,
            {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            },
        ]
    }
        >
        <ImageBackground
            source={ images[nextImageIndex] }
    style = {{ flex: 1 }
}
          />
    </Animated.View>
      )}

{/* UI layer (always visible) */ }
<LinearGradient
        colors={ ["rgba(0,0,0,0.8)", "transparent"] }
start = {{ x: 0, y: 0 }}
end = {{ x: 1, y: 0 }}
style = {{ flex: 1, justifyContent: "center" }}
      >
    <View
          style={
    {
        bottom: wp(40),
            padding: wp(6),
                gap: wp(4),
                    position: "absolute",
          }
}
        >
    <View
            style={
    {
        gap: 7,
            }
}
          >
    <ThemedText lightColor="white" type = "extremeTitle" >
        Let's Get
            </ThemedText>
            < ThemedText lightColor = "white" type = "title" >
                Started
                </ThemedText>
                </View>

                < View style = {{ gap: wp(1) }}>
                    <ThemedText lightColor="white" type = "subtitle" >
                        Welcome to WAVE
                            </ThemedText>
                            < ThemedText lightColor = "white" type = "defaultSemiBold" >
                                solution for all your event cravings!
                                    </ThemedText>
                                    </View>

                                    < Pressable
onPress = {() => {
    router.push("/(auth)/sign-up");
}}
style = { styles.button }
    >
    <ThemedText lightColor="white" style = { styles.buttonText } >
        Join Now
            </ThemedText>
            </Pressable>

            < View style = { styles.loginContainer } >
                <ThemedText
              lightColor="white"
style = { styles.loginText }
type = "subtitle"
    >
    Already have an account ?
        </ThemedText>
        < Pressable
              onPress = {() => {
    router.push("/(auth)/login");
}}
            >
    <ThemedText
                lightColor="white"
style = { [styles.loginText, styles.boldText]}
    >
    Login
    </ThemedText>
    </Pressable>
    </View>
    </View>
    </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    contentContainer: {
        paddingHorizontal: wp("10%"),
        alignItems: "center",
    },
    title: {
        fontSize: wp("8%"),
        fontWeight: "800",
        marginBottom: hp("2%"),
        textAlign: "center",
    },
    descriptionContainer: {
        marginBottom: hp("3%"),
        alignItems: "center",
    },
    description: {
        fontSize: wp("4%"),
        textAlign: "center",
    },
    button: {
        paddingVertical: wp("3%"),
        paddingHorizontal: wp("5%"),
        backgroundColor: "white",
        borderRadius: wp("5%"),
        marginBottom: hp("2%"),
    },
    buttonText: {
        fontSize: wp("4%"),
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
    },
    loginContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    loginText: {
        fontSize: wp("4"),
        fontWeight: "bold",
    },
    boldText: {
        fontWeight: "bold",
        marginLeft: wp("1%"),
    },
});
