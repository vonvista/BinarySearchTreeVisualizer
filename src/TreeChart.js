import React, { useRef, useEffect } from "react";
import { select, hierarchy, tree, linkHorizontal } from "d3";
import useResizeObserver from "./useResizeObserver";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function TreeChart({ data, pathData, traversalData, reloadData }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  pathData = pathData.flat();

  // we save data to see if it changed
  const previouslyRenderedData = usePrevious(data);

  data = data.root;

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // use dimensions from useResizeObserver,
    // but use getBoundingClientRect on initial render
    // (dimensions are null for the first render)
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // transform hierarchical data
    const root = hierarchy(data);
    const treeLayout = tree().size([width, height * 2]);

    const linkGenerator = linkHorizontal()
      .x(link => link.x)
      .y(link => link.y);

    const linkGenerator2 = (source, target) => {
      return "M " + source.x + " " + source.y +
      " L " + target.x + " " + target.y;
    }

    // enrich hierarchical data with coordinates
    treeLayout(root);

    console.warn("descendants", root.descendants());
    console.warn("links", root.links());
    console.warn("path data", pathData.flat());
    console.warn("traversal data", traversalData);
    console.warn("tree reload", reloadData);

    // nodes
    svg
      .selectAll(".node")
      .data(root.descendants())
      .join(enter => enter.append("circle").attr("opacity", 0))
      .attr("class", "node")
      .attr("cx", node => node.x)
      .attr("cy", node => node.y)
      .attr("r", function(d) {
        if (d.data.value === "e") {
          return 3;
        }
        // if(pathData.includes(d.data.value)){
        //   return 15;
        // }
        return 6;
      })   
      .attr("fill", function(d) { //TO SHOW PATH 
        if(pathData.includes(d.data.value)){
          return "#21c712";
        }
        return "#80c4ff";
      }) 
      .attr("stroke-width", 0)
      .transition()
      .duration(500)
      .delay(node => node.depth * 300)
      .attr("opacity", 1);

    // links
    const enteringAndUpdatingLinks = svg
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("stroke-dasharray", function() {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke", function(d) { //TO SHOW PATH 
        if(pathData.includes(d.target.data.value)){
          return "#21c712";
        }
        return "#80c4ff";
      }) 
      .attr("stroke-width", function(d) {
        if (d.target.data.value === "e") {
          return 1;
        }
        if (d.target.data.state === "path") {
          return 10;
        }
        return 4;
      })
      .attr("fill", "none")
      .attr("opacity", 1);

    if (reloadData === true) {
      enteringAndUpdatingLinks
        .attr("stroke-dashoffset", function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(500)
        .delay(link => link.source.depth * 500)
        .attr("stroke-dashoffset", 0);
    }

    // labels
    svg
      .selectAll(".label")
      .data(root.descendants())
      .join(enter => enter.append("text").attr("opacity", 0))
      .attr("class", "label")
      .attr("x", node => node.x)
      .attr("y", node => node.y - 12)
      .attr("text-anchor", "middle")
      .attr("font-size", 24)
      .attr("fill", "white")
      .text(function(d) {
        if (d.data.value === "e") {
          return "";
        }
        return d.data.value;
      })
      .transition()
      .duration(500)
      .delay(node => node.depth * 300)
      .attr("opacity", 1);

    //arrow test
    svg.append("svg:defs").append("svg:marker")
      .attr("id", "arrow")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .attr("viewBox", "0 0 12 12")
      .append("path")
      .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
      .style("fill", "#fff000");

    svg
      .selectAll(".traversal")
      .data(traversalData)
      .join(enter => enter.append("line"))
      .attr("class", "traversal")
      .attr("x1", function(d) { var des = root.descendants(); return des[des.findIndex(node => node.data.value == d.value)].x })
      .attr("y1", function(d) { var des = root.descendants(); return des[des.findIndex(node => node.data.value == d.value)].y })
      .attr("x2", function(d) { var des = root.descendants(); return des[des.findIndex(node => node.data.value == d.traverse.value)].x })
      .attr("y2", function(d) { var des = root.descendants(); return des[des.findIndex(node => node.data.value == d.traverse.value)].y })
      .attr("stroke", function(d) {
        var des = root.descendants();
        console.log("STROKE LOGS");
        console.log(d);
        console.log(des[des.findIndex(node => node.data.value == d.value)]);
        console.log(des[des.findIndex(node => node.data.value == d.traverse.value)]);
        return "red"
      })
      .attr("stroke","#fff000")  
      .attr("stroke-width",2)  
      .attr("marker-end","url(#arrow)"); 
      
  }, [data, pathData, traversalData, dimensions, reloadData, previouslyRenderedData]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default TreeChart;
