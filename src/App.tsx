import React, { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Home,
  Clapperboard,
  Monitor,
  LineChart,
  Plus,
  Shuffle,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchResults } from './SearchResults';

const icons = [
  { Icon: Search },
  { Icon: Home },
  { Icon: Clapperboard },
  { Icon: Monitor },
  { Icon: LineChart },
  { Icon: Plus },
  { Icon: Shuffle }
];

const keyboardRows = [
  ['a', 'b', 'c', 'd', 'e', 'f'],
  ['g', 'h', 'i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p', 'q', 'r'],
  ['s', 't', 'u', 'v', 'w', 'x'],
  ['y', 'z', '1', '2', '3', '4'],
  ['5', '6', '7', '8', '9', '0'],
];

const movieGenres = [
  { id: '28', name: 'Action' }, { id: '12', name: 'Adventure' }, { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' }, { id: '80', name: 'Crime' }, { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' }, { id: '10751', name: 'Family' }, { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' }, { id: '27', name: 'Horror' }, { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' }, { id: '10749', name: 'Romance' }, { id: '878', name: 'Science Fiction' },
  { id: '10770', name: 'TV Movie' }, { id: '53', name: 'Thriller' }, { id: '10752', name: 'War' },
  { id: '37', name: 'Western' }
];

const tvGenres = [
  { id: '10759', name: 'Action & Adventure' }, { id: '16', name: 'Animation' }, { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' }, { id: '99', name: 'Documentary' }, { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' }, { id: '10762', name: 'Kids' }, { id: '9648', name: 'Mystery' },
  { id: '10763', name: 'News' }, { id: '10764', name: 'Reality' }, { id: '10765', name: 'Sci-Fi & Fantasy' },
  { id: '10766', name: 'Soap' }, { id: '10767', name: 'Talk' }, { id: '10768', name: 'War & Politics' },
  { id: '37', name: 'Western' }
];

const baseFilters = {
  'Content Type': [
    { id: "movie", name: 'Movie' },
    { id: "tv", name: 'TV Series' },
  ],
  'Watched Status': [
    { id: "2000", name: 'Watched' },
    { id: "1999", name: 'Unwatched' }
  ],
  'Availability': [
    { id: "1", name: 'Available Now' },
    { id: "2", name: 'Coming Soon' }
  ],
  'Release Year': Array.from({ length: 2025 - 1969 + 1 }, (_, i) => {
    const year = (2025 - i).toString();
    return { id: year, name: year };
  }),
  'Duration': [
    { id: "1", name: '< 30 minutes' },
    { id: "2", name: '30-60 minutes' },
    { id: "3", name: '1-2 hours' },
    { id: "4", name: '2+ hours' }
  ],
  'Language': [
    { id: "en", name: 'English' },
    { id: "es", name: 'Spanish' },
    { id: "ko", name: 'Korean' },
    { id: "zh", name: 'Chinese' },
  ],
  'Rating/Maturity Level': [
    { id: "G", name: 'G' },
    { id: "PG", name: 'PG' },
    { id: "PG-13", name: 'PG-13' },
    { id: "R", name: 'R' }
  ]
};

