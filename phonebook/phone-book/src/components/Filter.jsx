const Filter = ({ search, setSearch }) => {
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      Search:{" "}
      <input
        value={search}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Filter;
