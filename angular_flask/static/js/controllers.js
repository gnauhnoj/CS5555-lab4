// /* Controllers */

var IndexController = function($scope, dataStore) {
  console.log(dataStore.storedData);
};

var AnalysisController = function($scope, dataStore) {
  $scope.formData = {};
  $scope.formData.dates = [[null, null]];

  // add defaulting code - options - internship, sickness, summer, reset

  $scope.addDate = function() {
    $scope.formData.dates.push([null, null]);
  };

  $scope.deleteDate = function() {
    $scope.formData.dates.splice(this.$index, 1);
  };

  // write method to send dates for analysis
};

var RecommendationsController = function($scope, dataStore) {
  console.log(dataStore.storedData);
};

var reconfigureXAxis = function(xAxis) {
  var configs = xAxis.axisConfigurations();
  var newConfigs = [];
  configs.forEach(function(tierConfiguration){
    var newTierConfiguration = [];
    tierConfiguration.forEach(function(row){
      if(row.interval === "day" ||
        row.interval === "month" ||
        row.interval === "year"){
        newTierConfiguration.push(row);
      }
    });
    newConfigs.push(newTierConfiguration);
  });
  xAxis.axisConfigurations(newConfigs);
};


var GraphsController = function ($scope, dataStore) {
  dataStore.retrieveData(dataStore, function(data) {
    var steps = [];
    var medact = [];
    for (var i=0; i<data.x.length; i += 1){
      var date = new Date(data.x[i]);
      steps.push({x: date,
                  y: parseInt(data.y_steps[i])});
      medact.push({x: date,
                y: parseInt(data.y_med_act[i])});
    }

    var xScale = new Plottable.Scales.Time();
    var yScale = new Plottable.Scales.Linear();
    var xAxis = new Plottable.Axes.Time(xScale, "bottom");
    reconfigureXAxis(xAxis);
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");

    var plot = new Plottable.Plots.ClusteredBar('vertical');
    plot.addDataset(new Plottable.Dataset(steps).metadata(3));
    plot.x(function(d) { return d.x; }, xScale)
        .y(function(d) { return d.y; }, yScale);
    plot.attr("fill", "#5279C7");
    plot.autorangeMode("y");
    var panZoom = new Plottable.Interactions.PanZoom(xScale, null);
    panZoom.attachTo(plot);
    var titlelabel = new Plottable.Components.TitleLabel("Steps").yAlignment("center");
    var table = new Plottable.Components.Table([
        [null, titlelabel],
        [yAxis, plot],
        [null, xAxis]
    ]);
    table.renderTo("#barchart");

    var xScale2 = new Plottable.Scales.Time();
    var yScale2 = new Plottable.Scales.Linear();
    var xAxis2 = new Plottable.Axes.Time(xScale2, "bottom");
    reconfigureXAxis(xAxis2);
    var yAxis2 = new Plottable.Axes.Numeric(yScale2, "left");

    var plot2 = new Plottable.Plots.ClusteredBar();
    plot2.addDataset(new Plottable.Dataset(medact));
    plot2.x(function(d) { return d.x; }, xScale2).y(function(d) { return d.y; }, yScale2);
    plot.attr("fill", "#BDCEF0");
    plot2.autorangeMode("y");
    var panZoom2 = new Plottable.Interactions.PanZoom(xScale2, null);
    panZoom2.attachTo(plot2);
    var titlelabel2 = new Plottable.Components.TitleLabel("Moderate Activity Time").yAlignment("center");
    var table2 = new Plottable.Components.Table([
        [null, titlelabel2],
        [yAxis2, plot2],
        [null, xAxis2]
    ]);
    table2.renderTo("#barchart2");
  });
};
