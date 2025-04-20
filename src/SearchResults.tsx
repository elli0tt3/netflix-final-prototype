import React, { useEffect, useState } from "react";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";

interface SearchResultsProps {
  selectedFilters: Record<string, string>;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ selectedFilters }) => {
  const [posters, setPosters] = useState<string[]>([]);
  console.log(selectedFilters);

  const generateFilters = () => {
    let newUrl = "?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc";

    if (selectedFilters['Content Type'] === "tv") {
      newUrl = "tv" + newUrl;
    } else {
      newUrl = "movie" + newUrl;
    }

    if (selectedFilters['Genre']){
      newUrl = newUrl + `&with_genres=${selectedFilters['Genre']}`;
    }

    if (selectedFilters['Watched Status'] === "Watched"){
      if (selectedFilters['Content Type'] === "tv") {
        newUrl = newUrl + `&first_air_date_year=${1960}`;
      } else {
        newUrl = newUrl + `&year=${1960}`;
      }
    } else if (selectedFilters['Watched Status'] === "1999"){
      if (selectedFilters['Content Type'] === "tv") {
        newUrl = newUrl + `&first_air_date_year=${1961}`;
      } else {
        newUrl = newUrl + `&primary_release_year=${1961}`;
      }
    }

    if (selectedFilters['Availability'] === "2") {
      newUrl += `&page=2`;
    } else {
      newUrl += `&page=1`;
    }

    if (selectedFilters['Release Year']) {
      // Remove any existing year param, capturing value until the next & or end of string
      newUrl = newUrl
        .replace(/&first_air_date_year=[^&]*/, '')
        .replace(/&primary_release_year=[^&]*/, '');
    
      if (selectedFilters['Content Type'] === "tv") {
        newUrl += `&first_air_date_year=${selectedFilters['Release Year']}`;
      } else {
        newUrl += `&primary_release_year=${selectedFilters['Release Year']}`;
      }
    }

    if (selectedFilters['Duration'] === "1") {
      newUrl += `&with_runtime.lte=30`;
    } else if (selectedFilters['Duration'] === "2") {
      newUrl += `&with_runtime.gte=30&with_runtime.lte=60`;
    } else if (selectedFilters['Duration'] === "3") {
      newUrl += `&with_runtime.gte=60&with_runtime.lte=120`;
    }else if (selectedFilters['Duration'] === "4") {
      newUrl += `&with_runtime.gte=120`;
    }

    if (selectedFilters['Language']) {
      newUrl += `&with_original_language=${selectedFilters['Language']}`;
    }
    
    if (selectedFilters['Rating/Maturity Level']) {
      newUrl += `&certification=${selectedFilters['Rating/Maturity Level']}&certification_country=US`;
    }


    

    return newUrl;
  }

  useEffect(() => {
    const fetchMovies = async () => {
      const url = "https://api.themoviedb.org/3/discover/";
      const fullUrl = url + generateFilters();

      console.log(fullUrl);

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
        const posterUrls = data.results
          .filter((movie: any) => movie.poster_path)
          .slice(0, 25)
          .map((movie: any) => IMAGE_BASE_URL + movie.poster_path);
        setPosters(posterUrls);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, [selectedFilters]);

  return (
    <div className="flex-1 max-w-3/5 ml-auto">
      <h2 className="text-3xl font-bold mb-4">Your Search Recommendations</h2>
      <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-6rem)] pr-2">
        <div className="grid grid-cols-5 gap-4">
          {posters.map((url, i) => (
            <div
              key={i}
              className="bg-gray-800 overflow-hidden flex items-center justify-center"
            >
              <img src={url} alt={`Poster ${i}`} className="w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
