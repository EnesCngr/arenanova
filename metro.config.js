const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolved = context.resolveRequest(context, moduleName, platform);
  if (moduleName === 'react-native-reanimated') {
    return {
      ...resolved,
      filePath: resolved.filePath.replace(/lib\/module\/index\.js$/, 'src/index.ts'),
    };
  }
  return resolved;
};

module.exports = withNativeWind(config, { input: "./app/Globals.css" });
