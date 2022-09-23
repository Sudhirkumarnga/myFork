const babelRelativePaths = require("./babelRelativePaths")
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      [
        "module:react-native-dotenv",

        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,

          allowUndefined: true
        }
      ],
      "import-glob-meta",
      "react-native-reanimated/plugin"
    ]
  }
}

// module.exports = api => {
//   api.cache(true)
//   return {
//     presets: ["module:metro-react-native-babel-preset"],
//     plugins: [
//       [
//         "babel-plugin-relative-path-import",
//         {
//           paths: [
//             {
//               rootPathPrefix: "@res",
//               rootPathSuffix: "src/res"
//             },
//             {
//               rootPathPrefix: "@Images",
//               rootPathSuffix: "src/res/Images"
//             },
//             {
//               rootPathPrefix: "@Common",
//               rootPathSuffix: "src/UI/Common"
//             },
//             {
//               rootPathPrefix: "@UI",
//               rootPathSuffix: "src/UI"
//             },
//             {
//               rootPathPrefix: "@",
//               rootPathSuffix: "src"
//             }
//           ]
//         }
//       ]
//     ]
//   }
// }
