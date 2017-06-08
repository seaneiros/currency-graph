const Chart = ({ points }) => {

  const d = points
    .map( (item, idx) => {
      const { x, y } = item;
      const type = idx === 0 ? 'M' : 'L';

      return `${type} ${x} ${y}`;
    } )
    .join(' ')

  return (
    <path
      className="chart"
      d={d}
    />
  );
}

export default Chart;
