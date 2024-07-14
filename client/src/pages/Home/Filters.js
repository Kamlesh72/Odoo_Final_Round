import React from "react";

const genres = [
  {
    name: "All",
    value: "All",
  },
  {
    name: "Fiction",
    value: "Fiction",
  },
  {
    name: "Self_Help",
    value: "Self Help",
  },
  {
    name: "Mystery",
    value: "Mystery",
  },
  {
    name: "Fantasy",
    value: "Fantasy",
  },
  {
    name: "Biography",
    value: "Biography",
  },
  {
    name: "Science_Fiction",
    value: "Science Fiction",
  },
  {
    name: "Romance",
    value: "Romance",
  },
  {
    name: "Thriller",
    value: "Thriller",
  },
  {
    name: "History",
    value: "History",
  },
  {
    name: "Philosophy",
    value: "Philosophy",
  }
];

const Filters = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  getData,
}) => {
  return (
    <div className="flex flex-col bg-slate-100 p-5 h-full my-filters-page">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Genres</h1>
        <i
          className="ri-close-line cursor-pointer text-2xl"
          onClick={() => setShowFilters(false)}
        ></i>
      </div>
      <div className="flex flex-col gap-1 mt-5">
        {/* <h1 className="text-gray-600 text-xl">Genres</h1> */}
        <div className="flex flex-col gap-1 justify-start">
          {genres.map((genre) => {
            return (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="genre"
                  className="width-fit"
                  checked={filters.genre.includes(genre.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        genre: [...filters.genre, genre.value],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        genre: filters.genre.filter(
                          (item) => item !== genre.value
                        ),
                      });
                    }
                  }}
                />
                <label className="text-xl" htmlFor="genre">{genre.value}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
