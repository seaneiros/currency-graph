class Info extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      svgCoords: {
        top: 0,
        left: 0
      },
      infoPoint: null
    }

    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    this.setState({
      svgCoords: this.svg.getBoundingClientRect()
    })
  }

  onMouseMove(e) {
    const { width, axisStart: { x, y }, points } = this.props;
    const { svgCoords: { left, top } } = this.state;

    const graphX = e.pageX - left;

    if (graphX >= 0 && graphX <= width - x) {
      const suitableElement = points.find( i => {
        return graphX >= i.x - i.safePadX && graphX <= i.x + i.safePadX
      } )
      const infoExists = suitableElement !== undefined;

      this.setState({
        infoPoint: infoExists ? suitableElement : null
      })
    }
  }

  renderLine() {
    const { axisStart: { y: y0 } } = this.props;
    const { infoPoint: { x, y } } = this.state;

    return (
      <g className="info-line">
        <line
          x1={x}
          y1={y0}
          x2={x}
          y2={y}
        />
        <circle
          cx={x}
          cy={y}
          r={3}
        />
      </g>
    )
  }

  renderBox() {
    const { infoPoint: {
      dateString,
      value,
      diffString,
      diffSign,
      x,
      y
    } } = this.state;
    const { width } = this.props;

    const baseX = x > width - 300 ? x - 170 : x + 10;

    return (
      <g
        className="info"
        fontFamily="sans"
        fontSize="12"
      >
        <rect
          className="info__plate"
          x={baseX}
          y={y + 10}
          width={160}
          height={60}
          rx={3}
          ry={3}
        />
        <text
          className="info__date"
          x={baseX + 20}
          y={y + 30}
        >
          {dateString}
        </text>
        <text
          className="info__value"
          x={baseX + 20}
          y={y + 50}
        >
          $ {value}
        </text>
        {
          diffSign < 0 ? (
            <polygon className="info__diff--less" points={`${baseX+75},${y+41} ${baseX+85},${y+41} ${baseX+80},${y+49}`} fill="red" stroke="none" />
          ) : (
            <polygon className="info__diff--more" points={`${baseX+75},${y+49} ${baseX+85},${y+49} ${baseX+80},${y+41}`} fill="green" stroke="none"/>
          )
        }
        <text
          x={baseX + 90}
          y={y + 50}
          className={`info__diff info__diff--${diffSign < 0 ? 'less' : 'more'}`}
        >
          {diffString}
        </text>
      </g>
    )
  }

  render() {
    const {
      height,
      width,
    } = this.props;
    const { infoPoint } = this.state;

    return (
      <svg
        ref={ t => this.svg = t }
        style={{position: 'absolute'}}
        height={height}
        width={width}
        onMouseMove={this.onMouseMove}
      >
      <defs>
        <filter id="dropshadow" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feComponentTransfer xmlns="http://www.w3.org/2000/svg">
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
        { infoPoint !== null && this.renderLine() }
        { infoPoint !== null && this.renderBox() }
      </svg>
    );
  }

}

Info.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  points: PropTypes.array,
  axisStart: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
}

export default Info;
