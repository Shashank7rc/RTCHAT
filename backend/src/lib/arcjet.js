import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";
import dotenv from "dotenv/config" ;


export const aj = arcjet({
  key: process.env.ARCJET_KEY, 
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // 3 algo available fixed ,sliding ,token
   slidingWindow({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      interval: 60, // 60 second sliding window
      max: 100, // allow a maximum of 100 requests
    }),
  ],
});