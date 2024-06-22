import { useState } from "react";
import { Input } from "@/components/ui/input";
import Search from "@/components/logo/Search";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative w-full">
      <div className="absolute text-white/50 left-2 top-1/2 transform -translate-y-1/2">
        <Search />
      </div>

      <Input
        type="text"
        placeholder="Search"
        value={searchTerm}
        className="w-full bg-base text-white/85 border-[1.5px] border-white/5 font-medium text-md rounded-md py-1 px-2 hover:bg-white/5 hover:text-white/100 transition-all duration-200 ease-in-out pl-9"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
