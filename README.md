# leaflet-challenge
- Module 15 Challenge
- Steph Abegg

In this challenge, we were tasked with developing a way to visualize USGS earthquake data using leaflet. This challenge had two parts (the second of which was optional):

Part 1: Create the Earthquake Visualization. This visualization shows earthquake markers on a map of the world. The markers are sized by magnitude (larger markers = greater magnitude) and colored by depth (a gradient from light green to dark red, with dark red representing the greatest depth). A legend shows the depth ranges and corresponding colors. Furthermore, each earthquake marker has a tooltip with the location, time, magintude, and depth.

Part 2: Plot Tectonic Plates, Add Other Base Maps, Add Layer Controls (optional). The tectonic plates dataset was plotted on the map in addition to the earthquakes. In addition, two additional base maps to choose from were added. Layer controls were added to the map so that the tectonic plate dataset can be turned on and off independently of the earthquake dataset, and different base maps can be selected.

Note: The GitHub Page and the main files (index.html, logic.js, and style.css files) combine Parts 1 and 2 into the finished product. But the Challenge instructions specifically said to create folders titled Leaflet-Part-1 and Leaflet-Part-2, so I also populated these folders with their own index.html, logic.js, and style.css files. The files in Part 2 are the same as those in the main directory.


## GitHub Pages

I deployed my repository to GitHub Pages. The interactive earthquake dashboard I created in this assignment can be displayed and interacted with at the following link:

https://sabegg2.github.io/leaflet-challenge/

## Files

The files for my earthquake visualization are:

[index.html](Leaflet-Parts-1and2/index.html)

[logic.js](Leaflet-Parts-1and2/static/js/logic.js)

[style.css](Leaflet-Parts-1and2/static/css/style.css)

The index.html file is the main HTML file for the web application, providing the basic structure of the web application and including references to the logic.js and style.css files. The logic.js file contains JavaScript code that handles the core logic of a web application and specific functionality within it. The style.css file contains the CSS (Cascading Style Sheets) code used to style and layout the HTML elements of the web page.

## Global Earthquake Map

The following images show screenshots of the global earthquake map created in this challenge. The second map shows a different map option and the tectonic plates layer which illustrates the relationship between tectonic plates and seismic activity.

<img src="images\map.png" width=900>

<img src="images\map_with_tectonic_plates.png" width=900>
