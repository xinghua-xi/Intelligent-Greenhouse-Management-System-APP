module.exports = {
    expo: {
        name: "绿智云棚",
        slug: "luzhi-yunpeng",
        version: "1.0.0",
        orientation: "portrait",
        // icon: "./assets/icon.png", // Temporarily disabled - create assets folder and add icon.png
        userInterfaceStyle: "light",
        splash: {
            // image: "./assets/splash.png", // Temporarily disabled
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                // foregroundImage: "./assets/adaptive-icon.png", // Temporarily disabled
                backgroundColor: "#ffffff"
            },
            permissions: [
                "CAMERA",
                "READ_EXTERNAL_STORAGE",
                "WRITE_EXTERNAL_STORAGE"
            ]
        },
        web: {
            // favicon: "./assets/favicon.png", // Temporarily disabled
            bundler: "metro"
        },
        scheme: "luzhiyunpeng",
        plugins: [
            "expo-image-picker",
            "expo-audio"
        ],
        extra: {
            GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.API_KEY || "",
            API_KEY: process.env.API_KEY || process.env.GEMINI_API_KEY || ""
        }
    }
};

