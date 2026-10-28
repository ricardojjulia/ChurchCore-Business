export default {
  project: "churchcore-business",
  sourceLocale: "en",
  targetLocales: ["es"],
  catalogsDir: "./locales",
  glossaryDir: "./data/glossaries",
  lifecycleState: "approved",
  provider: {
    engine: "openrouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    model: "google/gemini-2.5-flash",
    headers: {
      "HTTP-Referer": "https://churchcore.io",
      "X-Title": "ChurchCore Localization Engine",
    },
    zeroDataRetention: {
      data_collection: "deny",
    },
  },
  placeholderPattern: /\{(\w+)\}/g,
};

