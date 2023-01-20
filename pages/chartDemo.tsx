import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Treemap,
  BarChart,
  Tooltip,
  Legend,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  ResponsiveContainer
} from 'recharts';
const Linedata = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]

const Treedata = [
  {
    "name": "axis",
    "children": [
      {
        "name": "Axis",
        "size": 24593
      },
      {
        "name": "Axes",
        "size": 1302
      },
      {
        "name": "AxisGridLine",
        "size": 652
      },
      {
        "name": "AxisLabel",
        "size": 636
      },
      {
        "name": "CartesianAxes",
        "size": 6703
      }
    ]
  },
  {
    "name": "controls",
    "children": [
      {
        "name": "TooltipControl",
        "size": 8435
      },
      {
        "name": "SelectionControl",
        "size": 7862
      },
      {
        "name": "PanZoomControl",
        "size": 5222
      },
      {
        "name": "HoverControl",
        "size": 4896
      },
      {
        "name": "ControlList",
        "size": 4665
      },
      {
        "name": "ClickControl",
        "size": 3824
      },
      {
        "name": "ExpandControl",
        "size": 2832
      },
      {
        "name": "DragControl",
        "size": 2649
      },
      {
        "name": "AnchorControl",
        "size": 2138
      },
      {
        "name": "Control",
        "size": 1353
      },
      {
        "name": "IControl",
        "size": 763
      }
    ]
  },
  {
    "name": "data",
    "children": [
      {
        "name": "Data",
        "size": 20544
      },
      {
        "name": "NodeSprite",
        "size": 19382
      },
      {
        "name": "DataList",
        "size": 19788
      },
      {
        "name": "DataSprite",
        "size": 10349
      },
      {
        "name": "EdgeSprite",
        "size": 3301
      },
      {
        "name": "render",
        "children": [
          {
            "name": "EdgeRenderer",
            "size": 5569
          },
          {
            "name": "ShapeRenderer",
            "size": 2247
          },
          {
            "name": "ArrowType",
            "size": 698
          },
          {
            "name": "IRenderer",
            "size": 353
          }
        ]
      },
      {
        "name": "ScaleBinding",
        "size": 11275
      },
      {
        "name": "TreeBuilder",
        "size": 9930
      },
      {
        "name": "Tree",
        "size": 7147
      }
    ]
  },
  {
    "name": "events",
    "children": [
      {
        "name": "DataEvent",
        "size": 7313
      },
      {
        "name": "SelectionEvent",
        "size": 6880
      },
      {
        "name": "TooltipEvent",
        "size": 3701
      },
      {
        "name": "VisualizationEvent",
        "size": 2117
      }
    ]
  },
  {
    "name": "legend",
    "children": [
      {
        "name": "Legend",
        "size": 20859
      },
      {
        "name": "LegendRange",
        "size": 10530
      },
      {
        "name": "LegendItem",
        "size": 4614
      }
    ]
  },
  {
    "name": "operator",
    "children": [
      {
        "name": "distortion",
        "children": [
          {
            "name": "Distortion",
            "size": 6314
          },
          {
            "name": "BifocalDistortion",
            "size": 4461
          },
          {
            "name": "FisheyeDistortion",
            "size": 3444
          }
        ]
      },
      {
        "name": "encoder",
        "children": [
          {
            "name": "PropertyEncoder",
            "size": 4138
          },
          {
            "name": "Encoder",
            "size": 4060
          },
          {
            "name": "ColorEncoder",
            "size": 3179
          },
          {
            "name": "SizeEncoder",
            "size": 1830
          },
          {
            "name": "ShapeEncoder",
            "size": 1690
          }
        ]
      },
      {
        "name": "filter",
        "children": [
          {
            "name": "FisheyeTreeFilter",
            "size": 5219
          },
          {
            "name": "VisibilityFilter",
            "size": 3509
          },
          {
            "name": "GraphDistanceFilter",
            "size": 3165
          }
        ]
      },
      {
        "name": "IOperator",
        "size": 1286
      },
      {
        "name": "label",
        "children": [
          {
            "name": "Labeler",
            "size": 9956
          },
          {
            "name": "RadialLabeler",
            "size": 3899
          },
          {
            "name": "StackedAreaLabeler",
            "size": 3202
          }
        ]
      },
      {
        "name": "layout",
        "children": [
          {
            "name": "RadialTreeLayout",
            "size": 12348
          },
          {
            "name": "NodeLinkTreeLayout",
            "size": 12870
          },
          {
            "name": "CirclePackingLayout",
            "size": 12003
          },
          {
            "name": "CircleLayout",
            "size": 9317
          },
          {
            "name": "TreeMapLayout",
            "size": 9191
          },
          {
            "name": "StackedAreaLayout",
            "size": 9121
          },
          {
            "name": "Layout",
            "size": 7881
          },
          {
            "name": "AxisLayout",
            "size": 6725
          },
          {
            "name": "IcicleTreeLayout",
            "size": 4864
          },
          {
            "name": "DendrogramLayout",
            "size": 4853
          },
          {
            "name": "ForceDirectedLayout",
            "size": 8411
          },
          {
            "name": "BundledEdgeRouter",
            "size": 3727
          },
          {
            "name": "IndentedTreeLayout",
            "size": 3174
          },
          {
            "name": "PieLayout",
            "size": 2728
          },
          {
            "name": "RandomLayout",
            "size": 870
          }
        ]
      },
      {
        "name": "OperatorList",
        "size": 5248
      },
      {
        "name": "OperatorSequence",
        "size": 4190
      },
      {
        "name": "OperatorSwitch",
        "size": 2581
      },
      {
        "name": "Operator",
        "size": 2490
      },
      {
        "name": "SortOperator",
        "size": 2023
      }
    ]
  }
]

