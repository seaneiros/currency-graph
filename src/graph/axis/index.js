const Axis = ({ value, length, x, y }) => {
  const coords = {
    x1: x,
    y1: y,
    x2: x + length,
    y2: y
  }

  return (
    <g className="axis">
      <text
        className="axis__label"
        x={x - 40}
        y={y + 3}
        fontSize={12}
      >
        {value}
      </text>
      <line className="axis__line" {...coords} />
    </g>
  );
}

Axis.propTypes = {
  value: PropTypes.string,
  length: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
}

export default Axis;
