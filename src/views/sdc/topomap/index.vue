<template>
  <div>
    <basic-container>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="load">刷新</el-button>
      <div id="sample">
        <div style="width: 100%; display: flex; justify-content: space-between">
          <div
            id="myPaletteDiv"
            style="width: 240px; margin-right: 2px; background-color: #282c34"
          ></div>
          <div
            id="myDiagramDiv"
            style="flex-grow: 1; height: 750px; background-color: #282c34"
          ></div>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import go from "gojs";
import air01 from "../../../assets/img/air01.png";
import air02 from "../../../assets/img/air02.png";
import air03 from "../../../assets/img/air03.png";
import air04 from "../../../assets/img/air04.png";
export default {
  data() {
    return {
      diagram: "",
      myDiagram: "",
      myPalette: "",
      chartData: {
        class: "go.GraphLinksModel",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: [],
        linkDataArray: []
      }
    };
  },
  created() {
    
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var $ = go.GraphObject.make; // for conciseness in defining templates

      this.myDiagram = $(
        go.Diagram,
        "myDiagramDiv", // must name or refer to the DIV HTML element
        {
          LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
          LinkRelinked: showLinkLabel,
          "undoManager.isEnabled": true, // enable undo & redo
        }
      );

      // when the document is modified, add a "*" to the title and enable the "Save" button
      this.myDiagram.addDiagramListener("Modified", (e) => {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !this.myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (this.myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      this.myDiagram.nodeTemplateMap.add(
        "", // the default category
        $(
          go.Node,
          "Table",
          nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "Rectangle",
              { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true,
              },
              new go.Binding("text").makeTwoWay() 
            )
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
          makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "Conditional",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "Diamond",
              { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true,
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "Start",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Spot",
            $(go.Shape, "Circle", {
              desiredSize: new go.Size(70, 70),
              fill: "#282c34",
              stroke: "#09d3ac",
              strokeWidth: 3.5,
            }),
            $(go.TextBlock, "Start", textStyle(), new go.Binding("text"))
          ),
          // three named ports, one on each side except the top, all output only:
          makePort("L", go.Spot.Left, go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "End",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Spot",
            $(go.Shape, "Circle", {
              desiredSize: new go.Size(60, 60),
              fill: "#282c34",
              stroke: "#DC3C00",
              strokeWidth: 3.5,
            }),
            $(go.TextBlock, "End", textStyle(), new go.Binding("text"))
          ),
          // three named ports, one on each side except the bottom, all input only:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, go.Spot.Right, false, true)
        )
      );

      // taken from ../extensions/Figures.js:
      go.Shape.defineFigureGenerator("File", function (shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(0, 0, true); // starting point
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        var fig2 = new go.PathFigure(0.75 * w, 0, false);
        geo.add(fig2);
        // The Fold
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        geo.spot1 = new go.Spot(0, 0.25);
        geo.spot2 = go.Spot.BottomRight;
        return geo;
      });

      this.myDiagram.nodeTemplateMap.add(
        "Comment",
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          $(go.Shape, "File", {
            fill: "#282c34",
            stroke: "#DEE0A3",
            strokeWidth: 3,
          }),
          $(
            go.TextBlock,
            textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
          // no ports, because no links are allowed to connect with a comment
        )
      );

      // replace the default Link template in the linkTemplateMap
      this.myDiagram.linkTemplate = $(
        go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          mouseEnter: function (e, link) {
            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave: function (e, link) {
            link.findObject("HIGHLIGHT").stroke = "transparent";
          },
          selectionAdorned: false,
        },
        new go.Binding("points").makeTwoWay(),
        $(
          go.Shape, // the highlight shape, normally transparent
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: "transparent",
            name: "HIGHLIGHT",
          }
        ),
        $(
          go.Shape, // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isSelected", function (sel) {
            return sel ? "dodgerblue" : "gray";
          }).ofObject()
        ),
        $(
          go.Shape, // the arrowhead
          { toArrow: "standard", strokeWidth: 0, fill: "gray" }
        ),
        $(
          go.Panel,
          "Auto", // the link label, normally not visible
          {
            visible: false,
            name: "LABEL",
            segmentIndex: 2,
            segmentFraction: 0.5,
          },
          new go.Binding("visible", "visible").makeTwoWay(),
          $(
            go.Shape,
            "RoundedRectangle", // the label shape
            { fill: "#F8F8F8", strokeWidth: 0 }
          ),
          $(
            go.TextBlock,
            "Yes", // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );

      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      this.myDiagram.toolManager.linkingTool.temporaryLink.routing =
        go.Link.Orthogonal;
      this.myDiagram.toolManager.relinkingTool.temporaryLink.routing =
        go.Link.Orthogonal;

      this.load(); // load an initial diagram from some JSON text

      // 初始化创建选盘
      this.myPalette = $(
        go.Palette,
        "myPaletteDiv", // must name or refer to the DIV HTML element
        {
          // Instead of the default animation, use a custom fade-down
          "animationManager.initialAnimationStyle": go.AnimationManager.None,
          InitialAnimationStarting: animateFadeDown, // Instead, animate with this function

          nodeTemplateMap: this.myDiagram.nodeTemplateMap, // share the templates used by this.myDiagram
          model: new go.GraphLinksModel([
            { name: "Don Meow", source: air01 },
            { name: "Copricat", source: air02 },
            { name: "Demeter",  source: air03 },
            // specify the contents of the Palette
            { category: "Start", text: "Start" },
            { text: "Step" },
            { category: "Conditional", text: "???" },
            { category: "End", text: "End" },
            { category: "Comment", text: "Comment" },
          ]),
        }
      );

      function nodeStyle() {
        return [
          // The Node.location comes from the "loc" property of the node data,
          // converted by the Point.parse static method.
          // If the Node.location is changed, it updates the "loc" property of the node data,
          // converting back using the Point.stringify static method.
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center,
          },
        ];
      }
      function makePort(name, align, spot, output, input) {
        var horizontal =
          align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape, {
          fill: "transparent", // changed to a color in the mouseEnter event handler
          strokeWidth: 0, // no stroke
          width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
          alignment: align, // align the port on the main Shape
          stretch: horizontal
            ? go.GraphObject.Horizontal
            : go.GraphObject.Vertical,
          portId: name, // declare this object to be a "port"
          fromSpot: spot, // declare where links may connect at this port
          fromLinkable: output, // declare whether the user may draw links from here
          toSpot: spot, // declare where links may connect at this port
          toLinkable: input, // declare whether the user may draw links to here
          cursor: "pointer", // show a different cursor to indicate potential link point
          mouseEnter: function (e, port) {
            // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: function (e, port) {
            port.fill = "transparent";
          },
        });
      }
      function textStyle() {
        return {
          font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
          stroke: "#F8F8F8",
        };
      }
      function showLinkLabel(e) {
        console.log(e);
        var label = e.subject.findObject("LABEL");
        if (label !== null)
          label.visible = e.subject.fromNode.data.category === "Conditional";
      }

      function animateFadeDown(e) {
        var diagram = e.diagram;
        var animation = new go.Animation();
        animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
        animation.easing = go.Animation.EaseOutExpo;
        animation.duration = 900;
        // Fade "down", in other words, fade in from above
        animation.add(
          diagram,
          "position",
          diagram.position.copy().offset(0, 200),
          diagram.position
        );
        animation.add(diagram, "opacity", 0, 1);
        animation.start();
      }
    },
    save() {
      this.$set(this,"chartData",this.myDiagram.model.toJson())
      // document.getElementById("mySavedModel").value = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
    },
    load() {
      this.myDiagram.model = go.Model.fromJson(this.chartData);
      this.myDiagram.model.linkFromPortIdProperty = "fromPort"; //必须记住portIds
      this.myDiagram.model.linkToPortIdProperty = "toPort";
    },
    printDiagram() {
      var svgWindow = window.open();
      if (!svgWindow) return; // failure to open a new Window
      var printSize = new go.Size(700, 960);
      var bnds = this.myDiagram.documentBounds;
      var x = bnds.x;
      var y = bnds.y;
      while (y < bnds.bottom) {
        while (x < bnds.right) {
          var svg = this.myDiagram.makeSvg({
            scale: 1.0,
            position: new go.Point(x, y),
            size: printSize,
          });
          svgWindow.document.body.appendChild(svg);
          x += printSize.width;
        }
        x = bnds.x;
        y += printSize.height;
      }
      setTimeout(function () {
        svgWindow.print();
      }, 1);
    },
  },
};
</script>

<style>
</style>