export default function App() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({ 'Content Type': 'movie' });
  const [quizOpen, setQuizOpen] = useState(false);

  const contentType = selectedFilters['Content Type'];
  const dynamicFilters = {
    ...baseFilters,
    'Genre': contentType === 'tv' ? tvGenres : contentType === 'movie' ? movieGenres : []
  };

  const handleSelect = (filter: string, option: string) => {
    setSelectedFilters(prev => {
      const updated = { ...prev, [filter]: option };
      if (filter === 'Content Type') {
        updated['Genre'] = '';
        updated['Rating/Maturity Level'] = '';
      }
      return updated;
    });
  };

  const clearFilter = (filter: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFilters(prev => ({ ...prev, [filter]: '' }));
  };

  const openQuiz = () => {
    setSelectedFilters(Object.keys(baseFilters).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
    setQuizOpen(true);
  };
  
  const applyQuizResults = (results: Record<string, string>) => {
    setSelectedFilters(results);
    setQuizOpen(false);
  };

  return (
    <div className="bg-black min-w-screen min-h-screen text-white flex">

      
      <div className="w-16 h-full flex flex-col items-center justify-center py-4 space-y-8">
        {icons.map(({ Icon }, i) => (
          <div key={i} className="relative flex justify-center">
            <Icon className={`w-6 h-6 ${i === 0 ? 'text-white' : 'text-white/60'} transition`} />
            {i === 0 && <span className="absolute -bottom-2 h-1 w-6 bg-red-600 rounded-full" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row h-full w-full px-6 py-6 gap-8">


        <div className="space-y-6 w-72 ml-2">
          <div className="grid grid-cols-6 gap-1">
            {keyboardRows.flat().map((key) => (
              <button
                key={key}
                className="aspect-square w-full bg-[#5D5C57] text-lg font-medium hover:bg-[#4f4e4a]"
              >
                {key}
              </button>
            ))}
          </div>

          <div className="flex justify-between mb-2">
          <Button
            onClick={openQuiz}
            variant="secondary"
            className="text-sm h-8 bg-red-500 text-black hover:bg-red-600"
          >
            Take a Quiz
          </Button>


            {Object.values(selectedFilters).some(v => v) && (
              <button
                onClick={() => setSelectedFilters(Object.keys(dynamicFilters).reduce((acc, key) => ({ ...acc, [key]: '' }), {}))}
                className="text-xs text-red-400 hover:text-red-200 underline"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="text-sm space-y-2 text-gray-300 mt-4">
            {Object.entries(dynamicFilters)
              .filter(([filter]) => !(contentType === 'tv' && filter === 'Rating/Maturity Level'))
              .sort(([a], [b]) => {
                if (a === 'Content Type') return -1;
                if (b === 'Content Type') return 1;
                if (a === 'Genre') return -1;
                if (b === 'Genre') return 1;
                return 0;
              })
              .map(([filter, options]) => (
              <DropdownMenu key={filter}>
                <div className="relative w-full">
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between border border-white/30 bg-transparent text-white px-3 py-2 rounded-sm font-medium hover:bg-white/10">
                      <span>{options.find(o => o.id.toString() === selectedFilters[filter])?.name || filter}</span>
                    </button>
                  </DropdownMenuTrigger>

                  {selectedFilters[filter] && (
                    <button
                      onClick={(e) => clearFilter(filter, e)}
                      className="absolute right-2 top-[20%] -translate-y-[50%] p-1 rounded hover:bg-white/10" //top offset for X
                    >
                      <X className="w-4 h-4 text-white/70 hover:text-red-500" />
                    </button>
                  )}
                </div>

                <DropdownMenuContent className="custom-scrollbar w-full bg-[#1f1f1f] text-white border border-white/30">
                  <DropdownMenuLabel>{filter}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {options.map((option, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleSelect(filter, option.id.toString())}
                    >
                      {option.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:flex-1 lg:max-w-3/5 ml-2 lg:ml-auto min-w-[300px]">
          <SearchResults selectedFilters={selectedFilters} />
        </div>

        <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
          <DialogContent className="bg-[#1f1f1f] text-white">
            <DialogHeader>
              <DialogTitle>Quick Quiz</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm">Do you prefer Movies or TV Series?</label>
                <select
                  className="w-full p-2 bg-black border border-white/20"
                  onChange={(e) =>
                    applyQuizResults({ 'Content Type': e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  <option value="movie">Movie</option>
                  <option value="tv">TV Series</option>
                </select>
              </div>

              {/* Add more questions here */}
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button onClick={() => setQuizOpen(false)} variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        
      </div>
    </div>
  );
}
