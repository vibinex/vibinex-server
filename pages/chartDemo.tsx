import React from 'react'
import { ResponsiveRadar } from '@nivo/radar'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveBump } from '@nivo/bump'

const bumpData = [
    {
        "id": "Serie 1",
        "data": [
            {
                "x": 2000,
                "y": 8
            },
            {
                "x": 2001,
                "y": 1
            },
            {
                "x": 2002,
                "y": 12
            },
            {
                "x": 2003,
                "y": 7
            },
            {
                "x": 2004,
                "y": 7
            }
        ]
    },
    {
        "id": "Serie 2",
        "data": [
            {
                "x": 2000,
                "y": 3
            },
            {
                "x": 2001,
                "y": 5
            },
            {
                "x": 2002,
                "y": 6
            },
            {
                "x": 2003,
                "y": 4
            },
            {
                "x": 2004,
                "y": 4
            }
        ]
    },
    {
        "id": "Serie 3",
        "data": [
            {
                "x": 2000,
                "y": 2
            },
            {
                "x": 2001,
                "y": 9
            },
            {
                "x": 2002,
                "y": 11
            },
            {
                "x": 2003,
                "y": 6
            },
            {
                "x": 2004,
                "y": 1
            }
        ]
    },
    {
        "id": "Serie 4",
        "data": [
            {
                "x": 2000,
                "y": 10
            },
            {
                "x": 2001,
                "y": 10
            },
            {
                "x": 2002,
                "y": 9
            },
            {
                "x": 2003,
                "y": 3
            },
            {
                "x": 2004,
                "y": 10
            }
        ]
    },
    {
        "id": "Serie 5",
        "data": [
            {
                "x": 2000,
                "y": 1
            },
            {
                "x": 2001,
                "y": 6
            },
            {
                "x": 2002,
                "y": 4
            },
            {
                "x": 2003,
                "y": 1
            },
            {
                "x": 2004,
                "y": 12
            }
        ]
    },
    {
        "id": "Serie 6",
        "data": [
            {
                "x": 2000,
                "y": 11
            },
            {
                "x": 2001,
                "y": 7
            },
            {
                "x": 2002,
                "y": 7
            },
            {
                "x": 2003,
                "y": 12
            },
            {
                "x": 2004,
                "y": 11
            }
        ]
    },
    {
        "id": "Serie 7",
        "data": [
            {
                "x": 2000,
                "y": 7
            },
            {
                "x": 2001,
                "y": 2
            },
            {
                "x": 2002,
                "y": 1
            },
            {
                "x": 2003,
                "y": 10
            },
            {
                "x": 2004,
                "y": 2
            }
        ]
    },
    {
        "id": "Serie 8",
        "data": [
            {
                "x": 2000,
                "y": 9
            },
            {
                "x": 2001,
                "y": 12
            },
            {
                "x": 2002,
                "y": 3
            },
            {
                "x": 2003,
                "y": 11
            },
            {
                "x": 2004,
                "y": 5
            }
        ]
    },
    {
        "id": "Serie 9",
        "data": [
            {
                "x": 2000,
                "y": 12
            },
            {
                "x": 2001,
                "y": 3
            },
            {
                "x": 2002,
                "y": 10
            },
            {
                "x": 2003,
                "y": 2
            },
            {
                "x": 2004,
                "y": 9
            }
        ]
    },
    {
        "id": "Serie 10",
        "data": [
            {
                "x": 2000,
                "y": 5
            },
            {
                "x": 2001,
                "y": 4
            },
            {
                "x": 2002,
                "y": 2
            },
            {
                "x": 2003,
                "y": 5
            },
            {
                "x": 2004,
                "y": 6
            }
        ]
    },
    {
        "id": "Serie 11",
        "data": [
            {
                "x": 2000,
                "y": 6
            },
            {
                "x": 2001,
                "y": 8
            },
            {
                "x": 2002,
                "y": 8
            },
            {
                "x": 2003,
                "y": 8
            },
            {
                "x": 2004,
                "y": 8
            }
        ]
    },
    {
        "id": "Serie 12",
        "data": [
            {
                "x": 2000,
                "y": 4
            },
            {
                "x": 2001,
                "y": 11
            },
            {
                "x": 2002,
                "y": 5
            },
            {
                "x": 2003,
                "y": 9
            },
            {
                "x": 2004,
                "y": 3
            }
        ]
    }
]

