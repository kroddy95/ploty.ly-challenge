
var jsonFile = "../data/samples.json";

function initDashboard() {

    //Get the dropdown on the page and fill with the sample ids from the json
    var dropdown = d3.select("#selDataset");
    d3.json(jsonFile).then((sampleData) => {
        var sampleIds = sampleData.names;
        
        //Add each id to the dropdown
        sampleIds.forEach((id) => {
            dropdown.append("option").text(id).property("value", id);
        });

        //Call the functions to build the dashboard for first id in the list
        buildBarChart(sampleIds[0]);
        buildBubbleChart(sampleIds[0]);
        buildDemographics(sampleIds[0]);

    });

}

function optionChanged(sampleId) {

    // This is called when the dropdown changes (from HTML)
    buildBarChart(sampleId);
    buildBubbleChart(sampleId);
    buildDemographics(sampleId);
  }


function buildBarChart(sampleId){

    d3.json(jsonFile).then(function(sampleData) {

        //Get just the bacteria for the selected test subject
        var bacteria = sampleData.samples;
        var filteredData = bacteria.filter(sampleData => sampleData.id == sampleId);

        //sample_values is the bar chart values, otu_ids is the label, out_lables is hovertext
        var otuIDs = filteredData.map(sampleData => sampleData.otu_ids);
        var otuSampleValues = filteredData.map(sampleData => sampleData.sample_values);
        var otuLabels = filteredData.map(sampleData => sampleData.otu_labels);

        //We only want the top 10
        var otuID10 = otuIDs[0].slice(0, 10); 
        var otuSampleValues10 = otuSampleValues[0].slice(0, 10);
        var otuLabels10 = otuLabels[0].slice(0, 10);

        //We need the y axis to include "OTU ID" with each id
        var otuID10str = otuID10.map(otuId => "OTU ID " + otuId);

        //Create data for plot
        var data = [{
            type: 'bar',
            x: otuSampleValues10.reverse(),
            y: otuID10str,
            orientation: 'h',
            text: otuLabels10
          }];

          //Create the lable for the plot
          var layout = {
            title: {
                text: "Top 10 OTUs found in belly button " + sampleId
            }
          }

          Plotly.newPlot('bar', data, layout);

    })
}

function buildBubbleChart(sampleId){

    d3.json(jsonFile).then(function(sampleData) {

        //Get just the bacteria for the selected test subject
        var bacteria = sampleData.samples;
        var filteredData = bacteria.filter(sampleData => sampleData.id == sampleId);

        // otu_ids is x values and marker size, sample_values is y values, otu_labels is text values
        var otuIDs = filteredData.map(sampleData => sampleData.otu_ids);
        var otuSampleValues = filteredData.map(sampleData => sampleData.sample_values);
        var otuLabels = filteredData.map(sampleData => sampleData.otu_labels);
        
        //Set up the data information for the plot
        var data = [{
            x: otuIDs[0],
            y: otuSampleValues[0],
            mode: 'markers',
            text: otuLabels[0],
            marker: {
              size: otuSampleValues[0],
              color: otuIDs[0]
              
            }
          }];

          //Set up the layout information for the plot
          var layout = {
            xaxis: {
                title: {
                    text: "OTU for " + sampleId
                }
            }
          }

          Plotly.newPlot('bubble', data, layout);

    })
}

function buildDemographics(sampleId) {
    d3.json(jsonFile).then(function(sampleData) {
        
        //Get just the meta data out of the json file
        var samplemetadata = sampleData.metadata;

        //Filter for just the id sent in
        var filterdata = samplemetadata.filter(sampleData => sampleData.id == sampleId)

        //Get the metadata panel on the page and clear it out
        var sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");

        //Add the keys and values to the metadata panel
        Object.entries(filterdata[0]).forEach(function([key, value]) {      
            sampleMetadata.append("p").text(key + ": "+ value);
        });
            
    });
}

initDashboard();