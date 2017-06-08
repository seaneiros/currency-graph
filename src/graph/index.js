import moment   from 'moment';

import Axis     from './axis';
import Chart    from './chart';
import Info     from './info';

const DAY_LENGTH = 1000 * 60 * 60 * 24;

class Graph extends React.PureComponent {

  constructor(props) {
    super(props)

    const { data, width, height } = props;

    this.state = {
      points: [],
      axises: [],
      xScaleLabels: []
    }
  }

  componentDidMount() {
    this.setState({
      ...this.createPointsFromData(this.props)
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      ...this.createPointsFromData(newProps)
    })
  }

  createPointsFromData(props) {
    const { width, height, offsetX, offsetY, data } = props;

    if (data.length === 0) {
      return [];
    }

    // getting Y minimum value
    let max = data[0].value;
    let min = data[0].value;

    data.forEach( i => {
      if (i.value > max) {
        max = i.value
      }
      if (i.value < min) {
        min = i.value
      }
    })

    const amplitude = max - min;
    const bottomSafeZone = 60;
    const yUnit = (height - 2 * offsetY - bottomSafeZone) / amplitude;

    // considering data to be sorted by `ts` ASC
    const dataDays = ( data[data.length - 1].ts - data[0].ts ) / DAY_LENGTH
    const xModifier = (width - 2 * offsetX) / dataDays;
    const safePadX = Math.floor(xModifier / 3);

    // compute axis offsets
    const axisStep = amplitude / 3;
    const axisValues = [
      0,
      min,
      Math.round(min + axisStep),
      Math.round(min + 2 * axisStep),
      max
    ]

    const axises = axisValues.map( item => ({
        y: item === 0 ? height - offsetY : height - offsetY - bottomSafeZone - (item - min) * yUnit,
        value: item.toFixed(2)
    }) );

    // X scale labels
    const groupedMonths = {};
    data
      .map( i => {
        const date = moment(i.ts);

        return {
          monthName: date.format('MMMM'),
          monthNumber: +date.format('M'),
          ts: i.ts
        }
      } )
      .forEach( ({ monthName, monthNumber, ts }) => {
        if (!!groupedMonths[monthName]) {
          if (groupedMonths[monthName].lastTs < ts) {
            groupedMonths[monthName].lastTs = ts;
          }
        } else {
          groupedMonths[monthName] = {
            order: monthNumber,
            lastTs: 0
          }
        }
      } )
    
    const labelY = height - offsetY + 30;

    const xScaleLabels = Object.keys(groupedMonths)
      .map( k => ({
        label: k,
        order: groupedMonths[k].order,
        ts: groupedMonths[k].lastTs
      }))
      .sort( (a, b) => a.order > b.order ? 1 : -1 )
      .map( (i, idx, arr) => {
        const daysDiff = Math.ceil((i.ts - arr[0].ts) / DAY_LENGTH);

        return {
          x: offsetX + ( idx === 0 ? 0 : Math.round(daysDiff * xModifier) ) + 10,
          y: labelY,
          label: i.label
        };
      } )

    const points = data.map( (item, idx, arr) => {
      const daysDiff = Math.ceil((item.ts - arr[0].ts) / DAY_LENGTH);

      return {
        dateString: moment(item.ts).format('D MMMM YYYY'),
        value: item.value.toFixed(2),
        diffString: Math.abs(item.diff).toFixed(2),
        diffSign: Math.sign(item.diff),
        safePadX,
        x: offsetX + ( idx === 0 ? 0 : Math.round(daysDiff * xModifier) ),
        y: height - offsetY - bottomSafeZone - (item.value - min) * yUnit
      }
    } )

    return {
      points,
      axises,
      xScaleLabels
    }
  }

  render() {
    const {
      height,
      width,
      data,
      offsetX,
      offsetY
    } = this.props

    const axisStart = {
      x: offsetX,
      y: height - offsetY
    }

    return (
      <div style={{position: 'relative'}}>
        <svg
          style={{position: 'absolute'}}
          className="graph"
          height={height}
          width={width}
        >
          {
            this.state.axises.map( (item, idx) => (
              <Axis
                key={idx}
                value={item.value}
                x={axisStart.x}
                y={item.y}
                length={width - 2 * axisStart.x}
              />
            ) )
          }
          {
            this.state.xScaleLabels.map( (item, idx) => (
              <text
                key={idx}
                x={item.x}
                y={item.y}
                fontSize={12}
                className="x-label"
              >
                {item.label}
              </text>
            ) )
          }
          <Chart points={this.state.points} />
        </svg>
        <Info
          points={this.state.points}
          height={height}
          width={width}
          axisStart={axisStart}
        />
      </div>
    )
  }

}

Graph.defaultProps = {
  height: 500,
  width: 800,
  offsetX: 50,
  offsetY: 50
}

export default Graph;