const barData = [
    {
        "country": "AD",
        "hot dog": 21,
        "hot dogColor": "hsl(282, 70%, 50%)",
        "burger": 54,
        "burgerColor": "hsl(92, 70%, 50%)",
        "sandwich": 84,
        "sandwichColor": "hsl(70, 70%, 50%)",
        "kebab": 2,
        "kebabColor": "hsl(257, 70%, 50%)",
        "fries": 172,
        "friesColor": "hsl(20, 70%, 50%)",
        "donut": 37,
        "donutColor": "hsl(324, 70%, 50%)"
    },
    {
        "country": "AE",
        "hot dog": 151,
        "hot dogColor": "hsl(193, 70%, 50%)",
        "burger": 30,
        "burgerColor": "hsl(161, 70%, 50%)",
        "sandwich": 141,
        "sandwichColor": "hsl(59, 70%, 50%)",
        "kebab": 137,
        "kebabColor": "hsl(358, 70%, 50%)",
        "fries": 59,
        "friesColor": "hsl(345, 70%, 50%)",
        "donut": 39,
        "donutColor": "hsl(55, 70%, 50%)"
    },
    {
        "country": "AF",
        "hot dog": 151,
        "hot dogColor": "hsl(200, 70%, 50%)",
        "burger": 108,
        "burgerColor": "hsl(108, 70%, 50%)",
        "sandwich": 66,
        "sandwichColor": "hsl(331, 70%, 50%)",
        "kebab": 78,
        "kebabColor": "hsl(46, 70%, 50%)",
        "fries": 93,
        "friesColor": "hsl(322, 70%, 50%)",
        "donut": 145,
        "donutColor": "hsl(39, 70%, 50%)"
    },
    {
        "country": "AG",
        "hot dog": 139,
        "hot dogColor": "hsl(91, 70%, 50%)",
        "burger": 53,
        "burgerColor": "hsl(25, 70%, 50%)",
        "sandwich": 26,
        "sandwichColor": "hsl(67, 70%, 50%)",
        "kebab": 18,
        "kebabColor": "hsl(182, 70%, 50%)",
        "fries": 151,
        "friesColor": "hsl(186, 70%, 50%)",
        "donut": 161,
        "donutColor": "hsl(230, 70%, 50%)"
    },
    {
        "country": "AI",
        "hot dog": 95,
        "hot dogColor": "hsl(165, 70%, 50%)",
        "burger": 83,
        "burgerColor": "hsl(288, 70%, 50%)",
        "sandwich": 199,
        "sandwichColor": "hsl(92, 70%, 50%)",
        "kebab": 187,
        "kebabColor": "hsl(163, 70%, 50%)",
        "fries": 43,
        "friesColor": "hsl(72, 70%, 50%)",
        "donut": 29,
        "donutColor": "hsl(118, 70%, 50%)"
    },
    {
        "country": "AL",
        "hot dog": 49,
        "hot dogColor": "hsl(212, 70%, 50%)",
        "burger": 47,
        "burgerColor": "hsl(289, 70%, 50%)",
        "sandwich": 23,
        "sandwichColor": "hsl(124, 70%, 50%)",
        "kebab": 33,
        "kebabColor": "hsl(140, 70%, 50%)",
        "fries": 165,
        "friesColor": "hsl(285, 70%, 50%)",
        "donut": 68,
        "donutColor": "hsl(250, 70%, 50%)"
    },
    {
        "country": "AM",
        "hot dog": 116,
        "hot dogColor": "hsl(112, 70%, 50%)",
        "burger": 44,
        "burgerColor": "hsl(66, 70%, 50%)",
        "sandwich": 140,
        "sandwichColor": "hsl(204, 70%, 50%)",
        "kebab": 58,
        "kebabColor": "hsl(111, 70%, 50%)",
        "fries": 112,
        "friesColor": "hsl(293, 70%, 50%)",
        "donut": 74,
        "donutColor": "hsl(64, 70%, 50%)"
    }
]

const radarData = [
    {
        "taste": "fruity",
        "chardonay": 81,
        "carmenere": 32,
        "syrah": 106
    },
    {
        "taste": "bitter",
        "chardonay": 45,
        "carmenere": 98,
        "syrah": 81
    },
    {
        "taste": "heavy",
        "chardonay": 65,
        "carmenere": 61,
        "syrah": 31
    },
    {
        "taste": "strong",
        "chardonay": 114,
        "carmenere": 29,
        "syrah": 40
    },
    {
        "taste": "sunny",
        "chardonay": 74,
        "carmenere": 85,
        "syrah": 82
    }
]

const MyResponsiveRadar = () => {
    return (
        <div className='h-[50rem] w-[100%]'>
            <h3>This is radar chart of NivoCharts</h3>
            <ResponsiveRadar
                data={radarData}
                keys={['chardonay', 'carmenere', 'syrah']}
                indexBy="taste"
                valueFormat=">-.2f"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                borderColor={{ from: 'color' }}
                gridLabelOffset={36}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                colors={{ scheme: 'nivo' }}
                blendMode="multiply"
                motionConfig="wobbly"
                legends={[
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        translateX: -50,
                        translateY: -40,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: '#999',
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
            />

            <h1>Responsive Bar</h1>
            <ResponsiveBar
                data={barData}
                keys={[
                    'hot dog',
                    'burger',
                    'sandwich',
                    'kebab',
                    'fries',
                    'donut'
                ]}
                indexBy="country"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'fries'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'sandwich'
                        },
                        id: 'lines'
                    }
                ]}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'country',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'food',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in country: " + e.indexValue }}
            />

            <ResponsiveBump
                data={bumpData}
                colors={{ scheme: 'spectral' }}
                lineWidth={3}
                activeLineWidth={6}
                inactiveLineWidth={3}
                inactiveOpacity={0.15}
                pointSize={10}
                activePointSize={16}
                inactivePointSize={0}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={3}
                activePointBorderWidth={3}
                pointBorderColor={{ from: 'serie.color' }}
                axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: -36
                }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'ranking',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
                axisRight={null}
            />

        </div>
    )
}
export default MyResponsiveRadar;