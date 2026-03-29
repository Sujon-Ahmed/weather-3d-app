import { useState } from "react";
import { getWeather } from "./api/weather";
import Scene from "./components/Scene";

type WeatherType = {
  name: string;
  dt: number;
  main: { temp: number };
  weather: { main: string; description: string }[];
  sys: { sunrise: number; sunset: number };
};

function isDayTime(weather: WeatherType) {
  return weather.dt >= weather.sys.sunrise && weather.dt <= weather.sys.sunset;
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherType | null>(null);

  const handleSearch = async () => {
    if (!city) return;
    const data = await getWeather(city);
    setWeather(data);
  };

  const isDay = weather ? isDayTime(weather) : true;
  const condition = weather?.weather[0].main;

  // 🎨 Dynamic iOS-style gradient
  const bgGradient =
    condition === "Rain"
      ? isDay
        ? "from-gray-600 via-gray-500 to-gray-700"
        : "from-gray-900 via-slate-800 to-black"
      : condition === "Clouds"
        ? isDay
          ? "from-slate-400 via-gray-300 to-slate-500"
          : "from-slate-800 via-gray-700 to-slate-900"
        : isDay
          ? "from-blue-400 via-sky-500 to-blue-600"
          : "from-black via-indigo-900 to-purple-900";

  return (
    <div
      className={`relative h-screen w-full bg-gradient-to-br ${bgGradient} overflow-hidden`}
    >
      {/* 🌌 3D Scene */}
      <Scene weatherType={condition} isDay={isDay} />

      {/* 🌟 UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        {/* 🔍 Search */}
        <div className="absolute top-10 flex gap-2">
          <input
            type="text"
            placeholder="Search city..."
            className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 outline-none border border-white/20"
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/20"
          >
            🔍
          </button>
        </div>

        {/* 🌤️ Weather Info */}
        {weather && (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-semibold drop-shadow-lg">
              {weather.name}
            </h1>

            <p className="text-[110px] leading-none font-bold drop-shadow-2xl">
              {Math.round(weather.main.temp)}°
            </p>

            <p className="text-xl capitalize opacity-80">
              {weather.weather[0].description}
            </p>

            {/* 💎 Glass Card */}
            <div className="mt-6 w-80 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between text-sm opacity-80">
                <span>Condition</span>
                <span>{weather.weather[0].main}</span>
              </div>
              <div className="flex justify-between text-sm mt-2 opacity-80">
                <span>Temperature</span>
                <span>{Math.round(weather.main.temp)}°C</span>
              </div>
              <div className="flex justify-between text-sm mt-2 opacity-80">
                <span>Day/Night</span>
                <span>{isDay ? "Day ☀️" : "Night 🌙"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
