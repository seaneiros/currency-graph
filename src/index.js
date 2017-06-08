 import ReactDOM from 'react-dom';

 import Graph    from './graph';
 import data     from './data.js';

 ReactDOM.render(
   <Graph
    data={data}
    height={500}
    width={1200}
   />,
  document.getElementById('root')
);
