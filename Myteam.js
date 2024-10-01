document.addEventListener('DOMContentLoaded', function () {
    Plotly.newPlot('graph1', [{
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'bar'
    }]);
  
    Plotly.newPlot('graph2', [{
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: 'line'
    }]);
  
    Plotly.newPlot('graph3', [{
      x: [1, 2, 3, 4],
      y: [8, 14, 16, 10],
      type: 'bar'
    }]);
  
    Plotly.newPlot('graph4', [{
      x: [1, 2, 3, 4],
      y: [5, 10, 7, 12],
      type: 'scatter'
    }]);
  
    Plotly.newPlot('graph5', [{
      x: [1, 2, 3, 4],
      y: [8, 14, 16, 10],
      type: 'bar'
    }]);
  
    Plotly.newPlot('graph6', [{
      x: [1, 2, 3, 4],
      y: [7, 12, 5, 9],
      type: 'line'
    }]);
  });
  