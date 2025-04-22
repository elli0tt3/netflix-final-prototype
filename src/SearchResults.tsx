import React, { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";

interface SearchResultsProps {
  selectedFilters: Record<string, string>;
}

interface MovieResult {
  poster: string;
  title: string;
  overview: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ selectedFilters }) => {
  const [movies, setMovies] = useState<MovieResult[]>([]);

  const generateFilters = () => {
    let newUrl = "?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";

    if (selectedFilters['Content Type'] === "tv") {
      newUrl = "tv" + newUrl;
    } else {
      newUrl = "movie" + newUrl;
    }

    if (selectedFilters['Genre']) {
      newUrl += `&with_genres=${selectedFilters['Genre']}`;
    }

    if (selectedFilters['Watched Status'] === "Watched") {
      newUrl += selectedFilters['Content Type'] === "tv"
        ? `&first_air_date_year=1960`
        : `&year=1960`;
    } else if (selectedFilters['Watched Status'] === "1999") {
      newUrl += selectedFilters['Content Type'] === "tv"
        ? `&first_air_date_year=1961`
        : `&primary_release_year=1961`;
    }

    newUrl += selectedFilters['Availability'] === "2" ? `&page=2` : `&page=1`;

    if (selectedFilters['Release Year']) {
      newUrl = newUrl
        .replace(/&first_air_date_year=[^&]*/, '')
        .replace(/&primary_release_year=[^&]*/, '');

      newUrl += selectedFilters['Content Type'] === "tv"
        ? `&first_air_date_year=${selectedFilters['Release Year']}`
        : `&primary_release_year=${selectedFilters['Release Year']}`;
    }

    if (selectedFilters['Duration'] === "1") {
      newUrl += `&with_runtime.lte=30`;
    } else if (selectedFilters['Duration'] === "2") {
      newUrl += `&with_runtime.gte=30&with_runtime.lte=60`;
    } else if (selectedFilters['Duration'] === "3") {
      newUrl += `&with_runtime.gte=60&with_runtime.lte=120`;
    } else if (selectedFilters['Duration'] === "4") {
      newUrl += `&with_runtime.gte=120`;
    }

    if (selectedFilters['Language']) {
      newUrl += `&with_original_language=${selectedFilters['Language']}`;
    }

    if (selectedFilters['Rating/Maturity Level']) {
      newUrl += `&certification=${selectedFilters['Rating/Maturity Level']}&certification_country=US`;
    }

    return newUrl;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const url = "https://api.themoviedb.org/3/discover/";
      const fullUrl = url + generateFilters();

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      };

      try {
        const res = await fetch(fullUrl, options);
        const data = await res.json();

        const enriched = data.results
          .filter((movie: any) => movie.poster_path)
          .slice(0, 25)
          .map((movie: any) => ({
            poster: IMAGE_BASE_URL + movie.poster_path,
            title: movie.title || movie.name || "Untitled",
            overview: movie.overview || "No description available.",
          }));

        setMovies(enriched);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, [selectedFilters]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Your Search Recommendations</h2>
      <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-6rem)] pr-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie, i) => (
            <HoverCard key={i}>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer bg-gray-800 rounded overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-[#1f1f1f] text-white border border-white/20 p-4 rounded-md shadow-lg">
                <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-300">{movie.overview}</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  );
};
