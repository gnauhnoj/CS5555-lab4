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

var GraphsController = function ($scope, dataStore) {
  dataStore.retrieveData(dataStore, function(data) {
    // data available in callback -- i need to think about how to do this w/o cb
    console.log(data);
    console.log(dataStore.storedData);
    
    // boilerplate plottable code
    this.steps = [];
    this.medact = [];
    for (var i=0; i<data.x.length; i += 1){
        this.steps.push({x: new Date(data.x[i]), 
                         y: parseInt(data.y_steps[i])});
        this.medact.push({x: new Date(data.x[i]),
                          y: parseInt(data.y_med_act[i])});
    }

    this.xScale = new Plottable.Scales.Time();
    this.yScale = new Plottable.Scales.Linear();
    this.xAxis = new Plottable.Axes.Time(xScale, "bottom");
    this.yAxis = new Plottable.Axes.Numeric(yScale, "left");

    this.plot = new Plottable.Plots.Bar();
    plot.addDataset(new Plottable.Dataset(this.steps));
    plot.x(function(d) { return d.x; }, xScale).y(function(d) { return d.y; }, yScale);
    plot.autorangeMode("y");
    this.panZoom = new Plottable.Interactions.PanZoom(xScale, null);
    panZoom.attachTo(plot);
    this.titlelabel = new Plottable.Components.TitleLabel("Steps").yAlignment("center");
    this.table = new Plottable.Components.Table([
        [null, titlelabel],
        [yAxis, plot],
        [null, xAxis]
    ]);
    table.renderTo("#barchart");  

    this.xScale2 = new Plottable.Scales.Time();
    this.yScale2 = new Plottable.Scales.Linear();
    this.xAxis2 = new Plottable.Axes.Time(xScale2, "bottom");
    this.yAxis2 = new Plottable.Axes.Numeric(yScale2, "left");

    this.plot2 = new Plottable.Plots.Bar();
    plot2.addDataset(new Plottable.Dataset(this.medact));
    plot2.x(function(d) { return d.x; }, xScale2).y(function(d) { return d.y; }, yScale2);
    plot2.autorangeMode("y");
    this.panZoom2 = new Plottable.Interactions.PanZoom(xScale2, null);
    panZoom2.attachTo(plot2);
    this.titlelabel2 = new Plottable.Components.TitleLabel("Moderate Activities").yAlignment("center");
    this.table2 = new Plottable.Components.Table([
        [null, titlelabel2],
        [yAxis2, plot2],
        [null, xAxis2]
    ]);
    table2.renderTo("#barchart2"); 
  });
};
