import { ConfigContext, ExpoConfig } from "expo/config";


const EAS_PROJECT_ID = "08fe4b89-eaa3-40a6-bcd2-457ca8ed9650";
const PROJECT_SLUG = "Wave";
const OWNER = "kevinblack";

const APP_NAME = "Wave";
const BUNDLE_IDENTIFIER = "com.kevinblack.Wave";
const PACKAGE_NAME = "com.kevinblack.Wave";
const ICON = "./assets/images/icon.png";
const ADAPTIVE_ICON = "./assets/images/adaptive-icon.png";
const SCHEME = "Wave";


export default ({ config }: ConfigContext): ExpoConfig => {
    console.log("⚙️ Building app for environment:", process.env.APP_ENV);
    const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
        getDynamicAppConfig(
            (process.env.APP_ENV as "development" | "preview" | "production") ||
            "development"
        );

    return {
        ...config,
        name: name,
        version: "1.0.0",
        slug: PROJECT_SLUG,
        orientation: "portrait",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        icon: icon,
        scheme: scheme,
        ios: {
            supportsTablet: true,
            bundleIdentifier: bundleIdentifier,
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: adaptiveIcon,
                backgroundColor: "#ffffff",
            },
            package: packageName,
            permissions: [
                "android.permission.RECORD_AUDIO",
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE",
                "android.permission.ACCESS_MEDIA_LOCATION"
            ]
        },
        updates: {
            url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
        },
        runtimeVersion: "1.0.0",
        extra: {
            eas: {
                projectId: EAS_PROJECT_ID,
            },
        },
        web: {
            // bundler: "metro",
            // output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-font",
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff"
                }
            ],
            [
                "expo-image-picker",
                {
                    "photosPermission": "The app accesses your photos to let you share them with your friends."
                }
            ],
            [
                "expo-location",
                {
                    "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
                }
            ],
            [
                "expo-media-library",
                {
                    "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
                    "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
                    "isAccessMediaLocationEnabled": true
                }
            ],
            'expo-build-properties',
        ],
        experiments: {
            typedRoutes: true,
        },
        owner: OWNER,
    };
};

//TODO: create different app icon for different environments
export const getDynamicAppConfig = (
    environment: "development" | "preview" | "production"
) => {
    if (environment === "production") {
        return {
            name: APP_NAME,
            bundleIdentifier: BUNDLE_IDENTIFIER,
            packageName: PACKAGE_NAME,
            icon: ICON,
            adaptiveIcon: ADAPTIVE_ICON,
            scheme: SCHEME,
        };
    }

    if (environment === "preview") {
        return {
            name: `${APP_NAME} Preview`,
            bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
            packageName: `${PACKAGE_NAME}.preview`,
            icon: ICON,
            adaptiveIcon: ADAPTIVE_ICON,
            scheme: `${SCHEME}-prev`,
        };
    }

    return {
        name: `${APP_NAME} Development`,
        bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
        packageName: `${PACKAGE_NAME}.dev`,
        icon: ICON,
        adaptiveIcon: ADAPTIVE_ICON,
        scheme: `${SCHEME}-dev`,
    };
};