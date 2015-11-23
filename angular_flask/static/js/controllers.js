// /* Controllers */

var IndexController = function($scope, dataStore) {
};

var AnalysisController = function($scope) {
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

var RecommendationsController = function($scope, getReccData) {
  getReccData.get(function(data) {
    console.log(data);
    $scope.last_steps = data.last_steps;
    $scope.last_sed_act = data.last_sed_act;
    $scope.last_med_act = data.last_med_act;
    $scope.recent_steps = data.recent_steps;
    $scope.recent_sed_act = data.recent_sed_act;
    $scope.recent_med_act = data.recent_med_act;
    $scope.overall_steps = data.overall_steps;
    $scope.overall_sed_act = data.overall_sed_act;
    $scope.overall_med_act =data.overall_med_act;
  });
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

var GraphsController = function ($scope, getGraphData) {
  getGraphData.get(function(data) {
    //console.log(data);
    var steps = [];
    var medact = [];
    // monthly measures
    var mo = [];
    var mo_steps = [];
    var mo_medact = [];
    var cur = new Date(data.x[0]);
    var sum_steps = 0;
    var sum_medact = 0;
    for (var i=0; i<data.x.length; i += 1){
      var d = new Date(data.x[i]);
      steps.push({x: d,
                  y: parseInt(data.y_steps[i])});
      medact.push({x: d,
                   y: parseInt(data.y_med_act[i])});
      if (d.getMonth() != cur.getMonth()){
          if (i !== 0){
            mo_steps.push({x: cur,
                           y: sum_steps});
            mo_medact.push({x: cur,
                            y: sum_medact});
          }
          cur = d;
          sum_steps = parseInt(data.y_steps[i]);
          sum_medact = parseInt(data.y_med_act[i]);
      } else {
        sum_steps += parseInt(data.y_steps[i]);
        sum_medact += parseInt(data.y_med_act[i]);
      }
    }


    // TODO (Jon): Refactor this bc it is terrible and repeating everything
    var xScale = new Plottable.Scales.Time();
    var yScale = new Plottable.Scales.Linear();
    var xAxis = new Plottable.Axes.Time(xScale, "bottom");
    reconfigureXAxis(xAxis);
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");
    var yLabel = new Plottable.Components.AxisLabel( 'steps', '0')
      .padding( 5 )
      .xAlignment('right')
      .yAlignment('top');

    var plot = new Plottable.Plots.ClusteredBar('vertical');
    plot.x(function(d) { return d.x; }, xScale).y(function(d) { return d.y; }, yScale);
    plot.addClass("tooltipped").attr("title", function(d) { return '<div class="bartip"> Steps -- ' + d.y + '</div>';});
    plot.addDataset(new Plottable.Dataset(steps));
    plot.addDataset(new Plottable.Dataset([]));
    plot.attr("fill", "#5279C7");
    plot.autorangeMode("y");
    var panZoom = new Plottable.Interactions.PanZoom(xScale, null);
    panZoom.attachTo(plot);

    var xScale2 = new Plottable.Scales.Time();
    var yScale2 = new Plottable.Scales.Linear();
    var xAxis2 = new Plottable.Axes.Time(xScale2, "bottom");
    reconfigureXAxis(xAxis2);
    var yAxis2 = new Plottable.Axes.Numeric(yScale2, "left");
    var yLabel2 = new Plottable.Components.AxisLabel( 'minutes', '0')
      .padding( 5 )
      .xAlignment('left')
      .yAlignment('top');

    var plot2 = new Plottable.Plots.ClusteredBar();
    plot2.x(function(d) { return d.x; }, xScale2).y(function(d) { return d.y; }, yScale2);
    plot2.addClass("tooltipped").attr("title", function(d) { return '<div class="bartip"> Med Activity Minutes -- ' + d.y + '</div>';});
    plot2.addDataset(new Plottable.Dataset([]));
    plot2.addDataset(new Plottable.Dataset(medact));
    plot2.attr("fill", "#BDCEF0");
    plot2.autorangeMode("y");
    var panZoom2 = new Plottable.Interactions.PanZoom(xScale2, null);
    panZoom2.attachTo(plot2);

    var colorScale = new Plottable.Scales.Color();
    var legend = new Plottable.Components.Legend( colorScale );
    var names = ['Steps', 'Med Active Minutes'];
    var colors = ['#5279C7', '#BDCEF0'];
    colorScale.domain( names );
    colorScale.range( colors );
    legend.maxEntriesPerRow( 2 );
    legend.symbol( Plottable.SymbolFactories.square );
    legend.xAlignment("right");
    legend.yAlignment("top");

    var plots = [];
    plots.push(plot);
    plots.push(plot2);
    plots.push(legend);
    var plotGroup = new Plottable.Components.Group(plots);
    var yAxisGroup = new Plottable.Components.Group([yAxis, yLabel]);
    var yAxisGroup2 = new Plottable.Components.Group([yAxis2, yLabel2]);
    // var titlelabel = new Plottable.Components.TitleLabel("Moderate Activity Time").yAlignment("center");
    var table = new Plottable.Components.Table([
        // [null, titlelabel],
        [yAxisGroup, plotGroup, yAxisGroup2],
        [null, xAxis2, null]
    ]);
    table.renderTo("#barchart");

    $(".tooltipped rect").qtip({
      position: {
        my: "bottom middle",
        at: "top middle"
      },
      style: {
        classes: "qtip-dark"
      }
    });
  });
};
