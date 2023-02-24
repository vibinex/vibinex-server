import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

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

const MyResponsiveRadar = () => {
    return (
        <div className='h-[50rem] w-[90%] m-auto'>
            <div className='border-2 mt-10 p-2 rounded-md border-blue-200 text-[20px]'>
            <h3> <span>Repo Name : </span>Repo Profile Overview</h3>
            <h1><span>Own by : </span>Vibinex</h1>
            </div>

            <div className='h-[35rem] w-[100%] m-auto border-2 mt-5 p-2 rounded-md border-blue-200'>
                <div className='ml-5 mt-5 mb-[-10px]'>
                <h3>Metric : File Contribution</h3>
                <h4 className='text-gray-500'>About : Used to find out the total number of files used in repo. You can see language used, code chunk, and much more details of each file.</h4>
                </div>
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
</div>
        </div>
    )
}
export default MyResponsiveRadar;