const Bardata = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300
  }
]

const Radardata = [
  {
    "subject": "Math",
    "A": 120,
    "B": 110,
    "fullMark": 150
  },
  {
    "subject": "Chinese",
    "A": 98,
    "B": 130,
    "fullMark": 150
  },
  {
    "subject": "English",
    "A": 86,
    "B": 130,
    "fullMark": 150
  },
  {
    "subject": "Geography",
    "A": 99,
    "B": 100,
    "fullMark": 150
  },
  {
    "subject": "Physics",
    "A": 85,
    "B": 90,
    "fullMark": 150
  },
  {
    "subject": "History",
    "A": 65,
    "B": 85,
    "fullMark": 150
  }
]

const data01 = [
  {
    "name": "Group A",
    "value": 400
  },
  {
    "name": "Group B",
    "value": 300
  },
  {
    "name": "Group C",
    "value": 300
  },
  {
    "name": "Group D",
    "value": 200
  },
  {
    "name": "Group E",
    "value": 278
  },
  {
    "name": "Group F",
    "value": 189
  }
];
const data02 = [
  {
    "name": "Group A",
    "value": 2400
  },
  {
    "name": "Group B",
    "value": 4567
  },
  {
    "name": "Group C",
    "value": 1398
  },
  {
    "name": "Group D",
    "value": 9800
  },
  {
    "name": "Group E",
    "value": 3908
  },
  {
    "name": "Group F",
    "value": 4800
  }
];


const chartsDemo = () => {
  return (
    <div className='p-4'>

      <h1>Line Chart</h1>
      {/* <ResponsiveContainer width={700} height="80%"> */}

        <LineChart width={730} height={250} data={Linedata}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      {/* </ResponsiveContainer> */}
      {/* 
      <h1>Tree Chart</h1>
      <Treemap
        width={730}
        height={250}
        data={Treedata}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
        fill="#8884d8"
      /> */}

      <h1>Bar Chart</h1>
      <BarChart width={730} height={250} data={Bardata}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>

      <h1>Radar Chart</h1>
      <RadarChart outerRadius={90} width={730} height={250} data={Radardata}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
      </RadarChart>

      <h1>Pie Chart</h1>
      <PieChart width={730} height={250}>
        <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
        <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
      </PieChart>
    </div>
  )
}

export default chartsDemo;