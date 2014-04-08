var store = TFS.OM.TfsTeamProjectCollection.getConnection(TFS.Host.TfsContext.getDefault()).getService(TFS.WorkItemTracking.WorkItemStore);
var a = new Object();
a.getApiLocation = function (){ return ApiLocation; }

var query = "SELECT [System.Id],[Microsoft.VSTS.Scheduling.Size],[System.State],[Microsoft.VSTS.Common.StateChangeDate] FROM WorkItems WHERE "+
"[System.WorkItemType] IN GROUP 'Microsoft.RequirementCategory' AND "+
"[System.IterationPath] UNDER '"+IterationPath+"' AND "+
"[System.AreaPath] UNDER '"+AreaPath+"' "+
"ORDER BY [System.State] DESC"

store.beginQuery(a,query,collectNPrepare);

var data = null;
var dataBIG = null;

function collectNPrepare(wis){

  console.log(wis);

  //collect data
  var completedPoints = 0;
  var count = 0;

  var storyPoints = 0;
  var pointReduce = [];
  var SITReduce = [];
  var UATReduce = [];
  var DoneReduce = [];

  var incrSIT = 0;

  for(var row in wis.payload.rows){
    wi = wis.payload.rows[row];
    storyPoints += wi[1];
    if(DoDstates.indexOf(wi[2]) != -1){

      if(pointReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] == null) pointReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] = 0;
      pointReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] += wi[1];

    }
    //if(SITReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] == null) SITReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] = incrSIT;
    if(SITstates.indexOf(wi[2]) != -1){      
      SITReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] += wi[1];
    }

    if(UATReduce.indexOf(wi[2]) != -1){
      if(UATReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] == null) UATReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] = 0;
      UATReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] += wi[1];
    }
    if(DoneReduce.indexOf(wi[2]) != -1){
      if(DoneReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] == null) DoneReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] = 0;
      DoneReduce[(wi[3].getMonth()+1)+'/'+wi[3].getDate()+'/'+wi[3].getFullYear()] += wi[1];
    }
  }

  var sprintStartandEndDates = $(".sprint-date").text().split(' - ');

  var today = new Date();
  var day1 = new Date(sprintStartandEndDates[0]+', '+today.getFullYear());
  var day2 = new Date(day1); day2.setDate(day1.getDate()+1);
  var day3 = new Date(day1); day3.setDate(day1.getDate()+2);
  var day4 = new Date(day1); day4.setDate(day1.getDate()+3);
  var day5 = new Date(day1); day5.setDate(day1.getDate()+4);
  var day6 = new Date(day1); day6.setDate(day1.getDate()+5);
  var day7 = new Date(day1); day7.setDate(day1.getDate()+6);
  var day8 = new Date(day1); day8.setDate(day1.getDate()+7);
  var day9 = new Date(day1); day9.setDate(day1.getDate()+8);
  var day10 = new Date(day1); day10.setDate(day1.getDate()+9);
  var day11 = new Date(day1); day11.setDate(day1.getDate()+10);
  var day12 = new Date(day1); day12.setDate(day1.getDate()+11);

  function getSPoints(day){
    if(today >= day){
      return (pointReduce[(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear()] != null)? (storyPoints-parseInt(pointReduce[(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear()])) : storyPoints;
    }
    else return null;
  }

  function getSITPoints(day){
    if(today >= day){
      return (SITReduce[(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear()] != null)? incrSIT+SITReduce[(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear()] : incrSIT;
    }
    else return null;
  }

  var pointsbyDate = [];
  var SITReducebyDay = [];
  var totalSP = storyPoints;

  day = day1;
  storyPoints = getSPoints(day);
  pointsbyDate[day1] = storyPoints;
  SITReducebyDay[day] = getSITPoints(day); incrSIT+=SITReducebyDay[day];
  console.warn(incrSIT);

  day = day2;
  storyPoints = getSPoints(day);
  pointsbyDate[day2] = storyPoints;
  SITReducebyDay[day] = getSITPoints(day); incrSIT+=SITReducebyDay[day];
  day = day3;
  storyPoints = getSPoints(day);
  pointsbyDate[day3] = storyPoints;
  SITReducebyDay[day] = getSITPoints(day); incrSIT+=SITReducebyDay[day];
  day = day4;
  storyPoints = getSPoints(day);
  pointsbyDate[day4] = storyPoints;
  SITReducebyDay[day] = getSITPoints(day); incrSIT+=SITReducebyDay[day];
  day = day5;
  storyPoints = getSPoints(day);
  pointsbyDate[day5] = storyPoints; 
  SITReducebyDay[day] = getSITPoints(day); incrSIT+=SITReducebyDay[day];
  day = day6;
  storyPoints = getSPoints(day);
  pointsbyDate[day6] = storyPoints;
  day = day7;
  storyPoints = getSPoints(day);
  pointsbyDate[day7] = storyPoints;
  day = day8;
  storyPoints = getSPoints(day);
  pointsbyDate[day8] = storyPoints;
  day = day9;
  storyPoints = getSPoints(day);
  pointsbyDate[day9] = storyPoints;
  day = day10;
  storyPoints = getSPoints(day);
  pointsbyDate[day10] = storyPoints;
  day = day11;
  storyPoints = getSPoints(day);
  pointsbyDate[day11] = storyPoints;
  day = day12;
  storyPoints = getSPoints(day);
  pointsbyDate[day12] = storyPoints;


  var chartdiv = document.createElement('div');
  chartdiv.id = 'chart_div';
  $(chartdiv).css('float','right').css('margin-top','-15px').css('cursor','pointer').css('z-index',200);
  $(chartdiv).insertBefore('.sprint-title-right-container')

  var script = document.createElement('script');
  script.src = 'https://www.google.com/jsapi';
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
  console.warn('Google API loaded!');

  function drawChart() {

    // Create and populate the data table.
    data = google.visualization.arrayToDataTable([
      ['Date', 'Story Points'],
      [(day1.getMonth()+1)+'/'+day1.getDate(), pointsbyDate[day1]],
      [(day2.getMonth()+1)+'/'+day2.getDate(), pointsbyDate[day2]],
      [(day3.getMonth()+1)+'/'+day3.getDate(), pointsbyDate[day3]],
      [(day4.getMonth()+1)+'/'+day4.getDate(), pointsbyDate[day4]],
      [(day5.getMonth()+1)+'/'+day5.getDate(), pointsbyDate[day5]],
      [(day6.getMonth()+1)+'/'+day6.getDate(), pointsbyDate[day6]],
      [(day7.getMonth()+1)+'/'+day7.getDate(), pointsbyDate[day7]],
      [(day8.getMonth()+1)+'/'+day8.getDate(), pointsbyDate[day8]],
      [(day9.getMonth()+1)+'/'+day9.getDate(), pointsbyDate[day9]],
      [(day10.getMonth()+1)+'/'+day10.getDate(), pointsbyDate[day10]],
      [(day11.getMonth()+1)+'/'+day11.getDate(), pointsbyDate[day11]],
      [(day12.getMonth()+1)+'/'+day12.getDate(), pointsbyDate[day12]]
    ]);

    console.log(SITReducebyDay);

    // Create and populate the data table for BIG view.
    // dataBIG = google.visualization.arrayToDataTable([
    //   ['Date', 'Total Points', 'SIT'],
    //   [(day1.getMonth()+1)+'/'+day1.getDate(), totalSP, 0],
    //   [(day2.getMonth()+1)+'/'+day2.getDate(), totalSP, 0],
    //   [(day3.getMonth()+1)+'/'+day3.getDate(), totalSP-4, 4],
    //   [(day4.getMonth()+1)+'/'+day4.getDate(), totalSP-4, 4],
    //   [(day5.getMonth()+1)+'/'+day5.getDate(), totalSP-5, 5],
    //   [(day6.getMonth()+1)+'/'+day6.getDate(), totalSP-8, 8],
    //   [(day7.getMonth()+1)+'/'+day7.getDate(), totalSP-12, 12],
    //   [(day8.getMonth()+1)+'/'+day8.getDate(), totalSP-12, SITReduce[day8]],
    //   [(day9.getMonth()+1)+'/'+day9.getDate(), totalSP-12, SITReduce[day9]],
    //   [(day10.getMonth()+1)+'/'+day10.getDate(), totalSP-12, SITReduce[day10]],
    //   [(day11.getMonth()+1)+'/'+day11.getDate(), totalSP-12, SITReduce[day11]],
    //   [(day12.getMonth()+1)+'/'+day12.getDate(), totalSP-12, SITReduce[day12]]
    // ]);

    new google.visualization.AreaChart(document.getElementById('chart_div')).
        draw(data, {curveType: "function",
                    width: 180, height: 82,
                    vAxis: {minValue: 0, maxValue: 64},
                    colors: ['#a9a9a9'],
                    enableInteractivity: false,
                    legend: {position: 'none'},
                    hAxis: {textPosition: 'none'},
                    hAxis: {textStyle: {
                      color: '#777',
                      fontName: 'Arial',
                      fontSize: 9
                    }},
                    //vAxis: {textPosition: 'none'},
                    title: 'Story Points Burndown',
                    titleTextStyle: {
                      color: '#777',
                      fontName: 'Arial',
                      fontSize: 9
                    }
                  }
            );
    setTriggers();
    }

  // Load the Visualization API and the piechart package.
  setTimeout(function (){ google.load('visualization', '1', {'packages':['corechart'], callback: drawChart}); }, 1300);
}

function setTriggers(){
  $('#chart_div').click(function(){
    var dialog = '<div id="storyPointsDialog"><div class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable" tabindex="-1" role="dialog" aria-labelledby="ui-dialog-title-73" style="display: block; z-index: 1002; outline: 0px; height: auto; width: auto; top: 144.5px; left: 293px;">'+
      '<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">'+
        '<span class="ui-dialog-title" id="ui-dialog-title-73">Story Points Burndown for: Sprint05</span>'+
        '<a href="#" id="closeDialog" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick">Close</span></a><div class="ui-dialog-titlebar-progress-container">'+
        '<div class="ui-dialog-titlebar-progress-element" style="display: none;"></div>'+
      '</div>'+
    '</div>'+
    '<div id="73" class="dialog modal-dialog ajax-panel ui-dialog-content ui-widget-content" scrolltop="0" scrollleft="0" style="width: auto; height: auto; display: block; min-height: 114px;"><div class="large-chart-container" style="height: 646px; width: 1205px;">'+
    '<div id="StoryPointsChartBIG"></div>'+
    '</div></div></div>'+
    '<div class="ui-widget-overlay" style="width: 1855px; height: 995px; z-index: 1001;"></div></div>';

    $('body').append(dialog);

    new google.visualization.AreaChart(document.getElementById('StoryPointsChartBIG')).
      draw(data, {curveType: "function",
        width: 1200, height: 620,
        backgroundColor: '#fcfcfc',
        vAxis: {minValue: 0, maxValue: 64},
        colors: ['#a9a9a9'],
        legend: {position: 'right'},
        hAxis: {textPosition: 'bottom'},
        isStacked: true
      }
    );
    $('#closeDialog').click(function(){
      document.body.removeChild(document.getElementById("storyPointsDialog"));
    });
  });

}
