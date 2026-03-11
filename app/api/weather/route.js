import { NextResponse } from "next/server";

const WMO_CONDITIONS = {
  0: "clear",
  1: "mainly clear", 2: "partly cloudy", 3: "overcast",
  45: "foggy", 48: "foggy",
  51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
  61: "light rain", 63: "rain", 65: "heavy rain",
  71: "light snow", 73: "snow", 75: "heavy snow", 77: "snow grains",
  80: "showers", 81: "showers", 82: "heavy showers",
  85: "snow showers", 86: "heavy snow showers",
  95: "thunderstorm", 96: "thunderstorm", 99: "thunderstorm",
};

export async function GET(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() || realIp || "";

    let lat = 51.5;
    let lon = -0.12;

    if (ip && ip !== "::1" && ip !== "127.0.0.1") {
      try {
        const geoRes = await fetch(
          `http://ip-api.com/json/${ip}?fields=lat,lon`,
          { next: { revalidate: 3600 } }
        );
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.lat && geo.lon) {
            lat = geo.lat;
            lon = geo.lon;
          }
        }
      } catch {
        // use default coords
      }
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`,
      { next: { revalidate: 600 } }
    );

    if (!weatherRes.ok) {
      return NextResponse.json({ error: "unavailable" });
    }

    const data = await weatherRes.json();
    const temp = `${Math.round(data.current.temperature_2m * 10) / 10}°C`;
    const condition = WMO_CONDITIONS[data.current.weathercode] ?? "unknown";

    return NextResponse.json({ temp, condition });
  } catch {
    return NextResponse.json({ error: "unavailable" });
  }
}
