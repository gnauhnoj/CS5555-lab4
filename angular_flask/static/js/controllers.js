// /* Controllers */

var IndexController = function($scope) {
};

var dateIfy = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      var newd = new Date(arr[i][j].replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1"));
      arr[i][j] = newd;
    }
  }
  return arr;
};

var AnalysisController = function($scope, getAnalysisData, $location, $anchorScroll) {
  $scope.processed = false;
  $scope.formData = {};
  $scope.formData.categoryLabel = null;
  $scope.formData.dates = [[null, null]];

  $scope.analysis = {};

  // add defaulting code - options - internship, school year, reset

  $scope.addDate = function() {
    $scope.formData.dates.push([null, null]);
  };

  $scope.deleteDate = function() {
    $scope.formData.dates.splice(this.$index, 1);
  };

  $scope.submit = function() {
    getAnalysisData.retrieve($scope.formData, function(res) {
      $scope.analysis = res;
      $scope.processed = true;

      // $location.hash('go-here');
      // $anchorScroll();

      window.location='#go-here';
    });
  };

  $scope.preset_school = function() {
    $scope.formData.dates = dateIfy([['2014-08-26', '2014-12-12'], ['2015-01-21', '2015-05-06'], ['2015-08-25', '2015-12-04']]);
  };

  $scope.preset_internship = function() {
    $scope.formData.dates = dateIfy([['2015-05-26', '2015-08-14']]);
  };
};

