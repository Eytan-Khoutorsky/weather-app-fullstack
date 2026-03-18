function SearchBar({ location, setLocation, onSearch }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Enter city..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
