const Filter = ({ handleFilterChange, newFilter }) => (
  <div>
    filter shown with
    <input onChange={handleFilterChange} value={newFilter} />
  </div>
);

export default Filter;