var RecommendationsController = function($scope, getReccData) {
  getReccData.get(function(data) {
    console.log(data);
    $scope.recc = data;
    var steps_pct = parseFloat(data.month.steps)/(parseFloat(data.last.steps)) *100;
    var med_act_pct = parseFloat(data.month.med_act)/(parseFloat(data.last.med_act)) * 100;
    $('#steps').css('width', steps_pct+'%').attr('aria-valuenow', steps_pct);
    $('#medact').css('width', med_act_pct+'%').attr('aria-valuenow', med_act_pct);
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
    var mo_steps = [];
    var mo_medact = [];

    // monthly accumulators
    var cur = new Date(data.x[0]);
    cur.setHours(12);
    var sum_steps = 0;
    var sum_medact = 0;
    var sum_days = 0;
    var count = 0;

    for (var i = 0; i < data.x.length; i++) {
      var d = new Date(data.x[i]);
      // normalize to middle of day
      d.setHours(12);
      steps.push({x: d, y: parseInt(data.y_steps[i])});
      medact.push({x: d, y: parseInt(data.y_med_act[i])});

      var timestamp, average_days, average_med;
      if (d.getMonth() !== cur.getMonth()) {
        if (i !== 0) {
          timestamp = (cur.getMonth() + 1) + '/' + cur.getFullYear();
          average_days = sum_steps / sum_days;
          average_med = sum_medact / sum_days;
          mo_steps.push({x: timestamp, y: average_days});
          mo_medact.push({x: timestamp, y: average_med});
        }
        cur = d;
        sum_steps = parseInt(data.y_steps[i]);
        sum_medact = parseInt(data.y_med_act[i]);
        sum_days = 1;
      } else {
        sum_steps += parseInt(data.y_steps[i]);
        sum_medact += parseInt(data.y_med_act[i]);
        sum_days++;
        if (i === data.x.length - 1) {
          timestamp = (cur.getMonth() + 1) + '/' + cur.getFullYear();
          average_days = sum_steps / sum_days;
          average_med = sum_medact / sum_days;
          mo_steps.push({x: timestamp, y: average_days});
          mo_medact.push({x: timestamp, y: average_med});
        }
      }
    }


    // DAILY PLOT
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
    plot.addClass("tooltipped").attr("title", function(d) { return '<div class="bartip"> Average Daily Steps -- ' + d.y + '</div>';});
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
    plot2.addClass("tooltipped").attr("title", function(d) { return '<div class="bartip"> Average Daily Moderately Active Minutes -- ' + d.y + '</div>';});
    plot2.addDataset(new Plottable.Dataset([]));
    plot2.addDataset(new Plottable.Dataset(medact));
    plot2.attr("fill", "#BDCEF0");
    plot2.autorangeMode("y");
    var panZoom2 = new Plottable.Interactions.PanZoom(xScale2, null);
    panZoom2.attachTo(plot2);

    var colorScale = new Plottable.Scales.Color();
    var legend = new Plottable.Components.Legend( colorScale );
    var names = ['Steps', 'Moderately Active Minutes'];
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
    // var titlelabel = new Plottable.Components.TitleLabel("Daily Activity").yAlignment("center");
    var table = new Plottable.Components.Table([
        // [null, titlelabel],
        [yAxisGroup, plotGroup, yAxisGroup2],
        [null, xAxis2, null]
    ]);
    table.renderTo("#barchart2");


    // MONTHLY PLOT
    // TODO (Jon): Refactor this bc it is terrible and repeating everything
    var xScale_mo = new Plottable.Scales.Category();
    var yScale_mo = new Plottable.Scales.Linear();
    var xAxis_mo = new Plottable.Axes.Category(xScale_mo, "bottom");
    var yAxis_mo = new Plottable.Axes.Numeric(yScale_mo, "left");
    var yLabel_mo = new Plottable.Components.AxisLabel( 'steps', '0')
      .padding( 5 )
      .xAlignment('right')
      .yAlignment('top');

    var plot_mo = new Plottable.Plots.ClusteredBar('vertical');
    plot_mo.x(function(d) { return d.x; }, xScale_mo).y(function(d) { return d.y; }, yScale_mo);
    plot_mo.addClass("tooltipped").attr("title", function(d) { return '<div class="bartip"> Steps -- ' + Math.floor(d.y) + '</div>';});
    plot_mo.addDataset(new Plottable.Dataset(mo_steps));
    plot_mo.addDataset(new Plottable.Dataset([]));
    plot_mo.attr("fill", "#5279C7");
    plot_mo.autorangeMode("y");

    var xScale2_mo = new Plottable.Scales.Category();
    var yScale2_mo = new Plottable.Scales.Linear();
    var xAxis2_mo = new Plottable.Axes.Category(xScale2_mo, "bottom");
    var yAxis2_mo = new Plottable.Axes.Numeric(yScale2_mo, "left");
    var yLabel2_mo = new Plottable.Components.AxisLabel( 'minutes', '0')
      .padding( 5 )
      .xAlignment('left')
      .yAlignment('top');

    var plot2_mo = new Plottable.Plots.ClusteredBar();
    plot2_mo.x(function(d) { return d.x; }, xScale2_mo).y(function(d) { return d.y; }, yScale2_mo);
    plot2_mo.addClass("tooltipped").attr("title", function(d) { return '<div class="bartip"> Moderately Active Minutes -- ' + Math.floor(d.y) + '</div>';});
    plot2_mo.addDataset(new Plottable.Dataset([]));
    plot2_mo.addDataset(new Plottable.Dataset(mo_medact));
    plot2_mo.attr("fill", "#BDCEF0");
    plot2_mo.autorangeMode("y");

    var legend_mo = new Plottable.Components.Legend( colorScale );
    legend_mo.maxEntriesPerRow( 2 );
    legend_mo.symbol( Plottable.SymbolFactories.square );
    legend_mo.xAlignment("right");
    legend_mo.yAlignment("top");

    var plots_mo = [];
    plots_mo.push(plot_mo);
    plots_mo.push(plot2_mo);
    plots_mo.push(legend_mo);
    var plotGroup_mo = new Plottable.Components.Group(plots_mo);
    var yAxisGroup_mo = new Plottable.Components.Group([yAxis_mo, yLabel_mo]);
    var yAxisGroup2_mo = new Plottable.Components.Group([yAxis2_mo, yLabel2_mo]);
    // var titlelabel_mo = new Plottable.Components.TitleLabel("Average Monthly Activity").yAlignment("center");
    var table_mo = new Plottable.Components.Table([
        // [null, titlelabel_mo],
        [yAxisGroup_mo, plotGroup_mo, yAxisGroup2_mo],
        [null, xAxis2_mo, null]
    ]);
    table_mo.renderTo("#barchart");

    $(".tooltipped rect").qtip({
      position: {
        my: "bottom middle",
        at: "top middle"
      },
      style: {
        classes: "qtip-dark"
      }
    });

    window.addEventListener("resize", function () {
        table.redraw();
        table_mo.redraw();
    });
  });
};
